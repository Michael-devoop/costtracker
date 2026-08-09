import { NextResponse } from 'next/server';
import { getProjects, createProject, createCategoriesBatch } from '@/lib/db';
import { generateId } from '@/lib/utils';
import { validateProject } from '@/lib/validators';
import type { Project } from '@/types';

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects, {
      headers: {
        'Cache-Control': 'private, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateProject(body);

    if (!validation.valid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }

    const now = new Date().toISOString();
    const project: Project = {
      id: generateId(),
      name: body.name.trim(),
      clientName: body.clientName.trim(),
      address: body.address?.trim() || '',
      startDate: body.startDate || now.split('T')[0],
      endDate: body.endDate || '',
      status: body.status || 'planning',
      totalBudget: Number(body.totalBudget) || 0,
      createdBy: 'user-001',
      createdAt: now,
      updatedAt: now,
    };

    const created = await createProject(project);

    // Auto-seed default budget categories in a SINGLE batch insert (was 4 sequential inserts)
    const defaultCategories = [
      { name: 'Substructure & Foundation', code: '100', budgetedAmount: project.totalBudget * 0.3 },
      { name: 'Superstructure & Framing', code: '200', budgetedAmount: project.totalBudget * 0.35 },
      { name: 'Finishing & Masonry', code: '300', budgetedAmount: project.totalBudget * 0.2 },
      { name: 'MEP (Electrical & Plumbing)', code: '400', budgetedAmount: project.totalBudget * 0.15 },
    ];

    await createCategoriesBatch(
      defaultCategories.map((cat) => ({
        id: generateId(),
        projectId: created.id,
        name: cat.name,
        code: cat.code,
        budgetedAmount: Math.round(cat.budgetedAmount),
        createdAt: now,
      }))
    );

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
