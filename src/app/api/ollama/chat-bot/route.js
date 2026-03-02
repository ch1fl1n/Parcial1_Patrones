import {NextResponse} from 'next/server';
import {createOllamaClient, OLLAMA_CONFIG} from '@/lib/ollama-config';

/**
 * ChatBot API Endpoint
 * Processes conversational messages with context and history
 * 
 * POST /api/ollama/chat-bot
 * Body: { query: string, context?: string, history?: Array<{role, content}> }
 */
export async function POST(request) {
  try {
    const { query, context, history = [] } = await request.json();

    // Validar que la consulta no esté vacía
      if (!query || 'string' !== typeof query || 0 === query.trim().length) {
      return NextResponse.json(
        { 
          success: false,
          error: 'La consulta no puede estar vacía' 
        },
        { status: 400 }
      );
    }

    // Limitar longitud de consulta
      if (1000 < query.length) {
      return NextResponse.json(
        { 
          success: false,
          error: 'La consulta es demasiado larga. Máximo 1000 caracteres.' 
        },
        { status: 400 }
      );
    }

    console.log(`💬 Procesando mensaje del chat: "${query.substring(0, 50)}..."`);

    const systemPrompts = {
      "climate-resilience-assistant": `Eres un asistente virtual conversacional para DIR-Soacha (Dashboard Integrado de Resiliencia).
Tu rol es ayudar a líderes comunitarios y residentes de El Danubio y La María en Soacha, Colombia.

DATOS CLAVE DE SOACHA:
- 71% de incidencia de inundaciones en la zona
- 62% no conoce protocolos de evacuación
- 81% sin ahorros para emergencias
- Temporadas críticas: Marzo-Junio, Octubre-Noviembre
- Ríos principales: Río Bogotá, Quebrada Tibanica
- Población vulnerable: ~7,000 habitantes (El Danubio: 3,640, La María: 3,360)
- Factores de riesgo: alcantarillado artesanal, alta impermeabilización del suelo

CAPACIDADES:
- Explicar niveles de alerta (Alto/Medio/Bajo) y su significado
- Guiar en protocolos de evacuación paso a paso
- Informar sobre riesgos de inundación por zona
- Explicar cómo reportar emergencias (números, aplicaciones)
- Responder sobre el sistema AVCA/CRMC de Cruz Roja
- Recomendar medidas preventivas y de preparación
- Brindar información sobre recursos comunitarios disponibles

ESTILO DE RESPUESTA:
- Conversacional, empático y cercano
- Claro y conciso (2-4 párrafos máximo)
- Lenguaje sencillo, evita tecnicismos innecesarios
- Prioriza seguridad y acción inmediata en emergencias
- Proporciona pasos concretos y accionables
- Pregunta si necesita más detalles o aclaraciones
- Mantén el contexto de la conversación

IMPORTANTE:
- Si te preguntan sobre ubicaciones específicas, relaciona con datos de El Danubio o La María
- En emergencias, da prioridad a números de contacto: Cruz Roja (132), Bomberos (119), Policía (123)
- Si no sabes algo, admítelo y sugiere contactar autoridades locales`,
      
      "general": "Eres un asistente virtual conversacional útil y empático. Mantén el contexto de la conversación y responde de forma natural."
    };

    const systemContent = systemPrompts[context] || systemPrompts.general;

    // Construir mensajes con historial
    const messages = [
      {
        role: "system",
        content: systemContent
      },
      ...history.slice(-8), // Últimos 8 mensajes para contexto
      {
        role: "user",
        content: query
      }
    ];

    const ollama = createOllamaClient();
    
    const response = await ollama.chat({
      model: OLLAMA_CONFIG.cloudModel,
      messages: messages,
      stream: false,
      options: {
        temperature: OLLAMA_CONFIG.temperature.creative,
        num_predict: 300, // Respuestas conversacionales más largas
      }
    });

    return NextResponse.json({
      success: true,
      response: response.message.content,
      query: query,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error procesando mensaje del chat:', error);
    
    // Mensajes de error amigables
    let errorMessage = 'Error procesando tu mensaje';
    
    if (error.message?.includes('ECONNREFUSED')) {
      errorMessage = 'No se pudo conectar con el servicio de IA. Verifica la configuración de Ollama.';
    } else if (error.message?.includes('API key')) {
      errorMessage = 'Configuración de API incorrecta. Contacta al administrador.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for testing
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/ollama/chat-bot',
    method: 'POST',
    description: 'Procesa mensajes conversacionales con historial y contexto',
    parameters: {
      query: 'string (requerido) - Mensaje del usuario',
      context: 'string (opcional) - Contexto de la conversación (default: climate-resilience-assistant)',
      history: 'array (opcional) - Historial de mensajes [{role, content}]'
    },
    example: {
      query: '¿Cuál es el riesgo de inundación?',
      context: 'climate-resilience-assistant',
      history: [
        { role: 'user', content: 'Hola' },
        { role: 'assistant', content: '¡Hola! ¿En qué puedo ayudarte?' }
      ]
    }
  });
}
