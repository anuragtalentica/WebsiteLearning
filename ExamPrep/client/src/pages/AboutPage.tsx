import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, FlaskConical, Route, Users, Target, Zap, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import apiClient from '@/api/apiClient';
import type { ApiResponse, Certification } from '@/types';

export default function AboutPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    apiClient.get<ApiResponse<Certification[]>>('/certifications')
      .then(r => { if (r.data.data) setCertifications(r.data.data); });
  }, []);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">

      {/* Hero */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-6">
          <GraduationCap className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">About ExamPrep</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A focused platform built to help IT professionals and students prepare for industry-recognised
          certifications — without the noise of generic learning platforms.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-14">
        <div className="rounded-xl border border-border bg-card/50 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Our Mission</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Certification exams are tough. Good preparation materials are expensive, scattered, or bloated
            with unnecessary content. ExamPrep exists to change that — offering structured learning paths,
            targeted practice questions, and realistic timed mock tests, all in one place and completely free.
          </p>
        </div>
      </section>

      {/* What we offer */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-6">What You Get</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: BookOpen,
              title: 'Structured Courses',
              description: 'Organised modules and lessons covering every exam objective — with code examples and external references.',
            },
            {
              icon: FlaskConical,
              title: 'Mock Exams',
              description: 'Timed, full-length practice exams that mirror real certification conditions, including negative marking.',
            },
            {
              icon: Route,
              title: 'Certification Paths',
              description: 'Curated learning journeys that guide you from beginner to certified — step by step.',
            },
            {
              icon: Zap,
              title: 'Instant Feedback',
              description: 'Every practice question shows the correct answer and a detailed explanation immediately after you answer.',
            },
          ].map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Certifications covered */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-6">Certifications Covered</h2>
        <div className="rounded-xl border border-border bg-card/50 p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            {certifications.length > 0
              ? certifications.map(cert => (
                <div key={cert.id} className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  {cert.vendor} {cert.code}
                </div>
              ))
              : [1,2,3,4,5,6].map(i => (
                <div key={i} className="h-5 rounded bg-muted animate-pulse" />
              ))
            }
          </div>
          <p className="text-xs text-muted-foreground mt-4">More certifications added regularly.</p>
        </div>
      </section>

      {/* Who it's for */}
      <section className="mb-14">
        <div className="rounded-xl border border-border bg-card/50 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Who Is This For?</h2>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            {[
              'IT professionals preparing for their next certification',
              'Students entering the cloud, security, or DevOps field',
              'Developers looking to validate their cloud skills',
              'Anyone who wants structured, exam-focused learning',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Built with */}
      <section className="mb-14">
        <div className="rounded-xl border border-border bg-card/50 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Built With</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            ExamPrep is a full-stack application built on modern, production-grade technologies:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
            {[
              '.NET 8 — Backend API',
              'React 19 — Frontend',
              'TypeScript — Type safety',
              'Tailwind CSS v4 — Styling',
              'Entity Framework Core 8',
              'SQL Server — Database',
            ].map(tech => (
              <div key={tech} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center rounded-xl border border-primary/20 bg-primary/5 p-8">
        <h2 className="text-2xl font-bold mb-3">Ready to start?</h2>
        <p className="text-muted-foreground mb-6">Browse certifications and begin your learning journey today.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/courses"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <BookOpen className="h-4 w-4" /> Browse Courses
          </Link>
          <Link to="/register"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary transition-colors">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}
