import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const body = await req.json();
  const filePath = path.join(process.cwd(), 'public', 'products.json');
  fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
  return NextResponse.json({ ok: true });
}
