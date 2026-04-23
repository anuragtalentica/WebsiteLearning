import { useEffect, useState } from 'react';
import apiClient from '@/api/apiClient';
import type { ApiResponse, Certification } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LayoutDashboard, BookOpen, HelpCircle, ClipboardList,
  Users, Plus, Pencil, Trash2, Upload, Download, X, Check, ChevronDown, Newspaper, Layers, Mail, Eye
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────

interface AdminStats {
  totalUsers: number;
  totalQuestions: number;
  totalTestsTaken: number;
  totalCertifications: number;
  popularCourses: { id: number; name: string; code: string; topicCount: number }[];
}

interface AdminTopic { id: number; name: string; orderIndex: number; certificationId: number; }
interface AdminOption { id: number; optionText: string; isCorrect: boolean; orderIndex: number; }
interface AdminQuestion {
  id: number; questionText: string; explanation?: string; imageUrl?: string;
  difficultyLevel: number; topicId: number; options: AdminOption[];
}
interface AdminMockTest {
  id: number; title: string; description?: string; type: string;
  certificationId?: number; durationMinutes: number;
  negativeMarkingValue: number; passingScore: number; questionCount: number;
}
interface AdminUser { id: string; email: string; role: string; }
interface AdminNews { id: number; title: string; category: string; url?: string; publishedAt: string; }
interface AdminModule { id: number; title: string; orderIndex: number; certificationId: number; lessonCount: number; }
interface AdminLesson {
  id: number; title: string; content: string; codeExample?: string;
  codeLanguage?: string; externalLinks?: string; orderIndex: number; moduleId: number;
}

// ── Tab names ──────────────────────────────────────────────────────────

type Tab = 'dashboard' | 'certifications' | 'questions' | 'mocktests' | 'news' | 'content' | 'users' | 'messages';

// ── Main Component ─────────────────────────────────────────────────────

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'certifications', label: 'Certifications', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'questions', label: 'Questions', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'mocktests', label: 'Mock Tests', icon: <ClipboardList className="h-4 w-4" /> },
    { id: 'news', label: 'News', icon: <Newspaper className="h-4 w-4" /> },
    { id: 'content', label: 'Content', icon: <Layers className="h-4 w-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="h-4 w-4" /> },
    { id: 'messages', label: 'Messages', icon: <Mail className="h-4 w-4" /> },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {/* Tab bar */}
      <div className="flex gap-0.5 border-b border-border mb-6 overflow-x-auto scrollbar-none">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && <DashboardTab />}
      {tab === 'certifications' && <CertificationsTab />}
      {tab === 'questions' && <QuestionsTab />}
      {tab === 'mocktests' && <MockTestsTab />}
      {tab === 'news' && <NewsTab />}
      {tab === 'content' && <ContentTab />}
      {tab === 'users' && <UsersTab />}
      {tab === 'messages' && <MessagesTab />}
    </div>
  );
}

// ── Dashboard Tab ──────────────────────────────────────────────────────

function DashboardTab() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    apiClient.get<ApiResponse<AdminStats>>('/admin/stats').then(r => {
      if (r.data.data) setStats(r.data.data);
    });
  }, []);

  if (!stats) return <div className="text-muted-foreground">Loading stats...</div>;

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, color: 'text-blue-500' },
    { label: 'Total Questions', value: stats.totalQuestions, color: 'text-green-500' },
    { label: 'Tests Taken', value: stats.totalTestsTaken, color: 'text-purple-500' },
    { label: 'Certifications', value: stats.totalCertifications, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Certifications Overview</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2">Code</th><th className="pb-2">Name</th><th className="pb-2">Topics</th>
                </tr>
              </thead>
              <tbody>
                {stats.popularCourses.map(c => (
                  <tr key={c.id} className="border-b border-border/50">
                    <td className="py-2 font-mono text-xs">{c.code}</td>
                    <td className="py-2">{c.name}</td>
                    <td className="py-2">{c.topicCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Certifications Tab ─────────────────────────────────────────────────

const REQUIRED_CERT_FIELDS = ['vendor', 'name', 'code', 'category', 'difficulty'] as const;

function CertificationsTab() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [editing, setEditing] = useState<Partial<Certification> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [formError, setFormError] = useState('');

  const load = () => apiClient.get<ApiResponse<Certification[]>>('/certifications').then(r => {
    if (r.data.data) setCerts(r.data.data.filter(c => c.code && c.name));
  });

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const missing = REQUIRED_CERT_FIELDS.filter(f => !((editing as any)[f]?.trim()));
    if (missing.length) {
      setFormError(`Required: ${missing.join(', ')}`);
      return;
    }
    setFormError('');
    if (isNew) {
      await apiClient.post('/admin/certifications', editing);
    } else {
      await apiClient.put(`/admin/certifications/${editing.id}`, editing);
    }
    setEditing(null);
    setIsNew(false);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this certification and ALL its topics, questions, and lessons?')) return;
    await apiClient.delete(`/admin/certifications/${id}`);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => { setEditing({}); setIsNew(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Add Certification
        </Button>
      </div>

      {editing && (
        <Card>
          <CardHeader><CardTitle className="text-base">{isNew ? 'New Certification' : 'Edit Certification'}</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(['vendor', 'name', 'code', 'category', 'difficulty', 'description'] as const).map(field => {
              const required = REQUIRED_CERT_FIELDS.includes(field as any);
              return (
                <div key={field}>
                  <label className="text-xs text-muted-foreground capitalize">
                    {field}{required && <span className="text-destructive ml-0.5">*</span>}
                  </label>
                  <Input
                    value={(editing as any)[field] ?? ''}
                    onChange={e => { setFormError(''); setEditing(prev => ({ ...prev, [field]: e.target.value })); }}
                    placeholder={field}
                    className="mt-1"
                  />
                </div>
              );
            })}
            {formError && <p className="sm:col-span-2 text-xs text-destructive">{formError}</p>}
            <div className="sm:col-span-2 flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => { setEditing(null); setIsNew(false); setFormError(''); }}>Cancel</Button>
              <Button size="sm" onClick={save}>Save</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2">Code</th><th className="pb-2">Name</th>
                <th className="pb-2">Category</th><th className="pb-2">Difficulty</th><th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {certs.map(c => (
                <tr key={c.id} className="border-b border-border/50">
                  <td className="py-2 font-mono text-xs">{c.code}</td>
                  <td className="py-2">{c.vendor} — {c.name}</td>
                  <td className="py-2"><Badge variant="secondary">{c.category}</Badge></td>
                  <td className="py-2"><Badge variant="outline">{c.difficulty}</Badge></td>
                  <td className="py-2">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => { setEditing(c); setIsNew(false); }}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => remove(c.id)}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Questions Tab ──────────────────────────────────────────────────────

function QuestionsTab() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [selectedCert, setSelectedCert] = useState<number | null>(null);
  const [topics, setTopics] = useState<AdminTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [editing, setEditing] = useState<Partial<AdminQuestion> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkJson, setBulkJson] = useState('');
  const [bulkError, setBulkError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    apiClient.get<ApiResponse<Certification[]>>('/certifications').then(r => {
      if (r.data.data) setCerts(r.data.data);
    });
  }, []);

  useEffect(() => {
    if (!selectedCert) return;
    apiClient.get<ApiResponse<AdminTopic[]>>(`/admin/topics/${selectedCert}`).then(r => {
      if (r.data.data) setTopics(r.data.data);
      setSelectedTopic(null);
      setQuestions([]);
    });
  }, [selectedCert]);

  useEffect(() => {
    if (!selectedTopic) return;
    apiClient.get<ApiResponse<AdminQuestion[]>>(`/admin/questions/topic/${selectedTopic}`).then(r => {
      if (r.data.data) setQuestions(r.data.data);
    });
  }, [selectedTopic]);

  const loadQuestions = () => {
    if (!selectedTopic) return;
    apiClient.get<ApiResponse<AdminQuestion[]>>(`/admin/questions/topic/${selectedTopic}`).then(r => {
      if (r.data.data) setQuestions(r.data.data);
    });
  };

  const blankQuestion = (): Partial<AdminQuestion> => ({
    questionText: '', explanation: '', imageUrl: '', difficultyLevel: 1, topicId: selectedTopic ?? 0,
    options: [
      { id: 0, optionText: '', isCorrect: true, orderIndex: 1 },
      { id: 0, optionText: '', isCorrect: false, orderIndex: 2 },
      { id: 0, optionText: '', isCorrect: false, orderIndex: 3 },
      { id: 0, optionText: '', isCorrect: false, orderIndex: 4 },
    ]
  });

  const setCorrectOption = (idx: number) => {
    setEditing(prev => ({
      ...prev,
      options: prev?.options?.map((o, i) => ({ ...o, isCorrect: i === idx })) ?? []
    }));
  };

  const updateOption = (idx: number, text: string) => {
    setEditing(prev => ({
      ...prev,
      options: prev?.options?.map((o, i) => i === idx ? { ...o, optionText: text } : o) ?? []
    }));
  };

  const save = async () => {
    if (!editing) return;
    if (isNew) {
      await apiClient.post('/admin/questions', { ...editing, topicId: selectedTopic });
    } else {
      await apiClient.put(`/admin/questions/${editing.id}`, editing);
    }
    setEditing(null);
    loadQuestions();
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this question?')) return;
    await apiClient.delete(`/admin/questions/${id}`);
    loadQuestions();
  };

  const downloadTemplate = () => {
    const headers = 'QuestionText,OptionA,OptionB,OptionC,OptionD,CorrectAnswer,Explanation,DifficultyLevel,TopicId';
    const example = `"What is Azure?","A cloud platform","A database","An OS","A browser","A","Microsoft's cloud platform",1,${selectedTopic ?? 1}`;
    const blob = new Blob([headers + '\n' + example], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'questions_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkImport = async () => {
    setBulkError('');
    try {
      const rows = bulkJson.trim().split('\n').slice(1); // skip header
      const questions = rows.map(row => {
        const cols = row.match(/(".*?"|[^,]+)(?=,|$)/g)?.map(c => c.replace(/^"|"$/g, '').trim()) ?? [];
        return {
          questionText: cols[0] ?? '',
          optionA: cols[1] ?? '',
          optionB: cols[2] ?? '',
          optionC: cols[3] ?? '',
          optionD: cols[4] ?? '',
          correctAnswer: (cols[5] ?? 'A').toUpperCase(),
          explanation: cols[6] ?? '',
          difficultyLevel: parseInt(cols[7] ?? '1') || 1,
          topicId: parseInt(cols[8] ?? String(selectedTopic ?? 0)) || (selectedTopic ?? 0),
        };
      });
      await apiClient.post('/admin/questions/bulk-import', { questions });
      setShowBulk(false);
      setBulkJson('');
      loadQuestions();
    } catch {
      setBulkError('Import failed. Check your CSV format.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Selectors */}
      <div className="flex flex-wrap gap-3">
        <select
          value={selectedCert ?? ''}
          onChange={e => setSelectedCert(Number(e.target.value))}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          style={{ color: 'inherit' }}
        >
          <option value="" style={{ background: '#fff', color: '#000' }}>Select Certification</option>
          {certs.map(c => <option key={c.id} value={c.id} style={{ background: '#fff', color: '#000' }}>{c.code} — {c.name}</option>)}
        </select>

        {topics.length > 0 && (
          <select
            value={selectedTopic ?? ''}
            onChange={e => setSelectedTopic(Number(e.target.value))}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            style={{ color: 'inherit' }}
          >
            <option value="" style={{ background: '#fff', color: '#000' }}>Select Topic</option>
            {topics.map(t => <option key={t.id} value={t.id} style={{ background: '#fff', color: '#000' }}>{t.name}</option>)}
          </select>
        )}

        {selectedTopic && (
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="h-3 w-3 mr-1" /> Template
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowBulk(!showBulk)}>
              <Upload className="h-3 w-3 mr-1" /> Bulk Import
            </Button>
            <Button size="sm" onClick={() => { setEditing(blankQuestion()); setIsNew(true); }}>
              <Plus className="h-3 w-3 mr-1" /> Add Question
            </Button>
          </div>
        )}
      </div>

      {/* Bulk Import */}
      {showBulk && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Paste CSV content (including header row)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <textarea
              className="w-full h-40 rounded-md border border-input bg-background px-3 py-2 text-xs font-mono"
              placeholder="QuestionText,OptionA,OptionB,OptionC,OptionD,CorrectAnswer,Explanation,DifficultyLevel,TopicId"
              value={bulkJson}
              onChange={e => setBulkJson(e.target.value)}
            />
            {bulkError && <p className="text-xs text-destructive">{bulkError}</p>}
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowBulk(false)}>Cancel</Button>
              <Button size="sm" onClick={handleBulkImport}>Import</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit / New Question Form */}
      {editing && (
        <Card>
          <CardHeader><CardTitle className="text-sm">{isNew ? 'New Question' : 'Edit Question'}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Question Text</label>
              <textarea
                className="w-full mt-1 h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editing.questionText ?? ''}
                onChange={e => setEditing(p => ({ ...p, questionText: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Options (click radio to set correct)</label>
              {editing.options?.map((opt, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={opt.isCorrect}
                    onChange={() => setCorrectOption(i)}
                    className="cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground w-4">{String.fromCharCode(65 + i)}</span>
                  <Input
                    value={opt.optionText}
                    onChange={e => updateOption(i, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    className="h-8 text-sm"
                  />
                  {opt.isCorrect && <Check className="h-4 w-4 text-green-500 shrink-0" />}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Difficulty (1–3)</label>
                <Input
                  type="number" min={1} max={3}
                  value={editing.difficultyLevel ?? 1}
                  onChange={e => setEditing(p => ({ ...p, difficultyLevel: Number(e.target.value) }))}
                  className="mt-1 h-8"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Explanation</label>
                <Input
                  value={editing.explanation ?? ''}
                  onChange={e => setEditing(p => ({ ...p, explanation: e.target.value }))}
                  className="mt-1 h-8"
                  placeholder="Why is this the correct answer?"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Image URL (optional)</label>
              <Input
                value={editing.imageUrl ?? ''}
                onChange={e => setEditing(p => ({ ...p, imageUrl: e.target.value }))}
                className="mt-1 h-8"
                placeholder="https://example.com/image.png"
              />
              {editing.imageUrl && (
                <img src={editing.imageUrl} alt="Question preview" className="mt-2 max-h-40 rounded border border-border object-contain" />
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
              <Button size="sm" onClick={save}>Save</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      {questions.length > 0 && !editing && (
        <Input
          placeholder="Search questions..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="h-9"
        />
      )}

      {/* Questions list */}
      {questions.length > 0 && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            {questions.filter(q =>
              !searchTerm || q.questionText.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((q, i) => (
              <div key={q.id} className="border border-border rounded-lg p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{i + 1}. {q.questionText}</p>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(q); setIsNew(false); }}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(q.id)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {q.options.map((o, oi) => (
                    <span key={oi} className={`text-xs px-2 py-0.5 rounded ${o.isCorrect ? 'bg-green-500/20 text-green-600 font-medium' : 'text-muted-foreground'}`}>
                      {String.fromCharCode(65 + oi)}. {o.optionText}
                    </span>
                  ))}
                </div>
                {q.explanation && <p className="text-xs text-muted-foreground mt-1 italic">💡 {q.explanation}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {selectedTopic && questions.length === 0 && !editing && (
        <p className="text-center text-muted-foreground text-sm py-8">No questions yet. Add one or bulk import.</p>
      )}
      {!selectedTopic && (
        <p className="text-center text-muted-foreground text-sm py-8">Select a certification and topic to manage questions.</p>
      )}
    </div>
  );
}

// ── Mock Tests Tab ─────────────────────────────────────────────────────

function MockTestsTab() {
  const [tests, setTests] = useState<AdminMockTest[]>([]);
  const [certs, setCerts] = useState<Certification[]>([]);
  const [topics, setTopics] = useState<AdminTopic[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', type: 'mock', certificationId: '',
    topicId: '', questionCount: 10, durationMinutes: 30,
    negativeMarkingValue: 0, passingScore: 70
  });
  const [error, setError] = useState('');

  const load = () => {
    apiClient.get<ApiResponse<AdminMockTest[]>>('/admin/mocktests').then(r => {
      if (r.data.data) setTests(r.data.data);
    });
    apiClient.get<ApiResponse<Certification[]>>('/certifications').then(r => {
      if (r.data.data) setCerts(r.data.data);
    });
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!form.certificationId) return;
    apiClient.get<ApiResponse<AdminTopic[]>>(`/admin/topics/${form.certificationId}`).then(r => {
      if (r.data.data) setTopics(r.data.data);
    });
  }, [form.certificationId]);

  const create = async () => {
    setError('');
    try {
      await apiClient.post('/admin/mocktests', {
        ...form,
        certificationId: form.certificationId ? Number(form.certificationId) : null,
        topicId: Number(form.topicId),
        questionCount: Number(form.questionCount),
        durationMinutes: Number(form.durationMinutes),
        negativeMarkingValue: Number(form.negativeMarkingValue),
        passingScore: Number(form.passingScore),
      });
      setShowForm(false);
      setForm({ title: '', description: '', type: 'mock', certificationId: '', topicId: '', questionCount: 10, durationMinutes: 30, negativeMarkingValue: 0, passingScore: 70 });
      load();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create mock test.');
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this mock test?')) return;
    await apiClient.delete(`/admin/mocktests/${id}`);
    load();
  };

  const selectStyle = "h-9 rounded-md border border-input bg-background px-3 text-sm w-full";

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" /> Create Mock Test
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-sm">New Mock Test</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground">Title</label>
              <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground">Description</label>
              <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="mt-1" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className={`mt-1 ${selectStyle}`}>
                <option value="mock" style={{ background: '#fff', color: '#000' }}>Mock</option>
                <option value="exam" style={{ background: '#fff', color: '#000' }}>Exam</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Certification</label>
              <select value={form.certificationId} onChange={e => setForm(p => ({ ...p, certificationId: e.target.value, topicId: '' }))} className={`mt-1 ${selectStyle}`}>
                <option value="" style={{ background: '#fff', color: '#000' }}>None</option>
                {certs.map(c => <option key={c.id} value={c.id} style={{ background: '#fff', color: '#000' }}>{c.code}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Topic (source of questions) *</label>
              <select value={form.topicId} onChange={e => setForm(p => ({ ...p, topicId: e.target.value }))} className={`mt-1 ${selectStyle}`}>
                <option value="" style={{ background: '#fff', color: '#000' }}>Select Topic</option>
                {topics.map(t => <option key={t.id} value={t.id} style={{ background: '#fff', color: '#000' }}>{t.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Question Count</label>
              <Input type="number" min={1} value={form.questionCount} onChange={e => setForm(p => ({ ...p, questionCount: Number(e.target.value) }))} className="mt-1" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Duration (minutes)</label>
              <Input type="number" min={1} value={form.durationMinutes} onChange={e => setForm(p => ({ ...p, durationMinutes: Number(e.target.value) }))} className="mt-1" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Negative Marking (0 = disabled, e.g. 0.25)</label>
              <Input type="number" min={0} max={1} step={0.25} value={form.negativeMarkingValue} onChange={e => setForm(p => ({ ...p, negativeMarkingValue: Number(e.target.value) }))} className="mt-1" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Passing Score (%)</label>
              <Input type="number" min={1} max={100} value={form.passingScore} onChange={e => setForm(p => ({ ...p, passingScore: Number(e.target.value) }))} className="mt-1" />
            </div>

            {error && <p className="sm:col-span-2 text-xs text-destructive">{error}</p>}
            <div className="sm:col-span-2 flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button size="sm" onClick={create}>Create</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2">Title</th><th className="pb-2">Type</th>
                <th className="pb-2">Duration</th><th className="pb-2">Questions</th><th className="pb-2">Pass%</th><th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {tests.map(t => (
                <tr key={t.id} className="border-b border-border/50">
                  <td className="py-2">{t.title}</td>
                  <td className="py-2"><Badge variant="secondary">{t.type}</Badge></td>
                  <td className="py-2">{t.durationMinutes}m</td>
                  <td className="py-2">{t.questionCount}</td>
                  <td className="py-2">{t.passingScore}%</td>
                  <td className="py-2">
                    <Button variant="ghost" size="sm" onClick={() => remove(t.id)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {tests.length === 0 && <p className="text-center text-muted-foreground text-sm py-6">No mock tests yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

// ── News Tab ───────────────────────────────────────────────────────────

const NEWS_CATEGORIES = ['Cloud', 'AI', 'General', 'Programming', 'Security', 'DevOps'];

function NewsTab() {
  const [news, setNews] = useState<AdminNews[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Cloud', url: '' });
  const [formError, setFormError] = useState('');

  const load = () => apiClient.get<ApiResponse<AdminNews[]>>('/news?count=50').then(r => {
    if (r.data.data) setNews(r.data.data);
  });

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.title.trim()) { setFormError('Title is required.'); return; }
    setFormError('');
    await apiClient.post('/news', { ...form, publishedAt: new Date().toISOString() });
    setShowForm(false);
    setForm({ title: '', category: 'Cloud', url: '' });
    load();
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this news item?')) return;
    await apiClient.delete(`/news/${id}`);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" /> Add News
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-sm">New News Item</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Title <span className="text-destructive">*</span></label>
              <Input value={form.title} onChange={e => { setFormError(''); setForm(p => ({ ...p, title: e.target.value })); }} className="mt-1" placeholder="e.g. AWS Launches New Region in Southeast Asia" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {NEWS_CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#fff', color: '#000' }}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">URL (optional)</label>
                <Input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} className="mt-1" placeholder="https://..." />
              </div>
            </div>
            {formError && <p className="text-xs text-destructive">{formError}</p>}
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setFormError(''); }}>Cancel</Button>
              <Button size="sm" onClick={create}>Add</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2">Title</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Date</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {news.map(n => (
                <tr key={n.id} className="border-b border-border/50">
                  <td className="py-2">
                    {n.url ? <a href={n.url} target="_blank" rel="noreferrer" className="hover:text-primary hover:underline">{n.title}</a> : n.title}
                  </td>
                  <td className="py-2"><Badge variant="secondary">{n.category}</Badge></td>
                  <td className="py-2 text-muted-foreground text-xs">{new Date(n.publishedAt).toLocaleDateString()}</td>
                  <td className="py-2">
                    <Button variant="ghost" size="sm" onClick={() => remove(n.id)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {news.length === 0 && <p className="text-center text-muted-foreground text-sm py-6">No news items yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Content Tab (Modules & Lessons) ───────────────────────────────────

function ContentTab() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [selectedCert, setSelectedCert] = useState<number | null>(null);
  const [modules, setModules] = useState<AdminModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<AdminModule | null>(null);
  const [lessons, setLessons] = useState<AdminLesson[]>([]);

  // Module form
  const [editingModule, setEditingModule] = useState<Partial<AdminModule> | null>(null);
  const [isNewModule, setIsNewModule] = useState(false);

  // Lesson form
  const [editingLesson, setEditingLesson] = useState<Partial<AdminLesson> | null>(null);
  const [isNewLesson, setIsNewLesson] = useState(false);

  useEffect(() => {
    apiClient.get<ApiResponse<Certification[]>>('/certifications').then(r => {
      if (r.data.data) setCerts(r.data.data);
    });
  }, []);

  const loadModules = (certId: number) => {
    apiClient.get<ApiResponse<AdminModule[]>>(`/admin/modules/${certId}`).then(r => {
      if (r.data.data) setModules(r.data.data);
    });
  };

  const loadLessons = (moduleId: number) => {
    apiClient.get<ApiResponse<AdminLesson[]>>(`/admin/lessons/${moduleId}`).then(r => {
      if (r.data.data) setLessons(r.data.data);
    });
  };

  const saveModule = async () => {
    if (!editingModule?.title?.trim()) return;
    if (isNewModule) {
      await apiClient.post('/admin/modules', { ...editingModule, certificationId: selectedCert });
    } else {
      await apiClient.put(`/admin/modules/${editingModule.id}`, editingModule);
    }
    setEditingModule(null);
    if (selectedCert) loadModules(selectedCert);
  };

  const deleteModule = async (id: number) => {
    if (!confirm('Delete this module and all its lessons?')) return;
    await apiClient.delete(`/admin/modules/${id}`);
    if (selectedModule?.id === id) { setSelectedModule(null); setLessons([]); }
    if (selectedCert) loadModules(selectedCert);
  };

  const saveLesson = async () => {
    if (!editingLesson?.title?.trim()) return;
    if (isNewLesson) {
      await apiClient.post('/admin/lessons', { ...editingLesson, moduleId: selectedModule?.id });
    } else {
      await apiClient.put(`/admin/lessons/${editingLesson.id}`, editingLesson);
    }
    setEditingLesson(null);
    if (selectedModule) loadLessons(selectedModule.id);
  };

  const deleteLesson = async (id: number) => {
    if (!confirm('Delete this lesson?')) return;
    await apiClient.delete(`/admin/lessons/${id}`);
    if (selectedModule) loadLessons(selectedModule.id);
  };

  const selectStyle = "h-9 rounded-md border border-input bg-background px-3 text-sm";

  return (
    <div className="space-y-6">
      {/* Cert selector */}
      <div className="flex items-center gap-3">
        <select
          value={selectedCert ?? ''}
          onChange={e => {
            const id = Number(e.target.value);
            setSelectedCert(id || null);
            setSelectedModule(null);
            setLessons([]);
            setModules([]);
            if (id) loadModules(id);
          }}
          className={selectStyle}
          style={{ color: 'inherit' }}
        >
          <option value="" style={{ background: '#fff', color: '#000' }}>Select Certification</option>
          {certs.map(c => <option key={c.id} value={c.id} style={{ background: '#fff', color: '#000' }}>{c.code} — {c.name}</option>)}
        </select>
      </div>

      {selectedCert && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ── Modules column ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Modules</h3>
              <Button size="sm" onClick={() => { setEditingModule({ title: '', orderIndex: modules.length + 1 }); setIsNewModule(true); }}>
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>

            {editingModule && (
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Title</label>
                    <Input value={editingModule.title ?? ''} onChange={e => setEditingModule(p => ({ ...p, title: e.target.value }))} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Order</label>
                    <Input type="number" value={editingModule.orderIndex ?? 1} onChange={e => setEditingModule(p => ({ ...p, orderIndex: Number(e.target.value) }))} className="mt-1 h-8" />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setEditingModule(null)}>Cancel</Button>
                    <Button size="sm" onClick={saveModule}>Save</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="pt-4 space-y-2">
                {modules.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No modules yet.</p>}
                {modules.map(m => (
                  <div key={m.id}
                    onClick={() => { setSelectedModule(m); loadLessons(m.id); setEditingLesson(null); }}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${selectedModule?.id === m.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary/50'}`}>
                    <div>
                      <p className="text-sm font-medium">{m.title}</p>
                      <p className="text-xs text-muted-foreground">{m.lessonCount} lesson{m.lessonCount !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setEditingModule(m); setIsNewModule(false); }}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); deleteModule(m.id); }}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* ── Lessons column ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">
                {selectedModule ? `Lessons: ${selectedModule.title}` : 'Lessons'}
              </h3>
              {selectedModule && (
                <Button size="sm" onClick={() => { setEditingLesson({ title: '', content: '', orderIndex: lessons.length + 1, moduleId: selectedModule.id }); setIsNewLesson(true); }}>
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              )}
            </div>

            {!selectedModule && (
              <p className="text-sm text-muted-foreground text-center py-8">Select a module to manage lessons.</p>
            )}

            {/* Lesson edit form */}
            {editingLesson && (
              <Card>
                <CardHeader><CardTitle className="text-sm">{isNewLesson ? 'New Lesson' : 'Edit Lesson'}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Title <span className="text-destructive">*</span></label>
                    <Input value={editingLesson.title ?? ''} onChange={e => setEditingLesson(p => ({ ...p, title: e.target.value }))} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Content (HTML) <span className="text-destructive">*</span></label>
                    <textarea
                      className="w-full mt-1 h-48 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                      value={editingLesson.content ?? ''}
                      onChange={e => setEditingLesson(p => ({ ...p, content: e.target.value }))}
                      placeholder="<p>Lesson content here...</p>"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Code Example</label>
                      <textarea
                        className="w-full mt-1 h-24 rounded-md border border-input bg-background px-3 py-2 text-xs font-mono"
                        value={editingLesson.codeExample ?? ''}
                        onChange={e => setEditingLesson(p => ({ ...p, codeExample: e.target.value }))}
                        placeholder="Optional code snippet..."
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Code Language</label>
                      <Input value={editingLesson.codeLanguage ?? ''} onChange={e => setEditingLesson(p => ({ ...p, codeLanguage: e.target.value }))} className="mt-1" placeholder="e.g. typescript, python" />
                      <label className="text-xs text-muted-foreground mt-2 block">Order</label>
                      <Input type="number" value={editingLesson.orderIndex ?? 1} onChange={e => setEditingLesson(p => ({ ...p, orderIndex: Number(e.target.value) }))} className="mt-1 h-8" />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setEditingLesson(null)}>Cancel</Button>
                    <Button size="sm" onClick={saveLesson}>Save</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedModule && !editingLesson && (
              <Card>
                <CardContent className="pt-4 space-y-2">
                  {lessons.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No lessons yet.</p>}
                  {lessons.map(l => (
                    <div key={l.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50">
                      <div>
                        <p className="text-sm font-medium">{l.orderIndex}. {l.title}</p>
                        {l.codeLanguage && <span className="text-xs text-muted-foreground font-mono">{l.codeLanguage}</span>}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingLesson(l); setIsNewLesson(false); }}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteLesson(l.id)}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Users Tab ──────────────────────────────────────────────────────────

function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const load = () => apiClient.get<ApiResponse<AdminUser[]>>('/admin/users').then(r => {
    if (r.data.data) setUsers(r.data.data);
  });

  useEffect(() => { load(); }, []);

  const toggleRole = async (u: AdminUser) => {
    if (!confirm(`Change ${u.email} to ${u.role === 'Admin' ? 'User' : 'Admin'}?`)) return;
    setTogglingId(u.id);
    try {
      const newRole = u.role === 'Admin' ? 'User' : 'Admin';
      await apiClient.post(`/admin/users/${u.id}/role`, { role: newRole });
      load();
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-2">Email</th>
              <th className="pb-2">Role</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-border/50">
                <td className="py-2">{u.email}</td>
                <td className="py-2">
                  <Badge variant={u.role === 'Admin' ? 'destructive' : 'secondary'}>{u.role}</Badge>
                </td>
                <td className="py-2">
                  <Button
                    variant="ghost" size="sm"
                    disabled={togglingId === u.id}
                    onClick={() => toggleRole(u)}
                    className="text-xs h-7"
                  >
                    {u.role === 'Admin' ? 'Demote to User' : 'Make Admin'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {users.length === 0 && <p className="text-center text-muted-foreground text-sm py-6">No users found.</p>}
      </CardContent>
    </Card>
  );
}

// ── Messages Tab ───────────────────────────────────────────────────────

interface ContactMsg {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  submittedAt: string;
  isRead: boolean;
}

function MessagesTab() {
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    apiClient.get<ApiResponse<ContactMsg[]>>('/contact')
      .then(r => { if (r.data.data) setMessages(r.data.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: number) => {
    await apiClient.patch(`/contact/${id}/read`);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  const deleteMsg = async (id: number) => {
    await apiClient.delete(`/contact/${id}`);
    setMessages(prev => prev.filter(m => m.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const unread = messages.filter(m => !m.isRead).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Contact Messages
          {unread > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground font-bold">
              {unread}
            </span>
          )}
        </CardTitle>
        <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />)}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Mail className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No messages yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`rounded-lg border p-4 transition-colors ${
                  msg.isRead ? 'border-border bg-card' : 'border-primary/30 bg-primary/5'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{msg.name}</span>
                      {!msg.isRead && (
                        <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">New</span>
                      )}
                      <span className="text-xs text-muted-foreground">{msg.email}</span>
                      {msg.phone && <span className="text-xs text-muted-foreground">{msg.phone}</span>}
                    </div>
                    {msg.subject && (
                      <p className="text-sm font-medium mt-0.5">{msg.subject}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(msg.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!msg.isRead && (
                      <Button variant="ghost" size="sm" onClick={() => markRead(msg.id)} title="Mark as read">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${expanded === msg.id ? 'rotate-180' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteMsg(msg.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {expanded === msg.id && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{msg.message}</p>
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Your message')}`}
                      className="inline-flex items-center gap-1.5 mt-3 text-xs text-primary hover:underline"
                    >
                      <Mail className="h-3.5 w-3.5" /> Reply via email
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
