import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pago } from './schemas/pago.schema';
import { FlowService } from './flow/flow.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PagosService {
  private readonly logger = new Logger(PagosService.name);

  constructor(
    @InjectModel(Pago.name) private pagoModel: Model<Pago>,
    private flowService: FlowService,
    private configService: ConfigService,
  ) {}

  /**
   * Crea un pago usando FLOW
   */
  async crearPagoFlow(
    pedidoId: string,
    numeroOrden: string,
    monto: number,
    email: string,
  ): Promise<Pago> {
    try {
      this.logger.log(`Creando pago FLOW para pedido: ${pedidoId}`);

      const numeroComprobante = `FLOW-${Date.now()}`;
      
      // Obtener URLs de entorno con valores por defecto
      let backendUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
      let frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001';
      
      // Asegurar que las URLs tengan protocolo https en producción
      if (backendUrl && !backendUrl.startsWith('http')) {
        backendUrl = `https://${backendUrl}`;
      }
      if (frontendUrl && !frontendUrl.startsWith('http')) {
        frontendUrl = `https://${frontendUrl}`;
      }
      
      // Remover trailing slash si existe
      backendUrl = backendUrl.replace(/\/$/, '');
      frontendUrl = frontendUrl.replace(/\/$/, '');
      
      this.logger.log(`URLs configuradas - Backend: ${backendUrl}, Frontend: ${frontendUrl}`);

      // Crear pago en FLOW
      const flowResponse = await this.flowService.createPayment({
        commerceOrder: numeroOrden,
        subject: `Pedido Cervecería Craft & Beer - ${numeroOrden}`,
        currency: 'CLP',
        amount: monto,
        email: email,
        // Webhook de confirmación va al backend
        urlConfirmation: `${backendUrl}/api/pagos/flow/confirm`,
        // URL de retorno va al FRONTEND para mostrar confirmación al usuario
        urlReturn: `${frontendUrl}/checkout/confirmacion?pedido=${pedidoId}`,
        optional: pedidoId,
      });

      // Guardar pago en BD
      const pago = new this.pagoModel({
        pedidoId,
        metodo: 'Flow',
        monto,
        estado: 'Pendiente',
        numeroComprobante,
        flowToken: flowResponse.token,
        flowPaymentId: flowResponse.flowOrder.toString(),
        flowUrl: flowResponse.url,
        flowResponse: flowResponse,
        detalles: 'Pago procesado con FLOW',
      });

      const pagoGuardado = await pago.save();
      this.logger.log(`Pago FLOW creado exitosamente: ${pagoGuardado._id}`);

      return pagoGuardado;

    } catch (error) {
      this.logger.error(`Error al crear pago FLOW: ${error.message}`);
      throw error;
    }
  }

  /**
   * Confirma un pago desde el webhook de FLOW
   */
  async confirmarPagoFlow(token: string): Promise<Pago> {
    try {
      this.logger.log(`Confirmando pago FLOW con token: ${token}`);

      // Buscar pago por token
      let pago = await this.pagoModel.findOne({ flowToken: token }).exec();
      
      // Si no se encuentra por token exacto, buscar el último pago pendiente
      // (Flow a veces envía un token diferente en el retorno)
      if (!pago) {
        this.logger.warn(`Token ${token} no encontrado, buscando último pago pendiente...`);
        pago = await this.pagoModel
          .findOne({ estado: 'Pendiente', metodo: 'Flow' })
          .sort({ createdAt: -1 })
          .exec();
      }
      
      if (!pago) {
        throw new NotFoundException(`Pago con token ${token} no encontrado`);
      }

      // Verificar estado en FLOW
      const confirmacion = await this.flowService.confirmPayment(pago.flowToken);

      if (confirmacion.success) {
        pago.estado = 'Pagado';
        pago.flowStatus = confirmacion.status;
        pago.flowResponse = confirmacion;
        
        this.logger.log(`Pago confirmado exitosamente: ${pago._id}`);
      } else {
        pago.estado = confirmacion.status === 'Cancelado' ? 'Cancelado' : 'Rechazado';
        pago.flowStatus = confirmacion.status;
        
        this.logger.warn(`Pago rechazado o cancelado: ${pago._id}`);
      }

      return pago.save();

    } catch (error) {
      this.logger.error(`Error al confirmar pago FLOW: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtiene el estado actual de un pago
   */
  async obtenerEstadoPago(pagoId: string): Promise<any> {
    const pago = await this.pagoModel.findById(pagoId).exec();
    
    if (!pago) {
      throw new NotFoundException(`Pago con ID ${pagoId} no encontrado`);
    }

    // Si tiene token de FLOW, verificar estado actualizado
    if (pago.flowToken) {
      try {
        const estadoFlow = await this.flowService.getPaymentStatus(pago.flowToken);
        return {
          pago,
          flowStatus: estadoFlow,
        };
      } catch (error) {
        this.logger.warn(`No se pudo obtener estado de FLOW: ${error.message}`);
      }
    }

    return { pago };
  }

  /**
   * Método legacy: Simula un pago (para compatibilidad)
   */
  async simularPago(
    pedidoId: string,
    metodo: string,
    monto: number,
  ): Promise<Pago> {
    const numeroComprobante = `PAY-${Date.now()}`;

    const pago = new this.pagoModel({
      pedidoId,
      metodo,
      monto,
      estado: 'Pagado',
      numeroComprobante,
      detalles: 'Pago simulado - Modo de prueba',
    });

    return pago.save();
  }

  /**
   * Obtiene un pago por ID de pedido
   */
  async obtenerPagoPorPedido(pedidoId: string): Promise<Pago> {
    return this.pagoModel.findOne({ pedidoId }).exec();
  }

  /**
   * Obtiene todos los pagos de un pedido
   */
  async obtenerPagosPorPedido(pedidoId: string): Promise<Pago[]> {
    return this.pagoModel.find({ pedidoId }).sort({ fecha: -1 }).exec();
  }
}
