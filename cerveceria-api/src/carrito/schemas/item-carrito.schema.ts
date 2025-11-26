import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ItemCarrito extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Carrito' })
  carritoId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Producto' })
  productoId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  cantidad: number;

  @Prop({ required: true, min: 0 })
  precioUnitario: number;

  @Prop({ min: 0 })
  subtotal: number; // precioUnitario * cantidad
}

export const ItemCarritoSchema = SchemaFactory.createForClass(ItemCarrito);

// Índices para optimizar consultas
ItemCarritoSchema.index({ carritoId: 1 });
ItemCarritoSchema.index({ productoId: 1 });
ItemCarritoSchema.index({ carritoId: 1, productoId: 1 }, { unique: true }); // Un producto solo una vez por carrito
