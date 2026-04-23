import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import type { ApiResponse, Question, AnswerResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, XCircle, ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';

export default function QuestionPracticePage() {
  const { topicId } = useParams<{ topicId: string }>();
  const { isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    if (!topicId) return;
    apiClient.get<ApiResponse<Question[]>>(`/questions/topic/${topicId}`)
      .then(r => { if (r.data.data) setQuestions(r.data.data); })
      .finally(() => setLoading(false));
  }, [topicId]);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiClient.get<ApiResponse<number[]>>('/bookmarks/ids')
      .then(r => { if (r.data.data) setBookmarkedIds(new Set(r.data.data)); });
  }, [isAuthenticated]);

  const toggleBookmark = async (questionId: number) => {
    if (!isAuthenticated || bookmarkLoading) return;
    setBookmarkLoading(true);
    try {
      if (bookmarkedIds.has(questionId)) {
        await apiClient.delete(`/bookmarks/${questionId}`);
        setBookmarkedIds(prev => { const s = new Set(prev); s.delete(questionId); return s; });
      } else {
        await apiClient.post(`/bookmarks/${questionId}`);
        setBookmarkedIds(prev => new Set(prev).add(questionId));
      }
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (selected === null || !questions[current]) return;
    const res = await apiClient.post<ApiResponse<AnswerResult>>(`/questions/${questions[current].id}/submit`, { selectedOptionId: selected });
    if (res.data.data) {
      setResult(res.data.data);
      setScore(prev => ({ correct: prev.correct + (res.data.data!.isCorrect ? 1 : 0), total: prev.total + 1 }));
    }
  };

  const handleNext = () => {
    setSelected(null);
    setResult(null);
    setShowExplanation(false);
    setCurrent(prev => prev + 1);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (questions.length === 0) return <div className="text-center py-20 text-muted-foreground">No questions found for this topic.</div>;

  const q = questions[current];
  if (!q) return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h2 className="text-3xl font-bold mb-4">Practice Complete!</h2>
      <p className="text-lg text-muted-foreground mb-4">Score: {score.correct}/{score.total} ({score.total > 0 ? Math.round(score.correct/score.total*100) : 0}%)</p>
      <Button onClick={() => { setCurrent(0); setScore({ correct: 0, total: 0 }); }}>Try Again</Button>
    </div>
  );

  const progress = ((current) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">Question {current + 1} of {questions.length}</span>
        <Badge variant="secondary">Score: {score.correct}/{score.total}</Badge>
      </div>
      <Progress value={progress} className="mb-8" />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant={q.difficultyLevel === 1 ? 'success' : q.difficultyLevel === 2 ? 'warning' : 'destructive'}>
              {q.difficultyLevel === 1 ? 'Easy' : q.difficultyLevel === 2 ? 'Medium' : 'Hard'}
            </Badge>
            {isAuthenticated && (
              <button
                onClick={() => toggleBookmark(q.id)}
                disabled={bookmarkLoading}
                className="text-muted-foreground hover:text-primary transition-colors p-1 rounded"
                title={bookmarkedIds.has(q.id) ? 'Remove bookmark' : 'Bookmark this question'}
              >
                {bookmarkedIds.has(q.id)
                  ? <BookmarkCheck className="h-5 w-5 text-primary" />
                  : <Bookmark className="h-5 w-5" />}
              </button>
            )}
          </div>
          <CardTitle className="text-lg leading-relaxed">{q.questionText}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {q.options.map(opt => {
            let optStyle = 'border-border hover:border-primary/30 hover:bg-secondary/30';
            if (result) {
              if (opt.id === result.correctOptionId) optStyle = 'border-success bg-success/10';
              else if (opt.id === selected && !result.isCorrect) optStyle = 'border-destructive bg-destructive/10';
              else optStyle = 'border-border opacity-50';
            } else if (selected === opt.id) {
              optStyle = 'border-primary bg-primary/10';
            }
            return (
              <button key={opt.id}
                onClick={() => !result && setSelected(opt.id)}
                disabled={!!result}
                className={cn("w-full flex items-center gap-3 rounded-lg border p-4 text-left text-sm transition-all", optStyle)}>
                {result && opt.id === result.correctOptionId && <CheckCircle className="h-5 w-5 text-success shrink-0" />}
                {result && opt.id === selected && !result.isCorrect && <XCircle className="h-5 w-5 text-destructive shrink-0" />}
                <span>{opt.optionText}</span>
              </button>
            );
          })}

          {result && (
            <div className="mt-4 space-y-3">
              {result.explanation && !showExplanation && (
                <Button variant="outline" size="sm" onClick={() => setShowExplanation(true)}>
                  💡 See Explanation
                </Button>
              )}
              {result.explanation && showExplanation && (
                <div className="rounded-lg bg-info/5 border border-info/20 p-4">
                  <p className="text-sm font-medium text-info mb-1">Explanation</p>
                  <p className="text-sm text-muted-foreground">{result.explanation}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            {!result ? (
              <Button onClick={handleSubmit} disabled={selected === null}>Submit Answer</Button>
            ) : (
              <Button onClick={handleNext} className="gap-1">
                {current < questions.length - 1 ? <>Next <ArrowRight className="h-4 w-4" /></> : 'View Results'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
