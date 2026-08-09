'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { t } = useLanguage();
  const { user, updateProfile, updatePassword, signOut } = useAuth();
  const router = useRouter();

  // Profile form state
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const role = user?.user_metadata?.role || 'viewer';

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage(null);

    const result = await updateProfile({ full_name: fullName });
    if (result.error) {
      setProfileMessage({ type: 'error', text: result.error });
    } else {
      setProfileMessage({ type: 'success', text: t('settings.profileUpdated') || 'Profile updated successfully!' });
    }
    setProfileLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: t('settings.passwordMismatch') || 'Passwords do not match' });
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: t('settings.passwordTooShort') || 'Password must be at least 6 characters' });
      setPasswordLoading(false);
      return;
    }

    const result = await updatePassword(newPassword);
    if (result.error) {
      setPasswordMessage({ type: 'error', text: result.error });
    } else {
      setPasswordMessage({ type: 'success', text: t('settings.passwordUpdated') || 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    }
    setPasswordLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('settings.title')}</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* Profile Section */}
      <Card hover={false} padding="md" className="mb-6">
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">{t('settings.profile')}</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#d4fc34]/30 to-[#a3e635]/30 text-xl font-bold text-[#d4fc34]">
            {initials}
          </div>
          <div>
            <p className="text-lg font-semibold text-[var(--text-primary)]">{displayName}</p>
            <p className="text-sm text-[var(--text-muted)]">
              {user?.email} · <span className="capitalize">{role.replace('_', ' ')}</span>
            </p>
          </div>
        </div>

        {profileMessage && (
          <div className={`mb-4 rounded-xl border px-4 py-3 text-sm backdrop-blur-sm ${
            profileMessage.type === 'success'
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          }`}>
            {profileMessage.text}
          </div>
        )}

        <form onSubmit={handleUpdateProfile}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="input-label">{t('settings.fullName')}</label>
              <input
                type="text"
                className="input-field"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label className="input-label">{t('auth.email')}</label>
              <input
                type="email"
                className="input-field opacity-60 cursor-not-allowed"
                value={user?.email || ''}
                disabled
              />
            </div>
          </div>
          <Button type="submit" variant="primary" size="sm" loading={profileLoading}>
            {t('settings.saveProfile') || 'Save Profile'}
          </Button>
        </form>
      </Card>

      {/* Change Password */}
      <Card hover={false} padding="md" className="mb-6">
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">
          {t('settings.changePassword') || 'Change Password'}
        </h3>

        {passwordMessage && (
          <div className={`mb-4 rounded-xl border px-4 py-3 text-sm backdrop-blur-sm ${
            passwordMessage.type === 'success'
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          }`}>
            {passwordMessage.text}
          </div>
        )}

        <form onSubmit={handleUpdatePassword}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="input-label">{t('settings.newPassword') || 'New Password'}</label>
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
              <label className="input-label">{t('settings.confirmPassword') || 'Confirm Password'}</label>
              <input
                type="password"
                className="input-field"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>
          <Button type="submit" variant="primary" size="sm" loading={passwordLoading}>
            {t('settings.updatePassword') || 'Update Password'}
          </Button>
        </form>
      </Card>

      {/* Preferences */}
      <Card hover={false} padding="md" className="mb-6">
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">{t('settings.preferences')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="input-label">{t('settings.currency')}</label>
            <select className="input-field" defaultValue="ETB">
              <option value="ETB">ETB (Br)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div>
            <label className="input-label">{t('settings.dateFormat')}</label>
            <select className="input-field" defaultValue="short">
              <option value="short">Jan 1, 2025</option>
              <option value="long">January 1, 2025</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card hover={false} padding="md" className="mb-6">
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">{t('settings.notifications')}</h3>
        <div className="flex flex-col gap-4">
          {[
            { label: t('settings.budgetOverrun'), desc: t('settings.budgetOverrunDesc'), checked: true },
            { label: t('settings.costUpdates'), desc: t('settings.costUpdatesDesc'), checked: true },
            { label: t('settings.changeOrderAlerts'), desc: t('settings.changeOrderAlertsDesc'), checked: false },
            { label: t('settings.weeklyReport'), desc: t('settings.weeklyReportDesc'), checked: false },
          ].map((item) => (
            <label key={item.label} className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                defaultChecked={item.checked}
                className="mt-1 rounded"
              />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--text-accent)] transition-colors">
                  {item.label}
                </p>
                <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card hover={false} padding="md" className="border-red-500/20">
        <h3 className="text-base font-semibold text-red-400 mb-2">{t('settings.dangerZone') || 'Danger Zone'}</h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          {t('settings.signOutDesc') || 'Sign out from your account on this device.'}
        </p>
        <Button variant="secondary" size="sm" onClick={handleSignOut} className="!border-red-500/30 !text-red-400 hover:!bg-red-500/10">
          {t('auth.signOut') || 'Sign Out'}
        </Button>
      </Card>
    </div>
  );
}
