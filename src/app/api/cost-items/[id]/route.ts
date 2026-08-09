import { NextResponse } from 'next/server';
import { updateCostItem, deleteCostItem } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateCostItem(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Cost item not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update cost item' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteCostItem(id);
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete cost item' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete cost item' }, { status: 500 });
  }
}
