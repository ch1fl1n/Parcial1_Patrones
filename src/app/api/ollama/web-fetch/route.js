/**
 * API Route: Web Fetch
 * POST /api/ollama/web-fetch
 * Fetches content from a specific URL
 */

import { NextResponse } from 'next/server';
import { fetchWebPage } from '@/lib/ollama-service';

export async function POST(request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    const result = await fetchWebPage(url);

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
