import { NextResponse } from 'next/server';
import { getCostsByProject, createCostEntry } from '@/lib/db';
import { generateId } from '@/lib/utils';
import { validateCostEntry } from '@/lib/validators';
import type { CostEntry } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }
    const costs = await getCostsByProject(projectId);
    return NextResponse.json(costs);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch costs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateCostEntry(body);

    if (!validation.valid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }

    const now = new Date().toISOString();
    const entry: CostEntry = {
      id: generateId(),
      projectId: body.projectId,
      categoryId: body.categoryId,
      vendorId: body.vendorId || undefined,
      description: body.description.trim(),
      amount: Number(body.amount),
      entryDate: body.entryDate,
      paymentStatus: body.paymentStatus || 'pending',
      entryType: body.entryType || 'expense',
      createdBy: 'user-001', // Hardcoded for MVP
      createdAt: now,
      updatedAt: now,
    };

    const created = await createCostEntry(entry);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create cost entry' }, { status: 500 });
  }
}
