import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import type { ApiResponse, ForgotPasswordResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.post<ApiResponse<ForgotPasswordResponse>>('/auth/forgot-password', { email });
      if (res.data.success) {
        setSent(true);
      } else {
        setError(res.data.message || 'Failed to send reset email');
      }
    } catch { setError('An error occurred. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email address and we'll send you a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4">
              <div className="rounded-md bg-success/10 border border-success/20 p-4 text-sm text-success">
                <p className="font-medium mb-1">Check your email</p>
                <p className="text-muted-foreground text-xs">If an account exists for <strong>{email}</strong>, a password reset link has been sent. Check your inbox (and spam folder).</p>
              </div>
              <Link to="/login" className="text-sm text-primary hover:underline">Back to login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">{error}</div>}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full">{loading ? 'Sending...' : 'Send Reset Link'}</Button>
              <div className="text-center text-sm text-muted-foreground">
                <Link to="/login" className="text-primary hover:underline">Back to login</Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
