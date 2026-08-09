'use client';

import { useState } from 'react';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { ChangeOrder, Project } from '@/types';

interface ChangeOrdersViewProps {
  project: Project;
  changeOrders: ChangeOrder[];
}

export default function ChangeOrdersView({ project, changeOrders: initialOrders }: ChangeOrdersViewProps) {
  const { t, tStatus } = useLanguage();
  const [orders, setOrders] = useState<ChangeOrder[]>(initialOrders);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const openCreateModal = () => {
    setDescription('');
    setAmount('');
    setStatus('pending');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/change-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          description: description.trim(),
          amount: parseFloat(amount) || 0,
          status,
          requestedDate: new Date().toISOString().split('T')[0],
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setOrders((prev) => [created, ...prev]);
      }
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    const res = await fetch(`/api/change-orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this change order?')) return;
    const res = await fetch(`/api/change-orders/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  const statusColors: Record<string, string> = {
    approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {t('changeOrders.title')}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {project.name} · {orders.length} {t('changeOrders.title').toLowerCase()}
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t('common.add')} {t('changeOrders.title')}
        </Button>
      </div>

      <Card hover={false} padding="none" className="overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('costs.date')}</th>
              <th>{t('costs.description')}</th>
              <th className="text-right">{t('costs.amount')}</th>
              <th>{t('projects.status')}</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="text-[var(--text-muted)]">{formatDate(order.requestedDate)}</td>
                <td className="font-medium text-[var(--text-primary)]">{order.description}</td>
                <td className="text-right font-semibold text-[var(--text-primary)]">{formatCurrency(order.amount)}</td>
                <td>
                  <span className={cn('status-badge', statusColors[order.status] || '')}>
                    <span className="status-dot" />
                    {tStatus(order.status)}
                  </span>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'approved')}
                          className="rounded px-2 py-1 text-xs font-semibold bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'rejected')}
                          className="rounded px-2 py-1 text-xs font-semibold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(order.id)}
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
        {orders.length === 0 && (
          <div className="empty-state">
            <p className="empty-state-title">{t('changeOrders.noOrders')}</p>
            <p className="empty-state-desc">{t('changeOrders.noOrdersDesc')}</p>
          </div>
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Change Order"
        size="md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="input-label">{t('costs.description')}</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Additional basement waterproofing"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="input-label">{t('costs.amount')} (ETB)</label>
            <input
              type="number"
              className="input-field"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
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
