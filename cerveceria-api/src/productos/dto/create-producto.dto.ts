import { IsString, IsNumber, IsEnum, IsOptional, IsArray, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({ example: 'Golden Lager Artesanal' })
  @IsString()
  nombre: string;

  @ApiProperty({ enum: ['IPA', 'Stout', 'Lager', 'Porter', 'Ale'] })
  @IsEnum(['IPA', 'Stout', 'Lager', 'Porter', 'Ale'])
  tipo: string;

  @ApiProperty({ example: 'Cerveza dorada con cuerpo ligero y sabor refrescante' })
  @IsString()
  descripcion: string;

  @ApiProperty({ example: 3500 })
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiProperty({ example: 4.5 })
  @IsNumber()
  @Min(0)
  @Max(100)
  abv: number;

  @ApiPropertyOptional({ example: 18 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  ibu?: number;

  @ApiPropertyOptional({ enum: ['330ml', '500ml', '1L'], example: '330ml' })
  @IsOptional()
  @IsEnum(['330ml', '500ml', '1L'])
  formato?: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ example: 'https://ejemplo.com/imagen.jpg' })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiPropertyOptional({ example: ['Malta', 'Lúpulo', 'Levadura', 'Agua'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredientes?: string[];

  @ApiPropertyOptional({ example: '4-7°C' })
  @IsOptional()
  @IsString()
  temperatura?: string;
}
