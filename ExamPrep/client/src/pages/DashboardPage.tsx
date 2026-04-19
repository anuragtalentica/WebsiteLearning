import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '@/api/apiClient';
import type { ApiResponse, Dashboard, TestAttempt } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { Target, CheckCircle, FlaskConical, Trophy, Clock, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get<ApiResponse<Dashboard>>('/dashboard'),
      apiClient.get<ApiResponse<TestAttempt[]>>('/mocktests/attempts'),
    ]).then(([dashRes, attRes]) => {
      if (dashRes.data.data) setDashboard(dashRes.data.data);
      if (attRes.data.data) setAttempts(attRes.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.fullName || 'Learner'}!</h1>
        <p className="text-muted-foreground">Track your learning progress and test results</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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

      {/* Accuracy Progress */}
      {dashboard && dashboard.totalQuestionsAttempted > 0 && (
        <Card className="mb-10">
          <CardHeader><CardTitle>Overall Accuracy</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Progress value={dashboard.accuracyPercentage} className="flex-1" />
              <span className="font-semibold text-lg">{dashboard.accuracyPercentage}%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {dashboard.totalCorrect} correct out of {dashboard.totalQuestionsAttempted} questions
            </p>
          </CardContent>
        </Card>
      )}

      {/* Test Attempts */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent Test Attempts</CardTitle>
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
            <div className="space-y-3">
              {attempts.map(att => (
                <div key={att.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
                  {att.passed ? <CheckCircle className="h-5 w-5 text-success shrink-0" /> : <Target className="h-5 w-5 text-destructive shrink-0" />}
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{att.testTitle || `Test #${att.mockTestId}`}</h4>
                    <p className="text-xs text-muted-foreground">{new Date(att.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={att.passed ? 'success' : 'destructive'}>{att.score}%</Badge>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {Math.floor(att.timeTakenSeconds / 60)}m
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
