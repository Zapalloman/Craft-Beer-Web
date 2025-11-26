import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ValoracionesService } from './valoraciones.service';
import { ValoracionesController } from './valoraciones.controller';
import { Valoracion, ValoracionSchema } from './schemas/valoracion.schema';
import { ProductosModule } from '../productos/productos.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Valoracion.name, schema: ValoracionSchema }]),
    ProductosModule,
  ],
  controllers: [ValoracionesController],
  providers: [ValoracionesService],
})
export class ValoracionesModule {}
