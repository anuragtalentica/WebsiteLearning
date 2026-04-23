import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '@/api/apiClient';
import type { ApiResponse, MockTest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle, Target, FlaskConical, X } from 'lucide-react';

export default function MockTestsPage() {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [certFilter, setCertFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    apiClient.get<ApiResponse<MockTest[]>>('/mocktests')
      .then(r => { if (r.data.data) setTests(r.data.data); })
      .finally(() => setLoading(false));
  }, []);

  // Unique certifications from tests for filter dropdown
  const certOptions = useMemo(() => {
    const names = tests
      .map(t => t.certificationName)
      .filter((n): n is string => !!n);
    return [...new Set(names)].sort();
  }, [tests]);

  const filtered = useMemo(() => tests.filter(t => {
    if (certFilter && t.certificationName !== certFilter) return false;
    if (typeFilter && t.type !== typeFilter) return false;
    return true;
  }), [tests, certFilter, typeFilter]);

  const hasFilters = certFilter || typeFilter;

  const selectClass = "h-9 rounded-md border border-input bg-background px-3 text-sm";

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold mb-2">Mock Tests & Exams</h1>
      <p className="text-muted-foreground mb-6">Timed practice tests to prepare for your certification exams</p>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={certFilter}
          onChange={e => setCertFilter(e.target.value)}
          className={selectClass}
          style={{ color: 'inherit' }}
        >
          <option value="">All Certifications</option>
          {certOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className={selectClass}
          style={{ color: 'inherit' }}
        >
          <option value="">All Types</option>
          <option value="mock">Practice Test</option>
          <option value="exam">Full Exam</option>
        </select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={() => { setCertFilter(''); setTypeFilter(''); }} className="gap-1">
            <X className="h-3 w-3" /> Clear filters
          </Button>
        )}

        <span className="ml-auto text-sm text-muted-foreground">
          {filtered.length} of {tests.length} tests
        </span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FlaskConical className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No tests match your filters</p>
          <p className="text-sm mt-1">Try adjusting or clearing your filters</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => { setCertFilter(''); setTypeFilter(''); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((test, i) => (
            <motion.div key={test.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className="h-full hover:border-primary/30 transition-all flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant={test.type === 'exam' ? 'destructive' : 'default'}>
                      {test.type === 'exam' ? 'Full Exam' : 'Practice Test'}
                    </Badge>
                    {test.certificationName && <Badge variant="outline">{test.certificationName}</Badge>}
                  </div>
                  <CardTitle className="text-base leading-snug">{test.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{test.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{test.durationMinutes} min</div>
                    <div className="flex items-center gap-1.5"><FlaskConical className="h-4 w-4" />{test.questionCount} questions</div>
                    <div className="flex items-center gap-1.5"><Target className="h-4 w-4" />Pass: {test.passingScore}%</div>
                    {test.negativeMarking && (
                      <div className="flex items-center gap-1.5 text-warning">
                        <AlertTriangle className="h-4 w-4" />Negative marking
                      </div>
                    )}
                  </div>
                  <Link to={`/tests/${test.id}`}><Button className="w-full">Start Test</Button></Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
