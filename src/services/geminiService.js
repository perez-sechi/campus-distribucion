import { GoogleGenerativeAI } from "@google/generative-ai";

// Definición de funciones disponibles para Gemini
export const functionDeclarations = [
  {
    name: "moverEquipoAPlanta",
    description: "Mueve un equipo a una planta específica de un edificio. El equipo puede estar en la lista de disponibles o en otra planta.",
    parameters: {
      type: "object",
      properties: {
        nombreEquipo: {
          type: "string",
          description: "Nombre del equipo a mover (ej: 'Marketing', 'Desarrollo', 'Diseño')"
        },
        nombreEdificio: {
          type: "string",
          description: "Nombre del edificio de destino (ej: 'Edificio A', 'Edificio B', 'Edificio C')"
        },
        numeroPlanta: {
          type: "number",
          description: "Número de la planta de destino (1, 2, 3, etc.)"
        }
      },
      required: ["nombreEquipo", "nombreEdificio", "numeroPlanta"]
    }
  },
  {
    name: "moverEquipoADisponibles",
    description: "Devuelve un equipo a la lista de equipos disponibles, sacándolo de cualquier planta donde esté ubicado.",
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
    description: "Obtiene información sobre el estado actual del campus: qué equipos están en qué plantas, capacidades disponibles, etc.",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "distribuirEquiposAutomaticamente",
    description: "Distribuye automáticamente todos los equipos disponibles en las plantas del campus optimizando el uso del espacio.",
    parameters: {
      type: "object",
      properties: {
        criterio: {
          type: "string",
          enum: ["balanceado", "llenar_primero", "por_edificio"],
          description: "Criterio de distribución: 'balanceado' (distribuye equitativamente), 'llenar_primero' (llena un edificio antes de pasar al siguiente), 'por_edificio' (distribuye por edificio)"
        }
      },
      required: []
    }
  },
  {
    name: "vaciarPlanta",
    description: "Vacía todos los equipos de una planta específica, devolviéndolos a disponibles.",
    parameters: {
      type: "object",
      properties: {
        nombreEdificio: {
          type: "string",
          description: "Nombre del edificio"
        },
        numeroPlanta: {
          type: "number",
          description: "Número de la planta a vaciar"
        }
      },
      required: ["nombreEdificio", "numeroPlanta"]
    }
  },
  {
    name: "vaciarEdificio",
    description: "Vacía todas las plantas de un edificio, devolviendo todos los equipos a disponibles.",
    parameters: {
      type: "object",
      properties: {
        nombreEdificio: {
          type: "string",
          description: "Nombre del edificio a vaciar"
        }
      },
      required: ["nombreEdificio"]
    }
  }
];

// Inicializar Gemini
let genAI = null;
let model = null;

export function initializeGemini(apiKey) {
  if (!apiKey) {
    throw new Error("API Key de Gemini no proporcionada");
  }

  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    tools: [{ functionDeclarations }],
  });

  return model;
}

export async function sendMessageToGemini(message, history = []) {
  if (!model) {
    throw new Error("Gemini no está inicializado. Llama a initializeGemini primero.");
  }

  try {
    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(message);
    const response = result.response;

    // Verificar si hay function calls
    const functionCalls = [];
    if (response.functionCalls && response.functionCalls().length > 0) {
      for (const call of response.functionCalls()) {
        functionCalls.push({
          name: call.name,
          args: call.args
        });
      }
    }

    return {
      text: response.text(),
      functionCalls: functionCalls
    };
  } catch (error) {
    console.error("Error al comunicarse con Gemini:", error);
    throw error;
  }
}

// Crear el contexto inicial del sistema
export function getSystemContext(edificios, equiposDisponibles) {
  return `Eres un asistente para gestionar la distribución de equipos de trabajo en un campus de edificios.

ESTADO ACTUAL DEL CAMPUS:

Edificios disponibles:
${edificios.map(ed => `
- ${ed.nombre}:
  ${ed.plantas.map(p => `  * Planta ${p.numero}: Capacidad ${p.capacidad} puestos, Ocupados ${p.equipos.reduce((sum, e) => sum + e.ocupacion, 0)} puestos
    Equipos: ${p.equipos.length > 0 ? p.equipos.map(e => `${e.nombre} (${e.ocupacion} puestos)`).join(', ') : 'Ninguno'}`).join('\n  ')}
`).join('\n')}

Equipos disponibles (sin asignar):
${equiposDisponibles.length > 0 ? equiposDisponibles.map(e => `- ${e.nombre}: ${e.ocupacion} puestos`).join('\n') : 'Ninguno'}

Cuando el usuario te pida distribuir equipos, usar las funciones disponibles para realizar las acciones.
Responde de forma amigable y confirma las acciones realizadas.`;
}
