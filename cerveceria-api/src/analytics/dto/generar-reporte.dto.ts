import { IsEnum, IsDateString, IsOptional } from 'class-validator';
import { PeriodoReporte } from '../schemas/reporte-ventas.schema';

export class GenerarReporteDto {
  @IsEnum(PeriodoReporte)
  periodo: PeriodoReporte;

  @IsDateString()
  @IsOptional()
  fechaInicio?: string;

  @IsDateString()
  @IsOptional()
  fechaFin?: string;
}
