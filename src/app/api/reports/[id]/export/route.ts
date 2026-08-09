import { NextResponse } from 'next/server';
import { getProjectSummary, getCostsByProject, getCategoriesByProject, getVendors, getChangeOrdersByProject } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const [summary, costs, categories, vendors, changeOrders] = await Promise.all([
      getProjectSummary(id),
      getCostsByProject(id),
      getCategoriesByProject(id),
      getVendors(),
      getChangeOrdersByProject(id),
    ]);

    if (!summary) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({
      summary,
      costs,
      categories,
      vendors,
      changeOrders,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to generate report data' }, { status: 500 });
  }
}
