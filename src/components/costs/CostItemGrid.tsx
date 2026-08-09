'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import QuickAddModal from '@/components/costs/QuickAddModal';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { CostItemWithTotal, BudgetCategory } from '@/types';

interface CostItemGridProps {
  items: CostItemWithTotal[];
  categories: BudgetCategory[];
  onLogCost: (item: CostItemWithTotal, amount: number, note?: string) => Promise<void>;
  onCreateItem: (data: { name: string; nameAm?: string; categoryId: string; icon?: string; unit?: string }) => Promise<void>;
  onUpdateItem?: (id: string, data: { name: string; nameAm?: string; categoryId: string; icon?: string; unit?: string }) => Promise<void>;
  onDeleteItem?: (id: string) => Promise<void>;
}

const EMOJI_OPTIONS = ['🔩', '🧱', '⏳', '🔧', '🪵', '👷', '🚛', '⚡', '🎨', '📦', '🦺', '🔨', '📏'];

export default function CostItemGrid({
  items,
  categories,
  onLogCost,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
}: CostItemGridProps) {
  const { locale, t } = useLanguage();
  const [selectedItem, setSelectedItem] = useState<CostItemWithTotal | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CostItemWithTotal | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [nameAm, setNameAm] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [icon, setIcon] = useState('🔩');
  const [unit, setUnit] = useState('');
  const [saving, setSaving] = useState(false);

  const openCreateModal = () => {
    setEditingItem(null);
    setName('');
    setNameAm('');
    setCategoryId(categories.length > 0 ? categories[0].id : '');
    setIcon('🔩');
    setUnit('');
    setShowCreateModal(true);
  };

  const openEditModal = (item: CostItemWithTotal, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setName(item.name);
    setNameAm(item.nameAm || '');
    setCategoryId(item.categoryId);
    setIcon(item.icon || '🔩');
    setUnit(item.unit || '');
    setShowCreateModal(true);
  };

  const handleDeleteItem = async (item: CostItemWithTotal, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete cost item "${item.name}"?`)) {
      if (onDeleteItem) {
        await onDeleteItem(item.id);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;

    setSaving(true);
    try {
      if (editingItem && onUpdateItem) {
        await onUpdateItem(editingItem.id, {
          name: name.trim(),
          nameAm: nameAm.trim() || undefined,
          categoryId,
          icon,
          unit: unit.trim() || undefined,
        });
      } else {
        await onCreateItem({
          name: name.trim(),
          nameAm: nameAm.trim() || undefined,
          categoryId,
          icon,
          unit: unit.trim() || undefined,
        });
      }
      setShowCreateModal(false);
      setEditingItem(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            {t('costItems.title')}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {t('costItems.subtitle')}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={openCreateModal}
          className="text-xs flex items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t('costItems.addNew')}
        </Button>
      </div>

      {/* Grid of cost item cards */}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#282c37] p-8 text-center bg-[#14161b]/50">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d4fc34]/10 text-[#d4fc34] mb-3 text-2xl">
            ⚡
          </div>
          <h3 className="text-sm font-bold text-white mb-1">
            {t('costItems.noItems') || 'No Cost Items Yet'}
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
            Create reusable cost items (like Cement, Rebar, Labor) to log project expenses with 1-click.
          </p>
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            + {t('costItems.addNew')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {items.map((item) => {
            const displayName = locale === 'am' && item.nameAm ? item.nameAm : item.name;
            const secondaryName = locale === 'am' ? item.name : item.nameAm;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="cost-item-card group relative"
              >
                {/* Action controls on top right */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={(e) => openEditModal(item, e)}
                    className="p-1 rounded-md bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-white transition-colors"
                    title="Edit Item"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  {onDeleteItem && (
                    <button
                      onClick={(e) => handleDeleteItem(item, e)}
                      className="p-1 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      title="Delete Item"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl p-1 rounded-lg bg-[var(--bg-elevated)]/50 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-[10px] font-medium text-[var(--text-muted)] bg-[var(--bg-elevated)] px-1.5 py-0.5 rounded">
                    {item.entryCount} {t('costItems.times')}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--text-accent)] transition-colors pr-6">
                    {displayName}
                  </h3>
                  {secondaryName && (
                    <p className="text-[11px] text-[var(--text-muted)] truncate">{secondaryName}</p>
                  )}
                  <p className="text-xs font-semibold text-[var(--text-accent)] mt-2">
                    {formatCurrency(item.totalSpent)}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                  <span>+ {t('costs.quickAdd')}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-0.5 transition-transform">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for fast amount entry on card click */}
      <QuickAddModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onSubmit={async (amount, note) => {
          if (selectedItem) {
            await onLogCost(selectedItem, amount, note);
          }
        }}
      />

      {/* Modal for creating / editing a cost item template */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Cost Item' : t('costItems.addNew')}
        size="md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label" htmlFor="item-name-en">
                {t('costItems.itemName')} (English)
              </label>
              <input
                id="item-name-en"
                type="text"
                className="input-field"
                placeholder="e.g. Nails"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="input-label" htmlFor="item-name-am">
                {t('costItems.itemName')} (አማርኛ)
              </label>
              <input
                id="item-name-am"
                type="text"
                className="input-field"
                placeholder="ምሳሌ፦ ችንካር"
                value={nameAm}
                onChange={(e) => setNameAm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="input-label" htmlFor="item-category">
              {t('costs.category')}
            </label>
            <select
              id="item-category"
              className="input-field"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">{t('costs.selectCategory')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  [{cat.code}] {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">{t('costItems.selectIcon')}</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setIcon(e)}
                  className={`h-9 w-9 text-xl rounded-lg flex items-center justify-center transition-all ${
                    icon === e ? 'bg-indigo-500/30 border border-indigo-500 scale-110' : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
            <Button type="button" variant="ghost" onClick={() => {
              setShowCreateModal(false);
              setEditingItem(null);
            }}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
