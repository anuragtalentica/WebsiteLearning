import { useLocation, Link } from 'react-router-dom';
import type { TestResult, MockTestDetail } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, MinusCircle, Clock, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TestResultPage() {
  const location = useLocation();
  const { result, test } = (location.state || {}) as { result?: TestResult; test?: MockTestDetail };

  if (!result) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground mb-4">No results found</p>
      <Link to="/tests"><Button>Back to Tests</Button></Link>
    </div>
  );

  const minutes = Math.floor(result.timeTakenSeconds / 60);
  const seconds = result.timeTakenSeconds % 60;

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

        <div className="flex gap-3 justify-center">
          <Link to="/tests"><Button variant="outline">All Tests</Button></Link>
          <Link to="/dashboard"><Button>View Dashboard</Button></Link>
        </div>
      </motion.div>
    </div>
  );
}
