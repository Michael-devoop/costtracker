'use client';

import { useState } from 'react';
import { use } from 'react';
import { useCosts } from '@/hooks/useCosts';
import { useCostItems } from '@/hooks/useCostItems';
import { useLanguage } from '@/contexts/LanguageContext';
import CostItemGrid from '@/components/costs/CostItemGrid';
import CostEntryForm from '@/components/costs/CostEntryForm';
import CostEntryTable from '@/components/costs/CostEntryTable';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import type { CostItemWithTotal, CostEntry } from '@/types';

export default function CostsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = use(params);
  const { costs, categories, vendors, loading, createCost, updateCost, deleteCost } = useCosts(projectId);
  const { items, loading: itemsLoading, createItem, updateItem, deleteItem } = useCostItems(projectId);
  const { t } = useLanguage();

  const [showForm, setShowForm] = useState(false);
  const [editingCost, setEditingCost] = useState<CostEntry | null>(null);
  const [activeTab, setActiveTab] = useState<'quick' | 'all'>('quick');

  const openCreateModal = () => {
    setEditingCost(null);
    setShowForm(true);
  };

  const openEditModal = (cost: CostEntry) => {
    setEditingCost(cost);
    setShowForm(true);
  };

  const handleQuickLog = async (item: CostItemWithTotal, amount: number, note?: string) => {
    const description = note ? `${item.name}${item.nameAm ? ` (${item.nameAm})` : ''} - ${note}` : `${item.name}${item.nameAm ? ` (${item.nameAm})` : ''}`;
    await createCost({
      description,
      amount,
      categoryId: item.categoryId,
      vendorId: item.vendorId,
      entryDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'paid',
      entryType: 'expense',
    });
  };

  const handleSubmitCustom = async (data: {
    description: string;
    amount: number;
    categoryId: string;
    vendorId?: string;
    entryDate: string;
    paymentStatus: string;
    entryType: string;
  }) => {
    if (editingCost) {
      await updateCost(editingCost.id, data);
    } else {
      await createCost(data);
    }
    setShowForm(false);
    setEditingCost(null);
  };

  const handleDelete = async (costId: string) => {
    if (confirm(t('costs.deleteConfirm'))) {
      await deleteCost(costId);
    }
  };

  if (loading || itemsLoading) {
    return (
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-[var(--text-muted)]">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" opacity="0.25" />
              <path d="M4 12a8 8 0 018-8" opacity="0.75" />
            </svg>
            {t('common.loading')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {t('costs.title')}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            {costs.length} {t('costs.entriesLogged')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" onClick={openCreateModal} size="md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t('costs.addEntry')}
          </Button>
        </div>
      </div>

      {/* Tabs: Quick Add Grid vs Detailed Entry List */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2">
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'quick'
              ? 'bg-[var(--accent-primary)]/15 text-[var(--text-accent)] border border-[var(--border-focus)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
          }`}
        >
          ⚡ {t('costs.quickAdd')} ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'all'
              ? 'bg-[var(--accent-primary)]/15 text-[var(--text-accent)] border border-[var(--border-focus)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
          }`}
        >
          📋 {t('costs.title')} ({costs.length})
        </button>
      </div>

      {/* Quick Add Section */}
      {activeTab === 'quick' && (
        <div className="space-y-6">
          <CostItemGrid
            items={items}
            categories={categories}
            onLogCost={handleQuickLog}
            onCreateItem={async (data) => {
              await createItem(data);
            }}
            onUpdateItem={async (id, data) => {
              await updateItem(id, data);
            }}
            onDeleteItem={async (id) => {
              await deleteItem(id);
            }}
          />

          {/* Mini Table of Recent Costs */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              {t('costs.recentCosts')}
            </h3>
            <Card hover={false} padding="none" className="overflow-hidden">
              <CostEntryTable
                entries={costs.slice(0, 5)}
                categories={categories}
                vendors={vendors}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            </Card>
          </div>
        </div>
      )}

      {/* Full Cost Table Section */}
      {activeTab === 'all' && (
        <Card hover={false} padding="none" className="overflow-hidden">
          <CostEntryTable
            entries={costs}
            categories={categories}
            vendors={vendors}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </Card>
      )}

      {/* Custom Cost Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingCost(null);
        }}
        title={editingCost ? t('costs.updateEntry') : t('costs.addEntry')}
        size="lg"
      >
        <CostEntryForm
          projectId={projectId}
          categories={categories}
          vendors={vendors}
          initialData={editingCost || undefined}
          onSubmit={handleSubmitCustom}
          onCancel={() => {
            setShowForm(false);
            setEditingCost(null);
          }}
        />
      </Modal>
    </div>
  );
}
