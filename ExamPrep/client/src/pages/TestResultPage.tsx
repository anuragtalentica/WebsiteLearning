import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import type { TestResult, MockTestDetail, TestReview, TestReviewQuestion } from '@/types';
import type { ApiResponse } from '@/types';
import apiClient from '@/api/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, MinusCircle, Clock, Trophy, ArrowLeft, ArrowRight, RotateCcw, RefreshCw, FlaskConical, BookOpen, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

function ReviewQuestion({ q, index, total, onPrev, onNext }: {
  q: TestReviewQuestion; index: number; total: number;
  onPrev: () => void; onNext: () => void;
}) {
  const [showExplanation, setShowExplanation] = useState(false);

  const statusIcon = q.skipped
    ? <MinusCircle className="h-5 w-5 text-warning" />
    : q.isCorrect
      ? <CheckCircle className="h-5 w-5 text-success" />
      : <XCircle className="h-5 w-5 text-destructive" />;

  const statusLabel = q.skipped ? 'Skipped' : q.isCorrect ? 'Correct' : 'Incorrect';
  const statusVariant = q.skipped ? 'warning' : q.isCorrect ? 'success' : 'destructive';

  return (
    <motion.div key={q.questionId} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">Question {index + 1} of {total}</span>
        <div className="flex items-center gap-2">
          {statusIcon}
          <Badge variant={statusVariant as 'warning' | 'success' | 'destructive'}>{statusLabel}</Badge>
        </div>
      </div>
      <Progress value={((index + 1) / total) * 100} className="mb-6" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base leading-relaxed">{q.questionText}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {q.options.map(opt => {
            let style = 'border-border opacity-60';
            if (opt.id === q.correctOptionId) style = 'border-success bg-success/10';
            else if (opt.id === q.selectedOptionId && !q.isCorrect) style = 'border-destructive bg-destructive/10';
            return (
              <div key={opt.id}
                className={cn('w-full flex items-center gap-3 rounded-lg border p-4 text-sm', style)}>
                {opt.id === q.correctOptionId && <CheckCircle className="h-4 w-4 text-success shrink-0" />}
                {opt.id === q.selectedOptionId && !q.isCorrect && <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                {opt.id !== q.correctOptionId && opt.id !== q.selectedOptionId && <span className="h-4 w-4 shrink-0" />}
                <span>{opt.optionText}</span>
              </div>
            );
          })}

          {q.skipped && (
            <div className="rounded-lg bg-warning/5 border border-warning/20 p-3 text-sm text-warning">
              You skipped this question. The correct answer is highlighted above.
            </div>
          )}

          {q.explanation && !showExplanation && (
            <Button variant="outline" size="sm" onClick={() => setShowExplanation(true)}>
              Show Explanation
            </Button>
          )}
          {q.explanation && showExplanation && (
            <div className="rounded-lg bg-info/5 border border-info/20 p-4">
              <p className="text-sm font-medium text-info mb-1">Explanation</p>
              <p className="text-sm text-muted-foreground">{q.explanation}</p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onPrev} disabled={index === 0} className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Previous
            </Button>
            <Button onClick={onNext} disabled={index === total - 1} className="gap-1">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function TestResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, test } = (location.state || {}) as { result?: TestResult; test?: MockTestDetail };

  const [review, setReview] = useState<TestReview | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewError, setReviewError] = useState('');
  const [retryLoading, setRetryLoading] = useState(false);

  const handlePracticeWrong = async () => {
    setRetryLoading(true);
    try {
      const res = await apiClient.get<ApiResponse<TestReview>>(`/mocktests/attempts/${result!.attemptId}/review`);
      if (res.data.data) {
        const wrongIds = res.data.data.questions
          .filter(q => !q.isCorrect && !q.skipped)
          .map(q => q.questionId);
        if (wrongIds.length === 0) return;
        navigate('/practice/retry', {
          state: { retryIds: wrongIds, label: `Wrong answers from "${test?.title}"` }
        });
      }
    } finally {
      setRetryLoading(false);
    }
  };

  if (!result) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground mb-4">No results found</p>
      <Link to="/tests"><Button>Back to Tests</Button></Link>
    </div>
  );

  const minutes = Math.floor(result.timeTakenSeconds / 60);
  const seconds = result.timeTakenSeconds % 60;

  const handleReview = async () => {
    setReviewLoading(true);
    setReviewError('');
    try {
      const res = await apiClient.get<ApiResponse<TestReview>>(`/mocktests/attempts/${result.attemptId}/review`);
      if (res.data.data) {
        setReview(res.data.data);
        setReviewIndex(0);
      }
    } catch {
      setReviewError('Failed to load review. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  if (review) {
    const q = review.questions[reviewIndex];
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">{review.testTitle}</h2>
            <p className="text-sm text-muted-foreground">Score: {review.score}% — {review.passed ? 'Passed' : 'Not Passed'}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setReview(null)} className="gap-1">
            <RotateCcw className="h-4 w-4" /> Back to Summary
          </Button>
        </div>
        <ReviewQuestion
          q={q}
          index={reviewIndex}
          total={review.questions.length}
          onPrev={() => setReviewIndex(i => i - 1)}
          onNext={() => setReviewIndex(i => i + 1)}
        />
        {/* Question navigator dots */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center">
          {review.questions.map((rq, i) => (
            <button
              key={rq.questionId}
              onClick={() => setReviewIndex(i)}
              className={cn(
                'h-8 w-8 rounded-full text-xs font-medium transition-colors',
                i === reviewIndex ? 'bg-primary text-primary-foreground' :
                  rq.skipped ? 'bg-warning/20 text-warning border border-warning/40' :
                    rq.isCorrect ? 'bg-success/20 text-success border border-success/40' :
                      'bg-destructive/20 text-destructive border border-destructive/40'
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
        <div className="text-center mb-8">
          {result.passed ? (
            <Trophy className="h-16 w-16 text-success mx-auto mb-4" />
          ) : (
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          )}
          <h1 className="text-3xl font-bold mb-2">{result.passed ? 'Congratulations!' : 'Keep Practicing!'}</h1>
          <Badge variant={result.passed ? 'success' : 'destructive'} className="text-base px-4 py-1">
            {result.passed ? 'PASSED' : 'NOT PASSED'}
          </Badge>
          {test && <p className="text-muted-foreground mt-2">{test.title}</p>}
        </div>

        <Card className="mb-6">
          <CardHeader><CardTitle>Score Summary</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-1">{result.score}%</div>
              <p className="text-sm text-muted-foreground">Passing score: {result.passingScore}%</p>
              <Progress value={result.score} className="mt-3" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-secondary/30">
                <CheckCircle className="h-5 w-5 text-success mx-auto mb-1" />
                <div className="text-xl font-bold text-success">{result.correctAnswers}</div>
                <div className="text-xs text-muted-foreground">Correct</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/30">
                <XCircle className="h-5 w-5 text-destructive mx-auto mb-1" />
                <div className="text-xl font-bold text-destructive">{result.wrongAnswers}</div>
                <div className="text-xs text-muted-foreground">Wrong</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/30">
                <MinusCircle className="h-5 w-5 text-warning mx-auto mb-1" />
                <div className="text-xl font-bold text-warning">{result.skipped}</div>
                <div className="text-xs text-muted-foreground">Skipped</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/30">
                <Clock className="h-5 w-5 text-info mx-auto mb-1" />
                <div className="text-xl font-bold">{minutes}:{String(seconds).padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">Time Taken</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {reviewError && (
          <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {reviewError}
          </div>
        )}

        {/* Next Steps card */}
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart2 className="h-4 w-4 text-primary" />What's Next?</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {test?.certificationId && (
              <Link to={`/courses/${test.certificationId}`}>
                <div className="flex items-center gap-3 rounded-lg border border-border p-3 hover:border-primary/40 hover:bg-secondary/30 transition-colors cursor-pointer">
                  <BookOpen className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Study the course</p>
                    <p className="text-xs text-muted-foreground">Go back to lessons and review</p>
                  </div>
                </div>
              </Link>
            )}
            <Link to="/tests">
              <div className="flex items-center gap-3 rounded-lg border border-border p-3 hover:border-primary/40 hover:bg-secondary/30 transition-colors cursor-pointer">
                <FlaskConical className="h-5 w-5 text-warning shrink-0" />
                <div>
                  <p className="text-sm font-medium">Try another test</p>
                  <p className="text-xs text-muted-foreground">Browse all available mock exams</p>
                </div>
              </div>
            </Link>
            <Link to="/dashboard">
              <div className="flex items-center gap-3 rounded-lg border border-border p-3 hover:border-primary/40 hover:bg-secondary/30 transition-colors cursor-pointer">
                <BarChart2 className="h-5 w-5 text-info shrink-0" />
                <div>
                  <p className="text-sm font-medium">View your dashboard</p>
                  <p className="text-xs text-muted-foreground">See overall progress and history</p>
                </div>
              </div>
            </Link>
            {result.wrongAnswers > 0 && (
              <div onClick={handlePracticeWrong}
                className="flex items-center gap-3 rounded-lg border border-border p-3 hover:border-primary/40 hover:bg-secondary/30 transition-colors cursor-pointer">
                <XCircle className="h-5 w-5 text-destructive shrink-0" />
                <div>
                  <p className="text-sm font-medium">Practice wrong answers</p>
                  <p className="text-xs text-muted-foreground">{result.wrongAnswers} questions to review</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/tests"><Button variant="outline">All Tests</Button></Link>
          {test && (
            <Button variant="outline" className="gap-1"
              onClick={() => navigate(`/tests/${test.id}`)}>
              <RefreshCw className="h-4 w-4" /> Retry Test
            </Button>
          )}
          {result.wrongAnswers > 0 && (
            <Button variant="outline" className="gap-1" onClick={handlePracticeWrong} disabled={retryLoading}>
              <FlaskConical className="h-4 w-4" />
              {retryLoading ? 'Loading...' : `Practice ${result.wrongAnswers} Wrong`}
            </Button>
          )}
          <Button onClick={handleReview} disabled={reviewLoading}>
            {reviewLoading ? 'Loading...' : 'Review Answers'}
          </Button>
          <Link to="/dashboard"><Button variant="outline">View Dashboard</Button></Link>
        </div>
      </motion.div>
    </div>
  );
}
