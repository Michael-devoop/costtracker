import { NextResponse } from 'next/server';
import { getProjectSummary, getCostsByProject, getCategoriesByProject, getVendors, getChangeOrdersByProject } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  try {
    const [summary, allCosts, categories, vendors, changeOrders] = await Promise.all([
      getProjectSummary(id),
      getCostsByProject(id),
      getCategoriesByProject(id),
      getVendors(),
      getChangeOrdersByProject(id),
    ]);

    if (!summary) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Filter costs by date range if provided
    let costs = allCosts;
    if (from || to) {
      costs = allCosts.filter((cost) => {
        const entryDate = cost.entryDate;
        if (from && entryDate < from) return false;
        if (to && entryDate > to) return false;
        return true;
      });
    }

    // Compute period totals
    const periodTotalSpent = costs.reduce((sum, c) => sum + (c.entryType === 'credit' ? -c.amount : c.amount), 0);
    const periodPendingTotal = costs.filter((c) => c.paymentStatus === 'pending').reduce((sum, c) => sum + c.amount, 0);
    const periodPaidTotal = costs.filter((c) => c.paymentStatus === 'paid').reduce((sum, c) => sum + c.amount, 0);

    return NextResponse.json({
      summary,
      costs,
      categories,
      vendors,
      changeOrders,
      periodStats: {
        from: from || '',
        to: to || '',
        totalSpent: periodTotalSpent,
        pendingTotal: periodPendingTotal,
        paidTotal: periodPaidTotal,
        entryCount: costs.length,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to generate report data' }, { status: 500 });
  }
}
