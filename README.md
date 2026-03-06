# DATAMARK

Plataforma B2B SaaS para automatización y visualización de datos comerciales orientada a pequeños negocios de ropa y calzado en Perú.

## Descripción

DATAMARK es una solución integral para pequeños comercios del sector textil y calzado en provincias del Perú. La plataforma centraliza y automatiza la gestión de ventas, inventarios y clientes, transformando datos dispersos en información accionable mediante dashboards intuitivos.

## Stack Tecnológico

**Frontend**
- React 19
- Tailwind CSS 4
- Vite
- Axios
- React Router DOM

**Backend**
- Node.js (ES Modules)
- Express.js
- PostgreSQL (Neon)
- Prisma ORM
- JWT + bcryptjs

## Decisiones Tecnicas

### Neon (PostgreSQL Serverless)
Permite branching de base de datos para desarrollo sin afectar produccion. Escalabilidad automatica sin provisioning de servidores.

### Railway
Simplifica el despliegue de APIs Node.js con gestion automatica de variables de entorno, SSL y escalabilidad.

### Vercel
Optimizado para frontend React con CI/CD automatico, edge functions y optimizacion de rendimiento out-of-the-box.

### Prisma ORM
Type-safety completo con TypeScript, migraciones simples y abstraccion de consultas que evita SQL injection. Superior al raw SQL para mantenimiento a largo plazo.

### JWT vs Session-based Auth
Stateless, ideal para arquitecturas SPA. Sin almacenamiento server-side y compatible con multiples clientes (web, mobile).

### Clean Architecture
Separacion estricta de dominio y framework. Facilita testing, cambios de tecnologia y escalabilidad futura.

## Seguridad

- Hashing de contrasenas con bcrypt (cost factor 10)
- Autenticacion via JWT en todas las rutas protegidas
- Validacion de input con Zod
- CORS configurado via ALLOWED_ORIGINS
- Secrets almacenados en variables de entorno

## Roadmap

- OAuth con Facebook Login
- Exportacion de datos a CSV
- Sistema de recuperacion de contrasena
- Soporte multi-tienda por usuario

## Estructura del Proyecto

```
/                    # Raíz del monorepo
├── backend/         # API REST
│   ├── src/
│   │   ├── domain/           # Entidades, repositorios, errores
│   │   ├── application/      # Servicios, DTOs
│   │   ├── infrastructure/  # Implementaciones (Prisma)
│   │   └── interface/       # Controladores y rutas
│   └── prisma/               # Schema de base de datos
├── frontend/        # Aplicación React
│   └── src/
│       ├── app/             # Configuración global
│       ├── features/        # Módulos (auth, sales, products, etc.)
│       └── shared/          # Componentes y utilitarios
└── README.md
```

## Requisitos Previos

- Node.js 18+
- npm 9+
- PostgreSQL 14+ (Neon serverless recomendado)

## ⚡ Inicio Rápido

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edita .env con tus valores
npm run prisma:generate
npm run prisma:db push
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Acceder

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/api/health

## 📚 Documentación Completa

- [Guía de Configuración Detallada](./SETUP.md)
- [Guía de Usuario](./USER_GUIDE.md)
- [Referencia de API](#api-endpoints)

## Configuración del Proyecto

### Backend - Archivo .env

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=tu-secreto-muy-seguro-cambiar-en-produccion
DATABASE_URL=postgresql://usuario:password@localhost:5432/datamarkdb
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend - Archivo .env

```env
VITE_API_URL_DEV=http://localhost:3000/api
VITE_API_URL_PROD=https://tu-api-railway.up.railway.app/api
```

## Seguridad

✅ **Implementado:**
- Hashing de contraseñas con bcrypt (cost factor 10)
- Autenticación via JWT en todas las rutas protegidas
- Validación de input con Zod
- CORS configurado via ALLOWED_ORIGINS
- Secrets almacenados en variables de entorno
- Rutas protegidas con middleware de autenticación
- Token incluido automáticamente en peticiones desde frontend

⚠️ **Mejoras Futuras:**
- OAuth con Facebook Login
- sistema de recuperación de contraseña
- Two-factor authentication (2FA)
- Rate limiting por IP
- HTTPS en desarrollo (mkcert)

## Deployment

```
┌──────────────┐      ┌──────────────┐
│ Vercel       │─────▶│ Railway      │
│ (Frontend)   │      │ (Backend)    │
└──────────────┘      └──────┬───────┘
                             │
                             ▼
                    ┌──────────────┐
                    │ Neon         │
                    │ (PostgreSQL) │
                    └──────────────┘
```

### Railway
- Conectar repositorio GitHub
- Configurar variables: DATABASE_URL, JWT_SECRET, ALLOWED_ORIGINS

### Vercel
- Root Directory: frontend
- Build Command: npm run build
- Output Directory: dist
- Variables: VITE_API_URL_PROD

## Scripts

**Backend**
- `npm run dev` - Desarrollo
- `npm start` - Produccion
- `npm test` - Tests

**Frontend**
- `npm run dev` - Desarrollo
- `npm run build` - Build produccion
- `npm run lint` - Linting

## Guia de Usuario

Consulta la [guia completa](./USER_GUIDE.md) para instrucciones detalladas sobre el uso de la aplicacion.

## Equipo

- [Ezequiel Pacheco](https://github.com/EzePacheco) | [LinkedIn](https://www.linkedin.com/in/ezepacheco-dev/) - Fullstack Lead
- [Estrella Cruz Ulloa](https://github.com/estrellacruzulloa) | [LinkedIn](https://www.linkedin.com/in/estrella-cruz-ulloa-102708275/) - Data & Frontend Developer
- [Nelson Alexander Borbor Diaz](https://github.com/NelsonBorbor98) - Data & Fullstack Developer
- [Jose Ardilez Ugaz](https://github.com/JoseloArdiles) | [LinkedIn](https://www.linkedin.com/in/joselo-ardiles-ugaz/) - Data Scientist & Frontend Developer
- [Daniel Lara](https://github.com/Sts87) | [LinkedIn](https://www.linkedin.com/in/daniel-lara-mendoza/) - Data Scientist & Backend Developer

## Licencia

Proyecto de código cerrado desarrollado para DATAMARK.
