# GitHub Actions Workflows

Este directorio contiene los workflows de GitHub Actions para el proyecto Campus Distribución.

## 📁 Workflows Disponibles

### `deploy.yml` - Deployment a GitHub Pages

**Trigger**: Push a rama `main` o ejecución manual (workflow_dispatch)

**Funcionalidad**:
1. Checkout del código
2. Setup de Node.js 18
3. Instalación de dependencias
4. Build de la aplicación
5. Deployment a GitHub Pages

**Variables de Entorno**:
- `VITE_GEMINI_API_KEY`: API key de Google Gemini (configurada como Secret)

**Permisos Requeridos**:
- `contents: read` - Leer el código del repositorio
- `pages: write` - Escribir en GitHub Pages
- `id-token: write` - Generar tokens de identidad

**Jobs**:

#### 1. Build Job
- Instala dependencias
- Compila la aplicación con Vite
- Usa la API key desde GitHub Secrets
- Sube el artifact de build

#### 2. Deploy Job
- Depende del Build Job
- Despliega el artifact a GitHub Pages
- Genera URL de deployment

## ⚙️ Configuración Requerida

### 1. GitHub Secrets

Configura los siguientes secrets en:
`Settings > Secrets and variables > Actions > New repository secret`

| Secret Name | Descripción | Valor |
|-------------|-------------|-------|
| `VITE_GEMINI_API_KEY` | API key de Google Gemini | Tu API key de AI Studio |

### 2. GitHub Pages

Habilita GitHub Pages en:
`Settings > Pages`

Configuración:
- **Source**: GitHub Actions
- **Branch**: (Gestionado automáticamente por el workflow)

### 3. Permisos del Workflow

Verifica que el workflow tenga permisos en:
`Settings > Actions > General > Workflow permissions`

Configuración recomendada:
- [x] Read and write permissions
- [x] Allow GitHub Actions to create and approve pull requests

## 🚀 Uso

### Deployment Automático

El deployment se ejecuta automáticamente cuando:
```bash
git push origin main
```

### Deployment Manual

1. Ve a la pestaña `Actions` en GitHub
2. Selecciona el workflow "Deploy to GitHub Pages"
3. Click en "Run workflow"
4. Selecciona la rama `main`
5. Click en "Run workflow"

## 📊 Monitoreo

### Ver el Estado del Deployment

1. Ve a la pestaña `Actions` en tu repositorio
2. Busca el workflow más reciente
3. Click para ver los detalles

### Estados Posibles

- ✅ **Success**: Deployment completado correctamente
- ❌ **Failure**: Error durante el deployment
- 🟡 **In Progress**: Deployment en curso
- ⚪ **Pending**: Esperando inicio

### Ver la URL de Deployment

Después de un deployment exitoso:
1. Ve a la pestaña `Actions`
2. Click en el workflow completado
3. Click en el job "deploy"
4. Busca el paso "Deploy to GitHub Pages"
5. La URL aparecerá en los logs

## 🐛 Troubleshooting

### Error: "Process completed with exit code 1"

**Causas comunes**:
1. Error de compilación en el código
2. Dependencias faltantes
3. API key no configurada

**Solución**:
1. Revisa los logs del workflow
2. Ejecuta `npm run build` localmente para reproducir el error
3. Corrige el error y haz push de nuevo

### Error: "The process '/usr/bin/git' failed with exit code 128"

**Causa**: Problemas con permisos de git

**Solución**:
1. Verifica que los permisos del workflow estén habilitados
2. Verifica que GitHub Pages esté configurado correctamente

### Error: "API Key not found"

**Causa**: Secret `VITE_GEMINI_API_KEY` no configurado

**Solución**:
1. Ve a Settings > Secrets and variables > Actions
2. Verifica que existe un secret llamado exactamente `VITE_GEMINI_API_KEY`
3. Verifica que el valor es correcto
4. Re-ejecuta el workflow

### Deployment exitoso pero sitio no carga

**Causa**: Configuración incorrecta de base path

**Solución**:
1. Verifica `vite.config.js`:
   ```js
   base: process.env.NODE_ENV === 'production' ? '/campus-distribucion/' : '/'
   ```
2. Verifica que el nombre coincide con el nombre del repositorio
3. Redespliega

## 📋 Logs y Debugging

### Ver logs completos

1. Click en el workflow en la pestaña Actions
2. Click en cada job para expandir
3. Click en cada step para ver logs detallados

### Download Artifacts

Para debugging, puedes descargar el artifact de build:
1. Ve al workflow completado
2. Scroll hasta "Artifacts"
3. Click en "github-pages" para descargar

## 🔄 Actualización del Workflow

Si necesitas modificar el workflow:

1. Edita `.github/workflows/deploy.yml`
2. Commit y push los cambios
3. El nuevo workflow se usará en el siguiente deployment

**Nota**: Los cambios al workflow solo afectan deployments futuros, no el deployment actual.

## 📚 Recursos

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

## 🆘 Soporte

Si encuentras problemas:

1. Revisa [DEPLOY.md](../DEPLOY.md) en la raíz del proyecto
2. Revisa [DEPLOYMENT-CHECKLIST.md](../DEPLOYMENT-CHECKLIST.md)
3. Busca issues similares en el repositorio
4. Crea un nuevo issue con:
   - Descripción del problema
   - Logs del workflow
   - Pasos para reproducir

---

**Última actualización**: 2024
**Versión del workflow**: 1.0
**Mantenedor**: [Tu nombre]
