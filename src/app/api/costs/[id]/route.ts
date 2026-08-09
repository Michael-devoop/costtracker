import { NextResponse } from 'next/server';
import { getCostById, updateCostEntry, deleteCostEntry } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const entry = await getCostById(id);
    if (!entry) {
      return NextResponse.json({ error: 'Cost entry not found' }, { status: 404 });
    }
    return NextResponse.json(entry);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch cost entry' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateCostEntry(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Cost entry not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update cost entry' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteCostEntry(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Cost entry not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete cost entry' }, { status: 500 });
  }
}
