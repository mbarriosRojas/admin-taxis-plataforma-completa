#!/bin/bash

# Script de despliegue a Vercel
# Este script facilita el despliegue del proyecto

echo "=========================================="
echo "  Admin Taxis - Despliegue a Vercel"
echo "=========================================="
echo ""

# Verificar si Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI instalado"
echo ""

# Build del proyecto
echo "🔨 Construyendo el proyecto..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build exitoso"
else
    echo "❌ Error en el build"
    exit 1
fi

echo ""
echo "🚀 Iniciando despliegue a Vercel..."
echo ""
echo "NOTA: Necesitarás configurar las siguientes variables de entorno en Vercel:"
echo "  - MONGODB_URI: Tu URI de conexión a MongoDB Atlas"
echo "  - JWT_SECRET: Una clave secreta para JWT"
echo ""

# Desplegar a producción
vercel --prod

echo ""
echo "=========================================="
echo "  ✅ Despliegue Completado"
echo "=========================================="
