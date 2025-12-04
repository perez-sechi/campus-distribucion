# 🚀 Guía Rápida: Desplegar en GitHub Pages (5 minutos)

## Paso 1: Preparar el Código (1 min)

1. Abre `package.json` y busca la línea:
   ```json
   "homepage": "https://<TU-USUARIO>.github.io/campus-distribucion"
   ```

2. Reemplaza `<TU-USUARIO>` con tu nombre de usuario de GitHub:
   ```json
   "homepage": "https://tuusuario.github.io/campus-distribucion"
   ```

## Paso 2: Crear Repositorio en GitHub (2 min)

1. Ve a [GitHub](https://github.com) y crea un nuevo repositorio
   - Nombre: `campus-distribucion`
   - Público o Privado (tu elección)
   - NO inicialices con README

2. En tu terminal, ejecuta:
   ```bash
   cd campus-distribucion
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/campus-distribucion.git
   git push -u origin main
   ```

## Paso 3: Configurar API Key como Secret (1 min)

1. En tu repositorio de GitHub, ve a:
   ```
   Settings > Secrets and variables > Actions
   ```

2. Click en **"New repository secret"**

3. Configura:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Secret**: Pega tu API key de Gemini
   - Click en **"Add secret"**

## Paso 4: Habilitar GitHub Pages (1 min)

1. En tu repositorio, ve a:
   ```
   Settings > Pages
   ```

2. En **"Source"**, selecciona:
   ```
   GitHub Actions
   ```

3. Guarda los cambios

## Paso 5: Desplegar (automático)

El deployment se ejecuta automáticamente cuando haces push a `main`.

1. Verifica el progreso en:
   ```
   Pestaña "Actions" de tu repositorio
   ```

2. Espera a que aparezca un ✅ (normalmente 2-3 minutos)

3. Tu aplicación estará disponible en:
   ```
   https://TU-USUARIO.github.io/campus-distribucion
   ```

## ✅ ¡Listo!

Tu aplicación ahora está en línea. Cada vez que hagas push a `main`, se desplegará automáticamente.

---

## 🔄 Actualizar la Aplicación

Simplemente haz cambios y push:

```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

---

## ⚠️ Solución de Problemas

### Error: "Page not found"
- Espera 5-10 minutos después del primer deployment
- Verifica que la URL sea correcta

### Error: "API Key not configured"
- Verifica que el secret se llame exactamente `VITE_GEMINI_API_KEY`
- Verifica que copiaste la API key completa
- Re-ejecuta el workflow en Actions

### El workflow falla
- Revisa los logs en la pestaña Actions
- Verifica que `package.json` tenga el homepage correcto
- Asegúrate de que todos los archivos estén commiteados

---

## 📋 Checklist Completo

- [ ] `package.json` actualizado con tu usuario de GitHub
- [ ] Repositorio creado en GitHub
- [ ] Código subido con `git push`
- [ ] Secret `VITE_GEMINI_API_KEY` configurado
- [ ] GitHub Pages habilitado (Source: GitHub Actions)
- [ ] Workflow ejecutado correctamente (✅ verde en Actions)
- [ ] Sitio accesible en la URL de GitHub Pages

---

## 🎯 Próximos Pasos

1. **Configura restricciones de seguridad** (ver [SECURITY.md](SECURITY.md))
2. **Personaliza la aplicación** según tus necesidades
3. **Monitorea el uso** de la API en Google Cloud Console

---

## 📚 Más Información

- [DEPLOY.md](DEPLOY.md) - Guía completa de deployment
- [SECURITY.md](SECURITY.md) - Consideraciones de seguridad
- [README.md](README.md) - Documentación general del proyecto
