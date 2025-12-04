# 🚀 EMPIEZA AQUÍ - Campus Distribución

## ✅ Tu proyecto está listo para GitHub Pages

Este proyecto ha sido completamente empaquetado y configurado para ser desplegado en GitHub Pages. Todo lo que necesitas hacer es seguir 3 pasos simples.

---

## 🎯 Despliegue Rápido (5 minutos)

### Paso 1: Actualizar tu usuario de GitHub

Abre `package.json` y busca esta línea:
```json
"homepage": "https://<TU-USUARIO>.github.io/campus-distribucion"
```

Cámbiala por:
```json
"homepage": "https://tuusuario.github.io/campus-distribucion"
```
(Reemplaza `tuusuario` con tu nombre de usuario real de GitHub)

### Paso 2: Subir a GitHub

```bash
# Inicializar git (si no lo has hecho)
git init
git add .
git commit -m "Initial commit - Ready for GitHub Pages"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/TU-USUARIO/campus-distribucion.git
git branch -M main
git push -u origin main
```

### Paso 3: Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
   - Name: `VITE_GEMINI_API_KEY`
   - Secret: [Pega tu API key de Gemini]
4. **Settings** → **Pages**
   - Source: **GitHub Actions**
5. ✅ ¡Listo! Espera 2-3 minutos

Tu sitio estará en: `https://TU-USUARIO.github.io/campus-distribucion`

---

## 📚 Documentación Disponible

| Si quieres... | Lee este documento |
|---------------|-------------------|
| **Desplegar YA (5 min)** | [QUICKSTART-GITHUB-PAGES.md](QUICKSTART-GITHUB-PAGES.md) |
| **Entender TODO el proceso** | [DEPLOY.md](DEPLOY.md) |
| **Saber sobre seguridad** | [SECURITY.md](SECURITY.md) |
| **Seguir un checklist** | [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md) |
| **Ver qué se empaquetó** | [PACKAGE-SUMMARY.md](PACKAGE-SUMMARY.md) |
| **Usar la aplicación** | [README.md](README.md) |
| **Configurar localmente** | [SETUP.md](SETUP.md) |

---

## ⚠️ IMPORTANTE: Seguridad de la API Key

**Tu API key de Gemini será visible en GitHub Pages** (es un sitio estático).

### Protégete:

1. **Configura restricciones** en [Google Cloud Console](https://console.cloud.google.com):
   - HTTP referrers: `https://TU-USUARIO.github.io/campus-distribucion/*`
   - Límites de cuota: 50-100 queries/día

2. **Monitorea el uso** en Google Cloud Console

3. **Lee [SECURITY.md](SECURITY.md)** para detalles completos

### ¿Es esto seguro?

- ✅ **Para demos/desarrollo personal**: Sí, con restricciones
- ❌ **Para producción profesional**: No, usa un backend

---

## 🎨 Características de la Aplicación

Tu aplicación incluye:

- ✅ **Drag & Drop** - Arrastra equipos entre edificios y plantas
- ✅ **Asistente con IA** - Controla con lenguaje natural usando Gemini
- ✅ **Gestión de Capacidad** - Límites automáticos por planta
- ✅ **Prevención de Colisiones** - Los equipos no se superponen
- ✅ **Visualización Intuitiva** - Edificios verticales con plantas

### Ejemplo de comandos con IA:

```
"Coloca Marketing en la planta 2 del Edificio A"
"Distribuye todos los equipos automáticamente"
"¿Cuál es el estado del campus?"
"Vacía el Edificio C"
```

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Verificar configuración antes de desplegar
npm run check-deploy

# Build para producción
npm run build

# Deploy manual (alternativa a GitHub Actions)
npm run deploy
```

---

## 🎯 Próximos Pasos Recomendados

Después de desplegar:

1. **Configura seguridad** (10 min)
   - Lee [SECURITY.md](SECURITY.md)
   - Configura restricciones en Google Cloud Console

2. **Personaliza la app** (según necesites)
   - Edita equipos en `src/App.jsx`
   - Cambia colores en `src/App.css`
   - Añade más edificios

3. **Monitorea** (recurrente)
   - Revisa uso de API en Google Cloud Console
   - Verifica que no hay errores en GitHub Actions

---

## 📦 Lo Que Se Ha Empaquetado

Este proyecto incluye:

### Configuración de Deployment
- ✅ GitHub Actions workflow (`.github/workflows/deploy.yml`)
- ✅ Scripts de verificación (`scripts/check-deployment.js`)
- ✅ Configuración de Vite optimizada
- ✅ package.json configurado con gh-pages

### Documentación Completa
- ✅ 8 archivos de documentación
- ✅ Guías paso a paso
- ✅ Checklists completos
- ✅ Troubleshooting detallado

### Seguridad
- ✅ `.gitignore` configurado correctamente
- ✅ Documentación de seguridad exhaustiva
- ✅ Instrucciones para proteger API key

---

## ❓ ¿Necesitas Ayuda?

### Problemas Comunes

**"El sitio no carga"**
→ Espera 10 minutos después del primer deploy

**"API Key not configured"**
→ Verifica el secret en GitHub Settings

**"Los estilos no se cargan"**
→ Verifica que el `base` en `vite.config.js` coincida con el nombre del repo

**Más ayuda**: [DEPLOY.md](DEPLOY.md) → Sección "Solución de Problemas"

### Template de Issue

Si encuentras un problema que no puedes resolver:
1. Ve a la pestaña **Issues** en GitHub
2. Click **New Issue**
3. Selecciona **"Problema de Deployment"**
4. Llena el template

---

## ✅ Verificación Rápida

Antes de desplegar, asegúrate de que:

- [ ] `package.json` tiene tu usuario de GitHub en `homepage`
- [ ] Tienes una API key de Gemini de [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ ] La aplicación funciona en local (`npm run dev`)
- [ ] Has leído las consideraciones de seguridad

**Ejecuta**: `npm run check-deploy` para verificación automática

---

## 🎉 ¡Listo para Desplegar!

Si has completado el Paso 1 y 2, simplemente configura GitHub Pages (Paso 3) y en minutos tu aplicación estará en línea.

### Enlaces Rápidos

- 🚀 [Guía de 5 minutos](QUICKSTART-GITHUB-PAGES.md)
- 📖 [Documentación completa](DEPLOY.md)
- 🔒 [Seguridad](SECURITY.md)

---

**Versión**: 1.0.0
**Última actualización**: 2024
**Licencia**: MIT (ajusta según tu preferencia)

¡Éxito con tu deployment! 🚀
