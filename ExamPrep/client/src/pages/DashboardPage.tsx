import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '@/api/apiClient';
import type { ApiResponse, Dashboard, TestAttempt, Bookmark } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Target, CheckCircle, XCircle, FlaskConical, Trophy, Clock, BookOpen, MinusCircle, BarChart2, Bookmark as BookmarkIcon, BookmarkX } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllAttempts, setShowAllAttempts] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [expandedBookmark, setExpandedBookmark] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      apiClient.get<ApiResponse<Dashboard>>('/dashboard'),
      apiClient.get<ApiResponse<TestAttempt[]>>('/mocktests/attempts'),
      apiClient.get<ApiResponse<Bookmark[]>>('/bookmarks'),
    ]).then(([dashRes, attRes, bkRes]) => {
      if (dashRes.data.data) setDashboard(dashRes.data.data);
      if (attRes.data.data) setAttempts(attRes.data.data);
      if (bkRes.data.data) setBookmarks(bkRes.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const removeBookmark = async (questionId: number) => {
    await apiClient.delete(`/bookmarks/${questionId}`);
    setBookmarks(prev => prev.filter(b => b.questionId !== questionId));
    if (expandedBookmark === questionId) setExpandedBookmark(null);
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );

  const visibleAttempts = showAllAttempts ? attempts : attempts.slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.fullName || 'Learner'}!</h1>
        <p className="text-muted-foreground">Track your learning progress and test results</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Questions Attempted', value: dashboard?.totalQuestionsAttempted || 0, icon: BookOpen, color: 'text-info' },
          { label: 'Accuracy', value: `${dashboard?.accuracyPercentage || 0}%`, icon: Target, color: 'text-success' },
          { label: 'Tests Taken', value: dashboard?.testsTaken || 0, icon: FlaskConical, color: 'text-warning' },
          { label: 'Tests Passed', value: dashboard?.testsPassed || 0, icon: Trophy, color: 'text-primary' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-6 text-center">
                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Accuracy Progress */}
        {dashboard && dashboard.totalQuestionsAttempted > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Practice Accuracy</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Progress value={dashboard.accuracyPercentage} className="flex-1" />
                <span className="font-semibold text-lg shrink-0">{dashboard.accuracyPercentage}%</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-muted-foreground">Correct:</span>
                  <span className="font-medium">{dashboard.totalCorrect}</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-muted-foreground">Wrong:</span>
                  <span className="font-medium">{dashboard.totalQuestionsAttempted - dashboard.totalCorrect}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Performance */}
        {dashboard && dashboard.categoryStats && dashboard.categoryStats.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart2 className="h-4 w-4" /> By Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.categoryStats.map(cat => {
                const pct = cat.attempted > 0 ? Math.round(cat.correct / cat.attempted * 100) : 0;
                return (
                  <div key={cat.category}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground truncate">{cat.category}</span>
                      <span className="font-medium shrink-0 ml-2">{pct}% ({cat.attempted})</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Test History */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Test History</CardTitle>
          <Link to="/tests"><Button variant="ghost" size="sm">Take a test</Button></Link>
        </CardHeader>
        <CardContent>
          {attempts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FlaskConical className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No test attempts yet</p>
              <Link to="/tests"><Button variant="outline" size="sm" className="mt-3">Start your first test</Button></Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {visibleAttempts.map(att => {
                  const mins = Math.floor(att.timeTakenSeconds / 60);
                  const secs = att.timeTakenSeconds % 60;
                  return (
                    <div key={att.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
                      {att.passed
                        ? <Trophy className="h-5 w-5 text-success shrink-0" />
                        : <XCircle className="h-5 w-5 text-destructive shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{att.testTitle || `Test #${att.mockTestId}`}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{new Date(att.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-0.5">
                            <CheckCircle className="h-3 w-3 text-success" /> {att.correctAnswers}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <XCircle className="h-3 w-3 text-destructive" /> {att.wrongAnswers}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <MinusCircle className="h-3 w-3 text-warning" /> {att.skipped}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {mins}:{String(secs).padStart(2, '0')}
                        </div>
                        <Badge variant={att.passed ? 'success' : 'destructive'}>{att.score}%</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>

              {attempts.length > 5 && (
                <div className="mt-4 text-center">
                  <Button variant="ghost" size="sm" onClick={() => setShowAllAttempts(v => !v)}>
                    {showAllAttempts ? 'Show less' : `Show all ${attempts.length} attempts`}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Saved Questions */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookmarkIcon className="h-5 w-5 text-primary" /> Saved Questions
            {bookmarks.length > 0 && <Badge variant="secondary">{bookmarks.length}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookmarks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookmarkIcon className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No bookmarked questions yet.</p>
              <p className="text-xs mt-1">Bookmark questions while practising to review them here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map(b => (
                <div key={b.id} className="border border-border rounded-lg overflow-hidden">
                  <div
                    className="flex items-start gap-3 p-3 cursor-pointer hover:bg-secondary/30 transition-colors"
                    onClick={() => setExpandedBookmark(expandedBookmark === b.questionId ? null : b.questionId)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{b.topicName}</Badge>
                        <Badge variant={b.difficultyLevel === 1 ? 'success' : b.difficultyLevel === 2 ? 'warning' : 'destructive'} className="text-xs">
                          {b.difficultyLevel === 1 ? 'Easy' : b.difficultyLevel === 2 ? 'Medium' : 'Hard'}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium leading-snug">{b.questionText}</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); removeBookmark(b.questionId); }}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-1"
                      title="Remove bookmark"
                    >
                      <BookmarkX className="h-4 w-4" />
                    </button>
                  </div>

                  {expandedBookmark === b.questionId && (
                    <div className="border-t border-border bg-secondary/10 p-3 space-y-2">
                      {b.options.map(opt => (
                        <div key={opt.id} className={cn(
                          'flex items-center gap-2 rounded-md px-3 py-2 text-sm',
                          opt.isCorrect ? 'bg-success/10 border border-success/30 text-success' : 'text-muted-foreground'
                        )}>
                          {opt.isCorrect && <CheckCircle className="h-4 w-4 shrink-0" />}
                          <span>{opt.optionText}</span>
                        </div>
                      ))}
                      {b.explanation && (
                        <div className="rounded-md bg-info/5 border border-info/20 p-3 mt-2">
                          <p className="text-xs font-medium text-info mb-1">Explanation</p>
                          <p className="text-xs text-muted-foreground">{b.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
