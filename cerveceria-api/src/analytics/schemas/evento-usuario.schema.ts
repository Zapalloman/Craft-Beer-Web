import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TipoEvento {
  PRODUCTO_VISTO = 'ProductoVisto',
  PRODUCTO_AGREGADO_CARRITO = 'ProductoAgregadoCarrito',
  PRODUCTO_REMOVIDO_CARRITO = 'ProductoRemovidoCarrito',
  CARRITO_ABANDONADO = 'CarritoAbandonado',
  COMPRA_REALIZADA = 'CompraRealizada',
  BUSQUEDA_REALIZADA = 'BusquedaRealizada',
  VALORACION_CREADA = 'ValoracionCreada',
  INICIO_SESION = 'InicioSesion',
  CIERRE_SESION = 'CierreSesion',
  REGISTRO_USUARIO = 'RegistroUsuario',
}

export enum TipoEntidad {
  PRODUCTO = 'Producto',
  CARRITO = 'Carrito',
  PEDIDO = 'Pedido',
  USUARIO = 'Usuario',
  VALORACION = 'Valoracion',
  NINGUNO = 'Ninguno',
}

@Schema({ timestamps: true })
export class EventoUsuario extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Usuario' })
  usuarioId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(TipoEvento),
    required: true,
  })
  tipoEvento: TipoEvento;

  @Prop({
    type: String,
    enum: Object.values(TipoEntidad),
    default: TipoEntidad.NINGUNO,
  })
  entidad: TipoEntidad;

  @Prop({ type: Types.ObjectId })
  entidadId: Types.ObjectId;

  @Prop()
  accion: string;

  @Prop({ type: Object })
  datosAdicionales: Record<string, any>;

  @Prop()
  dispositivo: string;

  @Prop()
  navegador: string;

  @Prop()
  ipAddress: string;

  @Prop()
  userAgent: string;

  @Prop({ required: true, default: Date.now })
  fecha: Date;

  @Prop()
  sesionId: string;
}

export const EventoUsuarioSchema = SchemaFactory.createForClass(EventoUsuario);

// Índices para optimizar consultas de analytics
EventoUsuarioSchema.index({ usuarioId: 1, fecha: -1 });
EventoUsuarioSchema.index({ tipoEvento: 1, fecha: -1 });
EventoUsuarioSchema.index({ entidad: 1, entidadId: 1 });
EventoUsuarioSchema.index({ fecha: -1 });
EventoUsuarioSchema.index({ sesionId: 1 });
