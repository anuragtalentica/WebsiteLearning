import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import type { ApiResponse, CertificationDetail, Module as ModuleType, ModuleDetail } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, ChevronDown, ChevronRight, FileText, FlaskConical, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function CourseDetailPage() {
  const { certId } = useParams<{ certId: string }>();
  const { isAuthenticated } = useAuth();
  const [cert, setCert] = useState<CertificationDetail | null>(null);
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [moduleDetails, setModuleDetails] = useState<Record<number, ModuleDetail>>({});
  const [loading, setLoading] = useState(true);
  const [viewedLessonIds, setViewedLessonIds] = useState<Set<number>>(new Set());
  const [totalLessons, setTotalLessons] = useState(0);

  useEffect(() => {
    if (!certId) return;
    Promise.all([
      apiClient.get<ApiResponse<CertificationDetail>>(`/certifications/${certId}`),
      apiClient.get<ApiResponse<ModuleType[]>>(`/modules/certification/${certId}`),
    ]).then(([certRes, modRes]) => {
      if (certRes.data.data) setCert(certRes.data.data);
      if (modRes.data.data) {
        setModules(modRes.data.data);
        setTotalLessons(modRes.data.data.reduce((sum, m) => sum + m.lessonCount, 0));
      }
    }).finally(() => setLoading(false));
  }, [certId]);

  useEffect(() => {
    if (!certId || !isAuthenticated) return;
    apiClient.get<ApiResponse<number[]>>(`/progress/lessons/ids?certificationId=${certId}`)
      .then(r => { if (r.data.data) setViewedLessonIds(new Set(r.data.data)); });
  }, [certId, isAuthenticated]);

  const toggleModule = async (moduleId: number) => {
    if (expandedModule === moduleId) { setExpandedModule(null); return; }
    setExpandedModule(moduleId);
    if (!moduleDetails[moduleId]) {
      const res = await apiClient.get<ApiResponse<ModuleDetail>>(`/modules/${moduleId}`);
      if (res.data.data) setModuleDetails(prev => ({ ...prev, [moduleId]: res.data.data! }));
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (!cert) return <div className="text-center py-20 text-muted-foreground">Course not found</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <div className="flex gap-2 mb-3">
          <Badge variant="secondary">{cert.category || 'General'}</Badge>
          <Badge variant="outline">{cert.difficulty || 'All'}</Badge>
        </div>
        <h1 className="text-3xl font-bold mb-2">{cert.code} - {cert.name}</h1>
        <p className="text-muted-foreground mb-1">by {cert.vendor}</p>
        <p className="text-sm text-muted-foreground max-w-3xl">{cert.description}</p>

        {isAuthenticated && totalLessons > 0 && (
          <div className="mt-4 max-w-sm">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Course Progress</span>
              <span>{viewedLessonIds.size}/{totalLessons} lessons</span>
            </div>
            <Progress value={Math.round(viewedLessonIds.size / totalLessons * 100)} className="h-2" />
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Modules & Lessons */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><BookOpen className="h-5 w-5 text-primary" />Course Modules</h2>
          {modules.length === 0 ? (
            <p className="text-muted-foreground">No modules available yet.</p>
          ) : modules.map(mod => (
            <Card key={mod.id} className="overflow-hidden">
              <button onClick={() => toggleModule(mod.id)} className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors text-left">
                <div>
                  <h3 className="font-medium">{mod.title}</h3>
                  <p className="text-sm text-muted-foreground">{mod.lessonCount} lessons</p>
                </div>
                {expandedModule === mod.id ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
              </button>
              {expandedModule === mod.id && moduleDetails[mod.id] && (
                <div className="border-t border-border px-4 py-2 space-y-1">
                  {moduleDetails[mod.id].lessons.map(lesson => (
                    <Link key={lesson.id} to={`/lessons/${lesson.id}`}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary/50 transition-colors">
                      {viewedLessonIds.has(lesson.id)
                        ? <CheckCircle className="h-4 w-4 text-success shrink-0" />
                        : <FileText className="h-4 w-4 text-muted-foreground shrink-0" />}
                      <span className={viewedLessonIds.has(lesson.id) ? 'text-success' : ''}>{lesson.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Topics Sidebar */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><FlaskConical className="h-5 w-5 text-primary" />Practice Topics</h2>
          {cert.topics.length === 0 ? (
            <p className="text-muted-foreground text-sm">No practice topics yet.</p>
          ) : cert.topics.map(topic => (
            <Link key={topic.id} to={`/practice/${topic.id}`}>
              <Card className="hover:border-primary/30 transition-all mb-3">
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{topic.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{topic.questionCount} questions</span>
                    <Button variant="ghost" size="sm">Practice</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
