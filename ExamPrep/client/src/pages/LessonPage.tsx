import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import type { ApiResponse, LessonDetail, ExternalLink as ExtLink } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Code, ExternalLink, BookOpen } from 'lucide-react';

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) return;
    apiClient.get<ApiResponse<LessonDetail>>(`/lessons/${lessonId}`)
      .then(r => { if (r.data.data) setLesson(r.data.data); })
      .finally(() => setLoading(false));
  }, [lessonId]);

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
      <div className="flex gap-2 mb-8">
        <Badge variant="secondary"><BookOpen className="h-3 w-3 mr-1" />Lesson {lesson.orderIndex}</Badge>
        {lesson.questionCount > 0 && <Badge variant="info">{lesson.questionCount} practice questions</Badge>}
      </div>

      {/* Content */}
      <div className="prose prose-invert max-w-none mb-8">
        {lesson.content.split('\n').map((line, i) => {
          if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-semibold mt-8 mb-3 text-foreground">{line.slice(3)}</h2>;
          if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold mt-6 mb-2 text-foreground">{line.slice(4)}</h3>;
          if (line.startsWith('- **')) {
            const match = line.match(/^- \*\*(.+?)\*\*:?\s*(.*)$/);
            if (match) return <p key={i} className="text-muted-foreground ml-4 mb-1"><strong className="text-foreground">{match[1]}</strong>: {match[2]}</p>;
          }
          if (line.startsWith('- ')) return <p key={i} className="text-muted-foreground ml-4 mb-1">&bull; {line.slice(2)}</p>;
          if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) return <p key={i} className="text-muted-foreground ml-4 mb-1">{line}</p>;
          if (line.startsWith('**')) {
            const text = line.replace(/\*\*/g, '');
            return <p key={i} className="text-foreground font-medium mt-2">{text}</p>;
          }
          if (line.trim() === '') return <div key={i} className="h-2" />;
          return <p key={i} className="text-muted-foreground mb-2">{line}</p>;
        })}
      </div>

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

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => window.history.back()}>Previous</Button>
        <Button variant="outline" disabled>Next Lesson</Button>
      </div>
    </div>
  );
}
