import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import { Carrito, CarritoSchema } from './schemas/carrito.schema';
import { ItemCarrito, ItemCarritoSchema } from './schemas/item-carrito.schema';
import { ProductosModule } from '../productos/productos.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Carrito.name, schema: CarritoSchema },
      { name: ItemCarrito.name, schema: ItemCarritoSchema },
    ]),
    ProductosModule,
  ],
  controllers: [CarritoController],
  providers: [CarritoService],
  exports: [CarritoService],
})
export class CarritoModule {}
