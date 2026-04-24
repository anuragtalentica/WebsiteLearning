import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import type { ApiResponse, Question, AnswerResult, TopicStats } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, Bookmark, BookmarkCheck, FlaskConical, RefreshCw, Trophy, Play, GraduationCap, LogIn } from 'lucide-react';

export default function QuestionPracticePage() {
  const { topicId } = useParams<{ topicId: string }>();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  // retryIds: passed from TestResultPage when retrying wrong questions from a mock test
  const retryIds = (location.state as { retryIds?: number[]; label?: string } | null)?.retryIds;
  const retryLabel = (location.state as { retryIds?: number[]; label?: string } | null)?.label;

  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [wrongIds, setWrongIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [stats, setStats] = useState<TopicStats | null>(null);
  const [retryWrongOnly, setRetryWrongOnly] = useState(!!retryIds);
  const [certificationId, setCertificationId] = useState<number | null>(null);
  const [topicName, setTopicName] = useState<string>('');
  const [started, setStarted] = useState(!!retryIds); // auto-start for retry mode

  useEffect(() => {
    if (retryIds && retryIds.length > 0) {
      // Retry wrong questions from a mock test — fetch by IDs
      apiClient.post<ApiResponse<Question[]>>('/questions/by-ids', retryIds)
        .then(r => {
          if (r.data.data) { setAllQuestions(r.data.data); setQuestions(r.data.data); }
        }).finally(() => setLoading(false));
      return;
    }
    if (!topicId) return;
    Promise.all([
      apiClient.get<ApiResponse<Question[]>>(`/questions/topic/${topicId}`),
      apiClient.get<ApiResponse<TopicStats>>(`/questions/topic/${topicId}/stats`),
      apiClient.get<ApiResponse<{ id: number; name: string; certificationId: number }>>(`/questions/topic/${topicId}/info`),
    ]).then(([qRes, sRes, infoRes]) => {
      if (qRes.data.data) { setAllQuestions(qRes.data.data); setQuestions(qRes.data.data); }
      if (sRes.data.data) setStats(sRes.data.data);
      if (infoRes.data.data) { setCertificationId(infoRes.data.data.certificationId); setTopicName(infoRes.data.data.name); }
    }).finally(() => setLoading(false));
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
      const isCorrect = res.data.data.isCorrect;
      setResult(res.data.data);
      setScore(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));
      if (!isCorrect) setWrongIds(prev => new Set(prev).add(questions[current].id));
    }
  };

  const handleNext = () => {
    setSelected(null);
    setResult(null);
    setShowExplanation(false);
    setCurrent(prev => prev + 1);
  };

  const restart = (wrongOnly = false) => {
    const pool = wrongOnly ? allQuestions.filter(q => wrongIds.has(q.id)) : allQuestions;
    setQuestions(pool);
    setRetryWrongOnly(wrongOnly);
    setCurrent(0);
    setScore({ correct: 0, total: 0 });
    setWrongIds(new Set());
    setSelected(null);
    setResult(null);
    setShowExplanation(false);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (questions.length === 0 && allQuestions.length === 0) return <div className="text-center py-20 text-muted-foreground">No questions found for this topic.</div>;

  // Ready screen — shown before starting (only for normal topic practice, not retry)
  if (!started) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <FlaskConical className="h-14 w-14 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-1">{topicName || 'Practice'}</h1>
        <p className="text-muted-foreground mb-6">
          {allQuestions.length} questions · Practice Mode · Answers revealed immediately
        </p>
        {stats && (
          <div className="flex justify-center gap-4 mb-6 text-sm">
            <span className="text-success">{stats.easy} Easy</span>
            <span className="text-warning">{stats.medium} Medium</span>
            <span className="text-destructive">{stats.hard} Hard</span>
          </div>
        )}
        {!isAuthenticated && (
          <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
            <GraduationCap className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="mb-2">You can try questions as a guest — but your progress won't be saved.</p>
            <Link to="/login" className="inline-flex items-center gap-1 text-primary hover:underline font-medium">
              <LogIn className="h-4 w-4" /> Sign in to track your progress
            </Link>
          </div>
        )}
        {certificationId && (
          <Link to={`/courses/${certificationId}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 block">
            <ArrowLeft className="h-4 w-4" /> Back to course
          </Link>
        )}
        <Button size="lg" className="gap-2 w-full" onClick={() => setStarted(true)}>
          <Play className="h-5 w-5" /> Start Practice
        </Button>
      </div>
    );
  }

  const q = questions[current];

  // Completion screen
  if (!q) {
    const pct = score.total > 0 ? Math.round(score.correct / score.total * 100) : 0;
    const passed = pct >= 70;
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        {passed
          ? <Trophy className="h-16 w-16 mx-auto mb-4 text-warning" />
          : <FlaskConical className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />}
        <h2 className="text-3xl font-bold mb-2">{retryWrongOnly ? 'Retry Complete!' : 'Practice Complete!'}</h2>
        <p className="text-lg text-muted-foreground mb-2">
          Score: {score.correct}/{score.total} ({pct}%)
        </p>
        <Badge variant={passed ? 'success' : 'destructive'} className="text-sm mb-6">
          {passed ? 'Great job!' : 'Keep practising'}
        </Badge>

        {/* Difficulty breakdown */}
        {stats && (
          <div className="flex justify-center gap-4 mb-8 text-sm">
            <span className="text-success">{stats.easy} Easy</span>
            <span className="text-warning">{stats.medium} Medium</span>
            <span className="text-destructive">{stats.hard} Hard</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => restart(false)}>
            <RefreshCw className="h-4 w-4 mr-2" />Try Again
          </Button>
          {wrongIds.size > 0 && (
            <Button onClick={() => restart(true)}>
              <XCircle className="h-4 w-4 mr-2" />Retry {wrongIds.size} Wrong
            </Button>
          )}
        </div>
      </div>
    );
  }

  const progress = (current / questions.length) * 100;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Back link */}
      {certificationId && (
        <Link
          to={`/courses/${certificationId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to course
        </Link>
      )}

      {/* Mode Banner */}
      <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-success/10 border border-success/30 text-success text-sm font-medium">
        <FlaskConical className="h-4 w-4 shrink-0" />
        <span>{retryLabel ? `Retrying: ${retryLabel}` : 'Practice Mode — correct answer revealed immediately after each submission.'}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">Question {current + 1} of {questions.length}</span>
        <div className="flex items-center gap-2">
          {retryWrongOnly && <Badge variant="warning">Wrong Only</Badge>}
          <Badge variant="secondary">Score: {score.correct}/{score.total}</Badge>
        </div>
      </div>
      <Progress value={progress} className="mb-8" />

      {/* Difficulty stats bar */}
      {stats && current === 0 && (
        <div className="flex gap-3 mb-4 text-xs text-muted-foreground">
          <span className="text-success font-medium">{stats.easy} Easy</span>
          <span className="text-warning font-medium">{stats.medium} Medium</span>
          <span className="text-destructive font-medium">{stats.hard} Hard</span>
          <span className="ml-auto">{stats.total} total questions</span>
        </div>
      )}

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
          {q.imageUrl && (
            <img src={q.imageUrl} alt="Question illustration" className="mt-3 max-h-40 sm:max-h-64 w-full rounded-lg border border-border object-contain" />
          )}
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
