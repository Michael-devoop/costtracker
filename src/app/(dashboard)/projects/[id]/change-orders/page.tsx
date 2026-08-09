import { getChangeOrdersByProject, getProjectById } from '@/lib/db';
import ChangeOrdersView from '@/components/change-orders/ChangeOrdersView';
import { notFound } from 'next/navigation';

export default async function ChangeOrdersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const changeOrders = await getChangeOrdersByProject(id);

  return <ChangeOrdersView project={project} changeOrders={changeOrders} />;
}
