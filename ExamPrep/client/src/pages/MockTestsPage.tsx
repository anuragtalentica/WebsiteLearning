import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '@/api/apiClient';
import type { ApiResponse, MockTest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle, Target, FlaskConical } from 'lucide-react';

export default function MockTestsPage() {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<ApiResponse<MockTest[]>>('/mocktests')
      .then(r => { if (r.data.data) setTests(r.data.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold mb-2">Mock Tests & Exams</h1>
      <p className="text-muted-foreground mb-8">Timed practice tests to prepare for your certification exams</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((test, i) => (
          <motion.div key={test.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="h-full hover:border-primary/30 transition-all">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={test.type === 'exam' ? 'destructive' : 'default'}>
                    {test.type === 'exam' ? 'Full Exam' : 'Practice Test'}
                  </Badge>
                  {test.certificationName && <Badge variant="outline">{test.certificationName}</Badge>}
                </div>
                <CardTitle>{test.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{test.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{test.durationMinutes} min</div>
                  <div className="flex items-center gap-1.5"><FlaskConical className="h-4 w-4" />{test.questionCount} questions</div>
                  <div className="flex items-center gap-1.5"><Target className="h-4 w-4" />Pass: {test.passingScore}%</div>
                  {test.negativeMarking && <div className="flex items-center gap-1.5 text-warning"><AlertTriangle className="h-4 w-4" />Negative marking</div>}
                </div>
                <Link to={`/tests/${test.id}`}><Button className="w-full">Start Test</Button></Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
