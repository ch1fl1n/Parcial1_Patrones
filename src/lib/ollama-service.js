/**
 * Ollama AI Service for DIR-Soacha
 * Provides AI-powered analysis for climate resilience and risk assessment
 */

import {createOllamaClient, OLLAMA_CONFIG} from './ollama-config';
import {z} from 'zod';
import {zodToJsonSchema} from 'zod-to-json-schema';

/**
 * Process voice queries with conversational AI responses
 * @param {string} query - User's voice query
 * @param {string} context - Conversation context
 * @returns {Promise<string>} Natural language response
 */
export async function processVoiceQuery(query, context = "general") {
  const ollama = createOllamaClient();
  
  const systemPrompts = {
    "climate-resilience-assistant": `Eres un asistente virtual de voz para DIR-Soacha (Dashboard Integrado de Resiliencia).
Tu rol es ayudar a líderes comunitarios y residentes de El Danubio y La María en Soacha, Colombia.

DATOS CLAVE:
- 71% de incidencia de inundaciones en la zona
- 62% no conoce protocolos de evacuación
- 81% sin ahorros para emergencias
- Temporadas críticas: Marzo-Junio, Octubre-Noviembre
- Ríos: Río Bogotá, Quebrada Tibanica

CAPACIDADES:
- Explicar niveles de alerta (Alto/Medio/Bajo)
- Guiar en protocolos de evacuación
- Informar sobre riesgos de inundación
- Explicar cómo reportar emergencias
- Responder sobre el sistema AVCA/CRMC

ESTILO DE RESPUESTA:
- Claro, conciso (máximo 3-4 oraciones)
- Lenguaje sencillo, sin tecnicismos innecesarios
- Prioriza seguridad y acción inmediata
- Amigable y empático
- Respuestas óptimas para lectura por voz (TTS)`,
    
    "general": "Eres un asistente virtual útil y empático. Responde de forma clara y concisa."
  };

  const systemContent = systemPrompts[context] || systemPrompts.general;

  const response = await ollama.chat({
    model: OLLAMA_CONFIG.cloudModel,
    messages: [
      {
        role: "system",
        content: systemContent
      },
      {
        role: "user",
        content: query
      }
    ],
    stream: false,
    options: {
      temperature: OLLAMA_CONFIG.temperature.creative,
      num_predict: 200, // Limitar respuestas para voz
    }
  });

  return response.message.content;
}

/**
 * Analyze vulnerability data and generate insights
 * @param {Object} data - Vulnerability data from AVCA/CRMC
 * @returns {Promise<string>} Analysis results
 */
export async function analyzeVulnerability(data) {
  const ollama = createOllamaClient();
  
  const prompt = `Analiza los siguientes datos de vulnerabilidad de las comunidades El Danubio y La María en Soacha, Colombia:

Datos CRMC:
- ${data.noEvacuationProtocol}% de la población no conoce protocolos de evacuación
- ${data.noEmergencySavings}% de hogares sin ahorros para emergencias
- ${data.foodInsecurity}% de hogares con inseguridad alimentaria
- ${data.leadershipTrust}% de confianza en líderes comunitarios

Amenazas principales: ${data.threats.join(', ')}

Por favor, proporciona:
1. Análisis de las vulnerabilidades más críticas
2. Recomendaciones prioritarias para fortalecer la resiliencia
3. Estrategias de mitigación específicas`;

  const response = await ollama.chat({
    model: OLLAMA_CONFIG.cloudModel,
    messages: [
      {
        role: "system",
        content: "Eres un experto en gestión de riesgos climáticos y resiliencia comunitaria urbana, especializado en metodologías AVCA y CRMC de la Cruz Roja."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    stream: false,
    options: {
      temperature: OLLAMA_CONFIG.temperature.analysis,
    }
  });

  return response.message.content;
}

/**
 * Generate flood risk assessment based on geographic and community data
 * @param {Object} location - Location data with coordinates and characteristics
 * @returns {Promise<string>} Risk assessment
 */
export async function assessFloodRisk(location) {
  const ollama = createOllamaClient();
  
  const prompt = `Evalúa el riesgo de inundación para la siguiente ubicación en Soacha:

Ubicación: ${location.name}
Coordenadas: ${location.coordinates}
Características:
- Proximidad a ${location.waterBodies.join(', ')}
- Tipo de alcantarillado: ${location.sewerageType}
- Nivel de impermeabilización del suelo: ${location.soilImpermeability}
- Población afectada estimada: ${location.population} habitantes
- Temporada: ${location.season}

Basándote en los patrones de inundación identificados (71.07% de incidencia, picos en marzo-junio y octubre-noviembre), proporciona:
1. Evaluación del nivel de riesgo (Alto/Medio/Bajo)
2. Factores agravantes específicos
3. Medidas preventivas recomendadas`;

  const response = await ollama.chat({
    model: OLLAMA_CONFIG.cloudModel,
    messages: [
      {
        role: "system",
        content: "Eres un especialista en hidrología urbana y gestión de riesgos de inundación en asentamientos informales."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    stream: false,
    options: {
      temperature: OLLAMA_CONFIG.temperature.analysis,
    }
  });

  return response.message.content;
}

/**
 * Generate emergency response recommendations
 * @param {Object} incident - Incident details
 * @returns {Promise<string>} Response recommendations
 */
export async function generateEmergencyResponse(incident) {
  const ollama = createOllamaClient();
  
  const prompt = `Genera recomendaciones de respuesta inmediata para el siguiente incidente:

Tipo de incidente: ${incident.type}
Ubicación: ${incident.location}
Severidad: ${incident.severity}
Población afectada: ${incident.affectedPopulation}
Recursos disponibles: ${incident.availableResources.join(', ')}
Capacidades locales: ${incident.localCapacities.join(', ')}

Proporciona:
1. Acciones inmediatas prioritarias
2. Protocolo de evacuación recomendado
3. Coordinación con recursos locales
4. Comunicación con la comunidad`;

  const response = await ollama.chat({
    model: OLLAMA_CONFIG.cloudModel,
    messages: [
      {
        role: "system",
        content: "Eres un coordinador de emergencias de la Cruz Roja especializado en respuesta a desastres climáticos en contextos urbanos vulnerables."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    stream: false,
    options: {
      temperature: OLLAMA_CONFIG.temperature.recommendations,
    }
  });

  return response.message.content;
}

/**
 * Analyze seasonal patterns and predict risk periods
 * @param {Object} historicalData - Historical climate and incident data
 * @returns {Promise<string>} Predictive analysis
 */
export async function predictRiskPatterns(historicalData) {
  const ollama = createOllamaClient();
  
  const prompt = `Analiza los siguientes patrones históricos de riesgo climático en Soacha:

Datos históricos:
- Precipitación mensual: ${JSON.stringify(historicalData.precipitation)}
- Incidentes de inundación por mes: ${JSON.stringify(historicalData.floodIncidents)}
- Fenómenos climáticos (La Niña): ${historicalData.climateEvents.join(', ')}

Mes actual: ${historicalData.currentMonth}

Proporciona:
1. Predicción de riesgo para los próximos 3 meses
2. Períodos críticos identificados
3. Recomendaciones de preparación preventiva
4. Indicadores clave a monitorear`;

  const response = await ollama.chat({
    model: OLLAMA_CONFIG.cloudModel,
    messages: [
      {
        role: "system",
        content: "Eres un analista de patrones climáticos especializado en resiliencia urbana y predicción de riesgos hidrometeorológicos."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    stream: false,
    options: {
      temperature: OLLAMA_CONFIG.temperature.analysis,
    }
  });

  return response.message.content;
}

/**
 * Generate structured JSON using a provided Zod schema
 * Returns a validated object matching the schema
 * Best practices: temperature=0, schema in prompt, comprehensive validation
 * @param {Object} input - domain-specific inputs to ground the prompt
 * @returns {Promise<any>} Parsed and validated JSON object
 */
export async function analyzeStructuredOutput(input) {
  const ollama = createOllamaClient();

  // Enhanced schema with more granular risk assessment
  const RiskAssessment = z.object({
    location: z.string().describe('Nombre de la comunidad o barrio'),
    riskLevel: z.enum(['Alto', 'Medio', 'Bajo']).describe('Nivel general de riesgo'),
    confidence: z.number().min(0).max(1).describe('Nivel de confianza del análisis (0-1)'),
    
    // Detailed risk breakdown by category
    riskCategories: z.object({
      flood: z.enum(['Alto', 'Medio', 'Bajo', 'N/A']).describe('Riesgo de inundación'),
      infrastructure: z.enum(['Alto', 'Medio', 'Bajo', 'N/A']).describe('Riesgo de infraestructura'),
      socialVulnerability: z.enum(['Alto', 'Medio', 'Bajo', 'N/A']).describe('Vulnerabilidad social'),
      economicResilience: z.enum(['Alto', 'Medio', 'Bajo', 'N/A']).describe('Resiliencia económica')
    }).describe('Desglose de riesgo por categoría'),
    
    keyFactors: z.array(z.string()).min(1).max(8).describe('Factores críticos identificados'),
    
    // Prioritized recommendations with timeline
    recommendations: z.array(
      z.object({
        action: z.string().describe('Acción recomendada'),
        priority: z.enum(['Urgente', 'Alta', 'Media', 'Baja']).describe('Nivel de prioridad'),
        timeline: z.enum(['Inmediato', '1-3 meses', '3-6 meses', '6-12 meses']).describe('Plazo de implementación'),
        estimatedImpact: z.enum(['Alto', 'Medio', 'Bajo']).describe('Impacto estimado')
      })
    ).min(1).max(6).describe('Recomendaciones priorizadas'),
    
    // Population impact estimates
    affectedPopulation: z.object({
      total: z.number().int().positive().describe('Población total en riesgo'),
      highRisk: z.number().int().nonnegative().describe('Personas en riesgo alto'),
      vulnerable: z.number().int().nonnegative().describe('Personas vulnerables (niños, ancianos, etc.)')
    }).optional().describe('Estimación de población afectada'),
    
    // Metadata
    analysisDate: z.string().describe('Fecha del análisis (ISO 8601)'),
    dataSource: z.string().describe('Fuente de datos utilizada')
  });

  const jsonSchema = zodToJsonSchema(RiskAssessment, 'RiskAssessment');

  // Include schema in prompt for better grounding
  const system = `Eres un analista experto en gestión del riesgo climático y resiliencia comunitaria urbana.
Tu tarea es generar evaluaciones de riesgo estructuradas, precisas y accionables.

Responde EXCLUSIVAMENTE en JSON válido que cumpla exactamente con el siguiente esquema:

${JSON.stringify(jsonSchema, null, 2)}

IMPORTANTE:
- No incluyas texto fuera del JSON
- Asegúrate de que todos los campos requeridos estén presentes
- Usa datos contextuales para fundamentar tus análisis
- Proporciona recomendaciones específicas y priorizadas`;

  const user = `Genera un análisis estructurado de riesgo para la comunidad "${input.location}" en Soacha, Colombia.

**DATOS DE ENTRADA:**
- Ubicación: ${input.location}
- Amenazas principales: ${input.threats?.join(', ') || 'inundaciones, infraestructura inadecuada'}
- Indicadores sociales:
  ${JSON.stringify(input.indicators || { noEvac: 62, noSavings: 81, foodInsec: 27 }, null, 2)}

**CONTEXTO ADICIONAL:**
- Zona: Soacha, municipio metropolitano de Bogotá
- Cuencas: Río Bogotá, Quebrada Tibanica
- Infraestructura: Mayormente artesanal, alcantarillado deficiente
- Población: Comunidades vulnerables en asentamientos informales

**REQUISITOS DEL ANÁLISIS:**
1. Evalúa el riesgo general (Alto/Medio/Bajo) con nivel de confianza
2. Desglosa riesgos por categoría: inundación, infraestructura, social, económica
3. Identifica 3-8 factores críticos específicos
4. Proporciona 3-6 recomendaciones priorizadas con timeline y impacto estimado
5. Estima población afectada si hay datos suficientes
6. Incluye fecha de análisis: ${new Date().toISOString()}
7. Fuente de datos: "AVCA/CRMC Cruz Roja Colombiana - ${input.location}"

Genera el JSON estructurado ahora:`;

  const response = await ollama.chat({
    model: OLLAMA_CONFIG.cloudModel,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    stream: false,
    format: jsonSchema,
    options: { 
      temperature: 0,  // Deterministic output for structured data
      num_ctx: 8192    // Sufficient context for schema + data
    }
  });

  // Parse and validate with detailed error handling
  const raw = response.message?.content || '{}';
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Respuesta no es JSON válido: ${error.message}`);
  }

  // Validate against Zod schema
  try {
    return RiskAssessment.parse(parsed);
  } catch (error) {
    throw new Error(`JSON no cumple con el esquema: ${error.message}`);
  }
}

/**
 * Generate community report with insights
 * @param {Object} reportData - Data for community report
 * @returns {AsyncGenerator<string>} Streaming response
 */
export async function* generateCommunityReport(reportData) {
  const ollama = createOllamaClient();
  
  const prompt = `Genera un reporte comunitario para ${reportData.community}:

Período: ${reportData.period}
Población: ${reportData.population} habitantes

Incidentes reportados: ${reportData.incidents.length}
Tipos: ${reportData.incidentTypes.join(', ')}

Acciones realizadas: ${reportData.actions.length}
Participación comunitaria: ${reportData.participation}%

Genera un reporte narrativo que incluya:
1. Resumen ejecutivo de la situación
2. Análisis de tendencias
3. Logros y avances en resiliencia
4. Áreas de mejora identificadas
5. Recomendaciones para el próximo período`;

  const response = await ollama.chat({
    model: OLLAMA_CONFIG.cloudModel,
    messages: [
      {
        role: "system",
        content: "Eres un comunicador social especializado en reportes comunitarios para organizaciones humanitarias."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    stream: true,
    options: {
      temperature: OLLAMA_CONFIG.temperature.recommendations,
    }
  });

  for await (const part of response) {
    yield part.message.content;
  }
}

/**
 * Perform a web search using Ollama's search API
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum results (default 5, max 10)
 * @returns {Promise<Object>} Search results
 */
export async function performWebSearch(query, maxResults = 5) {
  const ollama = createOllamaClient();
  
  try {
    const results = await ollama.webSearch({ 
      query, 
      max_results: Math.min(maxResults, 10) 
    });
    return { success: true, results: results.results || [] };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      results: [] 
    };
  }
}

/**
 * Fetch content from a web page
 * @param {string} url - URL to fetch
 * @returns {Promise<Object>} Page content
 */
export async function fetchWebPage(url) {
  const ollama = createOllamaClient();
  
  try {
    const result = await ollama.webFetch({ url });
    return { 
      success: true, 
      title: result.title,
      content: result.content,
      links: result.links || []
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
}

/**
 * Climate Research Agent: Uses web search to augment responses
 * Searches for latest climate data and synthesizes with local context
 * @param {Object} researchQuery - Query with location and topic
 * @returns {Promise<string>} Research synthesis
 */
export async function conductClimateResearch(researchQuery) {
  const ollama = createOllamaClient();
  
  const { location, topic, localContext } = researchQuery;
  
  // Step 1: Search for relevant information
  const searchQuery = `${topic} ${location} Colombia clima cambio climático 2025`;
  const searchResults = await performWebSearch(searchQuery, 3);

    if (!searchResults.success || 0 === searchResults.results.length) {
    throw new Error('No se encontraron resultados de búsqueda');
  }
  
  // Step 2: Format search results for context
  const searchContext = searchResults.results
    .map((r, i) => `[${i + 1}] ${r.title}\n${r.url}\n${r.content}\n`)
    .join('\n');
  
  // Step 3: Synthesize with AI using local context
  const prompt = `Eres un investigador de resiliencia climática. Analiza la siguiente información actualizada de la web y sintetízala con el contexto local.

CONTEXTO LOCAL (${location}):
${localContext || 'Comunidades vulnerables a inundaciones, con infraestructura artesanal'}

INFORMACIÓN ACTUAL DE LA WEB:
${searchContext}

TEMA DE INVESTIGACIÓN: ${topic}

Por favor proporciona:
1. Síntesis de la información encontrada
2. Relevancia para el contexto local de ${location}
3. Recomendaciones basadas en las mejores prácticas encontradas
4. Referencias a las fuentes consultadas`;

  const response = await ollama.chat({
    model: OLLAMA_CONFIG.cloudModel,
    messages: [
      {
        role: 'system',
        content: 'Eres un investigador especializado en cambio climático y resiliencia urbana. Sintetizas información web con contexto local.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    stream: false,
    options: {
      temperature: OLLAMA_CONFIG.temperature.recommendations,
      num_ctx: 32000 // Increased context for web search results
    }
  });
  
  return {
    synthesis: response.message.content,
    sources: searchResults.results.map(r => ({ title: r.title, url: r.url }))
  };
}

/**
 * Test connection to Ollama cloud service
 * @returns {Promise<Object>} Connection status
 */
export async function testConnection() {
  try {
    const ollama = createOllamaClient();
    
    const response = await ollama.chat({
      model: OLLAMA_CONFIG.cloudModel,
      messages: [
        {
          role: "user",
          content: "Responde solo con 'OK' si estás funcionando correctamente."
        }
      ],
      stream: false,
    });

    return {
      success: true,
      model: OLLAMA_CONFIG.cloudModel,
      message: response.message.content,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
