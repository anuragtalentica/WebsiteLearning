import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '@/api/apiClient';
import type { ApiResponse, Certification } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Target, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LeaderboardEntry {
  rank: number;
  displayName: string;
  testsPassed: number;
  averageScore: number;
  bestScore: number;
  totalCorrect: number;
}

const RANK_STYLES: Record<number, { icon: React.ReactNode; badge: string }> = {
  1: { icon: <Trophy className="h-5 w-5 text-yellow-400" />, badge: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30' },
  2: { icon: <Medal className="h-5 w-5 text-slate-400" />, badge: 'bg-slate-400/10 text-slate-400 border-slate-400/30' },
  3: { icon: <Medal className="h-5 w-5 text-amber-600" />, badge: 'bg-amber-600/10 text-amber-600 border-amber-600/30' },
};

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [certs, setCerts] = useState<Certification[]>([]);
  const [selectedCert, setSelectedCert] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<ApiResponse<Certification[]>>('/certifications')
      .then(r => { if (r.data.data) setCerts(r.data.data); });
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = selectedCert
      ? `/leaderboard/certification/${selectedCert}`
      : '/leaderboard';
    apiClient.get<ApiResponse<LeaderboardEntry[]>>(url)
      .then(r => { if (r.data.data) setEntries(r.data.data); })
      .finally(() => setLoading(false));
  }, [selectedCert]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">Top performers ranked by average score on passed tests</p>
        </div>

        {/* Filter */}
        <div className="flex justify-center mb-6">
          <select
            value={selectedCert ?? ''}
            onChange={e => setSelectedCert(e.target.value ? Number(e.target.value) : null)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm min-w-48"
            style={{ color: 'inherit' }}
          >
            <option value="" style={{ background: '#fff', color: '#000' }}>Global Leaderboard</option>
            {certs.map(c => (
              <option key={c.id} value={c.id} style={{ background: '#fff', color: '#000' }}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {selectedCert
                ? `${certs.find(c => c.id === selectedCert)?.code ?? ''} Rankings`
                : 'Global Rankings'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No data yet. Be the first to pass a test!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry, i) => {
                  const style = RANK_STYLES[entry.rank];
                  const isMe = !!user?.fullName && entry.displayName === user.fullName;
                  return (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex items-center gap-4 rounded-lg border p-4 ${
                        isMe ? 'border-primary bg-primary/10 ring-1 ring-primary/30' :
                        entry.rank <= 3 ? 'border-primary/20 bg-primary/5' : 'border-border'
                      }`}
                    >
                      {/* Rank */}
                      <div className="w-8 flex justify-center shrink-0">
                        {style ? style.icon : (
                          <span className="text-sm font-bold text-muted-foreground">#{entry.rank}</span>
                        )}
                      </div>

                      {/* Avatar + Name */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-9 w-9 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center shrink-0">
                          {entry.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">
                          {entry.displayName}
                          {isMe && <span className="ml-1.5 text-xs text-primary font-semibold">(You)</span>}
                        </p>
                          <p className="text-xs text-muted-foreground">
                            {entry.testsPassed} test{entry.testsPassed !== 1 ? 's' : ''} passed
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 shrink-0 text-sm">
                        <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
                          <CheckCircle className="h-3.5 w-3.5 text-success" />
                          <span>{entry.totalCorrect}</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
                          <Target className="h-3.5 w-3.5 text-info" />
                          <span>Best {entry.bestScore}%</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`font-bold text-base px-3 ${style?.badge ?? ''}`}
                        >
                          {entry.averageScore}%
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
