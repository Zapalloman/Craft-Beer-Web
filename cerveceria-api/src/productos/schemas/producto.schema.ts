import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Producto extends Document {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, enum: ['IPA', 'Stout', 'Lager', 'Porter', 'Ale'] })
  tipo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true, min: 0 })
  precio: number;

  @Prop({ required: true, min: 0, max: 100 })
  abv: number; // Alcohol por volumen

  @Prop({ min: 0 })
  ibu: number; // International Bitterness Units

  @Prop({ default: '330ml', enum: ['330ml', '500ml', '1L'] })
  formato: string;

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  @Prop({ default: true })
  activo: boolean;

  @Prop({ trim: true })
  imagen: string;

  @Prop({ type: [String], default: [] })
  ingredientes: string[];

  @Prop({ trim: true })
  temperatura: string;

  @Prop({ default: 0 })
  valoracionPromedio: number;

  @Prop({ default: 0 })
  numeroValoraciones: number;
}

export const ProductoSchema = SchemaFactory.createForClass(Producto);

// Índices
ProductoSchema.index({ nombre: 'text', descripcion: 'text' });
ProductoSchema.index({ tipo: 1 });
ProductoSchema.index({ activo: 1 });
ProductoSchema.index({ precio: 1 });
