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

  @Get('flow/return')
  @ApiOperation({ summary: 'URL de retorno desde FLOW (usuario)' })
  @ApiQuery({ name: 'token', required: true })
  @Redirect()
  async retornoFlow(@Query('token') token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    
    try {
      const pago = await this.pagosService.confirmarPagoFlow(token);
      
      if (pago.estado === 'Pagado') {
        return { 
          url: `${frontendUrl}/checkout/confirmacion?pedido=${pago.pedidoId}&status=success`,
          statusCode: 302,
        };
      } else {
        return { 
          url: `${frontendUrl}/checkout?status=error&reason=${pago.estado}`,
          statusCode: 302,
        };
      }
    } catch (error) {
      console.error('Error en retorno Flow:', error.message);
      // Si hay error, redirigir al checkout con mensaje de error
      return { 
        url: `${frontendUrl}/checkout?status=error&reason=Error al procesar pago`,
        statusCode: 302,
      };
    }
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
