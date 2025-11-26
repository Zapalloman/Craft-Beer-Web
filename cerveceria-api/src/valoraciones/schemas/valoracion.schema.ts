import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Valoracion extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Producto' })
  productoId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Usuario' })
  usuarioId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  puntuacion: number;

  @Prop({ trim: true })
  comentario: string;

  @Prop({ default: false })
  verificado: boolean; // Si el usuario compró el producto
}

export const ValoracionSchema = SchemaFactory.createForClass(Valoracion);

// Índices
ValoracionSchema.index({ productoId: 1 });
ValoracionSchema.index({ usuarioId: 1 });
ValoracionSchema.index({ productoId: 1, usuarioId: 1 }, { unique: true }); // Un usuario solo puede valorar un producto una vez
