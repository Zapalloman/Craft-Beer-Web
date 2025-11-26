import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ValoracionesService } from './valoraciones.service';

@ApiTags('valoraciones')
@Controller('valoraciones')
export class ValoracionesController {
  constructor(private readonly valoracionesService: ValoracionesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear valoración de producto' })
  @ApiResponse({ status: 201, description: 'Valoración creada' })
  crear(
    @Body()
    body: {
      productoId: string;
      usuarioId: string;
      puntuacion: number;
      comentario?: string;
    },
  ) {
    return this.valoracionesService.crear(
      body.productoId,
      body.usuarioId,
      body.puntuacion,
      body.comentario,
    );
  }

  @Get('producto/:id')
  @ApiOperation({ summary: 'Obtener valoraciones de un producto' })
  @ApiResponse({ status: 200, description: 'Lista de valoraciones' })
  obtenerPorProducto(@Param('id') productoId: string) {
    return this.valoracionesService.obtenerPorProducto(productoId);
  }
}
