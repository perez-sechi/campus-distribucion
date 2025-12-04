# Consideraciones de Seguridad

## ⚠️ API Key de Gemini en Cliente

Esta aplicación está diseñada para ser desplegada en GitHub Pages, un servicio de hosting estático. Esto tiene implicaciones importantes de seguridad:

### Exposición de la API Key

**Realidad**: La API key de Google Gemini estará **visible en el código JavaScript** del navegador cuando se despliega en GitHub Pages.

**Por qué sucede esto**:
- GitHub Pages sirve archivos estáticos (HTML, CSS, JS)
- Las variables de entorno de Vite se incluyen en el bundle de JavaScript
- Cualquier usuario puede abrir las DevTools y ver el código fuente

**Qué significa esto**:
- ✅ Cualquiera puede copiar tu API key
- ✅ La API key puede ser usada por terceros
- ✅ Tu cuota de uso gratuito puede agotarse

## Medidas de Protección Recomendadas

### 1. Restricciones de API Key

Configura restricciones en [Google Cloud Console](https://console.cloud.google.com):

#### Restricciones de Aplicación
```
HTTP referrers (websites):
  - https://TU-USUARIO.github.io/campus-distribucion/*
  - http://localhost:5173/* (para desarrollo)
```

#### Restricciones de API
- Limita la key solo a "Generative Language API"
- Deshabilita otras APIs que no uses

#### Límites de Cuota
```
Queries per day: 50-100 (ajusta según necesidad)
Queries per minute: 10
```

### 2. Monitoreo de Uso

Configura alertas en Google Cloud Console:

1. Ve a "IAM & Admin" > "Quotas"
2. Busca "Generative Language API"
3. Configura alertas al 50%, 80% y 100% de uso

### 3. Rotación de API Keys

Si detectas uso sospechoso:

```bash
1. Genera una nueva API key en Google AI Studio
2. Revoca la API key anterior
3. Actualiza el secret en GitHub
4. Redespliega la aplicación
```

## Arquitectura Alternativa para Producción

Para un deployment profesional, considera implementar un backend:

### Opción 1: Backend Proxy

```
┌─────────────┐      ┌──────────────┐      ┌──────────┐
│   Cliente   │ ───> │   Backend    │ ───> │  Gemini  │
│ (GitHub     │ HTTP │   (Vercel/   │ API  │   API    │
│  Pages)     │ <─── │   Netlify)   │ <─── │          │
└─────────────┘      └──────────────┘      └──────────┘
                            │
                            │ API Key almacenada
                            ▼ de forma segura
                     ┌──────────────┐
                     │  Variables   │
                     │  de Entorno  │
                     └──────────────┘
```

**Ventajas**:
- API key nunca expuesta al cliente
- Control total sobre las peticiones
- Posibilidad de añadir autenticación
- Rate limiting por usuario
- Logs y analytics

### Opción 2: Serverless Functions

Implementa funciones serverless en:

#### Vercel
```javascript
// api/gemini.js
export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  // Llamada a Gemini API
  // ...
}
```

#### Netlify
```javascript
// netlify/functions/gemini.js
exports.handler = async (event) => {
  const apiKey = process.env.GEMINI_API_KEY;
  // Llamada a Gemini API
  // ...
}
```

## Uso Responsable

### Para Demos y Desarrollo Personal

Si decides usar la API key en el cliente:

1. ✅ Usa una API key separada para producción
2. ✅ Configura restricciones de dominio
3. ✅ Establece límites de cuota bajos
4. ✅ Monitorea el uso regularmente
5. ✅ Incluye un disclaimer en tu sitio

Ejemplo de disclaimer:
```html
<div class="security-notice">
  ⚠️ Esta es una aplicación de demostración.
  El uso de la API está limitado. Por favor, no abuses del servicio.
</div>
```

### Para Aplicaciones en Producción

1. ❌ NO uses API keys en el cliente
2. ✅ Implementa un backend
3. ✅ Añade autenticación de usuarios
4. ✅ Implementa rate limiting
5. ✅ Usa logs y analytics

## Detección de Abuso

Señales de que tu API key está siendo abusada:

- Incremento repentino en el uso
- Llamadas desde IPs o regiones inusuales
- Patrones de uso fuera del horario normal
- Mensajes de error de cuota excedida

### Qué hacer si detectas abuso:

```bash
1. Revoca inmediatamente la API key
2. Genera una nueva API key
3. Aplica restricciones más estrictas
4. Actualiza el deployment
5. Revisa los logs para entender el patrón de abuso
```

## Configuración de GitHub Secrets

Para mayor seguridad en GitHub Actions:

1. **Usa Environments**:
   - Settings > Environments > New environment
   - Nombre: "production"
   - Añade la API key como secret del environment
   - Configura protection rules (requiere aprobación manual)

2. **Limita acceso**:
   - Solo ciertos usuarios pueden aprobar deployments
   - Requiere revisión de código antes de merge a main

## Checklist de Seguridad

Antes de desplegar:

- [ ] API key configurada en GitHub Secrets
- [ ] Restricciones de HTTP referrer configuradas
- [ ] Límites de cuota establecidos
- [ ] Alertas de uso configuradas
- [ ] .env y .env.production en .gitignore
- [ ] Disclaimer de uso en la aplicación
- [ ] Plan de respuesta a abuso definido
- [ ] Monitoreo de uso configurado

## Recursos

- [Best practices para API keys](https://cloud.google.com/docs/authentication/api-keys)
- [Restricción de API keys](https://cloud.google.com/docs/authentication/api-keys#securing_an_api_key)
- [Gemini API Quotas](https://ai.google.dev/pricing)
- [OWASP API Security](https://owasp.org/www-project-api-security/)

## Contacto

Si detectas un problema de seguridad en este proyecto, por favor:

1. NO lo reportes públicamente
2. Crea un issue privado en GitHub
3. O contacta directamente al mantenedor

---

**Recuerda**: La seguridad es un proceso continuo, no un estado final. Monitorea, actualiza y mejora constantemente tus prácticas de seguridad.
