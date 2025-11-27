import { Controller, Post, Get, Body, Param, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
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
  private async processFlowReturn(token: string, res: Response) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    
    console.log(`Flow return: Procesando token: ${token ? token.substring(0, 20) + '...' : 'NO TOKEN'}`);
    
    if (!token) {
      console.log('Flow return: No token provided, redirecting to error');
      return res.redirect(`${frontendUrl}/checkout?status=error&reason=no-token`);
    }

    try {
      const pago = await this.pagosService.confirmarPagoFlow(token);
      console.log(`Flow return: Pago ${pago._id} - Estado: ${pago.estado} - PedidoId: ${pago.pedidoId}`);
      
      if (pago.estado === 'Pagado') {
        return res.redirect(`${frontendUrl}/checkout/confirmacion?pedido=${pago.pedidoId}&status=success`);
      } else {
        return res.redirect(`${frontendUrl}/checkout/confirmacion?pedido=${pago.pedidoId}&status=pending`);
      }
    } catch (error) {
      console.error('Error en retorno Flow:', error.message);
      return res.redirect(`${frontendUrl}/checkout?status=error&reason=processing-error`);
    }
  }

  @Get('flow/return')
  @ApiOperation({ summary: 'URL de retorno desde FLOW (GET)' })
  @ApiQuery({ name: 'token', required: false })
  async retornoFlowGet(@Query('token') token: string, @Res() res: Response) {
    return this.processFlowReturn(token, res);
  }

  @Post('flow/return')
  @ApiOperation({ summary: 'URL de retorno desde FLOW (POST)' })
  async retornoFlowPost(
    @Body() body: { token?: string }, 
    @Query('token') queryToken: string,
    @Res() res: Response
  ) {
    const token = body?.token || queryToken;
    return this.processFlowReturn(token, res);
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
