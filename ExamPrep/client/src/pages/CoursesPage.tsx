import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '@/api/apiClient';
import type { ApiResponse, Certification } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowRight, Search, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const difficultyVariant = (d?: string) => {
  switch (d) {
    case 'Beginner': return 'success' as const;
    case 'Intermediate': return 'warning' as const;
    case 'Advanced': return 'destructive' as const;
    default: return 'secondary' as const;
  }
};

const categoryVariant = (cat?: string) => {
  switch (cat) {
    case 'Cloud': return 'info' as const;
    case 'Programming': return 'success' as const;
    case 'AI': return 'warning' as const;
    default: return 'secondary' as const;
  }
};

export default function CoursesPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<ApiResponse<Certification[]>>('/certifications')
      .then(r => { if (r.data.data) setCerts(r.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(certs.map(c => c.category).filter(Boolean))];
  const difficulties = ['All', ...new Set(certs.map(c => c.difficulty).filter(Boolean))];

  const filtered = certs.filter(c =>
    (categoryFilter === 'All' || c.category === categoryFilter) &&
    (difficultyFilter === 'All' || c.difficulty === difficultyFilter) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) ||
     c.code.toLowerCase().includes(search.toLowerCase()) ||
     c.vendor.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header section with light background */}
      <div className="rounded-xl border border-border bg-card/50 px-6 py-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Course Catalog</h1>
        <p className="text-muted-foreground mb-6">
          Explore our comprehensive library of IT and coding courses designed for all skill levels.
        </p>

        {/* Search + Dropdowns in one row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category dropdown */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className={cn(
              "h-10 rounded-md border border-input bg-background px-3 py-2 text-sm",
              "text-foreground ring-offset-background",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "cursor-pointer min-w-[160px]",
              "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_8px_center] bg-no-repeat pr-8"
            )}
          >
            {categories.map(cat => (
              <option key={cat} value={cat} style={{ background: '#fff', color: '#000' }}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          {/* Level dropdown */}
          <select
            value={difficultyFilter}
            onChange={e => setDifficultyFilter(e.target.value)}
            className={cn(
              "h-10 rounded-md border border-input bg-background px-3 py-2 text-sm",
              "text-foreground ring-offset-background",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "cursor-pointer min-w-[160px]",
              "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_8px_center] bg-no-repeat pr-8"
            )}
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff} style={{ background: '#fff', color: '#000' }}>
                {diff === 'All' ? 'All Levels' : diff}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} {filtered.length === 1 ? 'course' : 'courses'}
        </p>
        {(categoryFilter !== 'All' || difficultyFilter !== 'All' || search) && (
          <button
            onClick={() => { setCategoryFilter('All'); setDifficultyFilter('All'); setSearch(''); }}
            className="text-sm text-primary hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Course grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 rounded-xl bg-card animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No courses found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cert, i) => (
            <motion.div key={cert.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/courses/${cert.id}`}>
                <Card className="h-full hover:border-primary/30 hover:shadow-lg transition-all group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={categoryVariant(cert.category)}>{cert.category || 'General'}</Badge>
                      <Badge variant={difficultyVariant(cert.difficulty)}>{cert.difficulty || 'All Levels'}</Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{cert.code}</CardTitle>
                    <p className="text-sm text-muted-foreground">{cert.vendor} — {cert.name}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{cert.description}</p>
                    <div className="text-sm text-primary font-medium flex items-center">
                      View course <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
