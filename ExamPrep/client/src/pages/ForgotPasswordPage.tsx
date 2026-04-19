import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import type { ApiResponse, ForgotPasswordResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setMessage(''); setResetToken('');
    setLoading(true);
    try {
      const res = await apiClient.post<ApiResponse<ForgotPasswordResponse>>('/auth/forgot-password', { email });
      if (res.data.success && res.data.data) {
        setMessage(res.data.data.message);
        if (res.data.data.resetToken) setResetToken(res.data.data.resetToken);
      } else {
        setError(res.data.message || 'Failed');
      }
    } catch { setError('An error occurred'); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a reset token</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">{error}</div>}
            {message && <div className="rounded-md bg-success/10 border border-success/20 p-3 text-sm text-success">{message}</div>}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Sending...' : 'Send Reset Token'}</Button>
            {resetToken && (
              <div className="rounded-md bg-info/10 border border-info/20 p-3 text-sm">
                <p className="font-medium text-info mb-1">Dev Mode - Reset Token:</p>
                <code className="text-xs break-all">{resetToken}</code>
                <Link to={`/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email)}`}
                  className="block mt-2 text-primary hover:underline text-sm">Go to Reset Password</Link>
              </div>
            )}
            <div className="text-center text-sm text-muted-foreground">
              <Link to="/login" className="text-primary hover:underline">Back to login</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
