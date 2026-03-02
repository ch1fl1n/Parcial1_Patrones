export const runtime = 'nodejs';

/**
 * Proxy to local Ollama chat API
 * Spec: POST http://localhost:11434/api/chat
 * Passes through request body and streams response when applicable.
 */
export async function POST(request) {
  const upstreamBase = (globalThis?.process?.env?.OLLAMA_LOCAL_URL) || 'http://localhost:11434';
  const url = `${upstreamBase.replace(/\/$/, '')}/api/chat`;

  let bodyJson;
  try {
    bodyJson = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyJson),
      signal: request.signal,
    });

    // If upstream returns JSON error, surface it
    if (!upstream.ok && upstream.headers.get('content-type')?.includes('application/json')) {
      const errPayload = await upstream.json().catch(() => ({}));
      return Response.json({ error: 'Upstream error', details: errPayload }, { status: upstream.status });
    }

    // Pass through status and content-type; stream body
    const headers = new Headers();
    const ct = upstream.headers.get('content-type');
      if (ct) {
          headers.set('content-type', ct);
      }
    headers.set('cache-control', 'no-store');

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (error) {
    return Response.json({ error: 'Failed to connect to local Ollama', message: error?.message }, { status: 502 });
  }
}
