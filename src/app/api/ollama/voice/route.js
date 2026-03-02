import {NextResponse} from 'next/server';
import {processVoiceQuery} from '@/lib/ollama-service';

/**
 * Voice Assistant API Endpoint
 * Processes voice queries and returns conversational AI responses
 * 
 * POST /api/ollama/voice
 * Body: { query: string, context?: string }
 */
export async function POST(request) {
  try {
    const { query, context } = await request.json();

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
      if (500 < query.length) {
      return NextResponse.json(
        { 
          success: false,
          error: 'La consulta es demasiado larga. Máximo 500 caracteres.' 
        },
        { status: 400 }
      );
    }

    console.log(`🎤 Procesando consulta de voz: "${query.substring(0, 50)}..."`);

    // Procesar consulta con Ollama
    const response = await processVoiceQuery(query, context || "climate-resilience-assistant");

    return NextResponse.json({
      success: true,
      response: response,
      query: query,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error procesando consulta de voz:', error);
    
    // Mensajes de error amigables
    let errorMessage = 'Error procesando tu consulta';
    
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
    endpoint: '/api/ollama/voice',
    method: 'POST',
    description: 'Procesa consultas de voz y retorna respuestas conversacionales',
    parameters: {
      query: 'string (requerido) - Consulta transcrita del usuario',
      context: 'string (opcional) - Contexto de la conversación (default: climate-resilience-assistant)'
    },
    example: {
      query: '¿Cuál es el riesgo de inundación en El Danubio?',
      context: 'climate-resilience-assistant'
    }
  });
}
