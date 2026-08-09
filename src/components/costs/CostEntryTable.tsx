'use client';

import { formatCurrency, formatDate, formatStatus, cn } from '@/lib/utils';
import type { CostEntry, BudgetCategory, Vendor } from '@/types';

interface CostEntryTableProps {
  entries: CostEntry[];
  categories: BudgetCategory[];
  vendors: Vendor[];
  onEdit?: (entry: CostEntry) => void;
  onDelete?: (id: string) => void;
}

export default function CostEntryTable({
  entries,
  categories,
  vendors,
  onEdit,
  onDelete,
}: CostEntryTableProps) {
  const getCategoryName = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : 'Unknown';
  };

  const getVendorName = (id?: string) => {
    if (!id) return '—';
    const vendor = vendors.find((v) => v.id === id);
    return vendor ? vendor.name : '—';
  };

  const statusColors: Record<string, string> = {
    paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    overdue: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="18" rx="2" />
          <path d="M2 8h20M8 3v18" />
        </svg>
        <p className="empty-state-title">No cost entries yet</p>
        <p className="empty-state-desc">Start logging expenses to track your project budget.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Vendor</th>
            <th className="text-right">Amount</th>
            <th>Status</th>
            {(onEdit || onDelete) && <th className="text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="whitespace-nowrap text-[var(--text-muted)]">
                {formatDate(entry.entryDate)}
              </td>
              <td className="text-[var(--text-primary)] font-medium max-w-[250px] truncate">
                {entry.description}
              </td>
              <td>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--bg-elevated)] px-2 py-1 text-xs font-medium text-[var(--text-secondary)]">
                  {getCategoryName(entry.categoryId)}
                </span>
              </td>
              <td className="text-[var(--text-muted)]">
                {getVendorName(entry.vendorId)}
              </td>
              <td className="text-right whitespace-nowrap font-semibold">
                <span className={entry.entryType === 'credit' ? 'text-emerald-400' : 'text-[var(--text-primary)]'}>
                  {entry.entryType === 'credit' ? '-' : ''}
                  {formatCurrency(entry.amount)}
                </span>
              </td>
              <td>
                <span className={cn('status-badge', statusColors[entry.paymentStatus] || '')}>
                  <span className="status-dot" />
                  {formatStatus(entry.paymentStatus)}
                </span>
              </td>
              {(onEdit || onDelete) && (
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(entry)}
                        className="rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
                        title="Edit"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(entry.id)}
                        className="rounded-md p-1.5 text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
