import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '@/api/apiClient';
import type { ApiResponse, CertPath } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Route, BookOpen, FlaskConical, Calendar, ArrowRight } from 'lucide-react';

export default function CertPathsPage() {
  const [paths, setPaths] = useState<CertPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<ApiResponse<CertPath[]>>('/certpaths')
      .then(r => { if (r.data.data) setPaths(r.data.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold mb-2">Certification Paths</h1>
      <p className="text-muted-foreground mb-8">Follow structured learning paths to achieve your certification goals</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paths.map((path, i) => (
          <motion.div key={path.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="h-full hover:border-primary/30 transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: path.badgeColor || '#6366f1' }} />
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Route className="h-5 w-5" style={{ color: path.badgeColor || '#6366f1' }} />
                  <Badge variant="outline">{path.estimatedWeeks} weeks</Badge>
                </div>
                <CardTitle>{path.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{path.description}</p>
                {path.goal && <p className="text-sm mb-4"><strong className="text-foreground">Goal:</strong> <span className="text-muted-foreground">{path.goal}</span></p>}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" />{path.courseCount} courses</span>
                  <span className="flex items-center gap-1"><FlaskConical className="h-4 w-4" />{path.testCount} tests</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{path.estimatedWeeks} weeks</span>
                </div>
                <Link to={`/paths/${path.id}`}>
                  <Button variant="outline" className="w-full gap-1">View Path <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
