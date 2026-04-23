import { useState, type FormEvent } from 'react';
import { Mail, Phone, FileText, MessageSquare, User, CheckCircle, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import apiClient from '@/api/apiClient';
import type { ApiResponse } from '@/types';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiClient.post<ApiResponse<boolean>>('/contact', form);
      setSent(true);
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Have a question or feedback? We'd love to hear from you!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info cards */}
        <div className="space-y-4">
          {[
            {
              icon: Mail,
              title: 'Email',
              value: 'support@examprep.dev',
              sub: 'We reply within 24 hours',
            },
            {
              icon: Clock,
              title: 'Support Hours',
              value: 'Mon – Fri, 9am – 6pm',
              sub: 'India Standard Time (IST)',
            },
            {
              icon: MapPin,
              title: 'Based in',
              value: 'India',
              sub: 'Serving learners worldwide',
            },
          ].map(({ icon: Icon, title, value, sub }) => (
            <Card key={title}>
              <CardContent className="p-5 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-sm text-muted-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Send us a Message
              </CardTitle>
              <p className="text-sm text-muted-foreground">Fill out the form below and we'll get back to you shortly</p>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Message Sent!</h3>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      Thanks for reaching out. We'll get back to you at <strong>{form.email}</strong> within 24 hours.
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        Name <span className="text-destructive">*</span>
                      </label>
                      <Input value={form.name} onChange={set('name')} placeholder="Enter your full name" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        Email <span className="text-destructive">*</span>
                      </label>
                      <Input type="email" value={form.email} onChange={set('email')} placeholder="your.email@example.com" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        Phone <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                      </label>
                      <Input value={form.phone} onChange={set('phone')} placeholder="Enter your phone number" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        Subject <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                      </label>
                      <Input value={form.subject} onChange={set('subject')} placeholder="Brief subject of your message" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                      Message <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      value={form.message}
                      onChange={set('message')}
                      placeholder="Tell us what's on your mind..."
                      required
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full gap-2" size="lg">
                    <Mail className="h-4 w-4" />
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
