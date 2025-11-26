import { IsString, IsEmail, MinLength, Matches, IsOptional, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Juan Pérez González' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'juan.perez@email.cl' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial',
  })
  password: string;

  @ApiPropertyOptional({ example: '+56912345678' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ example: '1990-05-15' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaNacimiento?: Date;
}
