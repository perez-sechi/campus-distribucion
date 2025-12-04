# Guía de Configuración Rápida

## 1. Instalación de Dependencias

```bash
cd campus-distribucion
npm install
```

## 2. Configuración de la API Key de Gemini

### Obtener la API Key

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key"
4. Copia la API key generada

### Configurar la API Key en la Aplicación

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` y pega tu API key:
   ```
   VITE_GEMINI_API_KEY=AIzaSy...tu_api_key_completa
   ```

3. Guarda el archivo

## 3. Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:5173`

## 4. Verificar la Conexión con Gemini

1. Busca el panel del "Asistente de Distribución" en la parte izquierda
2. Si ves un badge verde que dice "Conectado", ¡todo funciona correctamente!
3. Si ves un mensaje de error, verifica que:
   - Tu API key esté correctamente copiada en `.env`
   - El nombre de la variable sea exactamente `VITE_GEMINI_API_KEY`
   - Hayas reiniciado el servidor de desarrollo después de editar `.env`

## 5. Prueba el Asistente

Escribe en el chat:

```
Coloca Marketing en la planta 2 del Edificio A
```

Si el equipo se mueve automáticamente, ¡todo está funcionando!

## Solución de Problemas

### Error: "No se ha configurado la API Key"

- Verifica que el archivo `.env` existe en la raíz del proyecto
- Asegúrate de que la variable se llama `VITE_GEMINI_API_KEY`
- Reinicia el servidor de desarrollo (`Ctrl+C` y luego `npm run dev`)

### Error: "API Key inválida"

- Verifica que hayas copiado la API key completa
- Asegúrate de que no hay espacios extra al principio o final
- Genera una nueva API key en Google AI Studio

### El asistente no responde

- Verifica tu conexión a internet
- Revisa la consola del navegador (F12) para ver errores
- Asegúrate de que la API key tiene permisos habilitados en Google AI Studio

## Funciones Disponibles del Asistente

- Mover equipos: "Coloca [equipo] en planta [número] del [edificio]"
- Distribuir: "Distribuye todos los equipos automáticamente"
- Consultar: "¿Cuál es el estado del campus?"
- Vaciar: "Vacía la planta 1 del Edificio A"
