import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GraduationCap } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, fullName);
      navigate('/courses', { state: { newUser: true } });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <GraduationCap className="h-10 w-10 text-primary mx-auto mb-2" />
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Start your certification journey today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">{error}</div>}
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" required minLength={6} />
              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters and include an uppercase letter, lowercase letter, digit, and special character (e.g. <span className="font-mono">!</span>, <span className="font-mono">@</span>, <span className="font-mono">#</span>).
              </p>
            </div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Creating account...' : 'Create Account'}</Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
