import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class ItemPedido {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Producto' })
  productoId: Types.ObjectId;

  @Prop({ required: true })
  nombreProducto: string;

  @Prop({ required: true, min: 1 })
  cantidad: number;

  @Prop({ required: true, min: 0 })
  precioUnitario: number;

  @Prop({ required: true, min: 0 })
  subtotal: number;
}

@Schema({ timestamps: true })
export class Pedido extends Document {
  @Prop({ required: true, unique: true })
  numeroOrden: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Usuario' })
  usuarioId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Direccion' })
  direccionId: Types.ObjectId;

  @Prop({ type: [ItemPedido], required: true })
  items: ItemPedido[];

  @Prop({
    required: true,
    enum: ['Procesando', 'Confirmado', 'Enviado', 'Entregado', 'Cancelado'],
    default: 'Procesando',
  })
  estado: string;

  @Prop({ required: true, min: 0 })
  subtotal: number;

  @Prop({ required: true, min: 0 })
  iva: number;

  @Prop({ default: 0 })
  costoEnvio: number;

  @Prop({ required: true, min: 0 })
  total: number;

  @Prop({ required: true, enum: ['flow', 'card', 'transfer', 'Tarjeta', 'Transferencia'] })
  metodoPago: string;

  @Prop({ type: Date, default: Date.now })
  fechaPedido: Date;

  @Prop({ type: Date })
  fechaEntrega: Date;

  @Prop({ trim: true })
  notas: string;
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);

// Índices
PedidoSchema.index({ usuarioId: 1 });
PedidoSchema.index({ numeroOrden: 1 });
PedidoSchema.index({ estado: 1 });
PedidoSchema.index({ fechaPedido: -1 });
