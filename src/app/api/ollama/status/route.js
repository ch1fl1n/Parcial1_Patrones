/**
 * API Route: Ollama Status
 * GET /api/ollama/status
 * Returns whether Ollama is configured and reachable
 */

import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/ollama-service';
import { isOllamaConfigured } from '@/lib/ollama-config';

export async function GET() {
  try {
    const configured = isOllamaConfigured();

    if (!configured) {
      return NextResponse.json({
        success: false,
        configured: false,
        message: 'Ollama API key not configured. Set OLLAMA_API_KEY in .env'
      });
    }

    const result = await testConnection();

    return NextResponse.json({
      configured: true,
      ...result
    });
  } catch (error) {
    return NextResponse.json({ success: false, configured: isOllamaConfigured(), error: error.message }, { status: 500 });
  }
}
