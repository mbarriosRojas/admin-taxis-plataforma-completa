# 🔐 Configurar Vercel en Cursor Cloud Agents

Para que el Cloud Agent pueda desplegar automáticamente a Vercel, necesitas configurar el token de Vercel como un secreto.

## 📋 Pasos para Configurar:

### 1. Obtener Token de Vercel

1. Ve a [https://vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click en "Create Token"
3. Nombre: `Cursor Cloud Agent`
4. Scope: Full Account
5. Expiration: No Expiration (o el tiempo que prefieras)
6. Click "Create"
7. **Copia el token** (solo se muestra una vez)

### 2. Agregar Token a Cursor

1. Abre Cursor
2. Ve a **Cursor Dashboard** → **Cloud Agents** → **Secrets**
   - URL directa: [cursor.com/settings](https://cursor.com/settings)
3. Click en "Add Secret"
4. Nombre del secreto: `VERCEL_TOKEN`
5. Valor: Pega el token que copiaste de Vercel
6. Scope: Selecciona este repositorio o "All repositories"
7. Click "Save"

### 3. Ejecutar el Cloud Agent de Nuevo

Una vez configurado el secreto:

1. Ejecuta un nuevo Cloud Agent
2. Pídele: "despliega el proyecto a Vercel"
3. El agent ahora tendrá acceso al token y podrá desplegar

---

## 🚀 Comandos que el Agent Podrá Ejecutar:

Con el token configurado, el Cloud Agent podrá:

```bash
# Desplegar a producción
vercel --prod --token $VERCEL_TOKEN

# Ver deployments
vercel ls --token $VERCEL_TOKEN

# Ver logs
vercel logs --token $VERCEL_TOKEN
```

---

## ✅ Verificación

Para verificar que el token funciona:

```bash
vercel whoami --token YOUR_TOKEN_HERE
```

Debería mostrar tu nombre de usuario de Vercel.

---

## 📝 Notas Importantes:

- **Seguridad**: El token nunca se muestra en los logs, Cursor lo redacta automáticamente
- **Persistencia**: Los secretos persisten entre sesiones de Cloud Agent
- **Scope**: Puedes configurar secretos por usuario, equipo o repositorio
- **Renovación**: Si cambias el token en Vercel, actualízalo en Cursor también

---

## 🆘 Alternativa Rápida (Sin Configurar Secretos):

Si prefieres no configurar secretos, puedes desplegar directamente desde Vercel:

**Click aquí:** [Desplegar en Vercel](https://vercel.com/new/import?repository-url=https://github.com/mbarriosRojas/admin-taxis-plataforma-completa)

---

## 📞 Más Información:

- [Vercel Tokens Documentation](https://vercel.com/docs/rest-api#authentication)
- [Cursor Cloud Agents Secrets](https://cursor.com/docs/cloud-agents/secrets)
