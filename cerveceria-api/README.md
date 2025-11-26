# Cervecería Craft & Beer - Backend API | JAVIER FARÍAS

API REST desarrollada con NestJS para el e-commerce de cervezas artesanales. Proporciona endpoints para gestión de productos, usuarios, carritos de compra, pedidos, pagos y analytics.

## Stack Tecnológico

- **Framework**: NestJS 10.x (Node.js)
- **Base de datos**: MongoDB 8.x con Mongoose ODM
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger/OpenAPI
- **Pasarela de pagos**: FLOW (modo sandbox)

## Arquitectura

### Módulos principales

- **Auth**: Registro y autenticación de usuarios con JWT
- **Usuarios**: Gestión de perfiles y direcciones
- **Productos**: CRUD de productos, búsqueda y filtrado
- **Carrito**: Sistema de carrito con items separados (arquitectura optimizada)
- **Pedidos**: Gestión del flujo de compra
- **Pagos**: Integración con FLOW para procesamiento de pagos
- **Valoraciones**: Sistema de reviews de productos
- **Analytics**: Seguimiento de eventos, carritos abandonados y reportes de ventas

### Estructura del carrito

El sistema implementa una arquitectura de dos entidades separadas para optimizar consultas:

- **Carrito**: Almacena totales, IVA y contadores
- **ItemCarrito**: Entidad independiente con referencia al carrito

Esta separación evita cargar todos los items cuando solo se necesitan datos del carrito.

## Diagramas

El directorio `backend/` incluye dos diagramas Draw.io:

- `diagrama-api-craftbeer.drawio`: Arquitectura de la API y modelos de datos
- `diagrama-componentes-backend.drawio`: Estructura de módulos y dependencias

## Configuración e instalación

### Prerrequisitos

- Node.js 18+ y npm
- MongoDB 8.x instalado y corriendo en `localhost:27017`

### Variables de entorno

Crear archivo `.env` en la raíz del backend:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/cerveceria-craft-beer

# JWT
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRATION=7d

# CORS
FRONTEND_URL=http://localhost:5500
CORS_ORIGIN=http://localhost:5500

# FLOW (modo sandbox)
FLOW_SANDBOX=true
FLOW_API_KEY=DEMO_API_KEY
FLOW_SECRET_KEY=DEMO_SECRET_KEY
```

### Instalación

```bash

npm install


npm run start:dev

```

### Seeders (opcional)

Para poblar la base de datos con datos de prueba:

```bash
npm run seed
```

## API Endpoints

Una vez iniciado el servidor, la documentación interactiva está disponible en:

```
http://localhost:3000/api/docs
```

### Principales rutas

**Autenticación**
- POST `/api/auth/registro` - Crear cuenta
- POST `/api/auth/login` - Iniciar sesión

**Productos**
- GET `/api/productos` - Listar productos
- GET `/api/productos/buscar?termino=ipa` - Búsqueda
- POST `/api/productos` - Crear producto

**Carrito**
- GET `/api/carrito?usuarioId={id}` - Obtener carrito
- POST `/api/carrito/items` - Agregar item
- DELETE `/api/carrito/items/{productoId}` - Eliminar item

**Pedidos**
- POST `/api/pedidos` - Crear pedido
- GET `/api/pedidos?usuarioId={id}` - Listar pedidos

**Analytics**
- GET `/api/analytics/dashboard` - Dashboard general
- POST `/api/analytics/eventos` - Registrar evento
- GET `/api/analytics/carritos-abandonados` - Carritos abandonados

## Testing con Swagger

1. Iniciar MongoDB: `mongod --dbpath C:\data\db`
2. Iniciar API: `npm run start:dev`
3. Abrir `http://localhost:3000/api/docs`
4. Probar endpoints directamente desde la interfaz

Para verificar los datos, usar MongoDB Compass conectándose a `mongodb://localhost:27017` y explorar la base de datos `cerveceria-craft-beer`.

## Características destacadas

- Validación automática de DTOs con decoradores
- Paginación y filtrado en listados
- Índices en MongoDB para consultas optimizadas
- CORS configurado para desarrollo local
- Swagger UI para testing y documentación
- Arquitectura modular escalable
- Separación de responsabilidades (carrito refactorizado)

## Desarrollo

```bash
# Modo watch (auto-reload)
npm run start:dev

# Linting
npm run lint

# Formateo de código
npm run format
```

## Licencia

MIT
