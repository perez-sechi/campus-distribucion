import { useState, useRef, useEffect } from 'react';
import { initializeGemini, sendMessageToGemini, getSystemContext } from '../services/geminiService';

function ChatInterface({ edificios, equiposDisponibles, onExecuteAction }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const chatHistoryRef = useRef([]);

  // Inicializar Gemini al montar el componente
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey && apiKey.trim() !== '') {
      try {
        initializeGemini(apiKey);
        setIsInitialized(true);
        setError(null);

        // Mensaje de bienvenida
        setMessages([{
          role: 'assistant',
          content: '¡Hola! Soy tu asistente para distribuir equipos en el campus. Puedes pedirme cosas como:\n\n• "Coloca el equipo de Marketing en la planta 2 del Edificio A"\n• "Mueve Desarrollo al Edificio B"\n• "Distribuye todos los equipos automáticamente"\n• "Vacía la planta 1 del Edificio C"\n• "¿Cuál es el estado actual del campus?"'
        }]);
      } catch (err) {
        setError('Error al inicializar Gemini: ' + err.message);
        setIsInitialized(false);
      }
    } else {
      setError('⚠️ No se ha configurado la API Key de Gemini. Por favor, añade tu API key en el archivo .env (VITE_GEMINI_API_KEY)');
      setIsInitialized(false);
    }
  }, []);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !isInitialized || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Añadir mensaje del usuario
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Obtener contexto actualizado del sistema
      const systemContext = getSystemContext(edificios, equiposDisponibles);

      // Construir el historial para Gemini
      const history = [
        {
          role: 'user',
          parts: [{ text: systemContext }]
        },
        {
          role: 'model',
          parts: [{ text: 'Entendido. Estoy listo para ayudarte a gestionar la distribución de equipos en el campus.' }]
        },
        ...chatHistoryRef.current
      ];

      // Enviar mensaje a Gemini
      const response = await sendMessageToGemini(userMessage, history);

      // Actualizar historial
      chatHistoryRef.current.push(
        {
          role: 'user',
          parts: [{ text: userMessage }]
        },
        {
          role: 'model',
          parts: [{ text: response.text }]
        }
      );

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
          disabled={!isInitialized || isLoading}
          className="chat-input"
        />
        <button
          type="submit"
          disabled={!isInitialized || isLoading || !inputValue.trim()}
          className="chat-submit"
        >
          {isLoading ? '⏳' : '📤'}
        </button>
      </form>
    </div>
  );
}

export default ChatInterface;
