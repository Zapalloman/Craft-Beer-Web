import { IsEnum, IsOptional, IsString, IsObject, IsMongoId } from 'class-validator';
import { TipoEvento, TipoEntidad } from '../schemas/evento-usuario.schema';

export class RegistrarEventoDto {
  @IsEnum(TipoEvento)
  tipoEvento: TipoEvento;

  @IsEnum(TipoEntidad)
  @IsOptional()
  entidad?: TipoEntidad;

  @IsMongoId()
  @IsOptional()
  entidadId?: string;

  @IsString()
  @IsOptional()
  accion?: string;

  @IsObject()
  @IsOptional()
  datosAdicionales?: Record<string, any>;

  @IsString()
  @IsOptional()
  dispositivo?: string;

  @IsString()
  @IsOptional()
  navegador?: string;

  @IsString()
  @IsOptional()
  sesionId?: string;
}
