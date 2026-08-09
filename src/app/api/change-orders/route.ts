import { NextResponse } from 'next/server';
import { getChangeOrdersByProject, createChangeOrder } from '@/lib/db';
import { generateId } from '@/lib/utils';
import type { ChangeOrder } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }
    const orders = await getChangeOrdersByProject(projectId);
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch change orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();
    const order: ChangeOrder = {
      id: generateId(),
      projectId: body.projectId,
      description: body.description?.trim() || '',
      amount: Number(body.amount) || 0,
      status: 'pending',
      requestedDate: body.requestedDate || now.split('T')[0],
      createdBy: 'user-001',
      createdAt: now,
    };
    const created = await createChangeOrder(order);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create change order' }, { status: 500 });
  }
}
