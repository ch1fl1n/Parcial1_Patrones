/**
 * API Route: Flood Risk Assessment with Ollama
 * POST /api/ollama/flood-risk
 */

import { NextResponse } from 'next/server';
import { assessFloodRisk } from '@/lib/ollama-service';

export async function POST(request) {
  try {
    const location = await request.json();
    
    // Validate required fields
    if (!location.name || !location.coordinates) {
      return NextResponse.json(
        { error: 'Datos de ubicación incompletos' },
        { status: 400 }
      );
    }

    const assessment = await assessFloodRisk(location);
    
    return NextResponse.json({
      success: true,
      assessment,
      location: location.name,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error en evaluación de riesgo:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al evaluar el riesgo de inundación',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
