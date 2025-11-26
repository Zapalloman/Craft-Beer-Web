# Criterio 10: Integración Frontend+Backend y Demo Funcional

> **Puntuación máxima:** 20 puntos (Nivel 4)
> **Tipo:** Demo en vivo (sin diagrama)

---

## 📋 Resumen del Criterio

Este criterio evalúa la **demo en vivo** mostrando:
- Integración real: acciones en GUI disparan peticiones al backend
- CRUD principal funcionando (productos, carrito, pedidos)
- Manejo de errores y validaciones
- Coherencia con historias de usuario, mockups y API contracts

---

## 🎯 Qué Mostrar en el Video (4-5 minutos)

### Preparación Antes de Grabar

1. **Tener abiertos:**
   - Navegador con la app en `http://localhost:3001`
   - DevTools abierto en pestaña **Network** (para mostrar peticiones)
   - Terminal con el backend corriendo (`npm run start:dev`)
   - VS Code con el código (opcional, para mostrar snippets)

2. **Datos de prueba:**
   - Usuario registrado: `demo@craftbeer.cl` / `Demo123!`
   - Productos con stock variado
   - Un pedido previo para mostrar historial

---

## 🎬 Guión de la Demo

### 1. Catálogo de Productos (US01) - 45 segundos

**Acción:** Navegar a `/catalogo`

**Mostrar:**
- ✅ Lista de cervezas cargando desde API
- ✅ Imágenes, precios, tipos (IPA, Stout, Lager)
- ✅ Network tab: `GET /api/productos` → 200 OK

**Decir:** "El catálogo carga los productos desde el backend. Vemos en Network la petición GET a /api/productos que retorna el JSON con todas las cervezas."

---

### 2. Búsqueda y Filtros (US02) - 30 segundos

**Acción:** Usar barra de búsqueda y filtros

**Mostrar:**
- ✅ Buscar "IPA" → filtra en tiempo real
- ✅ Filtrar por tipo, rango de precio
- ✅ Network: `GET /api/productos?search=IPA` o filtros

**Decir:** "La búsqueda envía query params al backend. El filtrado puede ser client-side o server-side según implementación."

---

### 3. Detalle de Producto (US03) - 30 segundos

**Acción:** Click en un producto

**Mostrar:**
- ✅ Página de detalle con toda la info
- ✅ ABV, IBU, ingredientes, temperatura sugerida
- ✅ Valoraciones de otros usuarios
- ✅ Network: `GET /api/productos/:id`

**Decir:** "El detalle trae información completa del producto y sus valoraciones."

---

### 4. Agregar al Carrito (US04) - 45 segundos

**Acción:** Agregar producto al carrito

**Mostrar:**
- ✅ Click en "Agregar al carrito"
- ✅ Notificación de éxito
- ✅ Contador del carrito se actualiza
- ✅ Network: `POST /api/carrito/items` con body `{productoId, cantidad}`
- ✅ Response: carrito actualizado con totales

**Decir:** "Al agregar al carrito, enviamos un POST con el producto y cantidad. El backend calcula subtotales y retorna el carrito actualizado."

---

### 5. Ver y Modificar Carrito (US04) - 45 segundos

**Acción:** Ir al carrito, modificar cantidades

**Mostrar:**
- ✅ Lista de items en el carrito
- ✅ Cambiar cantidad → `PATCH /api/carrito/items/:id`
- ✅ Eliminar item → `DELETE /api/carrito/items/:id`
- ✅ Totales se recalculan (subtotal, IVA, total)

**Decir:** "El carrito permite modificar cantidades con PATCH y eliminar con DELETE. Los totales se recalculan en el backend."

---

### 6. Registro de Usuario (US06) - 30 segundos

**Acción:** Registrar nuevo usuario (o mostrar el flujo)

**Mostrar:**
- ✅ Formulario de registro con validaciones
- ✅ Error si email ya existe
- ✅ Network: `POST /api/auth/registro`
- ✅ Response: `{access_token, usuario}`
- ✅ Token guardado en localStorage

**Decir:** "El registro valida campos en frontend y backend. Si el email ya existe, muestra error. Al registrar, recibimos el JWT."

---

### 7. Login (US06) - 30 segundos

**Acción:** Hacer login

**Mostrar:**
- ✅ Formulario de login
- ✅ Credenciales incorrectas → error 401
- ✅ Login exitoso → `POST /api/auth/login`
- ✅ Token JWT en response y localStorage

**Decir:** "El login retorna un JWT que guardamos en localStorage y enviamos en cada petición protegida."

---

### 8. Proceso de Checkout (US05) - 60 segundos ⭐

**Acción:** Completar una compra

**Mostrar:**
- ✅ Seleccionar dirección de envío
- ✅ Resumen del pedido
- ✅ Click en "Pagar"
- ✅ Network: `POST /api/pedidos` → crea pedido
- ✅ Network: `POST /api/pagos/flow/crear` → inicia pago Flow
- ✅ Redirección a Flow.cl (sandbox)
- ✅ Retorno con confirmación

**Decir:** "El checkout es el flujo más complejo. Creamos el pedido, luego iniciamos el pago con Flow. El usuario es redirigido a la pasarela y al volver confirmamos el pago."

---

### 9. Historial de Pedidos (US10) - 30 segundos

**Acción:** Ver pedidos del usuario

**Mostrar:**
- ✅ Lista de pedidos con estados
- ✅ Detalle de un pedido
- ✅ Network: `GET /api/pedidos/mis-pedidos`
- ✅ Header `Authorization: Bearer <token>`

**Decir:** "Los pedidos se obtienen con el token JWT. Cada pedido muestra su estado: procesando, confirmado, enviado, entregado."

---

### 10. Valoraciones (US07) - 30 segundos

**Acción:** Dejar una valoración en un producto comprado

**Mostrar:**
- ✅ Formulario de valoración (1-5 estrellas + comentario)
- ✅ Network: `POST /api/valoraciones`
- ✅ Valoración aparece en el producto

**Decir:** "Solo usuarios que compraron el producto pueden valorar. La valoración se guarda y actualiza el promedio del producto."

---

### 11. Manejo de Errores - 30 segundos

**Mostrar casos de error:**
- ✅ Stock insuficiente → mensaje claro
- ✅ Token expirado → redirect a login
- ✅ Validación de formulario → errores inline
- ✅ 404 en producto inexistente

**Decir:** "La app maneja errores mostrando mensajes claros al usuario, no errores técnicos."

---

## 🔗 Coherencia con Documentación Anterior

| Documento | Cómo se Refleja en Demo |
|-----------|-------------------------|
| **US01-US10** | Cada flujo demostrado corresponde a una historia |
| **Mockups (Criterio 5)** | La UI sigue los wireframes diseñados |
| **API Contracts (Criterio 6)** | Endpoints mostrados en Network coinciden |
| **Diagrama Clases (Criterio 7)** | Entidades visibles: Usuario, Producto, Carrito, Pedido |
| **Componentes (Criterio 8)** | Se ve la integración Frontend → Backend → MongoDB |
| **Stack (Criterio 9)** | Tecnologías en acción: Next.js, NestJS, MongoDB |

---

## 💡 Tips para la Demo

### DevTools - Qué Mostrar

```
Network Tab:
┌──────────────────────────────────────────────────────────┐
│ Name              │ Status │ Type │ Size   │ Time       │
├───────────────────┼────────┼──────┼────────┼────────────┤
│ productos         │ 200    │ xhr  │ 15.2KB │ 45ms       │
│ carrito           │ 200    │ xhr  │ 2.1KB  │ 32ms       │
│ auth/login        │ 200    │ xhr  │ 1.5KB  │ 120ms      │
│ pedidos           │ 201    │ xhr  │ 3.4KB  │ 89ms       │
└──────────────────────────────────────────────────────────┘
```

### Console - Logs Útiles (si los tienes)
```javascript
console.log('🛒 Carrito actualizado:', carrito);
console.log('✅ Pedido creado:', pedido.numeroOrden);
console.log('💳 Redirigiendo a Flow...');
```

### Headers a Destacar
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

---

## 🎤 Script Sugerido para la Demo

> "Vamos a demostrar la integración real entre el frontend Next.js y el backend NestJS.
>
> *[Abrir catálogo]*
> Aquí vemos el catálogo de cervezas. En Network pueden ver el GET a /api/productos que retorna el JSON desde MongoDB.
>
> *[Agregar al carrito]*
> Al agregar al carrito, enviamos un POST. El backend calcula los totales y retorna el carrito actualizado.
>
> *[Hacer login]*
> El login envía las credenciales, el backend valida con bcrypt y retorna un JWT que guardamos en localStorage.
>
> *[Proceso de checkout]*
> Ahora el flujo completo: seleccionamos dirección, creamos el pedido con POST /api/pedidos, luego iniciamos el pago con Flow. El usuario es redirigido a la pasarela, completa el pago, y al volver el webhook confirma la transacción.
>
> *[Mostrar error]*
> Si intento agregar más stock del disponible, el backend responde con error y mostramos un mensaje claro al usuario.
>
> Esto demuestra la coherencia entre las historias de usuario que definimos, los mockups que diseñamos, y los API contracts que documentamos."

---

## ✅ Checklist para Nivel 4 (20 puntos)

- [x] Acciones en GUI disparan peticiones reales al backend
- [x] Se muestra Network/DevTools con las peticiones
- [x] CRUD principal funciona: listar, agregar, modificar, eliminar
- [x] Flujo de compra completo con pago
- [x] Manejo de errores visible (validaciones, stock, auth)
- [x] Coherencia con historias de usuario
- [x] Coherencia con mockups
- [x] Coherencia con API contracts documentados

---

## 🚀 Comandos para Iniciar la Demo

```powershell
# Terminal 1: Backend
cd cerveceria-api
npm run start:dev

# Terminal 2: Frontend (si aplica)
cd cerveceria-frontend
npm run dev
```

**URLs:**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api
- Swagger Docs: http://localhost:3000/api/docs

---

## 📎 Archivos Relacionados

- `cerveceria-frontend/` - Código del frontend
- `cerveceria-api/` - Código del backend
- `docs/criterio-06-api-contracts.md` - Endpoints documentados
- `docs/criterio-05-mockups-navegacion.md` - Mockups de referencia
