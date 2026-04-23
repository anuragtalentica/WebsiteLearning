import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import type { ApiResponse, LessonDetail, ExternalLink as ExtLink } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Code, ExternalLink, BookOpen, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LessonNav {
  prevId?: number;
  prevTitle?: string;
  nextId?: number;
  nextTitle?: string;
}

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [nav, setNav] = useState<LessonNav>({});
  const [loading, setLoading] = useState(true);
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    setLoading(true);
    setMarked(false);
    Promise.all([
      apiClient.get<ApiResponse<LessonDetail>>(`/lessons/${lessonId}`),
      apiClient.get<ApiResponse<LessonNav>>(`/lessons/${lessonId}/navigation`),
    ]).then(([lesRes, navRes]) => {
      if (lesRes.data.data) setLesson(lesRes.data.data);
      if (navRes.data.data) setNav(navRes.data.data);
    }).finally(() => setLoading(false));
  }, [lessonId]);

  // Mark lesson as viewed when loaded (logged-in users only)
  useEffect(() => {
    if (!lessonId || !isAuthenticated) return;
    apiClient.post(`/progress/lessons/${lessonId}`)
      .then(() => setMarked(true))
      .catch(() => { /* silent — not critical */ });
  }, [lessonId, isAuthenticated]);

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (!lesson) return <div className="text-center py-20 text-muted-foreground">Lesson not found</div>;

  let links: ExtLink[] = [];
  try { if (lesson.externalLinks) links = JSON.parse(lesson.externalLinks); } catch { /* ignore */ }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link to={-1 as unknown as string} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to course
      </Link>

      <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
      <div className="flex gap-2 mb-8 flex-wrap">
        <Badge variant="secondary"><BookOpen className="h-3 w-3 mr-1" />Lesson {lesson.orderIndex}</Badge>
        {lesson.questionCount > 0 && <Badge variant="info">{lesson.questionCount} practice questions</Badge>}
        {marked && (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />Completed
          </Badge>
        )}
      </div>

      {/* Content — HTML if it starts with a tag, otherwise plain text */}
      {lesson.content.trimStart().startsWith('<') ? (
        <div
          className="lesson-content mb-8 text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(lesson.content) }}
        />
      ) : (
        <div className="mb-8 space-y-2">
          {lesson.content.split('\n').map((line, i) => {
            if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-semibold mt-8 mb-3 text-foreground">{line.slice(3)}</h2>;
            if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold mt-6 mb-2 text-foreground">{line.slice(4)}</h3>;
            if (line.startsWith('- **')) {
              const match = line.match(/^- \*\*(.+?)\*\*:?\s*(.*)$/);
              if (match) return <p key={i} className="text-muted-foreground ml-4 mb-1"><strong className="text-foreground">{match[1]}</strong>: {match[2]}</p>;
            }
            if (line.startsWith('- ')) return <p key={i} className="text-muted-foreground ml-4 mb-1">&bull; {line.slice(2)}</p>;
            if (line.startsWith('**')) return <p key={i} className="text-foreground font-medium mt-2">{line.replace(/\*\*/g, '')}</p>;
            if (line.trim() === '') return <div key={i} className="h-2" />;
            return <p key={i} className="text-muted-foreground mb-2">{line}</p>;
          })}
        </div>
      )}

      {/* Code Example */}
      {lesson.codeExample && (
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              Code Example
              {lesson.codeLanguage && <Badge variant="outline" className="text-xs">{lesson.codeLanguage}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="rounded-lg bg-background p-4 overflow-x-auto text-sm font-mono">
              <code>{lesson.codeExample}</code>
            </pre>
          </CardContent>
        </Card>
      )}

      {/* External Links */}
      {links.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><ExternalLink className="h-4 w-4 text-primary" />Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {links.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline">
                <ExternalLink className="h-3.5 w-3.5" />{link.title}
              </a>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Inline prev/next navigation */}
      <div className="flex justify-between mt-10 gap-3 mb-24">
        <Button
          variant="outline"
          className="flex-1 max-w-xs justify-start gap-2"
          disabled={!nav.prevId}
          onClick={() => nav.prevId && navigate(`/lessons/${nav.prevId}`)}
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
          <span className="truncate">{nav.prevTitle || 'Previous'}</span>
        </Button>
        <Button
          variant="outline"
          className="flex-1 max-w-xs justify-end gap-2"
          disabled={!nav.nextId}
          onClick={() => nav.nextId && navigate(`/lessons/${nav.nextId}`)}
        >
          <span className="truncate">{nav.nextTitle || 'Next'}</span>
          <ChevronRight className="h-4 w-4 shrink-0" />
        </Button>
      </div>

      {/* Sticky completion bar (logged-in users only) */}
      {isAuthenticated && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm px-4 py-3">
          <div className="mx-auto max-w-4xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              {marked ? (
                <>
                  <CheckCircle className="h-5 w-5 text-success shrink-0" />
                  <span className="text-success font-medium">Lesson marked as complete</span>
                </>
              ) : (
                <span className="text-muted-foreground">Reading in progress…</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {nav.nextId ? (
                <Button size="sm" className="gap-1" onClick={() => navigate(`/lessons/${nav.nextId!}`)}>
                  Next Lesson <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
                  Back to Course
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
