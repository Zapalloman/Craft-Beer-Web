# Criterio 6: API Contracts y Diseño de Servicios (6 pts)

## 📋 Resumen para el Video (45-60 segundos)

> "La API REST de Craft & Beer expone 8 módulos: auth, usuarios, productos, carrito, pedidos, pagos, valoraciones y analytics. Cada endpoint está documentado con Swagger. Usamos códigos HTTP estándar: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found. La autenticación usa sesiones con sessionStorage para simplicidad. La paginación está diseñada pero no implementada en V1 - el catálogo tiene ~20 productos que no la requieren."

---

## 🔌 Base URL

```
http://localhost:3000
```

---

## 📦 Módulos de la API

| Módulo | Prefijo | Descripción |
|--------|---------|-------------|
| Auth | `/auth` | Registro y login |
| Usuarios | `/usuarios` | CRUD de usuarios y direcciones |
| Productos | `/productos` | Catálogo, búsqueda, filtros |
| Carrito | `/carrito` | Gestión del carrito de compras |
| Pedidos | `/pedidos` | Creación y seguimiento de pedidos |
| Pagos | `/pagos` | Integración con Flow (pasarela chilena) |
| Valoraciones | `/valoraciones` | Reseñas de productos |
| Analytics | `/analytics` | Eventos, reportes, estadísticas (Admin) |

---

## 🔐 1. Auth (`/auth`)

### POST `/auth/registro` - Registrar usuario

**Request Body:**
```json
{
  "nombre": "Juan Pérez González",
  "email": "juan.perez@email.cl",
  "password": "Password123!",
  "telefono": "+56912345678",        // opcional
  "fechaNacimiento": "1990-05-15"    // opcional
}
```

**Validaciones:**
- `email`: formato válido
- `password`: mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número, 1 especial

**Response 201 Created:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "Juan Pérez González",
  "email": "juan.perez@email.cl",
  "rol": "cliente",
  "createdAt": "2025-11-26T10:30:00Z"
}
```

**Response 409 Conflict:**
```json
{
  "statusCode": 409,
  "message": "El email ya está registrado",
  "error": "Conflict"
}
```

---

### POST `/auth/login` - Iniciar sesión

**Request Body:**
```json
{
  "email": "juan.perez@email.cl",
  "password": "Password123!"
}
```

**Response 200 OK:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "Juan Pérez González",
  "email": "juan.perez@email.cl",
  "rol": "cliente"
}
```

**Response 401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Credenciales inválidas",
  "error": "Unauthorized"
}
```

---

## 🍺 2. Productos (`/productos`)

### GET `/productos` - Listar productos con filtros

**Query Parameters (todos opcionales):**
| Param | Tipo | Valores | Ejemplo |
|-------|------|---------|---------|
| `tipo` | string | IPA, Stout, Lager, Porter, Ale | `?tipo=IPA` |
| `precioMin` | number | 0+ | `?precioMin=2000` |
| `precioMax` | number | 0+ | `?precioMax=5000` |
| `abvMin` | number | 0-100 | `?abvMin=4` |
| `abvMax` | number | 0-100 | `?abvMax=8` |

**Response 200 OK:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Golden Lager Artesanal",
    "tipo": "Lager",
    "descripcion": "Cerveza dorada con cuerpo ligero",
    "precio": 3500,
    "abv": 4.5,
    "ibu": 18,
    "formato": "330ml",
    "stock": 50,
    "activo": true,
    "imagen": "http://localhost:3000/uploads/productos/golden-lager.jpg",
    "ingredientes": ["Malta", "Lúpulo", "Levadura", "Agua"],
    "promedioValoracion": 4.2,
    "totalValoraciones": 15
  }
]
```

---

### GET `/productos/buscar?q={término}` - Buscar productos

**Query Parameters:**
| Param | Requerido | Descripción |
|-------|-----------|-------------|
| `q` | ✅ | Término de búsqueda (nombre o descripción) |

**Ejemplo:** `GET /productos/buscar?q=ipa`

**Response 200 OK:**
```json
[
  {
    "_id": "...",
    "nombre": "West Coast IPA",
    "tipo": "IPA",
    "precio": 4200,
    ...
  }
]
```

---

### GET `/productos/:id` - Detalle de producto

**Response 200 OK:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "Golden Lager Artesanal",
  "tipo": "Lager",
  "descripcion": "Cerveza dorada con cuerpo ligero y sabor refrescante",
  "precio": 3500,
  "abv": 4.5,
  "ibu": 18,
  "formato": "330ml",
  "stock": 50,
  "activo": true,
  "imagen": "http://localhost:3000/uploads/productos/golden-lager.jpg",
  "ingredientes": ["Malta pilsen", "Lúpulo Saaz", "Levadura lager", "Agua"],
  "temperaturaServido": "4-7°C",
  "maridaje": "Pescados, ensaladas, quesos suaves",
  "promedioValoracion": 4.2,
  "totalValoraciones": 15
}
```

**Response 404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "Producto no encontrado",
  "error": "Not Found"
}
```

---

### POST `/productos` - Crear producto (Admin)

**Request Body:**
```json
{
  "nombre": "New England IPA",
  "tipo": "IPA",
  "descripcion": "IPA turbia con notas tropicales",
  "precio": 4500,
  "abv": 6.8,
  "ibu": 45,
  "formato": "500ml",
  "stock": 30,
  "activo": true,
  "imagen": "http://localhost:3000/uploads/productos/neipa.jpg",
  "ingredientes": ["Malta pale", "Avena", "Citra", "Mosaic"]
}
```

**Response 201 Created:** Objeto producto creado

---

### POST `/productos/upload-imagen` - Subir imagen

**Request:** `multipart/form-data`
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| `imagen` | file | jpg, jpeg, png, gif, webp. Máx 5MB |

**Response 200 OK:**
```json
{
  "url": "http://localhost:3000/uploads/productos/producto-1732612345-123456789.jpg",
  "filename": "producto-1732612345-123456789.jpg"
}
```

---

### PATCH `/productos/:id` - Actualizar producto (Admin)

**Request Body:** Campos parciales de producto

**Response 200 OK:** Objeto producto actualizado

---

### DELETE `/productos/:id` - Eliminar producto (Admin)

**Response 200 OK:** Soft delete (activo = false)

---

## 🛒 3. Carrito (`/carrito`)

### GET `/carrito?usuarioId={id}` - Obtener carrito

**Response 200 OK:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "usuarioId": "507f1f77bcf86cd799439011",
  "items": [
    {
      "productoId": "507f1f77bcf86cd799439015",
      "cantidad": 2,
      "producto": {
        "nombre": "Golden Lager",
        "precio": 3500,
        "imagen": "..."
      }
    }
  ],
  "subtotal": 7000,
  "total": 7000
}
```

---

### POST `/carrito/items` - Agregar producto

**Request Body:**
```json
{
  "usuarioId": "507f1f77bcf86cd799439011",
  "productoId": "507f1f77bcf86cd799439015",
  "cantidad": 2
}
```

**Response 201 Created:** Carrito actualizado

---

### POST `/carrito/items/:productoId` - Actualizar cantidad

**Request Body:**
```json
{
  "usuarioId": "507f1f77bcf86cd799439011",
  "cantidad": 3
}
```

---

### DELETE `/carrito/items/:productoId?usuarioId={id}` - Eliminar item

**Response 200 OK:** Carrito sin el item

---

### DELETE `/carrito?usuarioId={id}` - Vaciar carrito

**Response 200 OK:** Carrito vacío

---

## 📦 4. Pedidos (`/pedidos`)

### POST `/pedidos` - Crear pedido

**Request Body:**
```json
{
  "usuarioId": "507f1f77bcf86cd799439011",
  "direccionId": "507f1f77bcf86cd799439013",
  "metodoPago": "flow"
}
```

**Response 201 Created:**
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "numeroOrden": "ORD-20251126-001",
  "usuarioId": "507f1f77bcf86cd799439011",
  "items": [...],
  "subtotal": 7000,
  "costoEnvio": 2990,
  "total": 9990,
  "estado": "Pendiente",
  "direccionEnvio": {...},
  "fechaCreacion": "2025-11-26T10:30:00Z"
}
```

---

### GET `/pedidos?usuarioId={id}` - Historial de pedidos

**Response 200 OK:**
```json
[
  {
    "_id": "...",
    "numeroOrden": "ORD-20251126-001",
    "estado": "Enviado",
    "total": 9990,
    "fechaCreacion": "2025-11-26T10:30:00Z",
    "items": [...]
  }
]
```

---

### GET `/pedidos/:id` - Detalle de pedido

**Response 200 OK:** Objeto pedido completo

---

### GET `/pedidos/admin/todos` - Listar todos (Admin)

**Query Parameters:**
| Param | Descripción |
|-------|-------------|
| `estado` | Filtrar por estado (Pendiente, Pagado, Enviado, Entregado) |
| `fechaInicio` | Fecha inicio (ISO 8601) |
| `fechaFin` | Fecha fin (ISO 8601) |

---

### GET `/pedidos/admin/estadisticas` - Estadísticas (Admin)

**Response 200 OK:**
```json
{
  "totalPedidos": 150,
  "pedidosPorEstado": {
    "Pendiente": 5,
    "Pagado": 10,
    "Enviado": 25,
    "Entregado": 110
  },
  "ingresoTotal": 1500000,
  "ticketPromedio": 10000
}
```

---

### PATCH `/pedidos/:id/estado` - Actualizar estado (Admin)

**Request Body:**
```json
{
  "estado": "Enviado"
}
```

**Estados válidos:** `Pendiente` → `Pagado` → `Enviado` → `Entregado`

---

## 💳 5. Pagos (`/pagos`) - Integración Flow

### POST `/pagos/flow/crear` - Iniciar pago Flow

**Request Body:**
```json
{
  "pedidoId": "507f1f77bcf86cd799439020",
  "numeroOrden": "ORD-20251126-001",
  "monto": 9990,
  "email": "juan.perez@email.cl"
}
```

**Response 201 Created:**
```json
{
  "success": true,
  "pagoId": "507f1f77bcf86cd799439025",
  "flowUrl": "https://sandbox.flow.cl/app/web/pay.php?token=...",
  "token": "xyz123...",
  "message": "Redirigir al usuario a flowUrl para completar el pago"
}
```

---

### GET `/pagos/flow/confirm?token={token}` - Webhook confirmación

**Llamado por Flow después del pago**

**Response 200 OK:**
```json
{
  "success": true,
  "estado": "Pagado",
  "pagoId": "507f1f77bcf86cd799439025",
  "pedidoId": "507f1f77bcf86cd799439020"
}
```

---

### GET `/pagos/flow/return?token={token}` - Retorno usuario

**Redirección automática a:**
- ✅ Éxito: `http://localhost:3001/checkout/confirmacion?pedido={id}&status=success`
- ❌ Error: `http://localhost:3001/checkout?status=error&reason={mensaje}`

---

### GET `/pagos/estado/:pagoId` - Consultar estado

**Response 200 OK:**
```json
{
  "_id": "507f1f77bcf86cd799439025",
  "pedidoId": "507f1f77bcf86cd799439020",
  "metodo": "flow",
  "monto": 9990,
  "estado": "Pagado",
  "flowToken": "xyz123...",
  "fechaPago": "2025-11-26T10:35:00Z"
}
```

---

## ⭐ 6. Valoraciones (`/valoraciones`)

### POST `/valoraciones` - Crear valoración

**Request Body:**
```json
{
  "productoId": "507f1f77bcf86cd799439015",
  "usuarioId": "507f1f77bcf86cd799439011",
  "puntuacion": 5,
  "comentario": "Excelente cerveza, muy refrescante"
}
```

**Validaciones:**
- `puntuacion`: 1-5 (entero)
- `comentario`: opcional

**Response 201 Created:** Objeto valoración

---

### GET `/valoraciones/producto/:id` - Valoraciones de producto

**Response 200 OK:**
```json
{
  "promedio": 4.2,
  "total": 15,
  "valoraciones": [
    {
      "_id": "...",
      "puntuacion": 5,
      "comentario": "Excelente cerveza",
      "usuario": {
        "nombre": "Juan P."
      },
      "fechaCreacion": "2025-11-20T15:00:00Z"
    }
  ]
}
```

---

## 👤 7. Usuarios (`/usuarios`)

### GET `/usuarios/:id` - Obtener usuario

**Response 200 OK:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "Juan Pérez González",
  "email": "juan.perez@email.cl",
  "telefono": "+56912345678",
  "rol": "cliente",
  "direcciones": [...]
}
```

---

### PATCH `/usuarios/:id` - Actualizar usuario

**Request Body:**
```json
{
  "nombre": "Juan Pablo Pérez",
  "telefono": "+56987654321"
}
```

---

### GET `/usuarios/:id/direcciones` - Listar direcciones

### POST `/usuarios/:id/direcciones` - Agregar dirección

**Request Body:**
```json
{
  "calle": "Av. Providencia 1234",
  "comuna": "Providencia",
  "ciudad": "Santiago",
  "region": "Metropolitana",
  "codigoPostal": "7500000",
  "instrucciones": "Departamento 501"
}
```

---

## 📊 8. Analytics (`/analytics`) - Admin

### POST `/analytics/eventos` - Registrar evento

**Request Body:**
```json
{
  "tipoEvento": "vista_producto",
  "productoId": "507f1f77bcf86cd799439015",
  "metadata": {
    "origen": "busqueda",
    "terminoBusqueda": "ipa"
  }
}
```

**Tipos de evento:** `vista_producto`, `agregar_carrito`, `eliminar_carrito`, `inicio_checkout`, `compra_completada`, `busqueda`, `filtro_aplicado`

---

### GET `/analytics/eventos/resumen` - Resumen de eventos

### GET `/analytics/carritos-abandonados` - Carritos abandonados

### GET `/analytics/carritos-abandonados/estadisticas` - Stats de abandono

---

## 🔴 Códigos de Estado HTTP

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| 200 | OK | GET exitoso, PATCH exitoso |
| 201 | Created | POST crea recurso nuevo |
| 400 | Bad Request | Validación falla (DTO inválido) |
| 401 | Unauthorized | Login fallido, sin autenticación |
| 404 | Not Found | Recurso no existe |
| 409 | Conflict | Email duplicado en registro |
| 500 | Internal Server Error | Error del servidor |

---

## 🔒 Autenticación

**Estrategia V1: Session-based (sessionStorage)**

```
┌─────────┐      POST /auth/login       ┌─────────┐
│ Frontend│ ────────────────────────────>│ Backend │
│         │<────────────────────────────│         │
└─────────┘   { _id, nombre, rol }      └─────────┘
     │
     ▼
sessionStorage.setItem('user', JSON.stringify(user))
```

**Para endpoints que requieren usuario:**
- Frontend envía `usuarioId` en query params o body
- Ejemplo: `GET /carrito?usuarioId=xxx`
- Ejemplo: `POST /carrito/items` con `{ usuarioId: xxx, ... }`

**Nota:** En producción se implementaría JWT. Para este MVP, la autenticación basada en sesión del navegador es suficiente.

---

## 📄 Paginación (Diseño)

**Diseñada pero no implementada en V1** - el catálogo tiene ~20 productos.

Estructura planificada para V2:
```json
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

Query params: `?page=1&limit=20`

---

## 🛡️ Manejo de Errores

**Formato estándar de error (NestJS):**
```json
{
  "statusCode": 400,
  "message": ["precio debe ser un número positivo"],
  "error": "Bad Request"
}
```

**Errores de validación (class-validator):**
```json
{
  "statusCode": 400,
  "message": [
    "email debe ser un email válido",
    "password debe tener al menos 8 caracteres"
  ],
  "error": "Bad Request"
}
```

---

## 📖 Swagger / OpenAPI

**URL de documentación interactiva:**
```
http://localhost:3000/api
```

Cada controller usa decoradores de Swagger:
- `@ApiTags('productos')` - Agrupa endpoints
- `@ApiOperation({ summary: '...' })` - Descripción
- `@ApiResponse({ status: 200, description: '...' })` - Respuestas
- `@ApiQuery({ name: 'tipo', required: false })` - Parámetros

---

## ✅ Checklist Nivel 4

| Requisito | Estado |
|-----------|--------|
| URL, método definidos para cada endpoint | ✅ |
| Estructura request/response documentada | ✅ |
| Códigos de estado HTTP especificados | ✅ |
| Coherencia API ↔ Historias de usuario | ✅ |
| Coherencia API ↔ Mockups | ✅ |
| Frontend puede consumir sin ambigüedad | ✅ |
| Paginación mencionada (diseño) | ✅ |
| Manejo de errores definido | ✅ |
| Autenticación explicada | ✅ |

---

## 🎬 Demo en el Video

1. **Mostrar Swagger UI** (`http://localhost:3000/api`)
   - Expandir un endpoint (ej: POST /auth/login)
   - Mostrar schema de request/response
   - Ejecutar "Try it out" si hay tiempo

2. **O scrollear este README** mostrando:
   - Tabla de módulos
   - Un ejemplo de endpoint completo (login o productos)
   - Códigos de estado

3. **Mencionar:**
   > "Todos los endpoints siguen REST, usan JSON, y están documentados con Swagger. Los códigos de estado son estándar HTTP."

---

## 🔗 Coherencia con User Stories

| User Story | Endpoints relacionados |
|------------|------------------------|
| US01: Catálogo | GET /productos |
| US02: Búsqueda | GET /productos/buscar |
| US03: Detalle | GET /productos/:id |
| US04: Carrito | GET/POST/DELETE /carrito/* |
| US05: Checkout | POST /pedidos, POST /pagos/flow/crear |
| US06: Registro | POST /auth/registro |
| US07: Valoraciones | GET/POST /valoraciones/* |
| US08: Inventario | GET/PATCH /productos/* (Admin) |
| US09: Perfil | GET/PATCH /usuarios/:id |
| US10: Pedidos | GET /pedidos |
