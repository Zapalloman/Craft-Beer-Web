import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class ItemCarritoAbandonado {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Producto' })
  productoId: Types.ObjectId;

  @Prop({ required: true })
  nombreProducto: string;

  @Prop({ required: true })
  cantidad: number;

  @Prop({ required: true })
  precioUnitario: number;
}

export enum MotivoAbandono {
  PRECIO_ALTO = 'PrecioAlto',
  COSTO_ENVIO = 'CostoEnvio',
  PROCESO_COMPLICADO = 'ProcesoComplicado',
  FALTA_METODO_PAGO = 'FaltaMetodoPago',
  SOLO_EXPLORANDO = 'SoloExplorando',
  DESCONOCIDO = 'Desconocido',
}

export enum EtapaAbandono {
  CARRITO = 'Carrito',
  CHECKOUT = 'Checkout',
  PAGO = 'Pago',
}

@Schema({ timestamps: true })
export class CarritoAbandonado extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Carrito' })
  carritoId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Usuario' })
  usuarioId: Types.ObjectId;

  @Prop({ type: [ItemCarritoAbandonado], default: [] })
  items: ItemCarritoAbandonado[];

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true })
  fechaCreacion: Date;

  @Prop({ required: true, default: Date.now })
  fechaAbandono: Date;

  @Prop({
    type: String,
    enum: Object.values(MotivoAbandono),
    default: MotivoAbandono.DESCONOCIDO,
  })
  motivoAbandono: MotivoAbandono;

  @Prop({
    type: String,
    enum: Object.values(EtapaAbandono),
    required: true,
  })
  etapaAbandono: EtapaAbandono;

  @Prop()
  dispositivoUsado: string;

  @Prop()
  navegador: string;

  @Prop()
  ipAddress: string;

  @Prop({ type: Object })
  metadatos: Record<string, any>;
}

export const CarritoAbandonadoSchema =
  SchemaFactory.createForClass(CarritoAbandonado);

// Índices para optimizar consultas
CarritoAbandonadoSchema.index({ usuarioId: 1 });
CarritoAbandonadoSchema.index({ fechaAbandono: -1 });
CarritoAbandonadoSchema.index({ motivoAbandono: 1 });
CarritoAbandonadoSchema.index({ etapaAbandono: 1 });
