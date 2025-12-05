// URL del backend (cambiar en producción)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Ya no necesitamos inicializar Gemini en el frontend
export function initializeGemini(apiKey) {
  // En el nuevo approach, no necesitamos la API key en el frontend
  // Solo verificamos que el backend esté configurado
  console.log('Backend URL configurado:', BACKEND_URL);
  return true;
}

export async function sendMessageToGemini(message, history = []) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/gemini/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        history: history,
        systemContext: getCurrentSystemContext()
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    const data = await response.json();

    return {
      text: data.text || '',
      functionCalls: data.functionCalls || []
    };
  } catch (error) {
    console.error("Error al comunicarse con el backend:", error);

    // Mensaje de error más amigable
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo.');
    }

    throw error;
  }
}

// Variable para almacenar el contexto actual (será actualizada desde el componente)
let currentSystemContext = '';

export function setSystemContext(context) {
  currentSystemContext = context;
}

function getCurrentSystemContext() {
  return currentSystemContext;
}

// Crear el contexto del sistema (movido desde el frontend)
export function getSystemContext(edificios, equiposDisponibles) {
  const context = `Eres un asistente para gestionar la distribución de equipos de trabajo en un campus de edificios.

IMPORTANTE: Cuando el usuario te dé una instrucción clara, DEBES llamar a la función correspondiente INMEDIATAMENTE sin hacer preguntas adicionales. Solo pregunta si falta información esencial.

ESTADO ACTUAL DEL CAMPUS:

Edificios disponibles:
${edificios.map(ed => `
- ${ed.nombre}:
  ${ed.plantas.map(p => `  * Planta ${p.numero}: Capacidad ${p.capacidad} puestos, Ocupados ${p.equipos.reduce((sum, e) => sum + e.ocupacion, 0)} puestos
    Equipos: ${p.equipos.length > 0 ? p.equipos.map(e => `${e.nombre} (${e.ocupacion} puestos)`).join(', ') : 'Ninguno'}`).join('\n  ')}
`).join('\n')}

Equipos disponibles (sin asignar):
${equiposDisponibles.length > 0 ? equiposDisponibles.map(e => `- ${e.nombre}: ${e.ocupacion} puestos`).join('\n') : 'Ninguno'}

INSTRUCCIONES DE ACCIÓN:
- Si el usuario dice "Coloca [equipo] en [edificio] planta [número]" → Llama a moverEquipoAPlanta inmediatamente
- Si el usuario dice "Vacía la planta [número] del edificio [nombre]" → Llama a vaciarPlanta inmediatamente
- Si el usuario dice "Vacía el edificio [nombre]" → Llama a vaciarEdificio inmediatamente
- Si el usuario dice "Distribuye los equipos" → Llama a distribuirEquiposAutomaticamente inmediatamente

NO hagas preguntas si la información está completa. Actúa directamente.
Responde de forma amigable y confirma las acciones realizadas.`;

  setSystemContext(context);
  return context;
}

// Función para enviar audio a Gemini
export async function sendAudioToGemini(audioBlob, history = []) {
  try {
    // Convertir blob a base64
    const base64Audio = await blobToBase64(audioBlob);

    // Remover el prefijo "data:audio/webm;base64," si existe
    const base64Data = base64Audio.split(',')[1] || base64Audio;

    const response = await fetch(`${BACKEND_URL}/api/gemini/chat-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audioData: base64Data,
        mimeType: audioBlob.type,
        history: history,
        systemContext: getCurrentSystemContext()
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    const data = await response.json();

    return {
      text: data.text || '',
      functionCalls: data.functionCalls || []
    };
  } catch (error) {
    console.error("Error al enviar audio:", error);

    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo.');
    }

    throw error;
  }
}

// Función auxiliar para convertir Blob a Base64
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
