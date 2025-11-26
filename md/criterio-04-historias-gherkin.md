# Criterio 4: Historias INVEST+3C, Gherkin y DoR

> **Peso:** 10 puntos | **Objetivo:** Nivel 4 (Excelente)

---

## 📋 Qué debes mostrar en el video

1. **Mostrar historias en Taiga.io** (o este README)
2. **Explicar que cumplen INVEST** (Independientes, Negociables, Valiosas, Estimables, Small, Testables)
3. **Mostrar escenarios Gherkin** (Given/When/Then) incluyendo casos de error
4. **Mencionar el DoR** (Definition of Ready) y cómo se cumple

---

## 📐 Definition of Ready (DoR)

Cada historia cumple con el DoR cuando tiene:

| Criterio DoR | Descripción |
|--------------|-------------|
| ✅ **Card** | Título claro en formato "Como... quiero... para..." |
| ✅ **Conversation** | Notas de refinamiento y aclaraciones |
| ✅ **Confirmation** | Criterios de aceptación en Gherkin |
| ✅ **Dependencias** | Dependencias identificadas (API, mockups) |
| ✅ **Mockup** | Diseño de pantalla vinculado |
| ✅ **API Contract** | Endpoints documentados |
| ✅ **Estimación** | Story points asignados |

---

## 📚 Historias de Usuario

---

### US01: Ver Catálogo de Cervezas

#### Card (Tarjeta)
| Campo | Valor |
|-------|-------|
| **Como** | Cliente |
| **Quiero** | Ver el catálogo de cervezas artesanales |
| **Para** | Explorar productos y decidir qué comprar |
| **Story Points** | 5 |
| **Épica** | Catálogo y Descubrimiento |

#### INVEST
| Criterio | Cumple | Justificación |
|----------|:------:|---------------|
| **I**ndependiente | ✅ | No depende de otras US para funcionar |
| **N**egociable | ✅ | Se puede ajustar filtros, paginación |
| **V**aliosa | ✅ | Sin catálogo no hay ventas |
| **E**stimable | ✅ | 5 SP - scope claro |
| **S**mall | ✅ | Una pantalla, un flujo |
| **T**estable | ✅ | Criterios Gherkin definidos |

#### Confirmation (Gherkin)

```gherkin
Feature: Catálogo de Cervezas
  Como cliente
  Quiero ver el catálogo de cervezas
  Para explorar productos disponibles

  Scenario: Ver catálogo con productos
    Given el cliente está en la página principal
    When navega al catálogo
    Then ve una lista de cervezas con imagen, nombre, precio y ABV
    And puede ver al menos 12 productos por página

  Scenario: Filtrar por tipo de cerveza
    Given el cliente está en el catálogo
    When selecciona el filtro "IPA"
    Then solo ve cervezas de tipo IPA
    And el contador muestra la cantidad filtrada

  Scenario: Filtrar por rango de precio
    Given el cliente está en el catálogo
    When ajusta el slider de precio de $3000 a $8000
    Then solo ve cervezas en ese rango de precio

  Scenario: Catálogo vacío (error)
    Given no hay productos en el sistema
    When el cliente navega al catálogo
    Then ve un mensaje "No hay productos disponibles"
    And ve un botón para volver al inicio
```

#### Dependencias
- **API:** `GET /productos` con filtros query params
- **Mockup:** Pantalla catálogo móvil

---

### US02: Buscar Cervezas

#### Card
| Campo | Valor |
|-------|-------|
| **Como** | Cliente |
| **Quiero** | Buscar cervezas por nombre |
| **Para** | Encontrar rápidamente un producto específico |
| **Story Points** | 3 |
| **Épica** | Catálogo y Descubrimiento |

#### INVEST
| Criterio | Cumple | Justificación |
|----------|:------:|---------------|
| **I**ndependiente | ✅ | Funciona con o sin filtros |
| **N**egociable | ✅ | Búsqueda simple o avanzada |
| **V**aliosa | ✅ | Mejora UX significativamente |
| **E**stimable | ✅ | 3 SP - input + llamada API |
| **S**mall | ✅ | Un componente de búsqueda |
| **T**estable | ✅ | Casos definidos |

#### Confirmation (Gherkin)

```gherkin
Feature: Búsqueda de Cervezas
  Como cliente
  Quiero buscar cervezas por nombre
  Para encontrar productos específicos

  Scenario: Búsqueda exitosa
    Given el cliente está en el catálogo
    When escribe "IPA" en el buscador
    And presiona Enter o el botón buscar
    Then ve cervezas que contienen "IPA" en el nombre

  Scenario: Búsqueda sin resultados
    Given el cliente está en el catálogo
    When escribe "xyz123" en el buscador
    Then ve mensaje "No se encontraron resultados para 'xyz123'"
    And ve sugerencia de limpiar búsqueda

  Scenario: Búsqueda vacía
    Given el cliente tiene una búsqueda activa
    When limpia el campo de búsqueda
    Then ve todos los productos sin filtro
```

#### Dependencias
- **API:** `GET /productos?search={término}`

---

### US03: Ver Detalle de Producto

#### Card
| Campo | Valor |
|-------|-------|
| **Como** | Cliente |
| **Quiero** | Ver el detalle completo de una cerveza |
| **Para** | Conocer características antes de comprar |
| **Story Points** | 3 |
| **Épica** | Catálogo y Descubrimiento |

#### INVEST
| Criterio | Cumple | Justificación |
|----------|:------:|---------------|
| **I**ndependiente | ✅ | Solo requiere ID de producto |
| **N**egociable | ✅ | Qué info mostrar es flexible |
| **V**aliosa | ✅ | Cliente necesita info para decidir |
| **E**stimable | ✅ | 3 SP - una pantalla |
| **S**mall | ✅ | Lectura de datos |
| **T**estable | ✅ | Datos específicos a validar |

#### Confirmation (Gherkin)

```gherkin
Feature: Detalle de Producto
  Como cliente
  Quiero ver el detalle de una cerveza
  Para conocer sus características

  Scenario: Ver detalle completo
    Given el cliente está en el catálogo
    When hace click en una cerveza
    Then ve la pantalla de detalle con:
      | Campo | Visible |
      | Imagen grande | Sí |
      | Nombre | Sí |
      | Precio | Sí |
      | ABV (alcohol) | Sí |
      | IBU (amargor) | Sí |
      | Descripción | Sí |
      | Tipo | Sí |
      | Valoraciones | Sí |
    And ve botón "Agregar al carrito"

  Scenario: Producto no encontrado (error)
    Given el cliente accede a /productos/id-inexistente
    Then ve mensaje "Producto no encontrado"
    And ve botón para volver al catálogo

  Scenario: Producto sin stock
    Given el producto tiene stock = 0
    When el cliente ve el detalle
    Then el botón "Agregar al carrito" está deshabilitado
    And ve mensaje "Sin stock disponible"
```

#### Dependencias
- **API:** `GET /productos/:id`
- **Mockup:** Pantalla detalle móvil

---

### US04: Gestionar Carrito de Compras

#### Card
| Campo | Valor |
|-------|-------|
| **Como** | Cliente |
| **Quiero** | Gestionar mi carrito de compras |
| **Para** | Agregar, modificar y eliminar productos antes de pagar |
| **Story Points** | 8 |
| **Épica** | Carrito y Compra |

#### INVEST
| Criterio | Cumple | Justificación |
|----------|:------:|---------------|
| **I**ndependiente | ✅ | Funciona con cualquier producto |
| **N**egociable | ✅ | UI del carrito flexible |
| **V**aliosa | ✅ | Core del e-commerce |
| **E**stimable | ✅ | 8 SP - múltiples acciones |
| **S**mall | ✅ | Scope definido: CRUD items |
| **T**estable | ✅ | Acciones verificables |

#### Confirmation (Gherkin)

```gherkin
Feature: Carrito de Compras
  Como cliente
  Quiero gestionar mi carrito
  Para preparar mi compra

  Scenario: Agregar producto al carrito
    Given el cliente está en el detalle de un producto
    And el producto tiene stock disponible
    When hace click en "Agregar al carrito"
    Then el producto se agrega al carrito
    And el contador del carrito aumenta en 1
    And ve confirmación "Producto agregado"

  Scenario: Modificar cantidad en carrito
    Given el cliente tiene un producto en el carrito
    When cambia la cantidad a 3
    Then el subtotal se actualiza (precio × 3)
    And el total del carrito se recalcula

  Scenario: Eliminar producto del carrito
    Given el cliente tiene productos en el carrito
    When hace click en eliminar un producto
    Then el producto se remueve del carrito
    And el total se recalcula

  Scenario: Carrito vacío
    Given el cliente no tiene productos en el carrito
    When accede al carrito
    Then ve mensaje "Tu carrito está vacío"
    And ve botón "Ir al catálogo"

  Scenario: Agregar más del stock disponible (error)
    Given el producto tiene stock = 5
    And el cliente ya tiene 5 en el carrito
    When intenta agregar 1 más
    Then ve error "No hay suficiente stock"
```

#### Dependencias
- **API:** `POST /carrito/agregar`, `PUT /carrito/item/:id`, `DELETE /carrito/item/:id`
- **Contexto:** CartContext para estado global

---

### US05: Realizar Checkout y Pago

#### Card
| Campo | Valor |
|-------|-------|
| **Como** | Cliente |
| **Quiero** | Completar el proceso de compra |
| **Para** | Pagar y recibir mis productos |
| **Story Points** | 13 |
| **Épica** | Carrito y Compra |

#### INVEST
| Criterio | Cumple | Justificación |
|----------|:------:|---------------|
| **I**ndependiente | ✅ | Depende de carrito pero es separable |
| **N**egociable | ✅ | Métodos de pago, pasos |
| **V**aliosa | ✅ | Sin checkout no hay ingresos |
| **E**stimable | ✅ | 13 SP - integración pago |
| **S**mall | ✅ | Flujo definido de 3 pasos |
| **T**estable | ✅ | Estados de pago verificables |

#### Confirmation (Gherkin)

```gherkin
Feature: Checkout y Pago
  Como cliente
  Quiero completar mi compra
  Para recibir mis productos

  Scenario: Checkout exitoso
    Given el cliente tiene productos en el carrito
    And está autenticado
    When procede al checkout
    Then selecciona o ingresa dirección de envío
    And confirma el pedido
    And es redirigido a Flow para pagar

  Scenario: Pago exitoso
    Given el cliente completó el pago en Flow
    When Flow redirige de vuelta
    Then ve pantalla de confirmación
    And el pedido queda en estado "Confirmado"
    And el carrito se vacía

  Scenario: Pago fallido
    Given el cliente cancela en Flow
    When es redirigido de vuelta
    Then ve mensaje "Pago no completado"
    And el pedido queda en estado "Procesando"
    And puede reintentar el pago

  Scenario: Usuario no autenticado (error)
    Given el cliente no está logueado
    When intenta hacer checkout
    Then es redirigido al login
    And después del login vuelve al checkout

  Scenario: Carrito vacío intenta checkout (error)
    Given el carrito está vacío
    When intenta acceder a checkout
    Then ve error "Agrega productos para continuar"
```

#### Dependencias
- **API:** `POST /pedidos`, `POST /pagos/crear`, `GET /pagos/confirmar`
- **Externa:** API Flow (sandbox)
- **Mockup:** Flujo checkout 3 pasos

---

### US06: Registrarse como Cliente

#### Card
| Campo | Valor |
|-------|-------|
| **Como** | Visitante |
| **Quiero** | Registrarme en la plataforma |
| **Para** | Poder realizar compras |
| **Story Points** | 5 |
| **Épica** | Cuenta y Autenticación |

#### Confirmation (Gherkin)

```gherkin
Feature: Registro de Usuario
  Como visitante
  Quiero registrarme
  Para poder comprar

  Scenario: Registro exitoso
    Given el visitante está en la página de registro
    When completa nombre, email y contraseña válidos
    And acepta términos
    And hace click en "Registrarse"
    Then se crea la cuenta
    And queda logueado automáticamente
    And es redirigido al catálogo

  Scenario: Email ya registrado (error)
    Given existe un usuario con email "test@mail.com"
    When el visitante intenta registrarse con ese email
    Then ve error "Este email ya está registrado"

  Scenario: Contraseña muy débil (error)
    Given el visitante ingresa contraseña "123"
    Then ve error "La contraseña debe tener al menos 6 caracteres"

  Scenario: Campos vacíos (error)
    Given el visitante deja campos obligatorios vacíos
    When intenta enviar el formulario
    Then ve errores de validación en cada campo
```

#### Dependencias
- **API:** `POST /auth/registro`

---

### US07: Valorar Productos Comprados

#### Card
| Campo | Valor |
|-------|-------|
| **Como** | Cliente |
| **Quiero** | Valorar productos que he comprado |
| **Para** | Compartir mi opinión y ayudar a otros |
| **Story Points** | 5 |
| **Épica** | Seguimiento y Valoraciones |

#### Confirmation (Gherkin)

```gherkin
Feature: Valoraciones
  Como cliente
  Quiero valorar productos
  Para compartir mi experiencia

  Scenario: Crear valoración
    Given el cliente compró el producto
    And el pedido está entregado
    When accede al producto y hace click en "Valorar"
    Then puede seleccionar 1-5 estrellas
    And puede escribir un comentario
    And al guardar, la valoración aparece en el producto

  Scenario: Ver valoraciones existentes
    Given un producto tiene valoraciones
    When el cliente ve el detalle
    Then ve el promedio de estrellas
    And ve las reseñas de otros clientes

  Scenario: No puede valorar sin comprar (error)
    Given el cliente no ha comprado el producto
    When intenta valorar
    Then ve mensaje "Debes comprar el producto para valorarlo"
```

#### Dependencias
- **API:** `POST /valoraciones`, `GET /valoraciones/producto/:id`

---

### US08: Gestionar Inventario (Admin)

#### Card
| Campo | Valor |
|-------|-------|
| **Como** | Administrador |
| **Quiero** | Gestionar el inventario de productos |
| **Para** | Mantener el catálogo actualizado |
| **Story Points** | 8 |
| **Épica** | Panel de Administración |

#### Confirmation (Gherkin)

```gherkin
Feature: Gestión de Inventario
  Como administrador
  Quiero gestionar productos
  Para mantener el catálogo

  Scenario: Crear nuevo producto
    Given el admin está en el panel de inventario
    When hace click en "Agregar Producto"
    And completa todos los campos requeridos
    And hace click en "Guardar"
    Then el producto aparece en el catálogo

  Scenario: Editar producto existente
    Given existe un producto
    When el admin edita el precio
    And guarda los cambios
    Then el precio se actualiza en el catálogo

  Scenario: Desactivar producto
    Given existe un producto activo
    When el admin lo desactiva
    Then el producto no aparece en el catálogo público
    But sigue visible en el panel admin

  Scenario: Actualizar stock
    Given un producto tiene stock = 10
    When el admin cambia el stock a 50
    Then el stock se actualiza
    And el producto permite compras hasta 50 unidades
```

#### Dependencias
- **API:** `POST /productos`, `PUT /productos/:id`, `DELETE /productos/:id`

---

### US09: Gestionar Perfil y Direcciones

#### Card
| Campo | Valor |
|-------|-------|
| **Como** | Cliente |
| **Quiero** | Gestionar mi perfil y direcciones |
| **Para** | Tener mis datos listos para futuras compras |
| **Story Points** | 5 |
| **Épica** | Cuenta y Autenticación |

#### Confirmation (Gherkin)

```gherkin
Feature: Perfil y Direcciones
  Como cliente
  Quiero gestionar mis datos
  Para agilizar compras

  Scenario: Agregar dirección
    Given el cliente está en su perfil
    When hace click en "Agregar Dirección"
    And completa calle, número, comuna, ciudad
    And guarda
    Then la dirección aparece en su lista

  Scenario: Editar dirección
    Given el cliente tiene una dirección guardada
    When la edita y guarda
    Then los cambios se reflejan

  Scenario: Usar dirección guardada en checkout
    Given el cliente tiene direcciones guardadas
    When procede al checkout
    Then puede seleccionar una dirección existente
    And no necesita escribirla de nuevo
```

#### Dependencias
- **API:** `PUT /usuarios/:id`, `POST /usuarios/:id/direcciones`

---

### US10: Ver Historial de Pedidos

#### Card
| Campo | Valor |
|-------|-------|
| **Como** | Cliente |
| **Quiero** | Ver mi historial de pedidos |
| **Para** | Hacer seguimiento y reordenar |
| **Story Points** | 5 |
| **Épica** | Seguimiento y Valoraciones |

#### Confirmation (Gherkin)

```gherkin
Feature: Historial de Pedidos
  Como cliente
  Quiero ver mis pedidos
  Para hacer seguimiento

  Scenario: Ver lista de pedidos
    Given el cliente tiene pedidos realizados
    When accede a "Mis Pedidos"
    Then ve lista ordenada por fecha (más reciente primero)
    And cada pedido muestra estado, total, fecha

  Scenario: Ver detalle de pedido
    Given el cliente tiene un pedido
    When hace click en el pedido
    Then ve los productos, cantidades, precios
    And ve la dirección de envío
    And ve el estado actual

  Scenario: Seguimiento de estado
    Given el cliente tiene un pedido en estado "Enviado"
    When ve el detalle
    Then ve la línea de tiempo del pedido
    And ve que pasó por: Procesando → Confirmado → Enviado

  Scenario: Sin pedidos
    Given el cliente no ha realizado pedidos
    When accede a "Mis Pedidos"
    Then ve mensaje "Aún no tienes pedidos"
    And ve botón "Ir al catálogo"
```

#### Dependencias
- **API:** `GET /pedidos/mis-pedidos`

---

## 🎬 Guión sugerido para el video (60-90 segundos)

> "Las historias de usuario siguen el formato INVEST y 3C.
>
> Por ejemplo, US04 Gestionar Carrito: **Independiente** porque funciona con cualquier producto. **Negociable** en diseño UI. **Valiosa** porque es core del e-commerce. **Estimable** con 8 story points. **Small** enfocada en CRUD de items. **Testable** con escenarios Gherkin.
>
> Las **3C**: La **Card** dice 'Como cliente quiero gestionar mi carrito para preparar mi compra'. La **Conversation** incluye notas de refinamiento. La **Confirmation** son los criterios de aceptación en Gherkin.
>
> Los escenarios Gherkin incluyen **casos de éxito** como agregar producto, y **casos de error** como intentar agregar más del stock disponible.
>
> Cada historia cumple el **DoR**: tiene Card clara, Gherkin completo, dependencias identificadas con el API contract, mockup vinculado, y estimación en story points."

---

## 💡 Qué mostrar en pantalla

| Opción | Recomendación |
|--------|---------------|
| **Taiga.io** | Si tienes las historias ahí, muéstralas mientras explicas |
| **Este README** | Scroll por las historias mostrando Card → INVEST → Gherkin |
| **Una historia completa** | Elige US04 o US05 y muéstrala como ejemplo completo |

---

## ✅ Checklist para Nivel 4

- [ ] Historias con formato INVEST bien aplicado
- [ ] Cada historia tiene Card (Como/Quiero/Para)
- [ ] Conversation con notas de refinamiento
- [ ] Confirmation con Gherkin (Given/When/Then)
- [ ] Escenarios incluyen casos de éxito Y error
- [ ] Gherkin describe comportamientos de GUI móvil
- [ ] DoR cumplido: dependencias, mockups, API contracts
- [ ] Story points estimados
- [ ] Al menos 10 historias documentadas
