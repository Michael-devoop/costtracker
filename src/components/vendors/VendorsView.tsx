'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { Vendor } from '@/types';

interface VendorsViewProps {
  vendors: Vendor[];
}

export default function VendorsView({ vendors: initialVendors }: VendorsViewProps) {
  const { t } = useLanguage();
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [trade, setTrade] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const openCreateModal = () => {
    setEditingVendor(null);
    setName('');
    setTrade('');
    setContactName('');
    setPhone('');
    setEmail('');
    setShowModal(true);
  };

  const openEditModal = (v: Vendor) => {
    setEditingVendor(v);
    setName(v.name);
    setTrade(v.trade);
    setContactName(v.contactName || '');
    setPhone(v.phone || '');
    setEmail(v.email || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !trade.trim()) return;

    setLoading(true);
    try {
      if (editingVendor) {
        // Edit
        const res = await fetch(`/api/vendors/${editingVendor.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            trade: trade.trim(),
            contactName: contactName.trim(),
            phone: phone.trim(),
            email: email.trim() || undefined,
          }),
        });
        if (res.ok) {
          const updated = await res.json();
          setVendors((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
        }
      } else {
        // Create
        const res = await fetch('/api/vendors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            trade: trade.trim(),
            contactName: contactName.trim(),
            phone: phone.trim(),
            email: email.trim() || undefined,
          }),
        });
        if (res.ok) {
          const created = await res.json();
          setVendors((prev) => [created, ...prev]);
        }
      }
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;
    const res = await fetch(`/api/vendors/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setVendors((prev) => prev.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {t('vendors.title')}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {vendors.length} {t('vendors.subtitle')}
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t('common.add')} {t('costs.vendor')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {vendors.map((vendor) => (
          <Card key={vendor.id} padding="md" className="relative group">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-accent)" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {vendor.name}
                  </h3>
                  <span className="inline-flex mt-1 rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 text-xs text-[var(--text-accent)] font-medium">
                    {vendor.trade}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(vendor)}
                  className="rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
                  title="Edit"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(vendor.id)}
                  className="rounded-md p-1.5 text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-1.5">
              {vendor.contactName && (
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  {vendor.contactName}
                </div>
              )}
              {vendor.phone && (
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  {vendor.phone}
                </div>
              )}
              {vendor.email && (
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {vendor.email}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingVendor ? 'Edit Vendor' : 'Add Vendor / Subcontractor'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="input-label">Company / Vendor Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., National Cement PLC"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="input-label">Trade / Specialty</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Concrete & Cement, Electrical, Plumbing"
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Contact Person</label>
              <input
                type="text"
                className="input-field"
                placeholder="Name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>
            <div>
              <label className="input-label">Phone Number</label>
              <input
                type="text"
                className="input-field"
                placeholder="+251 91 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="input-label">{t('auth.email')}</label>
            <input
              type="email"
              className="input-field"
              placeholder="vendor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
