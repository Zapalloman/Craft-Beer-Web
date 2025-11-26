# 🍺 Craft & Beer - E-commerce de Cervecería Artesanal

<div align="center">

![Craft & Beer Logo](https://img.shields.io/badge/Craft_&_Beer-Cervecer%C3%ADa_Artesanal-amber?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTQgMmgydjJoMTRWMmgydjRoLTJ2MTJjMCAxLjEtLjkgMi0yIDJINmMtMS4xIDAtMi0uOS0yLTJWNkg0VjJtMiA2djEwaDEyVjhINm0yIDJoOHY2SDhWMTBtNCAybC0yIDR2LTRoMloiLz48L3N2Zz4=)

**Sistema de ventas online para cervecería artesanal chilena**

[![NestJS](https://img.shields.io/badge/NestJS-10.x-ea2845?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Flow.cl](https://img.shields.io/badge/Pagos-Flow.cl-00B4E6?style=flat-square)](https://www.flow.cl/)

</div>

---

## 📑 Índice de Presentación

> **Estructura del video según rúbrica:** (1) Contexto rápido, (2) Camino de diseño, (3) Integración y demo, (4) Cierre

1. [Contexto del Proyecto](#1-contexto-del-proyecto) ← Parte 1
2. [Modelo de Negocio y Usuarios](#2-modelo-de-negocio-y-usuarios) ← Parte 2
3. [Épicas y Objetivos](#3-épicas-y-objetivos-de-negocio) ← Parte 2
4. [Historias de Usuario](#4-historias-de-usuario) ← Parte 2
5. [Mockups y Navegación](#5-mockups-y-navegación) ← Parte 2
6. [API y Contratos](#6-api-contracts) ← Parte 2
7. [Diagrama de Clases](#7-diagrama-de-clases) ← Parte 2
8. [Arquitectura de Componentes](#8-arquitectura-de-componentes) ← Parte 2
9. [Stack Tecnológico](#9-stack-tecnológico) ← Parte 2
10. [Demo de Integración](#10-demo-de-integración) ← Parte 3
11. [Calidad del Video](#11-calidad-del-video-y-storytelling) ← Guía completa
12. [Seguridad Web (Bonus)](#bonus-seguridad-web)
13. [Instalación y Ejecución](#instalación-y-ejecución)

---

## 1. Contexto del Proyecto

### 🍺 ¿Qué es Craft & Beer?

**Craft & Beer** es una cervecería artesanal que necesitaba expandir sus ventas más allá de la tienda física. Desarrollamos un **e-commerce completo** optimizado para dispositivos móviles.

### El Problema

| Desafío | Impacto |
|---------|---------|
| 📍 Solo venta física | Alcance limitado geográficamente |
| 🕐 Horario restringido | Pérdida de ventas fuera de horario |
| 📱 Sin presencia digital | Competidores ya venden online |
| 👥 Clientes ocupados | Prefieren comprar desde el celular |

### La Solución

Un sistema de ventas online con:
- ✅ Catálogo navegable de cervezas artesanales
- ✅ Carrito y checkout optimizado
- ✅ Pago seguro con Flow.cl
- ✅ Seguimiento de pedidos
- ✅ Sistema de valoraciones

### Flujo Principal de Compra

```
CATÁLOGO → DETALLE → CARRITO → CHECKOUT → PAGO → CONFIRMACIÓN
```

> 📊 **Mostrar diagrama:** `diagrams/criterio-01-flujo-ecommerce.drawio`

---

## 2. Modelo de Negocio y Usuarios

### 👥 Segmentos de Usuario

#### Cliente Final
| Jobs | Pains | Gains |
|------|-------|-------|
| Comprar cerveza artesanal | Tienda lejos, horarios | Compra rápida desde casa |
| Descubrir nuevos estilos | No sabe qué elegir | Filtros y valoraciones |
| Recibir en casa | Miedo a pagar online | Pago seguro (Flow) |

#### Administrador
| Jobs | Pains | Gains |
|------|-------|-------|
| Gestionar inventario | Excel manual, errores | Dashboard integrado |
| Ver estadísticas | Sin métricas claras | Analytics en tiempo real |
| Procesar pedidos | Proceso lento | Automatización |

### Modelo de Ingresos

| Fuente | Descripción |
|--------|-------------|
| 💰 Venta directa | Margen por cada cerveza vendida |
| 📦 Packs/Bundles | Combos con descuento |
| 🎁 Gift cards | Ventas anticipadas |

> 📊 **Mostrar diagrama:** `diagrams/criterio-02-modelo-negocio.drawio`

---

## 3. Épicas y Objetivos de Negocio

### 🎯 Objetivos de Negocio

| ID | Objetivo | KPI |
|----|----------|-----|
| ON1 | Aumentar ventas online | Ingresos mensuales |
| ON2 | Mejorar experiencia móvil | Bounce rate < 40% |
| ON3 | Reducir abandono de carrito | Conversión > 3% |
| ON4 | Fidelizar clientes | Tasa de recompra |

### 📚 Épicas del Proyecto

| Épica | Objetivo de Negocio | Historias |
|-------|---------------------|-----------|
| **E1:** Catálogo y Descubrimiento | ON1, ON2 | US01, US02, US03 |
| **E2:** Carrito y Compra | ON1, ON3 | US04, US05 |
| **E3:** Gestión de Cuenta | ON4 | US06, US09 |
| **E4:** Valoraciones | ON4 | US07 |
| **E5:** Administración | ON1 | US08 |
| **E6:** Seguimiento | ON4 | US10 |

> 📊 **Mostrar diagrama:** `diagrams/criterio-03-epicas-objetivos.drawio`

---

## 4. Historias de Usuario

### Historias Implementadas (10 User Stories)

| US | Historia | Épica | SP |
|----|----------|-------|----|
| US01 | Ver catálogo de cervezas | E1 | 5 |
| US02 | Buscar cervezas por nombre | E1 | 3 |
| US03 | Ver detalle de producto | E1 | 3 |
| US04 | Gestionar carrito de compras | E2 | 5 |
| US05 | Realizar checkout y pago | E2 | 8 |
| US06 | Registrarse e iniciar sesión | E3 | 5 |
| US07 | Valorar productos comprados | E4 | 3 |
| US08 | Gestionar inventario (Admin) | E5 | 5 |
| US09 | Gestionar mi perfil | E3 | 3 |
| US10 | Ver historial de pedidos | E6 | 3 |

### Formato INVEST + 3C

Cada historia cumple:
- ✅ **Independiente** - Funciona por sí sola
- ✅ **Negociable** - Scope ajustable
- ✅ **Valiosa** - Aporta al negocio
- ✅ **Estimable** - Story points claros
- ✅ **Small** - Completable en un sprint
- ✅ **Testable** - Criterios Gherkin definidos

### Ejemplo: US05 - Checkout

```gherkin
Feature: Checkout y Pago
  Scenario: Pago exitoso con Flow
    Given el cliente tiene productos en el carrito
    And ha iniciado sesión
    When confirma el pedido
    And completa el pago en Flow
    Then el pedido se crea con estado "pagado"
    And recibe confirmación en pantalla
```

> 📄 **Ver detalle completo:** `md/criterio-04-historias-gherkin.md`

---

## 5. Mockups y Navegación

### 📱 Diseño Mobile-First

La aplicación está optimizada para dispositivos móviles (375px+), con diseño responsive para desktop.

### Pantallas Principales

| Pantalla | Ruta | Descripción |
|----------|------|-------------|
| 🏠 Home | `/` | Landing con navegación |
| 📋 Catálogo | `/catalogo` | Grid de productos + filtros |
| 🔍 Búsqueda | `/buscar` | Resultados de búsqueda |
| 🍺 Detalle | `/producto/:id` | Info completa + valoraciones |
| 🛒 Carrito | `/carrito` | Items y total |
| 💳 Checkout | `/checkout` | Dirección + pago |
| 👤 Perfil | `/perfil` | Datos del usuario |
| 📦 Pedidos | `/pedidos` | Historial de órdenes |

### Estados Especiales

El sistema maneja 4 estados:
- ✅ **Loading** - Skeleton loaders
- ✅ **Vacío** - Mensajes amigables
- ✅ **Error** - Feedback claro
- ✅ **Sin stock** - Indicador visual

> 📊 **Mostrar diagrama:** `diagrams/criterio-05-mockups-navegacion.drawio`

---

## 6. API Contracts

### 🔌 Módulos de la API

```
Base URL: http://localhost:3000
```

| Módulo | Prefijo | Endpoints |
|--------|---------|-----------|
| Auth | `/auth` | login, registro |
| Usuarios | `/usuarios` | CRUD usuarios, direcciones |
| Productos | `/productos` | catálogo, búsqueda, filtros |
| Carrito | `/carrito` | agregar, actualizar, eliminar |
| Pedidos | `/pedidos` | crear, listar, estado |
| Pagos | `/pagos` | crear, confirmar (Flow) |
| Valoraciones | `/valoraciones` | crear, listar por producto |
| Analytics | `/analytics` | eventos, reportes (Admin) |

### Códigos HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | GET exitoso |
| 201 | Created | POST exitoso |
| 400 | Bad Request | Validación fallida |
| 401 | Unauthorized | Sin autenticación |
| 404 | Not Found | Recurso no existe |
| 409 | Conflict | Email duplicado |

### Ejemplo: Crear Pedido

```http
POST /pedidos HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "direccionId": "507f1f77bcf86cd799439011",
  "notas": "Dejar con el conserje"
}
```

> 📄 **Ver contratos completos:** `md/criterio-06-api-contracts.md`

---

## 7. Diagrama de Clases

### 🏗️ Entidades del Dominio (9)

```
Usuario ─────────── Direccion (1:*)
   │
   ├── Carrito (1:1) ─── ItemCarrito (*) ─── Producto
   │
   ├── Pedido (*) ─────┬── ItemPedido (embebido)
   │                   └── Pago (0..1)
   │
   └── Valoracion (*) ─── Producto
```

### Entidades

| Entidad | Descripción | Tipo |
|---------|-------------|------|
| **Usuario** | Cliente o admin | Colección |
| **Direccion** | Envío | Colección |
| **Producto** | Cerveza artesanal | Colección |
| **Carrito** | Carrito activo | Colección |
| **ItemCarrito** | Línea de carrito | Colección |
| **Pedido** | Orden confirmada | Colección |
| **ItemPedido** | Línea de pedido | Embebido |
| **Pago** | Transacción Flow | Colección |
| **Valoracion** | Reseña | Colección |

> 📊 **Mostrar diagrama:** `diagrams/criterio-07-diagrama-clases.drawio`

---

## 8. Arquitectura de Componentes

### 🏛️ Arquitectura de 3 Capas

```
┌─────────────────────────────────────────────┐
│         FRONTEND (Next.js :3001)            │
│   Pages → Components → Hooks → Services     │
└─────────────────────────────────────────────┘
                     │
                     │ REST/JSON + JWT
                     ▼
┌─────────────────────────────────────────────┐
│         BACKEND (NestJS :3000)              │
│   Controllers → Services → Schemas         │
└─────────────────────────────────────────────┘
                     │
          ┌─────────┴─────────┐
          ▼                   ▼
┌──────────────────┐  ┌──────────────────┐
│   MongoDB Atlas  │  │    Flow.cl       │
│   (Base Datos)   │  │    (Pagos)       │
└──────────────────┘  └──────────────────┘
```

### Módulos del Backend

| Módulo | Responsabilidad |
|--------|-----------------|
| **AuthModule** | JWT, login, registro |
| **UsuariosModule** | CRUD usuarios |
| **ProductosModule** | Catálogo |
| **CarritoModule** | Carrito de compras |
| **PedidosModule** | Órdenes |
| **PagosModule** | Integración Flow |
| **ValoracionesModule** | Reviews |
| **AnalyticsModule** | Estadísticas |

> 📊 **Mostrar diagrama:** `diagrams/criterio-08-diagrama-componentes.drawio`

---

## 9. Stack Tecnológico

### 🛠️ Stack Completo

| Capa | Tecnología | Versión | Justificación |
|------|------------|---------|---------------|
| **Frontend** | Next.js | 14.x | App Router, SSR, optimización |
| | React | 18.x | Componentes, hooks, ecosistema |
| | TailwindCSS | 3.x | Utility-first, responsive |
| | TypeScript | 5.x | Tipado estático, menos bugs |
| **Backend** | NestJS | 10.x | Modular, DI, TypeScript nativo |
| | Node.js | 18+ LTS | Event-loop, mismo lenguaje |
| **Base de Datos** | MongoDB | 6.x | Documentos, esquema flexible |
| | Mongoose | 8.x | ODM, validaciones |
| **Auth** | JWT | - | Stateless, escalable |
| | bcrypt | - | Hash seguro de passwords |
| **Pagos** | Flow.cl | - | Pasarela chilena, WebPay |
| **Docs** | Swagger | - | OpenAPI automático |

### ¿Por qué estas tecnologías?

| Decisión | Alternativas | Razón de Elección |
|----------|--------------|-------------------|
| Next.js | CRA, Vite | SSR, routing, optimización |
| NestJS | Express puro | Arquitectura, DI, TypeScript |
| MongoDB | PostgreSQL | Esquema flexible, JSON nativo |
| Flow.cl | MercadoPago | Más usado en Chile, WebPay |

> 📊 **Mostrar diagrama:** `diagrams/criterio-09-stack-tecnologico.drawio`

---

## 10. Demo de Integración

### 🎬 Flujo de Demo (5-7 minutos)

#### Paso 1: Catálogo (1 min)
```
1. Abrir http://localhost:3001/catalogo
2. Mostrar grid de productos
3. Usar filtro por tipo (ej: IPA)
4. Buscar "Golden"
```

#### Paso 2: Detalle (30 seg)
```
1. Click en una cerveza
2. Mostrar ABV, IBU, descripción
3. Ver valoraciones
```

#### Paso 3: Carrito (1 min)
```
1. Agregar producto al carrito
2. Mostrar badge actualizado
3. Ir al carrito
4. Modificar cantidad
```

#### Paso 4: Registro/Login (1 min)
```
1. Ir a registro
2. Completar formulario (mostrar validación de password)
3. Registrarse
4. Iniciar sesión
```

#### Paso 5: Checkout (1 min)
```
1. Agregar dirección si es primera vez
2. Seleccionar dirección de envío
3. Ver resumen del pedido
4. Confirmar compra
```

#### Paso 6: Pago con Flow (1 min)
```
1. Redirección a Flow sandbox
2. Usar datos de prueba
3. Confirmar pago
4. Ver confirmación
```

#### Paso 7: Mis Pedidos (30 seg)
```
1. Ir a perfil → Mis Pedidos
2. Ver historial
3. Ver detalle de pedido reciente
```

#### Paso 8: Valoración (30 seg)
```
1. Ir a un producto ya comprado
2. Dejar valoración (estrellas + comentario)
3. Ver valoración publicada
```

### DevTools Tips
- **Responsive:** F12 → Toggle device → iPhone 12 Pro (390px)
- **Network:** Pestaña Network para ver llamadas API (verificar que son peticiones REALES)
- **Console:** Ver logs y posibles errores

> 📄 **Ver guía completa:** `docs/criterio-10-integracion-demo.md`

---

## 11. Calidad del Video y Storytelling

### 🎬 Estructura del Video (4 Partes según Rúbrica)

| Parte | Contenido | Tiempo |
|-------|-----------|--------|
| **1. Contexto** | Transferencia sushi → cervecería | 1-2 min |
| **2. Diseño** | Épicas → Historias → Mockups → API → Clases → Componentes | 3-4 min |
| **3. Demo** | Código + funcionamiento real + DevTools | 5-6 min |
| **4. Cierre** | Limitaciones y trabajo futuro | 1-2 min |

### Parte 2: Camino de Diseño (Secuencia)

```
ÉPICAS → HISTORIAS → MOCKUPS → API → CLASES → ARQUITECTURA
   ↓         ↓           ↓        ↓       ↓          ↓
criterio-03 criterio-04 criterio-05 criterio-06 criterio-07 criterio-08
```

### Parte 4: Limitaciones y Trabajo Futuro

| Implementado | Pendiente |
|--------------|-----------|
| Flow sandbox | Producción real |
| JWT básico | Refresh tokens, 2FA |
| CRUD inventario | Dashboard analytics |
| Local dev | Deploy Vercel/Railway |

> 📄 **Ver guía completa:** `docs/criterio-11-calidad-video-storytelling.md`

---

## BONUS: Seguridad Web

### 🔐 Implementación de Seguridad

| Área | Implementación | Nivel |
|------|----------------|-------|
| **Autenticación** | JWT (HS256) + bcrypt | ✅ |
| **Autorización** | Roles user/admin | ✅ |
| **Validación** | class-validator + DTOs | ✅ |
| **Passwords** | bcrypt 10 rounds + regex | ✅ |
| **CORS** | Whitelist de orígenes | ✅ |
| **Datos sensibles** | Variables de entorno | ✅ |
| **Pagos** | HMAC-SHA256 (Flow) | ✅ |
| **Errores** | Mensajes genéricos | ✅ |

### Validación de Password

```typescript
@MinLength(8)
@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
password: string;
// Requiere: 8+ chars, mayúscula, minúscula, número, símbolo
```

### JWT Flow

```
1. Usuario envía credenciales
2. Backend valida con bcrypt.compare()
3. Si válido, genera JWT con rol
4. Cliente guarda token
5. Peticiones incluyen Authorization: Bearer <token>
6. Backend valida y extrae usuario del token
```

### Amenazas Mitigadas

| Amenaza | Protección |
|---------|------------|
| SQL/NoSQL Injection | DTOs + Mongoose |
| XSS | Validación + Sanitización |
| CSRF | CORS + Tokens |
| Fuerza Bruta | bcrypt (costoso) |
| Credential Stuffing | Mensajes genéricos |

> 📊 **Mostrar diagrama:** `diagrams/criterio-B1-web-segura.drawio`

---

## Instalación y Ejecución

### Requisitos Previos

- Node.js 18+ LTS
- MongoDB (local o Atlas)
- Git

### 1. Clonar Repositorio

```bash
git clone https://github.com/Zapalloman/Craft-Beer-Web.git
cd Craft-Beer-Web
```

### 2. Instalar Dependencias

```bash
# Backend
cd cerveceria-api
npm install

# Frontend
cd ../cerveceria-frontend
npm install
```

### 3. Configurar Variables de Entorno

```bash
# cerveceria-api/.env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/craftbeer
JWT_SECRET=tu-secret-seguro-de-256-bits
JWT_EXPIRATION=7d
FLOW_API_KEY=tu-api-key-flow
FLOW_SECRET_KEY=tu-secret-key-flow
FLOW_SANDBOX=true
```

### 4. Ejecutar Proyecto

```bash
# Terminal 1 - Backend
cd cerveceria-api
npm run start:dev
# API en http://localhost:3000
# Swagger en http://localhost:3000/api

# Terminal 2 - Frontend
cd cerveceria-frontend
npm run dev
# Web en http://localhost:3001
```

### 5. Seed de Datos (Opcional)

```bash
cd cerveceria-api
npm run seed
```

---

## 📁 Estructura del Proyecto

```
Craft-Beer-Web/
│
├── cerveceria-api/              # 🖥️ Backend NestJS
│   ├── src/
│   │   ├── auth/                # Autenticación JWT
│   │   ├── usuarios/            # CRUD usuarios + direcciones
│   │   ├── productos/           # Catálogo de cervezas
│   │   ├── carrito/             # Gestión del carrito
│   │   ├── pedidos/             # Órdenes y estados
│   │   ├── pagos/               # Integración Flow.cl
│   │   │   └── flow/            # Servicio Flow
│   │   ├── valoraciones/        # Sistema de reviews
│   │   ├── analytics/           # Estadísticas (Admin)
│   │   └── scripts/             # Seeds de datos
│   ├── .env                     # Variables de entorno
│   └── package.json
│
├── cerveceria-frontend/         # 📱 Frontend Next.js 14
│   ├── app/                     # App Router (páginas)
│   │   ├── layout.tsx           # Layout principal
│   │   ├── page.tsx             # Home (/)
│   │   ├── admin/               # Panel de administración
│   │   ├── buscar/              # Búsqueda (/buscar)
│   │   ├── carrito/             # Carrito (/carrito)
│   │   ├── checkout/            # Checkout (/checkout)
│   │   ├── login/               # Login (/login)
│   │   ├── registro/            # Registro (/registro)
│   │   ├── perfil/              # Perfil (/perfil)
│   │   ├── pedidos/             # Mis pedidos (/pedidos)
│   │   └── producto/            # Detalle (/producto/:id)
│   ├── components/              # Componentes React
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── header.tsx           # Navegación principal
│   │   ├── footer.tsx           # Pie de página
│   │   ├── product-card.tsx     # Tarjeta de producto
│   │   ├── product-grid.tsx     # Grid del catálogo
│   │   ├── cart-content.tsx     # Contenido del carrito
│   │   ├── checkout-content.tsx # Formulario checkout
│   │   ├── filter-bar.tsx       # Filtros del catálogo
│   │   └── ...                  # Más componentes
│   ├── hooks/                   # Custom hooks
│   ├── lib/                     # Utilidades
│   ├── styles/                  # Estilos globales
│   ├── public/                  # Assets estáticos
│   └── package.json
│
├── docs/                        # 📄 Documentación por criterio
│   ├── criterio-01-*.md/.drawio
│   ├── criterio-02-*.md/.drawio
│   ├── ...
│   └── criterio-B1-*.md/.drawio
│
├── diagrams/                    # 📊 Diagramas Draw.io
│
└── README.md                    # Este archivo
```

---

## 📊 Diagramas y Documentación Disponibles

### Diagramas (Draw.io)

| Criterio | Archivo | Descripción |
|----------|---------|-------------|
| 1 | `criterio-01-flujo-ecommerce.drawio` | Flujo de compra |
| 2 | `criterio-02-modelo-negocio.drawio` | Segmentos y modelo |
| 3 | `criterio-03-epicas-objetivos.drawio` | Épicas y KPIs |
| 5 | `criterio-05-mockups-navegacion.drawio` | Navegación |
| 7 | `criterio-07-diagrama-clases.drawio` | Modelo de dominio |
| 8 | `criterio-08-diagrama-componentes.drawio` | Arquitectura |
| 9 | `criterio-09-stack-tecnologico.drawio` | Stack |
| B1 | `criterio-B1-web-segura.drawio` | Seguridad |

### Documentación Detallada (Markdown)

| Criterio | Archivo | Contenido |
|----------|---------|-----------|
| 4 | `criterio-04-historias-gherkin.md` | US INVEST+3C, Gherkin, DoR |
| 6 | `criterio-06-api-contracts.md` | Endpoints, request/response |
| 10 | `criterio-10-integracion-demo.md` | Guía de demo en vivo |
| 11 | `criterio-11-calidad-video-storytelling.md` | Estructura del video |
| B1 | `criterio-B1-web-segura.md` | Seguridad implementada |

---

## 🎓 Información Académica

| Campo | Valor |
|-------|-------|
| **Asignatura** | Desarrollo Web y Móvil |
| **Proyecto** | E-commerce Cervecería Artesanal |
| **Repositorio** | [github.com/Zapalloman/Craft-Beer-Web](https://github.com/Zapalloman/Craft-Beer-Web) |

---

<div align="center">

**Desarrollado con 🍺 y ☕ para DWM**

</div>
