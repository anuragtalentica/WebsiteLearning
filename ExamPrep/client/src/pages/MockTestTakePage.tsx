import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useBlocker } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import type { ApiResponse, MockTestDetail, SubmitTest, TestResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Clock, ChevronLeft, ChevronRight, Send, ShieldAlert, AlertTriangle, X } from 'lucide-react';

export default function MockTestTakePage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<MockTestDetail | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

  // Block React Router in-app navigation mid-exam
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !submitting && currentLocation.pathname !== nextLocation.pathname
  );

  // Also warn on browser close / refresh
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 || !test) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); submitTest(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [test]);

  const submitTest = async () => {
    if (!test || submitting) return;
    setSubmitting(true);
    setShowConfirm(false);
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

  const handleSubmitClick = () => {
    // If all answered, submit directly; otherwise show confirmation
    const unanswered = test!.questions.length - Object.keys(answers).length;
    if (unanswered === 0) {
      submitTest();
    } else {
      setShowConfirm(true);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (!test) return <div className="text-center py-20 text-muted-foreground">Test not found</div>;

  const q = test.questions[current];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = test.questions.length - answeredCount;
  const progress = (answeredCount / test.questions.length) * 100;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Leave exam dialog */}
      {blocker.state === 'blocked' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Leave the exam?</h3>
                <p className="text-sm text-muted-foreground">
                  Your progress will be lost. The test will not be submitted and your answers won't be saved.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => blocker.reset()}>Stay</Button>
              <Button variant="destructive" className="flex-1" onClick={() => blocker.proceed()}>Leave Anyway</Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <h3 className="font-semibold">Submit Test?</h3>
              </div>
              <button onClick={() => setShowConfirm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              You have <span className="font-semibold text-warning">{unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}</span> out of {test.questions.length}.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Unanswered questions will be marked as skipped. Are you sure you want to submit?
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>
                Keep Answering
              </Button>
              <Button className="flex-1 gap-1" onClick={submitTest} disabled={submitting}>
                <Send className="h-4 w-4" />{submitting ? 'Submitting...' : 'Submit Anyway'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mode Banner */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium">
        <ShieldAlert className="h-4 w-4 shrink-0" />
        <span>Exam Mode — answers are hidden until you review results. Timer counts down.</span>
      </div>

      {/* Timer Bar */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-card border border-border">
        <h2 className="font-semibold text-sm truncate">{test.title}</h2>
        <div className={cn("flex items-center gap-1.5 font-mono text-sm font-semibold", timeLeft < 60 ? 'text-destructive animate-pulse' : timeLeft < 300 ? 'text-warning' : 'text-foreground')}>
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
            <Badge variant={answers[q.questionId] ? 'success' : 'outline'}>
              {answers[q.questionId] ? 'Answered' : 'Not answered'}
            </Badge>
          </div>
          <CardTitle className="text-lg leading-relaxed">{q.questionText}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {q.options.map(opt => (
            <button key={opt.id}
              onClick={() => setAnswers(prev => ({ ...prev, [q.questionId]: opt.id }))}
              className={cn("w-full flex items-center gap-3 rounded-lg border p-4 text-left text-sm transition-all",
                answers[q.questionId] === opt.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/30 hover:bg-secondary/30')}>
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
          <Button onClick={handleSubmitClick} disabled={submitting} className="gap-1">
            <Send className="h-4 w-4" />{submitting ? 'Submitting...' : 'Submit Test'}
          </Button>
        )}
      </div>

      {/* Question Navigator */}
      <div className="mt-8 p-4 rounded-lg bg-card border border-border">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium">Question Navigator</p>
          {unansweredCount > 0 && (
            <span className="text-xs text-warning">{unansweredCount} unanswered</span>
          )}
        </div>
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
        {unansweredCount > 0 && (
          <Button
            className="w-full mt-4 gap-1"
            onClick={handleSubmitClick}
            disabled={submitting}
            variant="outline"
          >
            <Send className="h-4 w-4" /> Submit Test ({unansweredCount} unanswered)
          </Button>
        )}
      </div>
    </div>
  );
}
