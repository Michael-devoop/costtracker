import { NextResponse } from 'next/server';
import { updateChangeOrder, deleteChangeOrder } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateChangeOrder(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Change order not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update change order' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteChangeOrder(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Change order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete change order' }, { status: 500 });
  }
}
