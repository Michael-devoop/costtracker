export const dynamic = 'force-dynamic';

import { getCategoriesByProject, getProjectById } from '@/lib/db';
import CategoriesView from '@/components/categories/CategoriesView';
import { notFound } from 'next/navigation';

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const categories = await getCategoriesByProject(id);

  return <CategoriesView project={project} categories={categories} />;
}
