'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { Project } from '@/types';

interface ProjectsViewProps {
  projects: Project[];
}

export default function ProjectsView({ projects: initialProjects }: ProjectsViewProps) {
  const { t, tStatus } = useLanguage();
  const [projectList, setProjectList] = useState<Project[]>(initialProjects);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [status, setStatus] = useState<'active' | 'planning' | 'on_hold' | 'completed' | 'cancelled'>('active');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const openCreateModal = () => {
    setEditingProject(null);
    setName('');
    setClientName('');
    setAddress('');
    setTotalBudget('');
    setStatus('active');
    setStartDate(new Date().toISOString().split('T')[0]);
    setShowModal(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setName(project.name);
    setClientName(project.clientName);
    setAddress(project.address || '');
    setTotalBudget(project.totalBudget.toString());
    setStatus(project.status);
    setStartDate(project.startDate);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !clientName.trim()) return;

    setLoading(true);
    try {
      if (editingProject) {
        // Update
        const res = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            clientName: clientName.trim(),
            address: address.trim(),
            totalBudget: parseFloat(totalBudget) || 0,
            status,
            startDate,
          }),
        });
        if (res.ok) {
          const updated = await res.json();
          setProjectList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        }
      } else {
        // Create
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            clientName: clientName.trim(),
            address: address.trim(),
            totalBudget: parseFloat(totalBudget) || 0,
            status,
            startDate,
          }),
        });
        if (res.ok) {
          const created = await res.json();
          setProjectList((prev) => [created, ...prev]);
        }
      }
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProjectList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    planning: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    on_hold: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    completed: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {t('projects.title')}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {t('projects.subtitle')} ({projectList.length})
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t('projects.newProject')}
        </Button>
      </div>

      {/* Projects Table */}
      <div className="glass-card-static overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('projects.title')}</th>
              <th>{t('projects.client')}</th>
              <th>{t('projects.status')}</th>
              <th className="text-right">{t('projects.budget')}</th>
              <th>{t('projects.startDate')}</th>
              <th>{t('projects.location')}</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projectList.map((project) => (
              <tr key={project.id}>
                <td>
                  <Link
                    href={`/projects/${project.id}`}
                    className="font-medium text-[var(--text-primary)] hover:text-[var(--text-accent)] transition-colors"
                  >
                    {project.name}
                  </Link>
                </td>
                <td>{project.clientName}</td>
                <td>
                  <span className={cn('status-badge', statusColors[project.status] || '')}>
                    <span className="status-dot" />
                    {tStatus(project.status)}
                  </span>
                </td>
                <td className="text-right font-semibold text-[var(--text-primary)]">
                  {formatCurrency(project.totalBudget)}
                </td>
                <td className="text-[var(--text-muted)]">
                  {formatDate(project.startDate)}
                </td>
                <td className="text-[var(--text-muted)] max-w-[150px] truncate">
                  {project.address}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEditModal(project)}
                      className="rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
                      title="Edit"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="rounded-md p-1.5 text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Project Modal (Create/Edit) */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProject ? 'Edit Project' : t('projects.newProject')}
        size="md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="input-label">Project Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Commercial Complex"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="input-label">{t('projects.client')}</label>
            <input
              type="text"
              className="input-field"
              placeholder="Client or Developer Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="input-label">{t('projects.location')}</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Bole Subcity, Addis Ababa"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">{t('projects.budget')} (ETB)</label>
              <input
                type="number"
                className="input-field"
                placeholder="0"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
              />
            </div>
            <div>
              <label className="input-label">{t('projects.status')}</label>
              <select
                className="input-field"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="active">{tStatus('active')}</option>
                <option value="planning">{tStatus('planning')}</option>
                <option value="on_hold">{tStatus('on_hold')}</option>
                <option value="completed">{tStatus('completed')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="input-label">{t('projects.startDate')}</label>
            <input
              type="date"
              className="input-field"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
