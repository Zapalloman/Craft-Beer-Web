import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum PeriodoEstadistica {
  DIARIO = 'Diario',
  SEMANAL = 'Semanal',
  MENSUAL = 'Mensual',
  ANUAL = 'Anual',
}

@Schema({ timestamps: true })
export class EstadisticaProducto extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Producto' })
  productoId: Types.ObjectId;

  @Prop({ required: true })
  nombre: string;

  @Prop({ default: 0 })
  totalVistas: number;

  @Prop({ default: 0 })
  totalVentas: number;

  @Prop({ default: 0 })
  totalCarritoAgregado: number;

  @Prop({ default: 0 })
  totalCarritoAbandonado: number;

  @Prop({ default: 0 })
  tasaConversion: number; // Porcentaje de conversión de vistas a ventas

  @Prop({ default: 0 })
  ingresoTotal: number;

  @Prop({ default: 0 })
  valoracionPromedio: number;

  @Prop({ default: 0 })
  totalValoraciones: number;

  @Prop({
    type: String,
    enum: Object.values(PeriodoEstadistica),
    required: true,
  })
  periodo: PeriodoEstadistica;

  @Prop({ required: true })
  fechaInicio: Date;

  @Prop({ required: true })
  fechaFin: Date;

  @Prop({ required: true, default: Date.now })
  fechaActualizacion: Date;

  @Prop({ type: Object })
  metadatos: Record<string, any>;
}

export const EstadisticaProductoSchema =
  SchemaFactory.createForClass(EstadisticaProducto);

// Índices para optimizar consultas
EstadisticaProductoSchema.index({ productoId: 1, periodo: 1, fechaInicio: -1 });
EstadisticaProductoSchema.index({ periodo: 1, fechaInicio: -1 });
EstadisticaProductoSchema.index({ totalVentas: -1 });
EstadisticaProductoSchema.index({ tasaConversion: -1 });
EstadisticaProductoSchema.index({ ingresoTotal: -1 });
