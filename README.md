# Admin Taxis - Plataforma Completa

Panel de administración completo para gestión de flota de taxis. Sistema multi-ciudad con login, gestión de usuarios, vehículos, choferes y rutas.

## 🚀 Stack Tecnológico

- **Frontend**: React 18 + Vite + TypeScript
- **UI Library**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **Backend**: Vercel Serverless Functions
- **Database**: MongoDB
- **Deployment**: Vercel

## 📋 Características

### Módulos Implementados

1. **Dashboard**
   - KPIs: Total vehículos, choferes activos, rutas activas, usuarios
   - Gráficos: Vehículos por estado, choferes por ciudad
   - Filtrado por ciudad

2. **Usuarios**
   - CRUD completo
   - Roles: admin, supervisor, operator
   - Filtrado por ciudad

3. **Choferes**
   - CRUD completo
   - Estados: activo, inactivo, suspendido
   - Asignación de vehículos

4. **Vehículos**
   - CRUD completo
   - Estados: disponible, en servicio, mantenimiento, fuera de servicio
   - Asignación de choferes

5. **Rutas**
   - CRUD completo
   - Cálculo de distancias, tiempos y precios
   - Activación/desactivación

6. **Configuración**
   - Perfil de usuario
   - Información del sistema

## 🛠️ Instalación

1. Clone el repositorio:
```bash
git clone https://github.com/mbarriosRojas/admin-taxis-plataforma-completa.git
cd admin-taxis-plataforma-completa
```

2. Instale las dependencias:
```bash
npm install
```

3. Configure las variables de entorno:
```bash
cp .env.example .env.local
```

Edite `.env.local` y configure:
- `VITE_API_URL`: URL de la API (vacío para desarrollo local)
- `MONGODB_URI`: URI de conexión a MongoDB
- `JWT_SECRET`: Clave secreta para JWT

4. Inicie el servidor de desarrollo:
```bash
npm run dev
```

## 📦 Despliegue en Vercel

1. Instale Vercel CLI:
```bash
npm install -g vercel
```

2. Despliegue el proyecto:
```bash
vercel
```

3. Configure las variables de entorno en Vercel Dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`

## 🗄️ Base de Datos

### Colecciones MongoDB

- `users`: Usuarios del sistema
- `drivers`: Choferes
- `vehicles`: Vehículos
- `routes`: Rutas
- `cities`: Ciudades

### Datos de Prueba

Para crear un usuario administrador inicial, use el endpoint `/api/auth/register`:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@taxis.com",
    "password": "admin123",
    "name": "Administrador",
    "role": "admin",
    "city": "Ciudad de México"
  }'
```

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para autenticación. Los tokens se almacenan en localStorage y se envían en el header `Authorization: Bearer <token>`.

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Usuarios
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Choferes
- `GET /api/drivers` - Listar choferes
- `POST /api/drivers` - Crear chofer
- `PUT /api/drivers/:id` - Actualizar chofer
- `DELETE /api/drivers/:id` - Eliminar chofer

### Vehículos
- `GET /api/vehicles` - Listar vehículos
- `POST /api/vehicles` - Crear vehículo
- `PUT /api/vehicles/:id` - Actualizar vehículo
- `DELETE /api/vehicles/:id` - Eliminar vehículo

### Rutas
- `GET /api/routes` - Listar rutas
- `POST /api/routes` - Crear ruta
- `PUT /api/routes/:id` - Actualizar ruta
- `DELETE /api/routes/:id` - Eliminar ruta

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas del dashboard

### Ciudades
- `GET /api/cities` - Listar ciudades

## 🎨 Estructura del Proyecto

```
admin-taxis-plataforma-completa/
├── api/                      # Serverless functions
│   ├── auth/                # Autenticación
│   ├── users/               # Usuarios
│   ├── drivers/             # Choferes
│   ├── vehicles/            # Vehículos
│   ├── routes/              # Rutas
│   ├── dashboard/           # Dashboard
│   ├── cities/              # Ciudades
│   └── lib/                 # Utilidades
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes UI base
│   │   └── layout/         # Componentes de layout
│   ├── contexts/            # Contextos React
│   ├── pages/               # Páginas de la aplicación
│   ├── services/            # Servicios API
│   ├── types/               # Tipos TypeScript
│   └── lib/                 # Utilidades
├── public/                  # Archivos estáticos
├── vercel.json             # Configuración Vercel
└── package.json            # Dependencias
```

## 📝 Licencia

ISC

## 👥 Autor

Desarrollado para la gestión eficiente de flotas de taxis.
