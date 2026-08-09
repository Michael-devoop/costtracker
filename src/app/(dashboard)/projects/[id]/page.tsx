export const dynamic = 'force-dynamic';

import { getProjectSummary } from '@/lib/db';
import ProjectDetailView from '@/components/projects/ProjectDetailView';
import { notFound } from 'next/navigation';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const summary = await getProjectSummary(id);

  if (!summary) {
    notFound();
  }

  return <ProjectDetailView summary={summary} />;
}
