'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

interface SupabaseUser {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    full_name?: string;
    role?: string;
  };
}

export default function UsersPage() {
  const { t } = useLanguage();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<SupabaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Add user form state
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState('viewer');
  const [addLoading, setAddLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          full_name: newFullName,
          role: newRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to add user' });
      } else {
        setMessage({ type: 'success', text: t('users.addSuccess') });
        setNewEmail('');
        setNewPassword('');
        setNewFullName('');
        setNewRole('viewer');
        setShowAddForm(false);
        fetchUsers();
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(t('users.deleteConfirm'))) return;

    try {
      const res = await fetch(`/api/users?id=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: t('users.deleteSuccess') });
        fetchUsers();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to delete user' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    }
  };

  const roleLabels: Record<string, string> = {
    admin: t('role.admin'),
    project_manager: t('role.project_manager'),
    supervisor: t('role.supervisor'),
    accountant: t('role.accountant'),
    viewer: t('role.viewer'),
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/15 text-red-400 border-red-500/20';
      case 'project_manager': return 'bg-blue-500/15 text-blue-400 border-blue-500/20';
      case 'supervisor': return 'bg-amber-500/15 text-amber-400 border-amber-500/20';
      case 'accountant': return 'bg-green-500/15 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/15 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('users.title')}</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{t('users.subtitle')}</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5">
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          {t('users.addUser')}
        </Button>
      </div>

      {/* Messages */}
      {message && (
        <div className={`mb-6 rounded-xl border px-4 py-3 text-sm backdrop-blur-sm animate-fade-in ${
          message.type === 'success'
            ? 'border-green-500/30 bg-green-500/10 text-green-400'
            : 'border-red-500/30 bg-red-500/10 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Add User Form */}
      {showAddForm && (
        <Card hover={false} padding="md" className="mb-6 animate-scale-in">
          <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            {t('users.addUser')}
          </h3>
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="input-label">{t('users.fullName')}</label>
              <input
                type="text"
                className="input-field"
                placeholder="John Doe"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="input-label">{t('users.email')}</label>
              <input
                type="email"
                className="input-field"
                placeholder="user@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="input-label">{t('users.password')}</label>
              <input
                type="password"
                className="input-field"
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="input-label">{t('users.role')}</label>
              <select
                className="input-field"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="admin">{t('role.admin')}</option>
                <option value="project_manager">{t('role.project_manager')}</option>
                <option value="supervisor">{t('role.supervisor')}</option>
                <option value="accountant">{t('role.accountant')}</option>
                <option value="viewer">{t('role.viewer')}</option>
              </select>
            </div>
            <div className="md:col-span-2 flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary" size="sm" loading={addLoading}>
                {t('users.addUser')}
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={() => setShowAddForm(false)}>
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Users Table */}
      <Card hover={false} padding="none" className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--text-muted)] border-t-[#d4fc34]" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1a1d24] mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{t('users.noUsers')}</h3>
            <p className="text-sm text-[var(--text-muted)]">{t('users.noUsersDesc')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1f232d] bg-[#0d0e12]/50">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('users.fullName')}</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('users.email')}</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('users.role')}</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('users.created')}</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('users.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f232d]">
                {users.map((u) => {
                  const name = u.user_metadata?.full_name || u.email.split('@')[0];
                  const role = u.user_metadata?.role || 'viewer';
                  const initials = name
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
                  const isCurrentUser = u.id === currentUser?.id;

                  return (
                    <tr key={u.id} className="hover:bg-[#1a1d24]/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#d4fc34]/20 to-[#a3e635]/20 text-xs font-bold text-[#d4fc34] shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {name}
                              {isCurrentUser && (
                                <span className="ml-2 text-[10px] bg-[#d4fc34]/15 text-[#d4fc34] px-1.5 py-0.5 rounded-full font-semibold">YOU</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-300">{u.email}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-block rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getRoleBadgeColor(role)}`}>
                          {roleLabels[role] || role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-400">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {!isCurrentUser && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="rounded-lg p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title={t('common.delete')}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
