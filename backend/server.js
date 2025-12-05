import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // En producción, especificar el dominio exacto
  methods: ['POST', 'GET'],
  credentials: true
}));
// Aumentar límite para soportar audio en base64 (hasta 10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Definición de funciones para Gemini
const functionDeclarations = [
  {
    name: "moverEquipoAPlanta",
    description: "Mueve o coloca un equipo en una planta específica de un edificio. Usa esta función cuando el usuario pida colocar, mover o poner un equipo en una planta.",
    parameters: {
      type: "object",
      properties: {
        nombreEquipo: {
          type: "string",
          description: "Nombre exacto del equipo a mover (ejemplo: 'Marketing', 'Desarrollo', 'Finanzas')"
        },
        nombreEdificio: {
          type: "string",
          description: "Nombre del edificio destino (ejemplo: 'Edificio A', 'Edificio B')"
        },
        numeroPlanta: {
          type: "number",
          description: "Número de la planta destino (ejemplo: 1, 2, 3)"
        }
      },
      required: ["nombreEquipo", "nombreEdificio", "numeroPlanta"]
    }
  },
  {
    name: "moverEquipoADisponibles",
    description: "Devuelve un equipo a la lista de disponibles, sacándolo de su planta actual. Usa esta función cuando el usuario pida remover o quitar un equipo de una planta.",
    parameters: {
      type: "object",
      properties: {
        nombreEquipo: {
          type: "string",
          description: "Nombre del equipo a devolver a disponibles"
        }
      },
      required: ["nombreEquipo"]
    }
  },
  {
    name: "obtenerEstadoCampus",
    description: "Obtiene y muestra el estado actual completo del campus con todos los edificios, plantas y equipos. Usa esta función cuando el usuario pregunte por el estado o información del campus.",
    parameters: { type: "object", properties: {}, required: [] }
  },
  {
    name: "distribuirEquiposAutomaticamente",
    description: "Distribuye todos los equipos disponibles automáticamente entre las plantas usando un criterio específico. Usa esta función cuando el usuario pida distribuir equipos de forma automática.",
    parameters: {
      type: "object",
      properties: {
        criterio: {
          type: "string",
          description: "Criterio de distribución: 'balanceado' (equilibrado entre plantas), 'llenar_primero' (llenar plantas secuencialmente)",
          enum: ["balanceado", "llenar_primero", "por_edificio"]
        }
      },
      required: []
    }
  },
  {
    name: "vaciarPlanta",
    description: "Vacía una planta específica de un edificio, moviendo todos sus equipos a disponibles. Usa esta función cuando el usuario pida vaciar, limpiar o remover todos los equipos de una planta.",
    parameters: {
      type: "object",
      properties: {
        nombreEdificio: {
          type: "string",
          description: "Nombre del edificio (ejemplo: 'Edificio A', 'Edificio B', etc.)"
        },
        numeroPlanta: {
          type: "number",
          description: "Número de la planta a vaciar (ejemplo: 1, 2, 3, etc.)"
        }
      },
      required: ["nombreEdificio", "numeroPlanta"]
    }
  },
  {
    name: "vaciarEdificio",
    description: "Vacía un edificio completo, moviendo todos los equipos de todas sus plantas a disponibles. Usa esta función cuando el usuario pida vaciar o limpiar todo un edificio.",
    parameters: {
      type: "object",
      properties: {
        nombreEdificio: {
          type: "string",
          description: "Nombre del edificio completo a vaciar (ejemplo: 'Edificio A', 'Edificio B', etc.)"
        }
      },
      required: ["nombreEdificio"]
    }
  }
];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Endpoint principal para chat con Gemini
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history, systemContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Crear modelo con function declarations y configuración estricta
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      tools: [{ functionDeclarations }],
      systemInstruction: `Eres un sistema de ejecución de comandos para gestionar equipos en un campus.

REGLAS ABSOLUTAS:
1. NUNCA JAMÁS hagas preguntas al usuario
2. SIEMPRE ejecuta funciones inmediatamente cuando el usuario dé instrucciones
3. Si falta información, infierela del estado actual del campus o del contexto previo de la conversación
4. Cada mensaje del usuario es un COMANDO, no una pregunta que requiere respuesta conversacional

EJEMPLOS DE INFERENCIA:
- Usuario: "vacía la planta 2"
  → Busca en el estado del campus qué edificio tiene planta 2 con equipos y llama vaciarPlanta
  → Si hay múltiples, usa el primero alfabéticamente
  → Si el usuario mencionó un edificio antes en la conversación, usa ese

- Usuario: "del edificio A"
  → Esto es continuación del comando anterior, combina ambos y llama vaciarPlanta("Edificio A", 2)

- Usuario: "coloca marketing en la planta 1"
  → Si no especifica edificio, busca el primer edificio con capacidad disponible en planta 1

IMPORTANTE: Tu trabajo es EJECUTAR FUNCIONES, no conversar. Cada mensaje debe resultar en una o más llamadas a función.`,
      generationConfig: {
        temperature: 0.1, // Más determinístico
      }
    });

    // Construir historial completo
    const fullHistory = [];

    if (systemContext) {
      fullHistory.push(
        {
          role: 'user',
          parts: [{ text: systemContext }]
        },
        {
          role: 'model',
          parts: [{ text: 'Entendido. Estoy listo para ayudarte.' }]
        }
      );
    }

    if (history && Array.isArray(history)) {
      fullHistory.push(...history);
    }

    // Iniciar chat
    const chat = model.startChat({
      history: fullHistory,
    });

    // Enviar mensaje
    const result = await chat.sendMessage(message);
    const response = result.response;

    // Extraer function calls - verificar diferentes formatos
    const functionCalls = [];

    try {
      // Intentar acceder a functionCalls como método
      const calls = response.functionCalls ? response.functionCalls() : null;
      if (calls && calls.length > 0) {
        for (const call of calls) {
          functionCalls.push({
            name: call.name,
            args: call.args
          });
        }
      }
    } catch (err) {
      // Si falla, intentar como propiedad
      const candidates = response.candidates || [];
      if (candidates.length > 0 && candidates[0].content) {
        const parts = candidates[0].content.parts || [];
        for (const part of parts) {
          if (part.functionCall) {
            functionCalls.push({
              name: part.functionCall.name,
              args: part.functionCall.args
            });
          }
        }
      }
    }

    // Obtener texto de respuesta
    let responseText = '';
    try {
      responseText = response.text();
    } catch (err) {
      // Si no hay texto, usar un mensaje por defecto
      responseText = functionCalls.length > 0 ? 'Ejecutando acciones...' : '';
    }

    // Enviar respuesta
    res.json({
      text: responseText,
      functionCalls: functionCalls
    });

  } catch (error) {
    console.error('Error en /api/gemini/chat:', error);
    res.status(500).json({
      error: 'Error al procesar la solicitud',
      message: error.message
    });
  }
});

// Endpoint para procesar audio
app.post('/api/gemini/chat-audio', async (req, res) => {
  try {
    const { audioData, mimeType, history, systemContext } = req.body;

    if (!audioData) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    // Crear modelo con function declarations
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      tools: [{ functionDeclarations }],
      systemInstruction: `Eres un sistema de ejecución de comandos para gestionar equipos en un campus.

REGLAS ABSOLUTAS:
1. NUNCA JAMÁS hagas preguntas al usuario
2. SIEMPRE ejecuta funciones inmediatamente cuando el usuario dé instrucciones de voz
3. Si falta información, infierela del estado actual del campus o del contexto previo
4. Cada mensaje de voz del usuario es un COMANDO, no una pregunta

IMPORTANTE: Tu trabajo es EJECUTAR FUNCIONES, no conversar. Cada mensaje debe resultar en una o más llamadas a función.`,
      generationConfig: {
        temperature: 0.1,
      }
    });

    // Construir historial completo
    const fullHistory = [];

    if (systemContext) {
      fullHistory.push(
        {
          role: 'user',
          parts: [{ text: systemContext }]
        },
        {
          role: 'model',
          parts: [{ text: 'Entendido. Sistema listo.' }]
        }
      );
    }

    if (history && Array.isArray(history)) {
      fullHistory.push(...history);
    }

    // Iniciar chat
    const chat = model.startChat({
      history: fullHistory,
    });

    // Enviar audio a Gemini
    // El audio viene en base64, necesitamos convertirlo a objeto inline_data
    const result = await chat.sendMessage([
      {
        inlineData: {
          mimeType: mimeType || 'audio/webm',
          data: audioData // base64 string sin el prefijo "data:audio/webm;base64,"
        }
      }
    ]);

    const response = result.response;

    // Extraer function calls
    const functionCalls = [];

    try {
      const calls = response.functionCalls ? response.functionCalls() : null;
      if (calls && calls.length > 0) {
        for (const call of calls) {
          functionCalls.push({
            name: call.name,
            args: call.args
          });
        }
      }
    } catch (err) {
      const candidates = response.candidates || [];
      if (candidates.length > 0 && candidates[0].content) {
        const parts = candidates[0].content.parts || [];
        for (const part of parts) {
          if (part.functionCall) {
            functionCalls.push({
              name: part.functionCall.name,
              args: part.functionCall.args
            });
          }
        }
      }
    }

    // Obtener texto de respuesta (transcripción + respuesta)
    let responseText = '';
    try {
      responseText = response.text();
    } catch (err) {
      responseText = functionCalls.length > 0 ? 'Ejecutando acciones...' : '';
    }

    // Enviar respuesta
    res.json({
      text: responseText,
      functionCalls: functionCalls
    });

  } catch (error) {
    console.error('Error en /api/gemini/chat-audio:', error);
    res.status(500).json({
      error: 'Error al procesar el audio',
      message: error.message
    });
  }
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no capturado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   API endpoint: http://localhost:${PORT}/api/gemini/chat`);
});
