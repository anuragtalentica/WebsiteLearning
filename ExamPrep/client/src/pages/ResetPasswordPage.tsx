import { useState, type FormEvent } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import type { ApiResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.post<ApiResponse<string>>('/auth/reset-password', { email, token, newPassword });
      if (res.data.success) navigate('/login');
      else setError(res.data.message || 'Reset failed');
    } catch { setError('An error occurred'); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center"><CardTitle className="text-2xl">Reset Password</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">{error}</div>}
            <div className="space-y-2"><label className="text-sm font-medium">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Reset Token</label>
              <Input value={token} onChange={e => setToken(e.target.value)} required /></div>
            <div className="space-y-2"><label className="text-sm font-medium">New Password</label>
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required /></div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Resetting...' : 'Reset Password'}</Button>
            <div className="text-center text-sm text-muted-foreground"><Link to="/login" className="text-primary hover:underline">Back to login</Link></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
