import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File;
    const name = form.get('name') as string;

    if (!file || !name) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(process.cwd(), 'public', 'images', name);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ ok: true, path: `/images/${name}` });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
