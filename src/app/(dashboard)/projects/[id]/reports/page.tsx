import { getProjectSummary } from '@/lib/db';
import ReportsView from '@/components/reports/ReportsView';
import { notFound } from 'next/navigation';

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const summary = await getProjectSummary(id);
  if (!summary) notFound();

  return <ReportsView summary={summary} projectId={id} />;
}
