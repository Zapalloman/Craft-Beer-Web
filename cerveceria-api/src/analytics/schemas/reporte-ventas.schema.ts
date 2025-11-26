import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum PeriodoReporte {
  DIARIO = 'Diario',
  SEMANAL = 'Semanal',
  MENSUAL = 'Mensual',
  TRIMESTRAL = 'Trimestral',
  ANUAL = 'Anual',
  PERSONALIZADO = 'Personalizado',
}

class ProductoVendido {
  @Prop({ required: true })
  productoId: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  cantidad: number;

  @Prop({ required: true })
  ingresos: number;
}

class CategoriaVendida {
  @Prop({ required: true })
  categoria: string;

  @Prop({ required: true })
  cantidad: number;

  @Prop({ required: true })
  ingresos: number;
}

@Schema({ timestamps: true })
export class ReporteVentas extends Document {
  @Prop({
    type: String,
    enum: Object.values(PeriodoReporte),
    required: true,
  })
  periodo: PeriodoReporte;

  @Prop({ required: true })
  fechaInicio: Date;

  @Prop({ required: true })
  fechaFin: Date;

  @Prop({ default: 0 })
  totalVentas: number;

  @Prop({ default: 0 })
  totalIngresos: number;

  @Prop({ default: 0 })
  ticketPromedio: number;

  @Prop({ default: 0 })
  totalClientes: number;

  @Prop({ default: 0 })
  clientesNuevos: number;

  @Prop({ default: 0 })
  clientesRecurrentes: number;

  @Prop({ type: [ProductoVendido], default: [] })
  productosMasVendidos: ProductoVendido[];

  @Prop({ type: [CategoriaVendida], default: [] })
  categoriasMasVendidas: CategoriaVendida[];

  @Prop({ default: 0 })
  totalCarritosCreados: number;

  @Prop({ default: 0 })
  totalCarritosAbandonados: number;

  @Prop({ default: 0 })
  tasaAbandonoCarrito: number; // Porcentaje

  @Prop({ default: 0 })
  tasaConversionGeneral: number; // Porcentaje

  @Prop({ type: Object })
  metricasAdicionales: Record<string, any>;

  @Prop({ required: true, default: Date.now })
  fechaGeneracion: Date;
}

export const ReporteVentasSchema = SchemaFactory.createForClass(ReporteVentas);

// Índices
ReporteVentasSchema.index({ periodo: 1, fechaInicio: -1 });
ReporteVentasSchema.index({ fechaGeneracion: -1 });
