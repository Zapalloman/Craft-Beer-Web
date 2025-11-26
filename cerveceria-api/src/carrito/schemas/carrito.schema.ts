import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Carrito extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Usuario', unique: true })
  usuarioId: Types.ObjectId;

  @Prop({ default: 0 })
  subtotal: number;

  @Prop({ default: 0 })
  iva: number;

  @Prop({ default: 0 })
  total: number;

  @Prop({ default: 0 })
  cantidadItems: number; // Cantidad total de items en el carrito
}

export const CarritoSchema = SchemaFactory.createForClass(Carrito);

// Índices
CarritoSchema.index({ usuarioId: 1 });
