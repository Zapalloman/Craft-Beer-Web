import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import {
  CarritoAbandonado,
  CarritoAbandonadoSchema,
} from './schemas/carrito-abandonado.schema';
import {
  EventoUsuario,
  EventoUsuarioSchema,
} from './schemas/evento-usuario.schema';
import {
  EstadisticaProducto,
  EstadisticaProductoSchema,
} from './schemas/estadistica-producto.schema';
import {
  ReporteVentas,
  ReporteVentasSchema,
} from './schemas/reporte-ventas.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CarritoAbandonado.name, schema: CarritoAbandonadoSchema },
      { name: EventoUsuario.name, schema: EventoUsuarioSchema },
      { name: EstadisticaProducto.name, schema: EstadisticaProductoSchema },
      { name: ReporteVentas.name, schema: ReporteVentasSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
