export const dynamic = 'force-dynamic';

import { getProjects } from '@/lib/db';
import ProjectsView from '@/components/projects/ProjectsView';

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsView projects={projects} />;
}
