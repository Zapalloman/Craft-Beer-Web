import { IsEnum, IsOptional, IsString, IsObject, IsDateString } from 'class-validator';
import { MotivoAbandono, EtapaAbandono } from '../schemas/carrito-abandonado.schema';

export class RegistrarAbandonoDto {
  @IsEnum(EtapaAbandono)
  etapaAbandono: EtapaAbandono;

  @IsEnum(MotivoAbandono)
  @IsOptional()
  motivoAbandono?: MotivoAbandono;

  @IsString()
  @IsOptional()
  dispositivoUsado?: string;

  @IsString()
  @IsOptional()
  navegador?: string;

  @IsObject()
  @IsOptional()
  metadatos?: Record<string, any>;
}
