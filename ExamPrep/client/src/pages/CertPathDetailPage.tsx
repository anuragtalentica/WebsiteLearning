import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import type { ApiResponse, CertPathDetail, CourseProgress } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, FlaskConical, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function CertPathDetailPage() {
  const { pathId } = useParams<{ pathId: string }>();
  const { isAuthenticated } = useAuth();
  const [path, setPath] = useState<CertPathDetail | null>(null);
  const [courseProgress, setCourseProgress] = useState<Record<number, CourseProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pathId) return;
    apiClient.get<ApiResponse<CertPathDetail>>(`/certpaths/${pathId}`)
      .then(r => { if (r.data.data) setPath(r.data.data); })
      .finally(() => setLoading(false));
  }, [pathId]);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiClient.get<ApiResponse<CourseProgress[]>>('/progress/courses')
      .then(r => {
        if (r.data.data) {
          const map: Record<number, CourseProgress> = {};
          r.data.data.forEach(p => { map[p.certificationId] = p; });
          setCourseProgress(map);
        }
      });
  }, [isAuthenticated]);

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (!path) return <div className="text-center py-20 text-muted-foreground">Path not found</div>;

  const completedCourses = path.courses.filter(c => (courseProgress[c.certificationId]?.percentComplete ?? 0) === 100).length;
  const pathPct = path.courses.length > 0 ? Math.round(completedCourses / path.courses.length * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link to="/paths" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> All Paths
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: path.badgeColor || undefined }}>{path.title}</h1>
        <p className="text-muted-foreground mb-2">{path.description}</p>
        {path.goal && <Badge variant="outline" className="mb-4">{path.goal}</Badge>}

        {/* Path progress (logged-in users) */}
        {isAuthenticated && path.courses.length > 0 && (
          <div className="mt-3 max-w-sm">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Path Progress</span>
              <span>{completedCourses}/{path.courses.length} courses complete</span>
            </div>
            <Progress value={pathPct} className="h-2" />
          </div>
        )}
      </div>

      {/* Courses */}
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-primary" />Courses ({path.courses.length})
      </h2>
      <div className="space-y-3 mb-10">
        {path.courses.map((course, i) => {
          const prog = courseProgress[course.certificationId];
          const pct = prog?.percentComplete ?? 0;
          const done = pct === 100;
          return (
            <Card key={course.id} className="overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                <div className={`flex items-center justify-center h-10 w-10 rounded-full font-bold text-sm shrink-0 ${done ? 'bg-success/20 text-success' : 'bg-primary/10 text-primary'}`}>
                  {done ? <CheckCircle className="h-5 w-5" /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{course.certificationCode} - {course.certificationName}</h3>
                  {course.description && <p className="text-sm text-muted-foreground truncate">{course.description}</p>}
                  {isAuthenticated && prog && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <Progress value={pct} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground shrink-0">{pct}%</span>
                    </div>
                  )}
                </div>
                <Link to={`/courses/${course.certificationId}`}>
                  <Button variant="ghost" size="sm" className="gap-1 shrink-0">View <ArrowRight className="h-3 w-3" /></Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tests */}
      {path.tests.length > 0 && (
        <>
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <FlaskConical className="h-5 w-5 text-primary" />Tests ({path.tests.length})
          </h2>
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
