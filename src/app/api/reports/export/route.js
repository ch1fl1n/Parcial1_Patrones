/* eslint-disable no-undef */
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function toCSV(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const esc = (v) => {
    const s = String(v ?? '');
    if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const headerLine = headers.map(esc).join(',');
  const lines = rows.map((r) => headers.map((h) => esc(r[h])).join(','));
  return [headerLine, ...lines].join('\r\n');
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const format = (url.searchParams.get('format') || 'csv').toLowerCase();
    const limit = Math.min(1000, Math.max(1, parseInt(url.searchParams.get('limit') || '200', 10)));

    const csvPath = path.join(process.cwd(), 'public', 'data', 'BASE DE DATOS LISTA.csv');
    const raw = await fs.promises.readFile(csvPath, 'utf8');
    const text = raw.replace(/^\uFEFF/, '');
    const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
    const headers = headerLine.split(',');
    const rows = lines.slice(0, limit).map((line) => {
      // naive split; adequate for simple export
      const cols = line.split(',');
      const obj = {};
      headers.forEach((h, i) => { obj[h.trim()] = (cols[i] ?? '').trim(); });
      return obj;
    });

    if (format === 'json') {
      return NextResponse.json({ success: true, data: rows, count: rows.length, timestamp: Date.now() });
    }

    const csvOut = toCSV(rows);
    return new Response(csvOut, {
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'cache-control': 'no-store',
        'content-disposition': 'attachment; filename="reports-export.csv"'
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
