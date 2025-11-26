import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PedidosService } from './pedidos.service';

@ApiTags('pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get('admin/todos')
  @ApiOperation({ summary: 'Obtener todos los pedidos (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de todos los pedidos' })
  obtenerTodosPedidos(
    @Query('estado') estado?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.pedidosService.obtenerTodosPedidos(estado, fechaInicio, fechaFin);
  }

  @Get('admin/estadisticas')
  @ApiOperation({ summary: 'Obtener estadísticas de pedidos (Admin)' })
  @ApiResponse({ status: 200, description: 'Estadísticas de pedidos' })
  obtenerEstadisticas() {
    return this.pedidosService.obtenerEstadisticas();
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo pedido desde el carrito' })
  @ApiResponse({ status: 201, description: 'Pedido creado exitosamente' })
  crear(
    @Body() body: { usuarioId: string; direccionId: string; metodoPago: string },
  ) {
    return this.pedidosService.crear(body.usuarioId, body.direccionId, body.metodoPago);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener historial de pedidos del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos' })
  obtenerPedidos(@Query('usuarioId') usuarioId: string) {
    return this.pedidosService.obtenerPedidos(usuarioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un pedido' })
  @ApiResponse({ status: 200, description: 'Detalle del pedido' })
  obtenerPedido(@Param('id') id: string) {
    return this.pedidosService.obtenerPedido(id);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado del pedido (Admin)' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  actualizarEstado(@Param('id') id: string, @Body() body: { estado: string }) {
    return this.pedidosService.actualizarEstado(id, body.estado);
  }
}
