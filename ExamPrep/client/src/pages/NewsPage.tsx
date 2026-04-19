import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '@/api/apiClient';
import type { ApiResponse, NewsItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

const categoryVariant = (cat: string) => {
  switch (cat) { case 'Cloud': return 'info' as const; case 'Programming': return 'success' as const; case 'AI': return 'warning' as const; default: return 'secondary' as const; }
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<ApiResponse<NewsItem[]>>('/news?count=50')
      .then(r => { if (r.data.data) setNews(r.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(news.map(n => n.category))];
  const filtered = filter === 'All' ? news : news.filter(n => n.category === filter);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold mb-2">Tech News</h1>
      <p className="text-muted-foreground mb-6">Stay updated with the latest in technology and certifications</p>

      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${filter === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-16 rounded-lg bg-card animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <motion.a key={item.id} href={item.url || '#'} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 rounded-lg border border-border bg-card px-5 py-4 hover:bg-secondary/50 transition-colors group">
              <Badge variant={categoryVariant(item.category)}>{item.category}</Badge>
              <div className="flex-1">
                <h3 className="font-medium text-sm group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
