import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import type { ApiResponse, NewsItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

const categoryVariant = (cat?: string) => {
  switch (cat) {
    case 'Cloud': return 'info' as const;
    case 'Programming': return 'success' as const;
    case 'AI': return 'warning' as const;
    case 'Certification': return 'default' as const;
    default: return 'secondary' as const;
  }
};

export default function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    apiClient
      .get<ApiResponse<NewsItem[]>>('/news?count=10')
      .then(res => {
        if (res.data.data) setNews(res.data.data);
      })
      .catch(() => {});
  }, []);

  if (news.length === 0) return null;

  // Duplicate items so the scroll loops seamlessly
  const tickerItems = [...news, ...news];

  return (
    <div className="relative w-full overflow-hidden border-b border-border bg-primary/5">
      <div className="mx-auto flex max-w-7xl items-center">
        {/* LATEST label */}
        <div className="flex-shrink-0 flex items-center gap-2 bg-primary px-4 py-2.5 z-10">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-primary-foreground">Latest</span>
        </div>

        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden">
          <div className="ticker-animate flex items-center whitespace-nowrap">
            {tickerItems.map((item, idx) => (
              <a
                key={`${item.id}-${idx}`}
                href={item.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm hover:text-primary transition-colors group"
              >
                <Badge variant={categoryVariant(item.category)} className="text-[10px] px-1.5 py-0">
                  {item.category}
                </Badge>
                <span className="font-medium">{item.title}</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-muted-foreground/40 mx-2">•</span>
              </a>
            ))}
          </div>
        </div>

        {/* View all link */}
        <Link
          to="/news"
          className="flex-shrink-0 px-4 py-2.5 text-xs font-medium text-primary hover:underline hidden sm:block"
        >
          View All →
        </Link>
      </div>
    </div>
  );
}
