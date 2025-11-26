import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Usuario extends Document {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ trim: true })
  telefono: string;

  @Prop({ type: Date })
  fechaNacimiento: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Direccion' }] })
  direcciones: Types.ObjectId[];

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  rol: string;

  @Prop({ default: true })
  activo: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

// Índices
UsuarioSchema.index({ email: 1 });
