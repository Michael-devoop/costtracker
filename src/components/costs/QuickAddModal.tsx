'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import type { CostItemWithTotal } from '@/types';

interface QuickAddModalProps {
  item: CostItemWithTotal | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, note?: string, workerName?: string, paymentStatus?: 'paid' | 'pending') => Promise<void>;
}

// Detect if a cost item is a labor type based on name/icon
function isLaborItem(item: CostItemWithTotal): boolean {
  const laborKeywords = ['labor', 'ሰራተኛ', 'ግንበኛ', 'አናጺ', 'ኤሌክትሪሻን', 'ቧንቧ', 'ፎርማን', 'mason', 'carpenter', 'electrician', 'plumber', 'foreman', 'worker', 'ሰው ኃይል'];
  const nameLower = `${item.name} ${item.nameAm || ''}`.toLowerCase();
  return laborKeywords.some((kw) => nameLower.includes(kw.toLowerCase())) || item.icon === '👷' || item.icon === '🧑‍🔧';
}

export default function QuickAddModal({
  item,
  isOpen,
  onClose,
  onSubmit,
}: QuickAddModalProps) {
  const { locale, t } = useLanguage();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('paid');
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  const displayName = locale === 'am' && item.nameAm ? item.nameAm : item.name;
  const secondaryName = locale === 'am' ? item.name : item.nameAm;
  const isLabor = isLaborItem(item);

  const presets = isLabor ? [300, 500, 800, 1000, 1500] : [100, 500, 1000, 2500, 5000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    setLoading(true);
    try {
      await onSubmit(val, note.trim() || undefined, workerName.trim() || undefined, paymentStatus);
      setAmount('');
      setNote('');
      setWorkerName('');
      setPaymentStatus('paid');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('costs.quickAdd')} size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Selected Item Card Header */}
        <div className="flex items-center gap-3.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-elevated)]/60 p-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-2xl shadow-inner">
            {item.icon}
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              {displayName}
            </h3>
            {secondaryName && (
              <p className="text-xs text-[var(--text-muted)] font-medium">{secondaryName}</p>
            )}
            <p className="text-[11px] text-[var(--text-accent)] mt-0.5 font-semibold">
              {t('costItems.totalSpent')}: {formatCurrency(item.totalSpent)}
            </p>
          </div>
        </div>

        {/* Worker Name (shown for labor items) */}
        {isLabor && (
          <div>
            <label className="input-label text-xs" htmlFor="quick-add-worker">
              👷 {locale === 'am' ? 'የሰራተኛ ስም' : 'Worker Name'} ({locale === 'am' ? 'አማራጭ' : 'optional'})
            </label>
            <input
              id="quick-add-worker"
              type="text"
              className="input-field text-sm"
              placeholder={locale === 'am' ? 'ምሳሌ፦ አበበ ከበደ' : 'e.g., Abebe Kebede'}
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
            />
          </div>
        )}

        {/* Amount Input */}
        <div>
          <label className="input-label text-center text-sm font-semibold mb-2 block" htmlFor="quick-add-amount">
            {t('costItems.enterAmount')} (ETB)
          </label>
          <div className="relative">
            <input
              id="quick-add-amount"
              type="number"
              step="0.01"
              min="0"
              autoFocus
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field text-center text-2xl font-bold py-3 text-[var(--text-accent)] focus:ring-2 focus:ring-[var(--border-focus)]"
              required
            />
          </div>
        </div>

        {/* Quick Amount Presets */}
        <div className="flex flex-wrap gap-2 justify-center">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(preset.toString())}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--border-focus)] hover:text-[var(--text-primary)] active:scale-95 transition-all"
            >
              +{preset} ETB
            </button>
          ))}
        </div>

        {/* Payment Status Toggle (shown for labor items) */}
        {isLabor && (
          <div>
            <label className="input-label text-xs mb-2 block">
              {locale === 'am' ? 'የክፍያ ሁኔታ' : 'Payment Status'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentStatus('paid')}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  paymentStatus === 'paid'
                    ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
                    : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-focus)]'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {locale === 'am' ? 'ተከፍሏል' : 'Paid Today'}
              </button>
              <button
                type="button"
                onClick={() => setPaymentStatus('pending')}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  paymentStatus === 'pending'
                    ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-focus)]'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {locale === 'am' ? 'በሳምንቱ መጨረሻ' : 'End of Week'}
              </button>
            </div>
          </div>
        )}

        {/* Optional Note */}
        <div>
          <label className="input-label text-xs" htmlFor="quick-add-note">
            {t('costs.description')} ({locale === 'am' ? 'አማራጭ' : 'optional'})
          </label>
          <input
            id="quick-add-note"
            type="text"
            className="input-field text-sm"
            placeholder={isLabor ? (locale === 'am' ? 'ምሳሌ፦ 8 ሰዓት ሥራ' : 'e.g., 8 hours work, foundation') : 'e.g., 50 kg bag, receipt #104'}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary" loading={loading} className="flex-1 py-3 text-base font-semibold shadow-lg shadow-indigo-500/25">
            {t('common.save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
