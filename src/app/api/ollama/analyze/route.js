/**
 * API Route: Vulnerability Analysis with Ollama
 * POST /api/ollama/analyze
 */

import { NextResponse } from 'next/server';
import { analyzeVulnerability } from '@/lib/ollama-service';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.noEvacuationProtocol || !data.noEmergencySavings) {
      return NextResponse.json(
        { error: 'Datos de vulnerabilidad incompletos' },
        { status: 400 }
      );
    }

    const analysis = await analyzeVulnerability(data);
    
    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error en análisis de vulnerabilidad:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al procesar el análisis',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
