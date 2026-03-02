# Guía de Despliegue - Admin Taxis

## 📋 Pre-requisitos

1. Cuenta en [Vercel](https://vercel.com)
2. Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
3. Repositorio GitHub configurado

## 🗄️ Paso 1: Configurar MongoDB Atlas

1. Crear una cuenta en MongoDB Atlas (si no tienes una)
2. Crear un nuevo cluster (el tier gratuito es suficiente para empezar)
3. Configurar acceso a la base de datos:
   - Ir a "Database Access" y crear un usuario con permisos de lectura/escritura
   - Ir a "Network Access" y agregar tu IP o `0.0.0.0/0` para acceso desde cualquier lugar
4. Obtener la cadena de conexión:
   - Click en "Connect" en tu cluster
   - Seleccionar "Connect your application"
   - Copiar la cadena de conexión (ejemplo: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Reemplazar `<password>` con tu contraseña
   - Agregar el nombre de la base de datos: `admin-taxis`

Ejemplo final:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/admin-taxis?retryWrites=true&w=majority
```

## 🔐 Paso 2: Generar JWT Secret

Generar una clave secreta para JWT (en terminal):

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Guardar esta clave, la necesitarás para las variables de entorno.

## 🚀 Paso 3: Desplegar en Vercel

### Opción A: Despliegue desde GitHub (Recomendado)

1. Ir a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en "New Project"
3. Importar el repositorio de GitHub: `mbarriosRojas/admin-taxis-plataforma-completa`
4. Configurar el proyecto:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. Agregar variables de entorno:
   - Click en "Environment Variables"
   - Agregar las siguientes variables:
     ```
     MONGODB_URI = [tu cadena de conexión MongoDB]
     JWT_SECRET = [tu clave secreta generada]
     ```

6. Click en "Deploy"

### Opción B: Despliegue desde CLI

1. Instalar Vercel CLI:
```bash
npm install -g vercel
```

2. Login en Vercel:
```bash
vercel login
```

3. Desplegar:
```bash
vercel
```

4. Seguir las instrucciones y agregar las variables de entorno cuando se soliciten

5. Para producción:
```bash
vercel --prod
```

## 📝 Paso 4: Configurar Variables de Entorno en Vercel

Si olvidaste agregar las variables durante el despliegue:

1. Ir a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agregar:
   - `MONGODB_URI`: Tu cadena de conexión MongoDB
   - `JWT_SECRET`: Tu clave secreta JWT
4. Redesplegar el proyecto (Deploy → Redeploy)

## 👤 Paso 5: Crear Usuario Administrador Inicial

Una vez desplegado, crear el primer usuario administrador:

```bash
curl -X POST https://tu-dominio.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@taxis.com",
    "password": "admin123",
    "name": "Administrador Principal",
    "role": "admin",
    "city": "Ciudad de México"
  }'
```

O usar Postman/Insomnia para hacer la petición POST.

## 🏙️ Paso 6: Agregar Ciudades (Opcional)

Conectar a MongoDB y agregar ciudades manualmente en la colección `cities`:

```javascript
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
  }
])
```

## ✅ Paso 7: Verificar el Despliegue

1. Abrir la URL de tu aplicación en Vercel
2. Deberías ver la página de login
3. Iniciar sesión con las credenciales del administrador
4. Verificar que todas las páginas funcionen correctamente

## 🔄 Actualizaciones Automáticas

Una vez configurado con GitHub:
- Cada push a la rama principal desplegará automáticamente
- Las ramas feature crearán preview deployments
- Los pull requests generarán URLs de vista previa

## 🐛 Troubleshooting

### Error: "Cannot connect to MongoDB"
- Verificar que la cadena de conexión sea correcta
- Verificar que el usuario MongoDB tenga permisos
- Verificar que la IP esté en la whitelist de MongoDB Atlas

### Error: "Unauthorized"
- Verificar que JWT_SECRET esté configurado
- Limpiar localStorage del navegador
- Intentar login nuevamente

### Error de Build
- Verificar que todas las dependencias estén en package.json
- Ejecutar `npm install` localmente y probar `npm run build`
- Revisar los logs de build en Vercel

## 📞 Soporte

Para más información, revisar:
- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de MongoDB Atlas](https://docs.atlas.mongodb.com/)
- README.md del proyecto

## 🎉 ¡Listo!

Tu panel de administración de taxis está ahora desplegado y listo para usar.
