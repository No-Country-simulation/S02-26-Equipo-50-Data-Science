# Guia de Usuario - DATAMARK

## Indice

1. [Introduccion](#introduccion)
2. [Primeros Pasos](#primeros-pasos)
3. [Modulos de la Aplicacion](#modulos-de-la-aplicacion)
4. [Referencia de API](#referencia-de-api)
5. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Introduccion

DATAMARK es una plataforma integral para la gestion de pequenos comercios de ropa y calzado. Permite gestionar productos, ventas, clientes e inventario desde una interfaz intuitiva.

### Arquitectura del Sistema

DATAMARK esta compuesto por:

- **Frontend SPA**: Aplicacion React desplegada en Vercel
- **Backend REST API**: Servidor Node/Express desplegado en Railway
- **Base de datos**: PostgreSQL alojada en Neon (serverless)

Esta arquitectura permite escalabilidad independiente de cada componente y costos optimizados segun el uso.

### Caracteristicas Principales

- Gestion de productos con codigo SKU
- Registro de ventas con control de inventario automatico
- Gestion de clientes
- Dashboard con metricas y tendencias
- Control de stock con alertas de nivel minimo

---

## Primeros Pasos

### 1. Registro de Cuenta

1. Accede a la aplicacion en [datamark.vercel.app](https://s02-26-equipo-50-data-science.vercel.app)
2. Haz clic en "Registrarse" o "Crear cuenta"
3. Completa el formulario:
   - Nombre completo
   - Correo electronico
   - Contrasena (minimo 6 caracteres)
4. Haz clic en "Registrarse"

### 2. Onboarding (Configuracion de Tienda)

Despues del registro, se iniciara el proceso de configuracion:

**Paso 1: Nombre de la tienda**
- Ingresa el nombre de tu negocio
- Ejemplo: "Boutique Maria" o "Zapateria El Rey"

**Paso 2: Categorias**
- Selecciona las categorias de productos que vendes
- Opciones: Ropa de Mujer, Ropa de Hombre, Ropa de Ninos, Calzado de mujer, Calzado de hombre, Accesorios, Ropa Deportiva, Ropa Interior, Otros

### 3. Inicio de Sesion

1. Haz clic en "Iniciar sesion"
2. Ingresa tu correo electronico y contrasena
3. Selecciona "Recordarme" para mantener la sesion activa

---

## Modulos de la Aplicacion

### Productos

Permite gestionar el catalogo de productos.

**Estado actual:**
- Backend: Implementado
- Frontend: Implementado

#### Acceso desde la interfaz

1. Navega a **Productos** en el menu lateral
2. Puedes:
   - Ver todos los productos en lista o tabla
   - Buscar por nombre o SKU
   - Filtrar por categoria (ROPA/CALZADO)
   - Agregar nuevo producto
   - Editar producto existente
   - Eliminar producto

#### Crear Producto

Desde la interfaz, haz clic en **"Agregar producto"** y completa:
- Nombre del producto
- SKU (codigo unico)
- Precio en soles (S/)
- Categoria: ROPA o CALZADO
- Activo/Inactivo

### Ventas

Registro de transacciones comerciales.

**Estado actual:**
- Backend: Implementado
- Frontend: Implementado

#### Acceso desde la interfaz

1. Navega a **Ventas** en el menu lateral
2. Veras el total de ventas del dia
3. Haz clic en el boton flotante **"+"** para registrar una nueva venta

#### Registrar una venta

1. Selecciona el producto del inventario
2. Ingresa la cantidad
3. El precio se carga automaticamente (puede modificarse)
4. Selecciona el cliente (opcional)
5. Confirma el total y registra

**Nota:** El sistema descuenta automaticamente el stock del inventario.

### Clientes

Gestion de la base de clientes.

**Estado actual:**
- Backend: Implementado
- Frontend: Implementado

#### Acceso desde la interfaz

1. Navega a **Clientes** en el menu lateral
2. Puedes:
   - Ver todos los clientes en lista o tabla
   - Buscar por nombre, email o telefono
   - Agregar nuevo cliente
   - Editar cliente existente
   - Eliminar cliente

#### Agregar Cliente

Desde la interfaz, haz clic en **"Agregar cliente"** y completa:
- Nombre del cliente
- Email (opcional)
- Telefono (opcional)

### Inventario

Control de stock y alertas.

**Estado actual:**
- Backend: Implementado
- Frontend: Implementado

#### Acceso desde la interfaz

1. Navega a **Productos** en el menu lateral (el inventario esta integrado con productos)
2. Veras:
   - Lista de productos con su stock actual
   - Alerta de productos con stock critico (menos de 3 unidades)
   - Puedes buscar y filtrar por categoria

#### Gestionar stock

- Para agregar inventario, edita el producto y configura el stock inicial
- El stock se descuenta automaticamente al registrar una venta
- Si un producto llega a menos de 3 unidades, aparecera una alerta en rojo

### Dashboard

Panel de metricas y analisis.

**Estado actual:** Implementado

#### Caracteristicas

- Resumen de ventas del dia
- Total vendido en el dia
- Acceso rapido a las demas secciones

---

## Referencia de API

**Nota Importante:** Todas las rutas (excepto `/api/auth/register` y `/api/auth/login`) requieren el header de autenticación:

```bash
Authorization: Bearer <token>
```

### Autenticacion

#### Registro de Usuario

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Nombre Completo",
  "email": "correo@ejemplo.com",
  "password": "contrasena123"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Nombre Completo",
      "email": "correo@ejemplo.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Inicio de Sesion

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "correo@ejemplo.com",
  "password": "contrasena123"
}
```

#### Obtener Usuario Actual

```bash
GET /api/auth/me
Authorization: Bearer <token>
```

### Tiendas

#### Crear Tienda (Onboarding)

```bash
POST /api/stores
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Mi Tienda",
  "categories": ["Ropa de Mujer", "Calzado de mujer"]
}
```

#### Obtener Mi Tienda

```bash
GET /api/stores/my-store
Authorization: Bearer <token>
```

---

## Preguntas Frecuentes

### ¿Como recupero mi contrasena?

Actualmente, la recuperacion de contrasena debe realizarse contactando al administrador del sistema.

### ¿Que pasa si el stock llega a cero?

El sistema permite registrar ventas siempre que haya stock disponible. Si intentas vender mas de lo que hay en inventario, el sistema te mostrara un mensaje de error indicando la cantidad disponible.

### ¿Puedo tener varias tiendas?

No, actualmente el sistema permite una tienda por usuario.

### ¿Como funcionan las alertas de stock bajo?

Cuando un producto tiene menos de 3 unidades en stock, aparecera una alerta en rojo en la seccion de productos indicando que hay stock critico.

### ¿Puedo exportar mis datos?

Actualmente no esta disponible la exportacion de datos. Esta funcionalidad esta en desarrollo.

### ¿El sistema hace backup de mis datos?

Si, la base de datos en Neon realiza backups automaticos.

---

## Soporte

Para soporte tecnico o consultas:
- Correo: soporte@datamark.com
- GitHub: https://github.com/EzePacheco/S02-26-Equipo-50-Data-Science

---

*Ultima actualizacion: Febrero 2026*
