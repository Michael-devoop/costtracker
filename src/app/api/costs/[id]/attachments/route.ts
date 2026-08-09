// Attachments upload route — placeholder for Phase 2
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Attachments not implemented in MVP' }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({ message: 'File upload not implemented in MVP' }, { status: 501 });
}
