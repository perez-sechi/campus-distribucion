# Backend - Campus Distribución

Backend seguro que actúa como proxy para las peticiones a Gemini AI, protegiendo la API key.

## Por qué un Backend

Google detectó la API key expuesta en el código del frontend y la bloqueó. Este backend:

- ✅ Protege la API key (nunca se expone al cliente)
- ✅ Actúa como proxy seguro para Gemini
- ✅ Permite control de acceso y rate limiting
- ✅ Logs centralizados de uso

## Requisitos

- Node.js >= 18
- npm o yarn
- API Key de Gemini (nueva, no la bloqueada)

## Setup Local

### 1. Instalar Dependencias

```bash
cd backend
npm install
```

### 2. Configurar Variables de Entorno

Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

Edita `.env`:
```bash
# API Key de Gemini (¡nueva!)
GEMINI_API_KEY=tu_nueva_api_key

# Puerto del servidor
PORT=3001

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:5173

# Entorno
NODE_ENV=development
```

### 3. Obtener Nueva API Key

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una **nueva** API key (la antigua está bloqueada)
3. Cópiala en el archivo `.env`

### 4. Ejecutar el Servidor

```bash
npm start
```

O en modo desarrollo con auto-reload:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

### 5. Verificar que Funciona

```bash
curl http://localhost:3001/health
```

Deberías ver: `{"status":"ok","timestamp":"..."}`

## Probar con el Frontend

1. En otra terminal, ve a la carpeta raíz del proyecto
2. Asegúrate de que `.env` tiene:
   ```
   VITE_BACKEND_URL=http://localhost:3001
   ```
3. Ejecuta el frontend:
   ```bash
   npm run dev
   ```
4. Abre `http://localhost:5173`
5. El asistente IA debería conectarse automáticamente

---

## Deployment a Producción

### Opción 1: Railway (Recomendado - Más Fácil)

#### Por qué Railway

- ✅ Setup de 5 minutos
- ✅ $5/mes gratis de crédito
- ✅ Auto-deploy desde GitHub
- ✅ Variables de entorno fáciles

#### Pasos:

1. **Crear cuenta en [Railway.app](https://railway.app)**

2. **Crear nuevo proyecto**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Autoriza Railway a acceder a tu repo
   - Selecciona el repositorio `campus-distribucion`

3. **Configurar el servicio**
   - Railway detectará automáticamente el backend
   - Si no, especifica:
     - Root Directory: `backend`
     - Start Command: `npm start`

4. **Configurar Variables de Entorno**
   - En el dashboard de Railway, ve a "Variables"
   - Añade:
     ```
     GEMINI_API_KEY=tu_nueva_api_key
     FRONTEND_URL=https://perez-sechi.github.io
     NODE_ENV=production
     ```

5. **Deploy**
   - Railway hará deploy automáticamente
   - Te dará una URL: `https://tu-proyecto.railway.app`

6. **Actualizar el Frontend**
   - En el repositorio principal, edita `.env.production`:
     ```
     VITE_BACKEND_URL=https://tu-proyecto.railway.app
     ```
   - Commit y push
   - GitHub Actions redesplegará con la nueva configuración

---

### Opción 2: Render

#### Pasos:

1. **Crear cuenta en [Render.com](https://render.com)**

2. **Crear nuevo Web Service**
   - Click en "New +" > "Web Service"
   - Conecta tu repositorio GitHub
   - Configura:
     - Name: `campus-distribucion-backend`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Root Directory: `backend`

3. **Variables de Entorno**
   ```
   GEMINI_API_KEY=tu_nueva_api_key
   FRONTEND_URL=https://perez-sechi.github.io
   NODE_ENV=production
   ```

4. **Deploy** - Render hará deploy automáticamente

---

### Opción 3: Vercel (Serverless)

#### Pasos:

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy desde la carpeta backend**
   ```bash
   cd backend
   vercel
   ```

4. **Configurar Variables de Entorno en Vercel Dashboard**
   - Ve a tu proyecto en vercel.com
   - Settings > Environment Variables
   - Añade `GEMINI_API_KEY` y `FRONTEND_URL`

5. **Redeploy**
   ```bash
   vercel --prod
   ```

---

## Arquitectura

```
┌─────────────┐      HTTPS      ┌──────────────┐      API     ┌──────────┐
│   Frontend  │ ─────────────> │   Backend    │ ──────────> │  Gemini  │
│  (GitHub    │   fetch()       │  (Railway/   │   Secure     │   API    │
│   Pages)    │                 │   Render)    │   API Key    │          │
└─────────────┘                 └──────────────┘              └──────────┘
                                       │
                                       │ API Key en
                                       ▼ Variables de Entorno
                                ┌──────────────┐
                                │  .env File   │
                                │  (Secreto)   │
                                └──────────────┘
```

## API Endpoints

### GET /health

Health check del servidor.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST /api/gemini/chat

Envía un mensaje a Gemini y obtiene respuesta con function calls.

**Request:**
```json
{
  "message": "Coloca Marketing en la planta 2",
  "history": [],
  "systemContext": "Eres un asistente..."
}
```

**Response:**
```json
{
  "text": "Ejecutando acción...",
  "functionCalls": [
    {
      "name": "moverEquipoAPlanta",
      "args": {
        "nombreEquipo": "Marketing",
        "nombreEdificio": "Edificio A",
        "numeroPlanta": 2
      }
    }
  ]
}
```

## Seguridad

### Implementado

- ✅ API key nunca expuesta al cliente
- ✅ CORS configurado para solo tu frontend
- ✅ Validación de requests
- ✅ Manejo de errores

### Mejoras Opcionales

Para producción profesional, considera:

1. **Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```

2. **Autenticación**
   - JWT tokens
   - Session-based auth

3. **Logging**
   - Winston o Pino para logs
   - Log aggregation (Sentry, LogRocket)

4. **Monitoring**
   - Uptime monitoring
   - Performance metrics

## Troubleshooting

### Error: "Cannot connect to backend"

**Causa**: Backend no está corriendo o URL incorrecta

**Solución**:
1. Verifica que el backend esté corriendo: `npm start`
2. Verifica `.env` en el frontend tenga la URL correcta
3. Verifica CORS - el backend debe permitir tu dominio

### Error: "GEMINI_API_KEY is not defined"

**Causa**: Variable de entorno no configurada

**Solución**:
1. Verifica que `.env` existe en `backend/`
2. Verifica que tiene `GEMINI_API_KEY=...`
3. En producción, configura en el dashboard de Railway/Render

### Error: 404 al llamar a Gemini

**Causa**: Modelo no válido o API key inválida

**Solución**:
1. Verifica que la API key es nueva (no la bloqueada)
2. Prueba con `gemini-2.0-flash-exp` o `gemini-1.5-pro`
3. Verifica en Google AI Studio que la key funciona

## Costos

### Railway
- $5/mes de crédito gratis
- ~$5-10/mes para uso moderado
- Escala automáticamente

### Render
- Free tier disponible (con limitaciones)
- $7/mes para instancia básica
- Sin sleep en el plan de pago

### Vercel
- Gratis para hobby projects
- Limits: 100GB bandwidth, 100 hours execution time
- Serverless = pay per use

## Estructura de Archivos

```
backend/
├── server.js           # Servidor Express principal
├── package.json        # Dependencias
├── .env               # Variables de entorno (NO COMMITEAR)
├── .env.example       # Ejemplo de configuración
├── .gitignore         # Archivos a ignorar
├── railway.json       # Config para Railway
├── render.yaml        # Config para Render
├── vercel.json        # Config para Vercel
└── README.md          # Este archivo
```

## Scripts

```bash
npm start              # Producción
npm run dev            # Desarrollo con auto-reload
```

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `GEMINI_API_KEY` | API key de Google Gemini | `AIzaSy...` |
| `PORT` | Puerto del servidor | `3001` |
| `FRONTEND_URL` | URL del frontend (CORS) | `http://localhost:5173` |
| `NODE_ENV` | Entorno | `development` o `production` |

## Próximos Pasos

1. ✅ Deploy a Railway/Render
2. ✅ Actualizar frontend con la URL del backend
3. ⏭️ Opcional: Añadir rate limiting
4. ⏭️ Opcional: Añadir autenticación
5. ⏭️ Opcional: Añadir analytics/logging

---

## Soporte

Si encuentras problemas:

1. Verifica los logs del servidor
2. Verifica las variables de entorno
3. Verifica que la API key de Gemini es válida
4. Crea un issue en GitHub con:
   - Descripción del error
   - Logs del servidor
   - Plataforma de deployment

---

**Última actualización**: 2024
**Versión**: 1.0.0
