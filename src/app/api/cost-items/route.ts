import { NextResponse } from 'next/server';
import { getCostItemsByProject, createCostItem } from '@/lib/db';
import { generateId } from '@/lib/utils';
import type { CostItem } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }
    const items = await getCostItemsByProject(projectId);
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch cost items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.projectId || !body.name || !body.categoryId) {
      return NextResponse.json({ error: 'projectId, name, and categoryId are required' }, { status: 400 });
    }

    const item: CostItem = {
      id: generateId(),
      projectId: body.projectId,
      name: body.name.trim(),
      nameAm: body.nameAm?.trim() || undefined,
      categoryId: body.categoryId,
      vendorId: body.vendorId || undefined,
      icon: body.icon || '📦',
      unit: body.unit || undefined,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };

    const created = await createCostItem(item);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create cost item' }, { status: 500 });
  }
}
