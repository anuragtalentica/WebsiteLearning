import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '@/api/apiClient';
import type { ApiResponse, Certification } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, BookOpen, FlaskConical, Newspaper, ArrowRight, Sparkles } from 'lucide-react';

const categoryVariant = (cat?: string) => {
  switch (cat) { case 'Cloud': return 'info' as const; case 'Programming': return 'success' as const; case 'AI': return 'warning' as const; default: return 'secondary' as const; }
};
const difficultyVariant = (d?: string) => {
  switch (d) { case 'Beginner': return 'success' as const; case 'Intermediate': return 'warning' as const; case 'Advanced': return 'destructive' as const; default: return 'secondary' as const; }
};

interface PlatformStats {
  certifications: number;
  practiceQuestions: number;
  mockTests: number;
  learningPaths: number;
}

export default function HomePage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get<ApiResponse<Certification[]>>('/certifications'),
      apiClient.get<ApiResponse<PlatformStats>>('/stats'),
    ]).then(([certRes, statsRes]) => {
      if (certRes.data.data) setCertifications(certRes.data.data);
      if (statsRes.data.data) setPlatformStats(statsRes.data.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-6">
              <Sparkles className="h-4 w-4" /> Your certification journey starts here
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              Master IT Certifications<br /><span className="text-gradient">with Confidence</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
              Practice with real-world exam questions, take timed mock tests, and follow structured learning paths.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/courses"><Button size="lg" className="gap-2"><BookOpen className="h-5 w-5" />Browse Courses</Button></Link>
              <Link to="/tests"><Button variant="outline" size="lg" className="gap-2"><FlaskConical className="h-5 w-5" />Take a Mock Test</Button></Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Certifications', value: platformStats?.certifications ?? certifications.length, icon: GraduationCap },
              { label: 'Practice Questions', value: platformStats ? `${platformStats.practiceQuestions}+` : '...', icon: BookOpen },
              { label: 'Mock Tests', value: platformStats ? `${platformStats.mockTests}+` : '...', icon: FlaskConical },
              { label: 'Learning Paths', value: platformStats ? `${platformStats.learningPaths}+` : '...', icon: Newspaper },
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-border bg-card/50 p-4 text-center">
                <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 space-y-16">
        {/* Certifications */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="h-5 w-5 text-primary" /><h2 className="text-2xl font-bold">Featured Certifications</h2>
            <Link to="/courses" className="ml-auto text-sm text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="h-48 rounded-xl bg-card animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.slice(0, 6).map((cert, i) => (
                <motion.div key={cert.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link to={`/courses/${cert.id}`}>
                    <Card className="h-full hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={categoryVariant(cert.category)}>{cert.category || 'General'}</Badge>
                          <Badge variant={difficultyVariant(cert.difficulty)}>{cert.difficulty || 'All Levels'}</Badge>
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors">{cert.code}</CardTitle>
                        <p className="text-sm text-muted-foreground">{cert.vendor}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">{cert.description}</p>
                        <div className="mt-4 flex items-center text-sm text-primary font-medium">Explore course <ArrowRight className="h-4 w-4 ml-1" /></div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
