// NextAuth route — placeholder for Phase 2
// Will implement full authentication with NextAuth.js

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Auth not implemented in MVP' }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({ message: 'Auth not implemented in MVP' }, { status: 501 });
}
