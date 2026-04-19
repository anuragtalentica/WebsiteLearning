import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import type { ApiResponse, CertPathDetail } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, FlaskConical, ArrowRight } from 'lucide-react';

export default function CertPathDetailPage() {
  const { pathId } = useParams<{ pathId: string }>();
  const [path, setPath] = useState<CertPathDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pathId) return;
    apiClient.get<ApiResponse<CertPathDetail>>(`/certpaths/${pathId}`)
      .then(r => { if (r.data.data) setPath(r.data.data); })
      .finally(() => setLoading(false));
  }, [pathId]);

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (!path) return <div className="text-center py-20 text-muted-foreground">Path not found</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link to="/paths" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> All Paths
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: path.badgeColor || undefined }}>{path.title}</h1>
        <p className="text-muted-foreground mb-2">{path.description}</p>
        {path.goal && <Badge variant="outline">{path.goal}</Badge>}
      </div>

      {/* Courses */}
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><BookOpen className="h-5 w-5 text-primary" />Courses ({path.courses.length})</h2>
      <div className="space-y-3 mb-10">
        {path.courses.map((course, i) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{course.certificationCode} - {course.certificationName}</h3>
                {course.description && <p className="text-sm text-muted-foreground">{course.description}</p>}
              </div>
              <Link to={`/courses/${course.certificationId}`}>
                <Button variant="ghost" size="sm" className="gap-1">View <ArrowRight className="h-3 w-3" /></Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Tests */}
      {path.tests.length > 0 && (
        <>
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><FlaskConical className="h-5 w-5 text-primary" />Tests ({path.tests.length})</h2>
          <div className="space-y-3">
            {path.tests.map(test => (
              <Card key={test.id}>
                <div className="flex items-center justify-between p-4">
                  <h3 className="font-medium">{test.mockTestTitle}</h3>
                  <Link to={`/tests/${test.mockTestId}`}>
                    <Button size="sm">Take Test</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
