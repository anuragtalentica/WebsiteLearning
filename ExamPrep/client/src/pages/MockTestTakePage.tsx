import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import type { ApiResponse, MockTestDetail, SubmitTest, TestResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Clock, ChevronLeft, ChevronRight, Send } from 'lucide-react';

export default function MockTestTakePage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<MockTestDetail | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!testId) return;
    apiClient.get<ApiResponse<MockTestDetail>>(`/mocktests/${testId}`)
      .then(r => {
        if (r.data.data) {
          setTest(r.data.data);
          setTimeLeft(r.data.data.durationMinutes * 60);
          startTimeRef.current = Date.now();
        }
      })
      .finally(() => setLoading(false));
  }, [testId]);

  useEffect(() => {
    if (timeLeft <= 0 || !test) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [test]);

  const handleSubmit = async () => {
    if (!test || submitting) return;
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const payload: SubmitTest = { mockTestId: test.id, timeTakenSeconds: elapsed, answers };
    try {
      const res = await apiClient.post<ApiResponse<TestResult>>('/mocktests/submit', payload);
      if (res.data.data) {
        navigate(`/tests/${test.id}/result`, { state: { result: res.data.data, test } });
      }
    } catch { alert('Failed to submit test'); setSubmitting(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (!test) return <div className="text-center py-20 text-muted-foreground">Test not found</div>;

  const q = test.questions[current];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / test.questions.length) * 100;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Timer Bar */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-card border border-border">
        <h2 className="font-semibold text-sm truncate">{test.title}</h2>
        <div className={cn("flex items-center gap-1.5 font-mono text-sm font-semibold", timeLeft < 60 ? 'text-destructive' : timeLeft < 300 ? 'text-warning' : 'text-foreground')}>
          <Clock className="h-4 w-4" />
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      <Progress value={progress} className="mb-6" />

      {/* Question */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">Question {current + 1} of {test.questions.length}</Badge>
            <Badge variant={answers[q.questionId] ? 'success' : 'outline'}>{answers[q.questionId] ? 'Answered' : 'Not answered'}</Badge>
          </div>
          <CardTitle className="text-lg leading-relaxed">{q.questionText}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {q.options.map(opt => (
            <button key={opt.id}
              onClick={() => setAnswers(prev => ({ ...prev, [q.questionId]: opt.id }))}
              className={cn("w-full flex items-center gap-3 rounded-lg border p-4 text-left text-sm transition-all",
                answers[q.questionId] === opt.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30 hover:bg-secondary/30')}>
              {opt.optionText}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setCurrent(prev => Math.max(0, prev - 1))} disabled={current === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" />Previous
        </Button>
        <span className="text-sm text-muted-foreground">{answeredCount}/{test.questions.length} answered</span>
        {current < test.questions.length - 1 ? (
          <Button variant="outline" onClick={() => setCurrent(prev => prev + 1)}>
            Next<ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting} className="gap-1">
            <Send className="h-4 w-4" />{submitting ? 'Submitting...' : 'Submit Test'}
          </Button>
        )}
      </div>

      {/* Question Navigator */}
      <div className="mt-8 p-4 rounded-lg bg-card border border-border">
        <p className="text-sm font-medium mb-3">Question Navigator</p>
        <div className="flex flex-wrap gap-2">
          {test.questions.map((tq, i) => (
            <button key={tq.id} onClick={() => setCurrent(i)}
              className={cn("h-8 w-8 rounded text-xs font-medium transition-all",
                i === current ? 'bg-primary text-primary-foreground' :
                answers[tq.questionId] ? 'bg-success/20 text-success border border-success/30' :
                'bg-secondary text-secondary-foreground hover:bg-secondary/80')}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
