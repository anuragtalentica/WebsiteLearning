import { useEffect, useState } from 'react';
import apiClient from '@/api/apiClient';
import type { ApiResponse, Certification } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LayoutDashboard, BookOpen, HelpCircle, ClipboardList,
  Users, Plus, Pencil, Trash2, Upload, Download, X, Check, ChevronDown
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
  id: number; questionText: string; explanation?: string;
  difficultyLevel: number; topicId: number; options: AdminOption[];
}
interface AdminMockTest {
  id: number; title: string; description?: string; type: string;
  certificationId?: number; durationMinutes: number;
  negativeMarkingValue: number; passingScore: number; questionCount: number;
}
interface AdminUser { id: string; email: string; role: string; }

// ── Tab names ──────────────────────────────────────────────────────────

type Tab = 'dashboard' | 'certifications' | 'questions' | 'mocktests' | 'users';

// ── Main Component ─────────────────────────────────────────────────────

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'certifications', label: 'Certifications', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'questions', label: 'Questions', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'mocktests', label: 'Mock Tests', icon: <ClipboardList className="h-4 w-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
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
      {tab === 'users' && <UsersTab />}
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
    questionText: '', explanation: '', difficultyLevel: 1, topicId: selectedTopic ?? 0,
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

            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
              <Button size="sm" onClick={save}>Save</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions list */}
      {questions.length > 0 && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            {questions.map((q, i) => (
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
          {tests.length === 0 && <p className="text-center text-muted-foreground text-sm py-6">No mock tests yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Users Tab ──────────────────────────────────────────────────────────

function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    apiClient.get<ApiResponse<AdminUser[]>>('/admin/users').then(r => {
      if (r.data.data) setUsers(r.data.data);
    });
  }, []);

  return (
    <Card>
      <CardContent className="pt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-2">Email</th><th className="pb-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-border/50">
                <td className="py-2">{u.email}</td>
                <td className="py-2">
                  <Badge variant={u.role === 'Admin' ? 'destructive' : 'secondary'}>{u.role}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-center text-muted-foreground text-sm py-6">No users found.</p>}
      </CardContent>
    </Card>
  );
}
