import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import type { ApiResponse, CertificationDetail } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TopicsPage() {
  const { certId } = useParams<{ certId: string }>();
  const [cert, setCert] = useState<CertificationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!certId) return;
    apiClient.get<ApiResponse<CertificationDetail>>(`/certifications/${certId}`)
      .then(r => { if (r.data.data) setCert(r.data.data); })
      .finally(() => setLoading(false));
  }, [certId]);

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (!cert) return <div className="text-center py-20 text-muted-foreground">Not found</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link to={`/courses/${certId}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to {cert.code}
      </Link>
      <h1 className="text-3xl font-bold mb-2">{cert.code} - Practice Topics</h1>
      <p className="text-muted-foreground mb-8">{cert.name} by {cert.vendor}</p>
      <div className="space-y-3">
        {cert.topics.map(topic => (
          <Link key={topic.id} to={`/practice/${topic.id}`}>
            <Card className="hover:border-primary/30 transition-all mb-3">
              <CardHeader className="p-4 flex-row items-center justify-between">
                <CardTitle className="text-base">{topic.name}</CardTitle>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{topic.questionCount} questions</span>
                  <Button size="sm">Practice</Button>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
