# Aplicación de Distribución de Equipos en Campus

Aplicación React para gestionar la distribución de equipos de trabajo en diferentes plantas de edificios dentro de un campus.

---

## 🚀 ¿Listo para Desplegar en GitHub Pages?

**👉 [START-HERE.md](START-HERE.md) - Guía de deployment en 5 minutos**

El proyecto está completamente empaquetado y listo para GitHub Pages. Solo necesitas configurar tu usuario de GitHub y la API key.

---

## Características

- **Visualización de Campus**: Edificios dispuestos en grid (máximo 2 por fila)
- **Edificios Verticales**: Cada edificio muestra sus plantas de abajo hacia arriba
- **Drag & Drop**: Arrastra y suelta equipos entre plantas
- **Gestión de Capacidad**: Cada planta tiene capacidad limitada de puestos de trabajo
- **Prevención de Colisiones**: Los equipos no pueden superponerse en las plantas
- **Visualización de Ocupación**: Barra de progreso que muestra el nivel de ocupación
- **Equipos Coloreados**: Cada equipo tiene un color distintivo
- **🤖 Asistente con IA (Gemini)**: Controla la distribución mediante lenguaje natural

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar API Key de Gemini
# 1. Copia el archivo .env.example a .env
cp .env.example .env

# 2. Edita .env y añade tu API key de Google AI Studio
# Obtén tu API key gratis en: https://makersuite.google.com/app/apikey
# VITE_GEMINI_API_KEY=tu_api_key_aqui

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## Uso

### Modo Manual (Drag & Drop)

1. **Arrastrar equipos disponibles**: En la parte superior izquierda verás los equipos disponibles. Arrástralos a cualquier planta de un edificio.

2. **Mover entre plantas**: Puedes arrastrar equipos de una planta a otra dentro del mismo edificio o entre edificios diferentes.

3. **Posicionamiento horizontal**: Los equipos se colocan en la posición horizontal donde sueltas el cursor.

4. **Restricciones**:
   - No se puede exceder la capacidad de la planta
   - Los equipos no pueden superponerse
   - El ancho de cada equipo representa su ocupación proporcional

### Modo Asistente IA (Gemini)

Usa lenguaje natural para controlar la distribución de equipos. Ejemplos de comandos:

- **Mover equipos**: "Coloca el equipo de Marketing en la planta 2 del Edificio A"
- **Mover múltiples**: "Mueve Desarrollo y Diseño al Edificio B"
- **Distribución automática**: "Distribuye todos los equipos de forma balanceada"
- **Consultar estado**: "¿Cuál es el estado actual del campus?"
- **Vaciar plantas**: "Vacía la planta 1 del Edificio C"
- **Vaciar edificios**: "Vacía todo el Edificio A"

#### Funciones Disponibles

El asistente puede ejecutar las siguientes acciones:

- `moverEquipoAPlanta`: Mueve un equipo a una planta específica
- `moverEquipoADisponibles`: Devuelve un equipo a la lista de disponibles
- `obtenerEstadoCampus`: Consulta el estado actual de ocupación
- `distribuirEquiposAutomaticamente`: Distribuye equipos con criterios (balanceado, llenar_primero)
- `vaciarPlanta`: Vacía una planta específica
- `vaciarEdificio`: Vacía todas las plantas de un edificio

## Estructura del Proyecto

```
campus-distribucion/
├── src/
│   ├── components/
│   │   ├── Campus.jsx         # Contenedor principal del campus
│   │   ├── Edificio.jsx       # Componente de edificio
│   │   ├── Planta.jsx         # Componente de planta con lógica de drop
│   │   ├── Equipo.jsx         # Pastilla arrastrable de equipo
│   │   └── ChatInterface.jsx  # Interfaz de chat con Gemini
│   ├── services/
│   │   └── geminiService.js   # Integración con Google Gemini AI
│   ├── App.jsx                # Componente raíz con estado global
│   ├── App.css                # Estilos globales
│   └── main.jsx               # Punto de entrada
├── .env                       # Variables de entorno (API keys)
├── .env.example               # Ejemplo de configuración
├── index.html
├── package.json
└── vite.config.js
```

## Personalización

Puedes modificar los datos iniciales en `src/App.jsx`:

- **Edificios**: Añade o modifica edificios y sus plantas
- **Equipos**: Cambia nombres, colores y ocupación de equipos
- **Capacidades**: Ajusta la capacidad de cada planta

## Tecnologías

- React 18
- Vite
- Google Gemini AI (con Function Calling)
- HTML5 Drag and Drop API
- CSS3 con Grid y Flexbox

## Deployment a GitHub Pages

### Método Rápido (GitHub Actions - Automático)

1. **Crear repositorio en GitHub y subir el código**
2. **Configurar API Key como Secret**:
   - Settings > Secrets and variables > Actions
   - Nuevo secret: `VITE_GEMINI_API_KEY`
3. **Habilitar GitHub Pages**:
   - Settings > Pages > Source: GitHub Actions
4. **Actualizar `package.json`**:
   ```json
   "homepage": "https://TU-USUARIO.github.io/campus-distribucion"
   ```
5. **Hacer push a `main`** y el deployment será automático

### Método Manual

```bash
# Actualizar homepage en package.json
# Luego ejecutar:
npm run deploy
```

📚 **Documentación completa**: Ver [DEPLOY.md](DEPLOY.md) para instrucciones detalladas

⚠️ **Seguridad**: Ver [SECURITY.md](SECURITY.md) para consideraciones de seguridad de la API key

## Notas de Seguridad

- El archivo `.env` está excluido de git para proteger tu API key
- Nunca compartas tu API key de Gemini públicamente
- **⚠️ IMPORTANTE**: En GitHub Pages, la API key será visible en el código del navegador
- Configura restricciones de dominio y límites de cuota en Google Cloud Console
- Para producción profesional, considera usar un backend (ver SECURITY.md)
