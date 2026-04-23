import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/api/apiClient';
import type { ApiResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Lock, CheckCircle } from 'lucide-react';

interface Profile {
  email: string;
  fullName: string;
  role: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Name edit
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameMsg, setNameMsg] = useState('');

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    apiClient.get<ApiResponse<Profile>>('/auth/profile')
      .then(r => { if (r.data.data) setProfile(r.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveName = async (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setNameSaving(true);
    setNameMsg('');
    try {
      await apiClient.put('/auth/profile', { fullName: newName.trim() });
      setProfile(p => p ? { ...p, fullName: newName.trim() } : p);
      setEditingName(false);
      setNameMsg('Name updated. Re-login to see it reflected in the navbar.');
    } catch {
      setNameMsg('Failed to update name.');
    } finally {
      setNameSaving(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwMsg('');
    if (newPassword !== confirmPassword) { setPwError('Passwords do not match.'); return; }
    if (newPassword.length < 6) { setPwError('Password must be at least 6 characters.'); return; }
    setPwSaving(true);
    try {
      await apiClient.post('/auth/change-password', { currentPassword, newPassword });
      setPwMsg('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwError(err?.response?.data?.message || 'Failed to change password.');
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );

  if (!profile) return (
    <div className="text-center py-20 text-muted-foreground">Could not load profile.</div>
  );

  const initials = profile.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || profile.email[0].toUpperCase();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {/* Identity card */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 pb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
            {initials}
          </div>
          <div>
            <p className="text-lg font-semibold">{profile.fullName || '—'}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <Badge variant={profile.role === 'Admin' ? 'destructive' : 'secondary'} className="mt-1">
              {profile.role}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Edit display name */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" /> Display Name
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!editingName ? (
            <div className="flex items-center justify-between">
              <p className="text-sm">{profile.fullName || <span className="text-muted-foreground italic">Not set</span>}</p>
              <Button size="sm" variant="outline" onClick={() => { setEditingName(true); setNewName(profile.fullName); setNameMsg(''); }}>
                Edit
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSaveName} className="space-y-3">
              <Input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Your display name"
                required
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={nameSaving}>
                  {nameSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setEditingName(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
          {nameMsg && (
            <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-success" /> {nameMsg}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="h-4 w-4" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Current Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
                className="mt-1"
              />
            </div>
            {pwError && <p className="text-xs text-destructive">{pwError}</p>}
            {pwMsg && (
              <p className="text-xs text-success flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> {pwMsg}
              </p>
            )}
            <Button type="submit" size="sm" disabled={pwSaving}>
              {pwSaving ? 'Changing...' : 'Change Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">Sign out of your account on this device.</p>
          <Button variant="destructive" size="sm" onClick={logout}>Sign Out</Button>
        </CardContent>
      </Card>
    </div>
  );
}
