import { NextResponse } from 'next/server';
import { getProjects, createProject } from '@/lib/db';
import { generateId } from '@/lib/utils';
import { validateProject } from '@/lib/validators';
import type { Project } from '@/types';

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
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
      createdBy: 'user-001', // Hardcoded for MVP
      createdAt: now,
      updatedAt: now,
    };

    const created = await createProject(project);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
