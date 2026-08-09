import { NextResponse } from 'next/server';
import { getProjectSummary } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const summary = await getProjectSummary(id);
    if (!summary) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(summary);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch project summary' }, { status: 500 });
  }
}
