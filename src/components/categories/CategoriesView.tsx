'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { BudgetCategory, Project } from '@/types';

interface CategoriesViewProps {
  project: Project;
  categories: BudgetCategory[];
}

export default function CategoriesView({ project, categories: initialCategories }: CategoriesViewProps) {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [budgetedAmount, setBudgetedAmount] = useState('');

  const totalBudgeted = categories.reduce((s, c) => s + c.budgetedAmount, 0);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setCode('');
    setBudgetedAmount('');
    setShowModal(true);
  };

  const openEditModal = (cat: BudgetCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setCode(cat.code);
    setBudgetedAmount(cat.budgetedAmount.toString());
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    setLoading(true);
    try {
      if (editingCategory) {
        // Edit
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            code: code.trim().toUpperCase(),
            budgetedAmount: parseFloat(budgetedAmount) || 0,
          }),
        });
        if (res.ok) {
          const updated = await res.json();
          setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        }
      } else {
        // Create
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: project.id,
            name: name.trim(),
            code: code.trim().toUpperCase(),
            budgetedAmount: parseFloat(budgetedAmount) || 0,
          }),
        });
        if (res.ok) {
          const created = await res.json();
          setCategories((prev) => [...prev, created]);
        }
      }
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {t('categories.title')}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {project.name} · {categories.length} {t('categories.title').toLowerCase()} · {formatCurrency(totalBudgeted)} {t('categories.totalBudgeted')}
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t('common.add')} {t('costs.category')}
        </Button>
      </div>

      <Card hover={false} padding="none" className="overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('categories.code')}</th>
              <th>{t('categories.name')}</th>
              <th className="text-right">{t('categories.budgeted')}</th>
              <th className="text-right">{t('categories.pctTotal')}</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const pctOfTotal = totalBudgeted > 0 ? ((cat.budgetedAmount / totalBudgeted) * 100).toFixed(1) : '0';
              return (
                <tr key={cat.id}>
                  <td>
                    <span className="inline-flex items-center rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 text-xs font-mono font-semibold text-[var(--text-accent)]">
                      {cat.code}
                    </span>
                  </td>
                  <td className="font-medium text-[var(--text-primary)]">{cat.name}</td>
                  <td className="text-right font-semibold text-[var(--text-primary)]">
                    {formatCurrency(cat.budgetedAmount)}
                  </td>
                  <td className="text-right text-[var(--text-muted)]">{pctOfTotal}%</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
                        title="Edit"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
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
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="font-semibold text-[var(--text-primary)] border-t border-[var(--border-subtle)]">
                {t('common.total')}
              </td>
              <td className="text-right font-bold text-[var(--text-primary)] border-t border-[var(--border-subtle)]">
                {formatCurrency(totalBudgeted)}
              </td>
              <td className="text-right text-[var(--text-muted)] border-t border-[var(--border-subtle)]">
                100%
              </td>
              <td className="border-t border-[var(--border-subtle)]" />
            </tr>
          </tfoot>
        </table>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCategory ? 'Edit Category' : 'Add Budget Category'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="input-label">{t('categories.name')}</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Concrete & Cement"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">{t('categories.code')}</label>
              <input
                type="text"
                className="input-field uppercase font-mono"
                placeholder="e.g., CMAT"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="input-label">{t('categories.budgeted')} (ETB)</label>
              <input
                type="number"
                className="input-field"
                placeholder="0"
                value={budgetedAmount}
                onChange={(e) => setBudgetedAmount(e.target.value)}
              />
            </div>
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
