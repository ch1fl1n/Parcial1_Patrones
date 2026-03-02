/**
 * API Route: Climate Research Agent
 * POST /api/ollama/research
 * Uses web search to augment climate resilience analysis
 */

import { NextResponse } from 'next/server';
import { conductClimateResearch } from '@/lib/ollama-service';

export async function POST(request) {
  try {
    const body = await request.json();
    const { location, topic, localContext } = body;

    if (!location || !topic) {
      return NextResponse.json(
        { success: false, error: 'Location and topic are required' },
        { status: 400 }
      );
    }

    const result = await conductClimateResearch({
      location,
      topic,
      localContext
    });

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
