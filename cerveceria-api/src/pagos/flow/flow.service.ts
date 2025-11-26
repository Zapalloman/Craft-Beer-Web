import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';

export interface FlowPaymentRequest {
  commerceOrder: string;
  subject: string;
  currency: string;
  amount: number;
  email: string;
  urlConfirmation: string;
  urlReturn: string;
  optional?: string;
}

export interface FlowPaymentResponse {
  url: string;
  token: string;
  flowOrder: number;
}

@Injectable()
export class FlowService {
  private readonly logger = new Logger(FlowService.name);
  private readonly apiKey: string;
  private readonly secretKey: string;
  private readonly apiUrl: string;
  private readonly sandboxMode: boolean;
  private readonly useMock: boolean; // Para testing local sin credenciales válidas

  constructor(private configService: ConfigService) {
    // Configuración desde variables de entorno
    this.apiKey = this.configService.get<string>('FLOW_API_KEY') || 'DEMO_API_KEY';
    this.secretKey = this.configService.get<string>('FLOW_SECRET_KEY') || 'DEMO_SECRET_KEY';
    this.sandboxMode = this.configService.get<string>('FLOW_SANDBOX') === 'true';
    
    // Si no hay credenciales válidas, usar mock
    this.useMock = !this.apiKey || this.apiKey === 'DEMO_API_KEY' || !this.secretKey || this.secretKey === 'DEMO_SECRET_KEY';
    
    // URL según ambiente
    this.apiUrl = this.sandboxMode
      ? 'https://sandbox.flow.cl/api'
      : 'https://www.flow.cl/api';

    this.logger.log(`FLOW Service iniciado en modo: ${this.sandboxMode ? 'SANDBOX' : 'PRODUCTION'}`);
    if (this.useMock) {
      this.logger.warn('⚠️  FLOW usando MOCK - Configure FLOW_API_KEY y FLOW_SECRET_KEY para pagos reales');
    }
  }

  /**
   * Genera la firma para autenticar la petición a FLOW
   */
  private generateSignature(params: Record<string, any>): string {
    // Ordenar parámetros alfabéticamente
    const sortedKeys = Object.keys(params).sort();
    
    // Construir string a firmar
    const toSign = sortedKeys
      .map(key => `${key}${params[key]}`)
      .join('');

    // Generar firma HMAC-SHA256
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(toSign)
      .digest('hex');

    return signature;
  }

  /**
   * Crea un pago en FLOW y retorna la URL de redirección
   */
  async createPayment(paymentData: FlowPaymentRequest): Promise<FlowPaymentResponse> {
    try {
      this.logger.log(`Creando pago FLOW para orden: ${paymentData.commerceOrder}`);

      // Si no hay credenciales válidas, usar mock
      if (this.useMock) {
        this.logger.log('Usando respuesta MOCK (sin credenciales configuradas)');
        return this.mockFlowResponse(paymentData);
      }

      // En modo sandbox, Flow requiere usar emails de prueba específicos
      // Usar el email configurado o uno genérico de sandbox
      const sandboxEmail = this.configService.get<string>('FLOW_SANDBOX_EMAIL') || 'sandbox@flow.cl';
      const emailToUse = this.sandboxMode ? sandboxEmail : paymentData.email;
      
      this.logger.log(`Modo: ${this.sandboxMode ? 'SANDBOX' : 'PRODUCTION'}, Email: ${emailToUse}`);

      // Parámetros para FLOW
      const params: Record<string, any> = {
        apiKey: this.apiKey,
        commerceOrder: paymentData.commerceOrder,
        subject: paymentData.subject,
        currency: paymentData.currency,
        amount: Math.round(paymentData.amount), // Flow requiere enteros
        email: emailToUse,
        urlConfirmation: paymentData.urlConfirmation,
        urlReturn: paymentData.urlReturn,
      };

      // Agregar parámetro opcional si existe
      if (paymentData.optional) {
        params['optional'] = paymentData.optional;
      }

      // Generar firma
      const signature = this.generateSignature(params);
      params['s'] = signature;

      this.logger.log(`Enviando petición a: ${this.apiUrl}/payment/create`);

      // Llamada real a la API de FLOW
      const response = await axios.post(
        `${this.apiUrl}/payment/create`,
        new URLSearchParams(params).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.logger.log(`Respuesta FLOW: ${JSON.stringify(response.data)}`);

      return {
        url: response.data.url + '?token=' + response.data.token,
        token: response.data.token,
        flowOrder: response.data.flowOrder,
      };

    } catch (error) {
      // Log detallado del error
      if (error.response) {
        // Error de respuesta de Flow
        this.logger.error(`Error FLOW API - Status: ${error.response.status}`);
        this.logger.error(`Error FLOW API - Data: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // Error de conexión
        this.logger.error(`Error de conexión a FLOW: ${error.message}`);
      } else {
        this.logger.error(`Error al crear pago FLOW: ${error.message}`);
      }
      throw new Error(`Error al procesar el pago con FLOW: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Verifica el estado de un pago usando el token
   */
  async getPaymentStatus(token: string): Promise<any> {
    try {
      this.logger.log(`Verificando estado del pago con token: ${token}`);

      // Si no hay credenciales válidas, usar mock
      if (this.useMock) {
        this.logger.log('Usando estado MOCK (sin credenciales configuradas)');
        return this.mockPaymentStatus(token);
      }

      const params: Record<string, any> = {
        apiKey: this.apiKey,
        token: token,
      };

      const signature = this.generateSignature(params);
      params['s'] = signature;

      // Llamada real a la API de FLOW
      const response = await axios.get(`${this.apiUrl}/payment/getStatus`, {
        params: params,
      });

      this.logger.log(`Estado del pago FLOW: ${JSON.stringify(response.data)}`);

      return response.data;

    } catch (error) {
      this.logger.error(`Error al verificar estado del pago: ${error.message}`);
      // Si falla la verificación con Flow, intentar mock para no romper el flujo
      if (this.useMock || this.sandboxMode) {
        this.logger.warn('Fallback a mock por error en Flow API');
        return this.mockPaymentStatus(token);
      }
      throw new Error('Error al verificar el estado del pago');
    }
  }

  /**
   * Confirma un pago usando el token retornado por FLOW
   */
  async confirmPayment(token: string): Promise<any> {
    try {
      this.logger.log(`Confirmando pago con token: ${token}`);

      const paymentStatus = await this.getPaymentStatus(token);

      if (paymentStatus.status === 2) {
        // Estado 2 = Pago exitoso en FLOW
        this.logger.log(`Pago confirmado exitosamente: ${token}`);
        return {
          success: true,
          status: 'Pagado',
          flowOrder: paymentStatus.flowOrder,
          commerceOrder: paymentStatus.commerceOrder,
          amount: paymentStatus.amount,
          paymentData: paymentStatus.paymentData,
        };
      } else {
        this.logger.warn(`Pago rechazado o pendiente: ${token}`);
        return {
          success: false,
          status: this.getStatusText(paymentStatus.status),
          flowOrder: paymentStatus.flowOrder,
        };
      }

    } catch (error) {
      this.logger.error(`Error al confirmar pago: ${error.message}`);
      throw new Error('Error al confirmar el pago');
    }
  }

  /**
   * Verifica la firma de un webhook de FLOW
   */
  verifyWebhookSignature(params: Record<string, any>, receivedSignature: string): boolean {
    const calculatedSignature = this.generateSignature(params);
    return calculatedSignature === receivedSignature;
  }

  /**
   * Convierte código de estado de FLOW a texto
   */
  private getStatusText(status: number): string {
    const statuses = {
      1: 'Pendiente',
      2: 'Pagado',
      3: 'Rechazado',
      4: 'Cancelado',
    };
    return statuses[status] || 'Desconocido';
  }

  /**
   * Simula una respuesta de FLOW para testing (SANDBOX)
   */
  private mockFlowResponse(paymentData: FlowPaymentRequest): FlowPaymentResponse {
    const token = `FLOW_TOKEN_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const flowOrder = Math.floor(Math.random() * 1000000);

    return {
      url: `${this.apiUrl}/payment/pay?token=${token}`,
      token: token,
      flowOrder: flowOrder,
    };
  }

  /**
   * Simula el estado de un pago para testing (SANDBOX)
   */
  private mockPaymentStatus(token: string): any {
    return {
      flowOrder: Math.floor(Math.random() * 1000000),
      commerceOrder: token.split('_')[2] || 'ORD-' + Date.now(),
      requestDate: new Date().toISOString(),
      status: 2, // 2 = Pagado (para testing)
      subject: 'Compra Cervecería Craft & Beer',
      currency: 'CLP',
      amount: Math.floor(Math.random() * 50000) + 10000,
      payer: 'cliente@test.cl',
      optional: '',
      paymentData: {
        date: new Date().toISOString(),
        media: 'WEBPAY',
        conversionDate: new Date().toISOString(),
        conversionRate: 1,
        amount: Math.floor(Math.random() * 50000) + 10000,
        currency: 'CLP',
        fee: 0,
        balance: 0,
        transferDate: new Date().toISOString(),
      },
    };
  }
}
