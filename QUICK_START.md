# 🚀 Quick Start Guide - Admin Taxis

## Inicio Rápido (5 minutos)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/mbarriosRojas/admin-taxis-plataforma-completa.git
cd admin-taxis-plataforma-completa
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crear archivo `.env.local`:

```bash
cp .env.example .env.local
```

Editar `.env.local` (opcional para desarrollo local):
```
VITE_API_URL=
```

### 4. Iniciar Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:3000

## ⚡ Desarrollo Local con Mock Data

Para desarrollo local sin MongoDB, el frontend funcionará correctamente. Las llamadas API fallarán, pero puedes trabajar en la UI.

## 🌐 Despliegue Rápido en Vercel

### Opción 1: Desde GitHub (Más Fácil)

1. Fork o clona este repositorio en tu GitHub
2. Ir a [vercel.com](https://vercel.com)
3. Click "New Project"
4. Importar el repositorio
5. Configurar variables de entorno:
   - `MONGODB_URI`: Tu URI de MongoDB Atlas
   - `JWT_SECRET`: Una clave secreta aleatoria
6. Click "Deploy"

### Opción 2: Desde CLI

```bash
npm install -g vercel
vercel login
vercel
```

## 🗄️ MongoDB Atlas Setup (5 minutos)

1. Crear cuenta en [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Crear un cluster (gratis)
3. Crear usuario de base de datos
4. Whitelist IP: `0.0.0.0/0`
5. Obtener cadena de conexión
6. Agregar como variable de entorno

## 👤 Crear Usuario Admin

Después del despliegue, crear el primer usuario:

```bash
curl -X POST https://tu-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@taxis.com",
    "password": "admin123",
    "name": "Admin",
    "role": "admin",
    "city": "CDMX"
  }'
```

## ✅ Verificar Instalación

1. Abrir la aplicación
2. Login con credenciales del admin
3. Verificar que el dashboard cargue
4. Crear algunos registros de prueba

## 📚 Documentación Completa

- [README.md](./README.md) - Documentación principal
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía de despliegue detallada
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Resumen del proyecto

## 🆘 Problemas Comunes

### "Cannot connect to MongoDB"
- Verificar que MONGODB_URI esté configurado
- Verificar que la IP esté en whitelist

### Build Failed
```bash
npm run build
```
Si falla localmente, revisar errores de TypeScript

### Puerto en Uso
Cambiar puerto en `vite.config.ts`:
```ts
server: {
  port: 3001, // Cambiar aquí
}
```

## 🎯 Próximos Pasos

1. ✅ Desarrollo local funcionando
2. ✅ Desplegar en Vercel
3. ✅ Configurar MongoDB
4. ✅ Crear usuario admin
5. 📝 Agregar ciudades
6. 📝 Comenzar a usar el sistema

## 💡 Tips

- Usar Chrome DevTools para debugging
- Revisar Console para errores
- Network tab para ver llamadas API
- localStorage contiene el token de autenticación

## 🎉 ¡Listo para Usar!

Tu panel está listo. Comienza creando:
1. Ciudades
2. Usuarios
3. Vehículos
4. Choferes
5. Rutas

¡Disfruta tu panel de administración de taxis! 🚕
