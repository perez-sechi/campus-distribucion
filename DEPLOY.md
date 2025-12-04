# Guía de Deployment a GitHub Pages

## ⚠️ IMPORTANTE: Consideraciones de Seguridad

### API Key de Gemini en Producción

**ADVERTENCIA**: GitHub Pages es un servicio de hosting estático. Esto significa que tu API key de Gemini quedará expuesta en el código JavaScript del navegador, donde cualquiera puede verla.

**Implicaciones de seguridad:**
- ✅ La API key es visible para cualquier usuario que inspeccione el código
- ✅ Puede ser copiada y usada por terceros
- ✅ Google Gemini tiene límites de uso gratuitos que podrían agotarse

**Recomendaciones:**

1. **Para desarrollo/demo personal**: Usa la API key directamente (como está configurado)
2. **Para producción profesional**: Implementa un backend que maneje las llamadas a Gemini
3. **Protección adicional**:
   - Configura restricciones de dominio en Google Cloud Console
   - Habilita límites de cuota en tu API key
   - Monitorea el uso regularmente

## Métodos de Deployment

### Método 1: GitHub Actions (Recomendado)

Este método despliega automáticamente cada vez que haces push a la rama `main`.

#### Pasos:

1. **Crear el repositorio en GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TU-USUARIO/campus-distribucion.git
   git push -u origin main
   ```

2. **Configurar la API Key como Secret**

   Ve a tu repositorio en GitHub:
   - `Settings` > `Secrets and variables` > `Actions`
   - Click en `New repository secret`
   - Nombre: `VITE_GEMINI_API_KEY`
   - Valor: Tu API key de Gemini
   - Click en `Add secret`

3. **Habilitar GitHub Pages**

   En tu repositorio:
   - `Settings` > `Pages`
   - Source: `GitHub Actions`
   - Guarda los cambios

4. **Hacer push para desplegar**
   ```bash
   git push origin main
   ```

5. **Verificar el deployment**
   - Ve a la pestaña `Actions` en tu repositorio
   - Espera a que el workflow termine (aparecerá un check verde)
   - Tu app estará disponible en: `https://TU-USUARIO.github.io/campus-distribucion`

#### Actualizar package.json

Antes de hacer el deployment, actualiza la URL en `package.json`:

```json
"homepage": "https://TU-USUARIO.github.io/campus-distribucion"
```

Reemplaza `TU-USUARIO` con tu nombre de usuario de GitHub.

---

### Método 2: Deploy Manual con gh-pages

Este método te permite desplegar manualmente desde tu máquina local.

#### Pasos:

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Actualizar package.json**

   Edita la línea `homepage` con tu usuario de GitHub:
   ```json
   "homepage": "https://TU-USUARIO.github.io/campus-distribucion"
   ```

3. **Crear archivo .env.production**

   Crea un archivo `.env.production` con tu API key:
   ```
   VITE_GEMINI_API_KEY=tu_api_key_aqui
   ```

4. **Habilitar GitHub Pages**

   En tu repositorio de GitHub:
   - `Settings` > `Pages`
   - Source: `Deploy from a branch`
   - Branch: `gh-pages` / `root`
   - Guarda los cambios

5. **Hacer deploy**
   ```bash
   npm run deploy
   ```

   Este comando:
   - Compila la aplicación (`npm run build`)
   - Publica el contenido de `dist/` a la rama `gh-pages`

6. **Verificar**

   Tu aplicación estará disponible en:
   `https://TU-USUARIO.github.io/campus-distribucion`

---

## Configuración de Variables de Entorno

### Desarrollo Local
```bash
# .env (no commitear a git)
VITE_GEMINI_API_KEY=tu_api_key_de_desarrollo
```

### Producción con GitHub Actions
Configurado como Secret en GitHub (ver Método 1)

### Producción con Deploy Manual
```bash
# .env.production (no commitear a git)
VITE_GEMINI_API_KEY=tu_api_key_de_produccion
```

---

## Actualización del Sitio

### Con GitHub Actions:
Simplemente haz push a la rama main:
```bash
git add .
git commit -m "Actualización de funcionalidades"
git push origin main
```

### Con Deploy Manual:
Ejecuta el script de deploy:
```bash
npm run deploy
```

---

## Solución de Problemas

### Error: "Failed to load module script"

Si ves este error después del deployment:

1. Verifica que `vite.config.js` tenga la base correcta:
   ```js
   base: process.env.NODE_ENV === 'production' ? '/campus-distribucion/' : '/'
   ```

2. Asegúrate de que el nombre coincida con el nombre de tu repositorio

### Error: "API Key not configured"

1. Verifica que hayas configurado el secret `VITE_GEMINI_API_KEY` en GitHub
2. Verifica que el nombre del secret sea exactamente `VITE_GEMINI_API_KEY`
3. Reconstruye y redespliega

### La página muestra 404

1. Verifica que GitHub Pages esté habilitado en Settings
2. Espera unos minutos (puede tardar hasta 10 minutos)
3. Verifica que la URL sea correcta: `https://TU-USUARIO.github.io/NOMBRE-REPO`

### Los estilos no se cargan

1. Verifica la configuración de `base` en `vite.config.js`
2. Abre la consola del navegador (F12) y busca errores 404
3. Asegúrate de que el nombre del repositorio coincida con la configuración

---

## Alternativas Más Seguras

Para un deployment profesional, considera estas alternativas:

### 1. Backend con Proxy
Crea un backend simple que actúe como proxy para Gemini:

```
Frontend (GitHub Pages) → Backend (Vercel/Netlify) → Gemini API
```

### 2. Serverless Functions
Usa funciones serverless en:
- Vercel Functions
- Netlify Functions
- AWS Lambda
- Google Cloud Functions

### 3. Restricciones de API Key
En Google Cloud Console:
- Restringe la API key solo a tu dominio
- Configura límites de cuota diarios
- Habilita alertas de uso

---

## Monitoreo

Después del deployment, monitorea:

1. **Uso de la API**: Google Cloud Console > APIs & Services > Gemini API
2. **GitHub Actions**: Pestaña Actions en tu repositorio
3. **Errores**: Consola del navegador de los usuarios

---

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Compilar para producción
npm run build

# Previsualizar build local
npm run preview

# Deploy manual a GitHub Pages
npm run deploy

# Ver logs de GitHub Actions
# (desde la pestaña Actions en GitHub)
```

---

## Checklist de Deployment

- [ ] API key configurada como Secret en GitHub
- [ ] `homepage` actualizado en package.json con tu usuario
- [ ] GitHub Pages habilitado en Settings
- [ ] `.env` añadido a `.gitignore` (ya configurado)
- [ ] Código commiteado y pusheado a GitHub
- [ ] Workflow de GitHub Actions ejecutado correctamente
- [ ] Sitio accesible en la URL de GitHub Pages
- [ ] Funcionalidad del asistente IA probada en producción
- [ ] Restricciones de API key configuradas en Google Cloud

---

## Recursos Adicionales

- [Documentación de GitHub Pages](https://docs.github.com/en/pages)
- [Documentación de Vite](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [Configurar restricciones de API key](https://cloud.google.com/docs/authentication/api-keys)
