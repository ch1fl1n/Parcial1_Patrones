/**
 * API Route: Emergency Response Recommendations with Ollama
 * POST /api/ollama/emergency
 */

import { NextResponse } from 'next/server';
import { generateEmergencyResponse } from '@/lib/ollama-service';

export async function POST(request) {
  try {
    const incident = await request.json();
    
    // Validate required fields
    if (!incident.type || !incident.location || !incident.severity) {
      return NextResponse.json(
        { error: 'Datos del incidente incompletos' },
        { status: 400 }
      );
    }

    const recommendations = await generateEmergencyResponse(incident);
    
    return NextResponse.json({
      success: true,
      recommendations,
      incident: {
        type: incident.type,
        location: incident.location,
        severity: incident.severity,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generando recomendaciones de emergencia:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al generar recomendaciones',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
