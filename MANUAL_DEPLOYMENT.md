# 🚀 Guía de Despliegue Manual

## ✅ Estado del Proyecto

- ✅ Build completado exitosamente
- ✅ Código pusheado a GitHub
- ✅ Configuración de Vercel lista
- ✅ Archivos de producción generados en `/dist`

## 🌐 Opción 1: Despliegue desde Vercel Dashboard (MÁS FÁCIL)

### Paso 1: Ir a Vercel
1. Abre [vercel.com/new](https://vercel.com/new)
2. Si no tienes cuenta, créala (es gratis)
3. Conecta tu cuenta de GitHub

### Paso 2: Importar el Proyecto
1. Click en "Import Project"
2. Buscar el repositorio: `mbarriosRojas/admin-taxis-plataforma-completa`
3. Click "Import"

### Paso 3: Configurar el Proyecto
Vercel detectará automáticamente la configuración, pero verifica:

- **Framework Preset**: Vite
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Paso 4: Variables de Entorno

**IMPORTANTE**: Antes de hacer click en "Deploy", agregar estas variables de entorno:

#### Variables Requeridas:

1. **MONGODB_URI**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/admin-taxis?retryWrites=true&w=majority
   ```
   
   Para obtenerla:
   - Ir a [MongoDB Atlas](https://cloud.mongodb.com)
   - Crear cluster (gratis)
   - Database Access → Crear usuario
   - Network Access → Add IP `0.0.0.0/0`
   - Connect → Connect your application → Copiar URI

2. **JWT_SECRET**
   ```
   Generar con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   
   O usar cualquier string aleatorio largo, ejemplo:
   ```
   super-secret-jwt-key-change-in-production-12345678901234567890
   ```

### Paso 5: Deploy
1. Click en "Deploy"
2. Esperar 1-2 minutos
3. ¡Listo! Vercel te dará una URL

---

## 🖥️ Opción 2: Despliegue desde CLI

### Requisitos:
- Node.js instalado
- Cuenta de Vercel

### Comandos:

```bash
# 1. Instalar Vercel CLI (si no lo tienes)
npm install -g vercel

# 2. Login en Vercel
vercel login

# 3. Desde la carpeta del proyecto
cd /workspace

# 4. Desplegar
vercel --prod

# 5. Configurar variables de entorno cuando te lo pida:
#    - MONGODB_URI: [tu URI de MongoDB]
#    - JWT_SECRET: [tu secret key]
```

---

## 🗄️ Configurar MongoDB Atlas (5 minutos)

### Paso a Paso:

1. **Ir a MongoDB Atlas**
   - [cloud.mongodb.com](https://cloud.mongodb.com)
   - Crear cuenta gratis

2. **Crear Cluster**
   - Click "Build a Database"
   - Elegir "FREE" (M0)
   - Elegir región (usa la más cercana)
   - Click "Create"

3. **Crear Usuario de Base de Datos**
   - Ir a "Database Access"
   - Click "Add New Database User"
   - Username: `admin-taxis`
   - Password: (genera una segura y guárdala)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP**
   - Ir a "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Obtener Connection String**
   - Ir a "Database"
   - Click "Connect" en tu cluster
   - Elegir "Connect your application"
   - Copiar la connection string
   - Reemplazar `<password>` con tu password
   - Agregar el nombre de la DB: `/admin-taxis`

   Ejemplo final:
   ```
   mongodb+srv://admin-taxis:TU_PASSWORD_AQUI@cluster0.xxxxx.mongodb.net/admin-taxis?retryWrites=true&w=majority
   ```

---

## ✅ Verificar el Despliegue

### 1. Abrir la URL
Vercel te dará una URL como: `https://admin-taxis-plataforma-completa.vercel.app`

### 2. Crear Usuario Administrador

Usar curl o Postman:

```bash
curl -X POST https://TU-URL.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@taxis.com",
    "password": "Admin123!",
    "name": "Administrador Principal",
    "role": "admin",
    "city": "Ciudad de México"
  }'
```

### 3. Iniciar Sesión
1. Ir a tu URL
2. Usar las credenciales:
   - Email: admin@taxis.com
   - Password: Admin123!

### 4. Agregar Ciudades (Opcional)

Conectar a MongoDB Compass o usar MongoDB Shell:

```javascript
use admin-taxis

db.cities.insertMany([
  {
    name: "Ciudad de México",
    code: "cdmx",
    active: true
  },
  {
    name: "Guadalajara",
    code: "gdl",
    active: true
  },
  {
    name: "Monterrey",
    code: "mty",
    active: true
  },
  {
    name: "Puebla",
    code: "pue",
    active: true
  },
  {
    name: "Cancún",
    code: "cun",
    active: true
  }
])
```

---

## 🔧 Configuración Adicional en Vercel

### Dominios Personalizados
1. Ir a tu proyecto en Vercel
2. Settings → Domains
3. Agregar tu dominio personalizado

### Variables de Entorno Adicionales
Si necesitas agregar más después:
1. Settings → Environment Variables
2. Add → Name y Value
3. Redeploy

### Revisar Logs
1. Deployments
2. Click en el deployment activo
3. Ver "Functions" para logs de API

---

## 🐛 Troubleshooting

### Error: Cannot connect to database
- Verificar MONGODB_URI en Environment Variables
- Verificar que la IP 0.0.0.0/0 esté en whitelist
- Verificar que el usuario de DB tenga permisos

### Error: Unauthorized
- Verificar que JWT_SECRET esté configurado
- Limpiar cookies/localStorage del navegador
- Intentar crear un nuevo usuario

### Build Failed
- Verificar que todas las dependencias estén en package.json
- Revisar logs de build en Vercel
- Contactar soporte si persiste

---

## 📊 Resultado Esperado

Después del despliegue exitoso, tendrás:

- ✅ Aplicación web funcionando en Vercel
- ✅ Base de datos MongoDB configurada
- ✅ Usuario administrador creado
- ✅ Sistema listo para producción

### URLs del Proyecto:
- **Frontend**: https://[tu-proyecto].vercel.app
- **API**: https://[tu-proyecto].vercel.app/api/*
- **Dashboard Vercel**: https://vercel.com/[tu-usuario]/[proyecto]
- **MongoDB Atlas**: https://cloud.mongodb.com

---

## 🎉 ¡Listo!

Tu panel de administración de taxis está desplegado y funcionando en producción.

### Próximos Pasos:
1. ✅ Crear usuarios adicionales
2. ✅ Agregar vehículos
3. ✅ Registrar choferes
4. ✅ Configurar rutas
5. ✅ Comenzar a usar el sistema

---

## 📞 Soporte

Si tienes problemas:
1. Revisar logs en Vercel Dashboard
2. Verificar variables de entorno
3. Consultar documentación:
   - [Vercel Docs](https://vercel.com/docs)
   - [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
   - README.md del proyecto
