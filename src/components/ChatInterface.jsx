import { useState, useRef, useEffect } from 'react';
import { initializeGemini, sendMessageToGemini, sendAudioToGemini, getSystemContext } from '../services/geminiService';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';

function ChatInterface({ edificios, equiposDisponibles, onExecuteAction }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const conversationHistoryRef = useRef([]); // Para mantener últimos 3 intercambios
  const [recordingTime, setRecordingTime] = useState(0);

  // Hook de grabación de voz
  const { isRecording, audioBlob, startRecording, stopRecording, clearRecording } = useVoiceRecorder();

  // Verificar conexión con el backend al montar el componente
  useEffect(() => {
    const checkBackend = async () => {
      try {
        initializeGemini(); // Ya no requiere API key

        // Verificar que el backend esté disponible
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
        const response = await fetch(`${backendUrl}/health`);

        if (response.ok) {
          setIsInitialized(true);
          setError(null);

          // Mensaje de bienvenida
          setMessages([{
            role: 'assistant',
            content: '¡Hola! Soy tu asistente para distribuir equipos en el campus. Puedes pedirme cosas como:\n\n• "Coloca el equipo de Marketing en la planta 2 del Edificio A"\n• "Mueve Desarrollo al Edificio B"\n• "Distribuye todos los equipos automáticamente"\n• "Vacía la planta 1 del Edificio C"\n• "¿Cuál es el estado actual del campus?"'
          }]);
        } else {
          throw new Error('Backend no disponible');
        }
      } catch (err) {
        setError('⚠️ No se pudo conectar con el servidor backend. Asegúrate de que esté corriendo en ' + (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'));
        setIsInitialized(false);
      }
    };

    checkBackend();
  }, []);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Temporizador de grabación (límite de 30 segundos)
  useEffect(() => {
    let interval;
    if (isRecording) {
      setRecordingTime(0);
      interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 30) {
            stopRecording(); // Detener automáticamente después de 30 segundos
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Procesar audio cuando la grabación termine
  useEffect(() => {
    if (audioBlob && !isRecording) {
      handleAudioSubmit(audioBlob);
    }
  }, [audioBlob, isRecording]);

  const handleAudioSubmit = async (audioBlob) => {
    if (!isInitialized || isLoading) return;

    setIsLoading(true);

    // Añadir mensaje visual indicando que se está procesando audio
    setMessages(prev => [...prev, { role: 'user', content: '🎤 [Mensaje de voz]' }]);

    try {
      // Obtener contexto actualizado del sistema
      const systemContext = getSystemContext(edificios, equiposDisponibles);

      // Construir el historial
      const history = [
        {
          role: 'user',
          parts: [{ text: systemContext }]
        },
        {
          role: 'model',
          parts: [{ text: 'Entendido. Sistema listo.' }]
        },
        ...conversationHistoryRef.current.slice(-6)
      ];

      // Enviar audio a Gemini
      const response = await sendAudioToGemini(audioBlob, history);

      // Guardar en historial de conversación
      conversationHistoryRef.current.push(
        {
          role: 'user',
          parts: [{ text: response.text || '[Audio]' }] // Usar transcripción si está disponible
        },
        {
          role: 'model',
          parts: [{ text: response.text || 'Acción ejecutada.' }]
        }
      );

      // Mantener solo los últimos 3 intercambios
      if (conversationHistoryRef.current.length > 6) {
        conversationHistoryRef.current = conversationHistoryRef.current.slice(-6);
      }

      // Ejecutar function calls si existen
      if (response.functionCalls && response.functionCalls.length > 0) {
        const results = [];
        for (const call of response.functionCalls) {
          const result = await executeFunctionCall(call);
          results.push(result);
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        const fullResponse = response.text || 'Procesando comando de voz...';
        const actionsInfo = results.filter(r => r.success).length > 0
          ? `\n\n✅ Se realizaron ${results.filter(r => r.success).length} acción(es) correctamente.`
          : '';

        const errors = results.filter(r => !r.success);
        const errorsInfo = errors.length > 0
          ? `\n\n❌ Errores: ${errors.map(e => e.message).join(', ')}`
          : '';

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: fullResponse + actionsInfo + errorsInfo
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.text || 'No entendí el comando de voz. ¿Podrías intentarlo de nuevo?'
        }]);
      }
    } catch (err) {
      console.error('Error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Error al procesar el audio: ' + err.message
      }]);
    } finally {
      setIsLoading(false);
      clearRecording(); // Limpiar el audio procesado
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !isInitialized || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Añadir mensaje del usuario
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Obtener contexto actualizado del sistema (siempre el estado más reciente)
      const systemContext = getSystemContext(edificios, equiposDisponibles);

      // Construir el historial para Gemini
      // Incluye contexto actual + últimos 3 intercambios de conversación
      const history = [
        {
          role: 'user',
          parts: [{ text: systemContext }]
        },
        {
          role: 'model',
          parts: [{ text: 'Entendido. Sistema listo.' }]
        },
        ...conversationHistoryRef.current.slice(-6) // Últimos 3 intercambios (6 mensajes)
      ];

      // Enviar mensaje a Gemini
      const response = await sendMessageToGemini(userMessage, history);

      // Guardar en historial de conversación (limitado a últimos 3 intercambios)
      conversationHistoryRef.current.push(
        {
          role: 'user',
          parts: [{ text: userMessage }]
        },
        {
          role: 'model',
          parts: [{ text: response.text || 'Acción ejecutada.' }]
        }
      );

      // Mantener solo los últimos 3 intercambios (6 mensajes)
      if (conversationHistoryRef.current.length > 6) {
        conversationHistoryRef.current = conversationHistoryRef.current.slice(-6);
      }

      // Ejecutar function calls si existen
      if (response.functionCalls && response.functionCalls.length > 0) {
        const results = [];
        for (const call of response.functionCalls) {
          const result = await executeFunctionCall(call);
          results.push(result);
          // Pequeño delay entre llamadas para permitir que React actualice el estado
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        // Añadir respuesta del asistente
        const fullResponse = response.text || 'Ejecutando acciones...';
        const actionsInfo = results.filter(r => r.success).length > 0
          ? `\n\n✅ Se realizaron ${results.filter(r => r.success).length} acción(es) correctamente.`
          : '';

        const errors = results.filter(r => !r.success);
        const errorsInfo = errors.length > 0
          ? `\n\n❌ Errores: ${errors.map(e => e.message).join(', ')}`
          : '';

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: fullResponse + actionsInfo + errorsInfo
        }]);
      } else {
        // Solo respuesta de texto
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.text || 'No entendí tu solicitud. ¿Podrías reformularla?'
        }]);
      }
    } catch (err) {
      console.error('Error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Error al procesar tu solicitud: ' + err.message
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Ejecutar una llamada de función
  const executeFunctionCall = async (functionCall) => {
    try {
      const result = await onExecuteAction(functionCall.name, functionCall.args);
      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>🤖 Asistente de Distribución</h2>
        {!isInitialized && <span className="status-badge error">No configurado</span>}
        {isInitialized && <span className="status-badge success">Conectado</span>}
      </div>

      {error && (
        <div className="chat-error">
          {error}
          <div className="error-help">
            <small>
              Obtén tu API key gratis en: <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
            </small>
          </div>
        </div>
      )}

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message message-${msg.role}`}>
            <div className="message-content">
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message message-assistant">
            <div className="message-content loading">
              <span className="loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isInitialized ? "Ej: Coloca Marketing en la planta 2 del Edificio A..." : "Configura la API key primero..."}
          disabled={!isInitialized || isLoading || isRecording}
          className="chat-input"
        />
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!isInitialized || isLoading}
          className={`chat-voice-button ${isRecording ? 'recording' : ''}`}
          title={isRecording ? `Detener grabación (${recordingTime}s)` : "Grabar mensaje de voz"}
        >
          {isRecording ? `⏹️ ${recordingTime}s` : '🎤'}
        </button>
        <button
          type="submit"
          disabled={!isInitialized || isLoading || !inputValue.trim() || isRecording}
          className="chat-submit"
        >
          {isLoading ? '⏳' : '📤'}
        </button>
      </form>
    </div>
  );
}

export default ChatInterface;
