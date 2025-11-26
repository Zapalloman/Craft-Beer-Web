import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Pago extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Pedido' })
  pedidoId: Types.ObjectId;

  @Prop({ required: true, enum: ['Tarjeta', 'Transferencia', 'Flow', 'card', 'transfer', 'flow'] })
  metodo: string;

  @Prop({ required: true, min: 0 })
  monto: number;

  @Prop({
    required: true,
    enum: ['Pendiente', 'Pagado', 'Rechazado', 'Cancelado'],
    default: 'Pendiente',
  })
  estado: string;

  @Prop({ type: Date, default: Date.now })
  fecha: Date;

  @Prop({ required: true, unique: true })
  numeroComprobante: string;

  // Campos específicos de FLOW
  @Prop({ trim: true })
  flowToken: string; // Token de la transacción FLOW

  @Prop({ trim: true })
  flowPaymentId: string; // ID del pago en FLOW

  @Prop({ trim: true })
  flowUrl: string; // URL de redirección a FLOW

  @Prop({ trim: true })
  flowStatus: string; // Estado retornado por FLOW

  @Prop({ type: Object })
  flowResponse: any; // Respuesta completa de FLOW (para debugging)

  @Prop({ trim: true })
  detalles: string; // Información adicional del pago
}

export const PagoSchema = SchemaFactory.createForClass(Pago);

// Índices
PagoSchema.index({ pedidoId: 1 });
PagoSchema.index({ numeroComprobante: 1 });
PagoSchema.index({ estado: 1 });
PagoSchema.index({ flowToken: 1 });
PagoSchema.index({ flowPaymentId: 1 });
