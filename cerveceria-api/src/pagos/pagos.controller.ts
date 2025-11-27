import { Controller, Post, Get, Body, Param, Query, Redirect } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PagosService } from './pagos.service';

@ApiTags('pagos')
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post('flow/crear')
  @ApiOperation({ summary: 'Crear pago con FLOW' })
  @ApiResponse({ status: 201, description: 'Pago FLOW creado, retorna URL de redirección' })
  async crearPagoFlow(
    @Body() body: { 
      pedidoId: string; 
      numeroOrden: string; 
      monto: number; 
      email: string 
    },
  ) {
    const pago = await this.pagosService.crearPagoFlow(
      body.pedidoId,
      body.numeroOrden,
      body.monto,
      body.email,
    );

    return {
      success: true,
      pagoId: pago._id,
      flowUrl: pago.flowUrl,
      token: pago.flowToken,
      message: 'Redirigir al usuario a flowUrl para completar el pago',
    };
  }

  @Get('flow/confirm')
  @ApiOperation({ summary: 'Confirmar pago desde webhook de FLOW' })
  @ApiQuery({ name: 'token', required: true })
  async confirmarPagoFlow(@Query('token') token: string) {
    try {
      const pago = await this.pagosService.confirmarPagoFlow(token);
      
      return {
        success: pago.estado === 'Pagado',
        estado: pago.estado,
        pagoId: pago._id,
        pedidoId: pago.pedidoId,
      };
    } catch (error) {
      console.error('Error en confirmación Flow:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Método compartido para procesar retorno de Flow
  private async processFlowReturn(token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    
    try {
      if (!token) {
        console.log('Flow return: No token provided');
        return { 
          url: `${frontendUrl}/checkout?status=error&reason=No token`,
          statusCode: 302,
        };
      }

      const pago = await this.pagosService.confirmarPagoFlow(token);
      console.log(`Flow return: Pago ${pago._id} - Estado: ${pago.estado}`);
      
      if (pago.estado === 'Pagado') {
        return { 
          url: `${frontendUrl}/checkout/confirmacion?pedido=${pago.pedidoId}&status=success`,
          statusCode: 302,
        };
      } else {
        return { 
          url: `${frontendUrl}/checkout/confirmacion?pedido=${pago.pedidoId}&status=pending`,
          statusCode: 302,
        };
      }
    } catch (error) {
      console.error('Error en retorno Flow:', error.message);
      return { 
        url: `${frontendUrl}/checkout?status=error&reason=Error`,
        statusCode: 302,
      };
    }
  }

  @Get('flow/return')
  @ApiOperation({ summary: 'URL de retorno desde FLOW (GET)' })
  @ApiQuery({ name: 'token', required: false })
  @Redirect()
  async retornoFlowGet(@Query('token') token: string) {
    return this.processFlowReturn(token);
  }

  @Post('flow/return')
  @ApiOperation({ summary: 'URL de retorno desde FLOW (POST)' })
  @Redirect()
  async retornoFlowPost(@Body() body: { token?: string }, @Query('token') queryToken: string) {
    const token = body?.token || queryToken;
    return this.processFlowReturn(token);
  }

  @Get('estado/:pagoId')
  @ApiOperation({ summary: 'Consultar estado de un pago' })
  @ApiResponse({ status: 200, description: 'Estado actual del pago' })
  async obtenerEstadoPago(@Param('pagoId') pagoId: string) {
    return this.pagosService.obtenerEstadoPago(pagoId);
  }

  @Post('simular')
  @ApiOperation({ summary: 'Simular procesamiento de pago (legacy - sin FLOW)' })
  @ApiResponse({ status: 201, description: 'Pago simulado exitosamente' })
  simularPago(
    @Body() body: { pedidoId: string; metodo: string; monto: number },
  ) {
    return this.pagosService.simularPago(body.pedidoId, body.metodo, body.monto);
  }

  @Get('pedido/:pedidoId')
  @ApiOperation({ summary: 'Obtener información de pago de un pedido' })
  @ApiResponse({ status: 200, description: 'Información del pago' })
  obtenerPagoPorPedido(@Param('pedidoId') pedidoId: string) {
    return this.pagosService.obtenerPagoPorPedido(pedidoId);
  }
}
