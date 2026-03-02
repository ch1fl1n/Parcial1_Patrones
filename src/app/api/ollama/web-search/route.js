/**
 * API Route: Web Search
 * POST /api/ollama/web-search
 * Performs web search using Ollama's search API
 */

import { NextResponse } from 'next/server';
import { performWebSearch } from '@/lib/ollama-service';

export async function POST(request) {
  try {
    const body = await request.json();
    const { query, maxResults = 5 } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    const result = await performWebSearch(query, maxResults);

    return NextResponse.json({
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
