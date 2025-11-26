import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { Pago, PagoSchema } from './schemas/pago.schema';
import { FlowService } from './flow/flow.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pago.name, schema: PagoSchema }]),
    ConfigModule,
  ],
  controllers: [PagosController],
  providers: [PagosService, FlowService],
  exports: [PagosService],
})
export class PagosModule {}
