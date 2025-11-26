import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CarritoService } from './carrito.service';

@ApiTags('carrito')
@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener carrito del usuario con items' })
  @ApiResponse({ status: 200, description: 'Carrito obtenido con items' })
  obtenerCarrito(@Query('usuarioId') usuarioId: string) {
    return this.carritoService.obtenerCarritoConItems(usuarioId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Agregar producto al carrito' })
  @ApiResponse({ status: 201, description: 'Producto agregado al carrito' })
  agregarItem(
    @Body() body: { usuarioId: string; productoId: string; cantidad: number },
  ) {
    return this.carritoService.agregarItem(
      body.usuarioId,
      body.productoId,
      body.cantidad,
    );
  }

  @Post('items/:productoId')
  @ApiOperation({ summary: 'Actualizar cantidad de producto en carrito' })
  actualizarCantidad(
    @Param('productoId') productoId: string,
    @Body() body: { usuarioId: string; cantidad: number },
  ) {
    return this.carritoService.actualizarCantidad(
      body.usuarioId,
      productoId,
      body.cantidad,
    );
  }

  @Delete('items/:productoId')
  @ApiOperation({ summary: 'Eliminar producto del carrito' })
  eliminarItem(
    @Param('productoId') productoId: string,
    @Query('usuarioId') usuarioId: string,
  ) {
    return this.carritoService.eliminarItem(usuarioId, productoId);
  }

  @Delete()
  @ApiOperation({ summary: 'Vaciar carrito' })
  vaciarCarrito(@Query('usuarioId') usuarioId: string) {
    return this.carritoService.vaciarCarrito(usuarioId);
  }
}
