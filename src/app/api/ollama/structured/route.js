/**
 * API Route: Structured JSON via schema
 * POST /api/ollama/structured
 */

import { NextResponse } from 'next/server';
import { analyzeStructuredOutput } from '@/lib/ollama-service';

export async function POST(request) {
  try {
    const body = await request.json();

    const payload = {
      location: body.location || 'El Danubio',
      threats: body.threats || ['Inundaciones', 'Obstrucción de alcantarillas'],
      indicators: body.indicators || {
        noEvac: 62,
        noSavings: 81,
        foodInsec: 27
      }
    };

    const result = await analyzeStructuredOutput(payload);

    return NextResponse.json({ success: true, result, timestamp: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
