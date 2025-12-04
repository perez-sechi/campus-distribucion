# ✅ Checklist de Deployment - Campus Distribución

## Pre-Deployment

### Configuración Local

- [ ] Dependencias instaladas (`npm install`)
- [ ] Aplicación funciona en local (`npm run dev`)
- [ ] API key de Gemini configurada en `.env`
- [ ] Asistente IA funciona correctamente
- [ ] Todas las funciones de drag & drop funcionan

### Configuración del Proyecto

- [ ] `package.json`:
  - [ ] Campo `homepage` actualizado con tu usuario de GitHub
  - [ ] Scripts de deploy presentes (`predeploy`, `deploy`)
  - [ ] Dependencia `gh-pages` instalada

- [ ] `vite.config.js`:
  - [ ] Configuración de `base` correcta para GitHub Pages
  - [ ] Build configurado para producción

- [ ] `.gitignore`:
  - [ ] `.env` incluido
  - [ ] `.env.production` incluido
  - [ ] `node_modules` incluido
  - [ ] `dist` incluido

## Deployment con GitHub Actions (Recomendado)

### 1. Preparar Repositorio

- [ ] Repositorio creado en GitHub
- [ ] Nombre del repo coincide con la configuración
- [ ] Código local commiteado:
  ```bash
  git add .
  git commit -m "Ready for deployment"
  ```

### 2. Configurar GitHub

- [ ] Código pusheado a GitHub:
  ```bash
  git remote add origin https://github.com/TU-USUARIO/campus-distribucion.git
  git push -u origin main
  ```

- [ ] GitHub Pages habilitado:
  - [ ] Settings > Pages
  - [ ] Source: GitHub Actions
  - [ ] Guardado

- [ ] API Key configurada como Secret:
  - [ ] Settings > Secrets and variables > Actions
  - [ ] Secret name: `VITE_GEMINI_API_KEY`
  - [ ] Secret value: [tu API key de Gemini]
  - [ ] Secret creado

### 3. Verificar Workflow

- [ ] Archivo `.github/workflows/deploy.yml` existe
- [ ] Push a main ejecuta el workflow automáticamente
- [ ] Workflow aparece en pestaña Actions
- [ ] Build completa sin errores (✅ verde)
- [ ] Deploy completa sin errores (✅ verde)

### 4. Verificar Deployment

- [ ] Sitio accesible en: `https://TU-USUARIO.github.io/campus-distribucion`
- [ ] Página carga correctamente
- [ ] Estilos se aplican correctamente
- [ ] Edificios y plantas se muestran
- [ ] Equipos disponibles visibles
- [ ] Drag & drop funciona
- [ ] Asistente IA visible
- [ ] Badge "Conectado" aparece en el asistente
- [ ] Comandos de IA funcionan correctamente

## Deployment Manual con gh-pages

### 1. Preparar

- [ ] `npm install` ejecutado
- [ ] Archivo `.env.production` creado con API key
- [ ] `homepage` en `package.json` actualizado

### 2. Verificar Configuración

- [ ] Ejecutar: `npm run check-deploy`
- [ ] Todos los checks pasan (✅)
- [ ] Correger errores si los hay

### 3. Desplegar

- [ ] Ejecutar: `npm run deploy`
- [ ] Build completa correctamente
- [ ] Deploy a rama gh-pages exitoso
- [ ] Mensaje de éxito mostrado

### 4. Configurar GitHub Pages

- [ ] Settings > Pages
- [ ] Source: Deploy from a branch
- [ ] Branch: gh-pages / root
- [ ] Guardado

### 5. Verificar

- [ ] Sitio accesible (esperar 5-10 minutos)
- [ ] Todas las funcionalidades operativas

## Post-Deployment

### Seguridad

- [ ] Configurar restricciones de API key en Google Cloud Console:
  - [ ] HTTP referrers configurados
  - [ ] Solo Generative Language API habilitada
  - [ ] Límites de cuota establecidos

- [ ] Alertas de uso configuradas:
  - [ ] Alert al 50% de cuota
  - [ ] Alert al 80% de cuota
  - [ ] Alert al 100% de cuota

### Monitoreo

- [ ] Bookmark de Google Cloud Console guardado
- [ ] Verificar uso de API después de 24 horas
- [ ] Verificar que no hay errores en consola del navegador
- [ ] Verificar analytics de GitHub Pages (si está habilitado)

### Documentación

- [ ] README.md actualizado con URL del sitio
- [ ] DEPLOY.md revisado y actualizado si es necesario
- [ ] SECURITY.md compartido con colaboradores

## Testing en Producción

### Funcionalidades Básicas

- [ ] Página carga en diferentes navegadores:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

- [ ] Responsive design funciona:
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile

### Drag & Drop

- [ ] Arrastrar equipo de disponibles a planta
- [ ] Mover equipo entre plantas
- [ ] Mover equipo entre edificios
- [ ] Detección de colisiones funciona
- [ ] Límites de capacidad respetados
- [ ] Barra de ocupación se actualiza

### Asistente IA

- [ ] Badge muestra "Conectado"
- [ ] Mensaje de bienvenida aparece
- [ ] Comando: "Coloca Marketing en planta 2 del Edificio A"
- [ ] Comando: "¿Cuál es el estado del campus?"
- [ ] Comando: "Distribuye todos los equipos automáticamente"
- [ ] Comando: "Vacía el Edificio A"
- [ ] Respuestas apropiadas a comandos
- [ ] Acciones se ejecutan correctamente

## Mantenimiento

### Actualizaciones Regulares

- [ ] Calendario de revisión de dependencias (mensual)
- [ ] Revisión de uso de API (semanal)
- [ ] Backup del código actualizado
- [ ] Documentación actualizada con cambios

### Rotación de API Key

- [ ] Procedimiento de rotación documentado
- [ ] Plan de respuesta a compromiso de key
- [ ] Contactos de emergencia definidos

## Troubleshooting Común

### Sitio no carga

- [ ] Verificar que GitHub Pages esté habilitado
- [ ] Esperar 10 minutos después del primer deploy
- [ ] Verificar URL correcta
- [ ] Revisar logs de GitHub Actions

### API Key no funciona

- [ ] Verificar nombre del secret: `VITE_GEMINI_API_KEY`
- [ ] Verificar que la key es válida
- [ ] Re-ejecutar workflow después de añadir secret
- [ ] Verificar restricciones en Google Cloud Console

### Estilos no se cargan

- [ ] Verificar `base` en `vite.config.js`
- [ ] Verificar que coincide con nombre del repositorio
- [ ] Limpiar caché del navegador
- [ ] Verificar en modo incógnito

### Workflow falla

- [ ] Revisar logs completos en Actions
- [ ] Verificar que todos los archivos estén commiteados
- [ ] Verificar package.json válido
- [ ] Verificar que gh-pages está instalado

## Recursos de Ayuda

- 📖 [QUICKSTART-GITHUB-PAGES.md](QUICKSTART-GITHUB-PAGES.md) - Inicio rápido
- 📖 [DEPLOY.md](DEPLOY.md) - Guía detallada
- 🔒 [SECURITY.md](SECURITY.md) - Seguridad
- 🏗️ [README.md](README.md) - Documentación general
- 🐛 [GitHub Issues](https://github.com/TU-USUARIO/campus-distribucion/issues) - Reportar problemas

## Contactos

- Mantenedor: [Tu nombre]
- Email: [Tu email]
- GitHub: [@TU-USUARIO]

---

**Última actualización**: [Fecha]
**Versión**: 1.0.0
**Estado del deployment**: [ ] En desarrollo | [ ] En staging | [ ] En producción
