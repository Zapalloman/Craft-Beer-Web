import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductosService } from '../productos/productos.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  //const productosService = app.get(ProductosService);

  

  console.log('🌱 Iniciando seed de productos...');



  

  console.log('\n✅ Seed completado!');
  await app.close();
}

bootstrap();
