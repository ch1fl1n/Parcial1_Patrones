/**
 * API Route: Predict Risk Patterns
 * POST /api/ollama/predict
 */

import { NextResponse } from 'next/server';
import { predictRiskPatterns } from '@/lib/ollama-service';

export async function POST(request) {
  try {
    const body = await request.json();
    const prediction = await predictRiskPatterns(body);

    return NextResponse.json({
      success: true,
      prediction,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
