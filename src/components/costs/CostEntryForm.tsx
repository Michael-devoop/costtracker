'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import type { BudgetCategory, Vendor } from '@/types';

interface CostEntryFormProps {
  projectId: string;
  categories: BudgetCategory[];
  vendors: Vendor[];
  onSubmit: (data: {
    description: string;
    amount: number;
    categoryId: string;
    vendorId?: string;
    entryDate: string;
    paymentStatus: string;
    entryType: string;
  }) => Promise<void>;
  onCancel: () => void;
  initialData?: {
    description?: string;
    amount?: number;
    categoryId?: string;
    vendorId?: string;
    entryDate?: string;
    paymentStatus?: string;
    entryType?: string;
  };
}

export default function CostEntryForm({
  categories,
  vendors,
  onSubmit,
  onCancel,
  initialData,
}: CostEntryFormProps) {
  const [description, setDescription] = useState(initialData?.description || '');
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [vendorId, setVendorId] = useState(initialData?.vendorId || '');
  const [entryDate, setEntryDate] = useState(
    initialData?.entryDate || new Date().toISOString().split('T')[0]
  );
  const [paymentStatus, setPaymentStatus] = useState(initialData?.paymentStatus || 'pending');
  const [entryType, setEntryType] = useState(initialData?.entryType || 'expense');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!description.trim()) errs.description = 'Description is required';
    if (!amount || parseFloat(amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!categoryId) errs.categoryId = 'Select a category';
    if (!entryDate) errs.entryDate = 'Select a date';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit({
        description: description.trim(),
        amount: parseFloat(amount),
        categoryId,
        vendorId: vendorId || undefined,
        entryDate,
        paymentStatus,
        entryType,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Description */}
      <div>
        <label className="input-label" htmlFor="cost-description">Description</label>
        <input
          id="cost-description"
          type="text"
          className="input-field"
          placeholder="e.g., Concrete pouring — foundation slab"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
      </div>

      {/* Amount + Date row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="input-label" htmlFor="cost-amount">Amount (ETB)</label>
          <input
            id="cost-amount"
            type="number"
            className="input-field"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount}</p>}
        </div>
        <div>
          <label className="input-label" htmlFor="cost-date">Date</label>
          <input
            id="cost-date"
            type="date"
            className="input-field"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
          />
          {errors.entryDate && <p className="text-xs text-red-400 mt-1">{errors.entryDate}</p>}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="input-label" htmlFor="cost-category">Category</label>
        <select
          id="cost-category"
          className="input-field"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select category...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              [{cat.code}] {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="text-xs text-red-400 mt-1">{errors.categoryId}</p>}
      </div>

      {/* Vendor */}
      <div>
        <label className="input-label" htmlFor="cost-vendor">Vendor (optional)</label>
        <select
          id="cost-vendor"
          className="input-field"
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
        >
          <option value="">No vendor</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} — {v.trade}
            </option>
          ))}
        </select>
      </div>

      {/* Type + Status */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="input-label" htmlFor="cost-type">Type</label>
          <select
            id="cost-type"
            className="input-field"
            value={entryType}
            onChange={(e) => setEntryType(e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="credit">Credit</option>
            <option value="adjustment">Adjustment</option>
          </select>
        </div>
        <div>
          <label className="input-label" htmlFor="cost-status">Payment Status</label>
          <select
            id="cost-status"
            className="input-field"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border-subtle)]">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Update Entry' : 'Add Entry'}
        </Button>
      </div>
    </form>
  );
}
