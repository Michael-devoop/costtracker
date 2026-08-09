import { NextResponse } from 'next/server';
import { getCategoriesByProject, createCategory } from '@/lib/db';
import { generateId } from '@/lib/utils';
import { validateCategory } from '@/lib/validators';
import type { BudgetCategory } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }
    const categories = await getCategoriesByProject(projectId);
    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'private, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateCategory(body);

    if (!validation.valid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }

    const category: BudgetCategory = {
      id: generateId(),
      projectId: body.projectId,
      name: body.name.trim(),
      code: body.code.trim().toUpperCase(),
      budgetedAmount: Number(body.budgetedAmount) || 0,
      parentCategoryId: body.parentCategoryId,
      createdAt: new Date().toISOString(),
    };

    const created = await createCategory(category);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
