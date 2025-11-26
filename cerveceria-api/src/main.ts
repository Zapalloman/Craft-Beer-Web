import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir archivos estáticos (imágenes de productos)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // CORS - Permitir peticiones desde el frontend
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://192.168.1.170:5500',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
      ];
      
      // Permitir peticiones sin origin (como Postman) o desde origins permitidos
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  // Validación automática de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
      transform: true, // Transforma tipos automáticamente
    }),
  );

  // Configuración de Swagger (Documentación API)
  const config = new DocumentBuilder()
    .setTitle('Cervecería Craft & Beer API')
    .setDescription('API REST para e-commerce de cervezas artesanales chilenas')
    .setVersion('1.0')
    .addTag('auth', 'Autenticación y registro')
    .addTag('productos', 'Gestión de productos (cervezas)')
    .addTag('carrito', 'Carrito de compras')
    .addTag('pedidos', 'Gestión de pedidos')
    .addTag('usuarios', 'Gestión de usuarios')
    .addTag('valoraciones', 'Valoraciones de productos')
    .addTag('pagos', 'Procesamiento de pagos (simulado)')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
  🍺 ========================================
     Cervecería Craft & Beer API
  ========================================
  🚀 Servidor: http://localhost:${port}
  📚 Swagger: http://localhost:${port}/api/docs
  🗄️  MongoDB: ${process.env.MONGODB_URI}
  🌍 CORS: ${process.env.CORS_ORIGIN}
  ========================================
  `);
}
bootstrap();
