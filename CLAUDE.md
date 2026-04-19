# CLAUDE.md — WebsiteLearning Repository

## Overview

**ExamPrep** is a full-stack IT certification practice platform. Learners can browse courses, study structured lessons, practice MCQ questions by topic, take timed mock exams, follow certification paths, and track progress via a personal dashboard.

The repo lives at: `C:\Code\Learning\WebsiteLearning\`
GitHub: `anuragtalentica/WebsiteLearning` (private)

---

## Repository Structure

```
WebsiteLearning/
└── ExamPrep/
    ├── client/                        # React 19 + TypeScript + Vite 8 frontend
    │   └── src/
    │       ├── api/                   # apiClient (Axios instance, base URL config)
    │       ├── components/
    │       │   ├── Layout/            # Navbar.tsx, ProtectedRoute.tsx
    │       │   ├── ui/                # button, card, badge, input, progress (CVA components)
    │       │   └── NewsTicker.tsx     # Horizontal scrolling news banner
    │       ├── context/
    │       │   ├── AuthContext.tsx    # JWT auth (login, register, logout, token in localStorage)
    │       │   └── ThemeContext.tsx   # Dark/light theme toggle (persisted in localStorage)
    │       ├── pages/                 # One file per route (see Routes section)
    │       ├── types/index.ts         # All TypeScript interfaces
    │       ├── lib/utils.ts           # cn() = clsx + tailwind-merge
    │       ├── App.tsx                # Routes + Footer + providers
    │       ├── index.css              # Tailwind v4 @import, dark + light CSS variables
    │       └── main.tsx               # Entry point
    ├── src/                           # .NET 8 Clean Architecture backend
    │   ├── ExamPrep.API/              # ASP.NET Core Web API (controllers, Program.cs, DI wiring)
    │   ├── ExamPrep.Application/      # DTOs, service interfaces, repository interfaces, services
    │   ├── ExamPrep.Domain/           # Entity classes (no EF dependencies)
    │   └── ExamPrep.Infrastructure/   # EF Core DbContext, repositories, seed data, migrations
    ├── tests/                         # Test projects (future)
    └── ExamPrep.slnx                  # Solution file
```

---

## Tech Stack

### Backend
- **.NET 8** — ASP.NET Core Web API
- **Clean Architecture** — Domain → Application → Infrastructure → API (dependency flow)
- **Entity Framework Core 8** — Code-First, SQL Server LocalDB
- **ASP.NET Core Identity** — User management
- **JWT Bearer** — Authentication tokens
- **Newtonsoft.Json / System.Text.Json** — Serialization

### Frontend
- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS v4** — `@tailwindcss/vite` plugin, `@theme` for CSS variables
- **shadcn/ui-style components** — CVA + Radix UI + clsx + tailwind-merge
- **Framer Motion** — Page/card animations
- **Lucide React** — Icons
- **Axios** — HTTP client
- **React Router v6** — Client-side routing

---

## Mandatory Rules

- **NEVER auto-commit.** Only commit when user explicitly asks.
- **Read before editing.** Always read a file before modifying it.
- **Ask clarifying questions** before starting ambiguous work.
- **Halt on "stop".** When interrupted, stop immediately and ask what to do instead.
- **Build after every change.** Run `npx vite build` after frontend changes; `dotnet build` after backend changes.

---

## Build Commands

### Frontend
```bash
# Working directory: ExamPrep/client
npx vite build                  # production build
npx vite --host                 # dev server (hot reload)
npm install                     # install dependencies
```

### Backend
```bash
# Working directory: ExamPrep/
dotnet build ExamPrep.slnx
dotnet run --project src/ExamPrep.API

# EF Core Migrations (run from ExamPrep/ root)
dotnet ef migrations add <Name> --project src/ExamPrep.Infrastructure --startup-project src/ExamPrep.API
dotnet ef database update       --project src/ExamPrep.Infrastructure --startup-project src/ExamPrep.API
```

### Dev Server URLs
- Frontend: `http://localhost:5173` (or next available: 5174, 5175)
- Backend API: `http://localhost:5062`

---

## Database

- **SQL Server LocalDB** instance: `ExamPrepInstance`
- **Database name**: `ExamPrepDb`
- **Connection string** (in `appsettings.json`):
  ```
  Server=(localdb)\\ExamPrepInstance;Database=ExamPrepDb;Trusted_Connection=True;MultipleActiveResultSets=true;Encrypt=false
  ```
- **Migrations location**: `src/ExamPrep.Infrastructure/Data/Migrations/`
- **Seed data**: `src/ExamPrep.Infrastructure/Data/SeedData.cs` — runs on startup if DB is empty

### Known EF Constraints
- `Question → Lesson` FK: `DeleteBehavior.NoAction` (avoids multiple cascade path error)
- `Question → Certification` FK: `DeleteBehavior.NoAction` (same reason)

---

## API Controllers & Routes

| Controller | Base Route | Key Endpoints |
|---|---|---|
| AuthController | `/api/auth` | POST `/register`, POST `/login`, POST `/forgot-password`, POST `/reset-password` |
| CertificationsController | `/api/certifications` | GET `/`, GET `/{id}`, GET `/{id}/topics` |
| ModulesController | `/api/modules` | GET `/certification/{certId}`, GET `/{id}`, POST, PUT `/{id}`, DELETE `/{id}` |
| LessonsController | `/api/lessons` | GET `/module/{moduleId}`, GET `/{id}`, POST, PUT `/{id}`, DELETE `/{id}` |
| QuestionsController | `/api/questions` | GET `/topic/{topicId}`, POST `/answer` |
| MockTestsController | `/api/mocktests` | GET `/`, GET `/{id}`, POST `/submit`, GET `/attempts` |
| CertPathsController | `/api/certpaths` | GET `/`, GET `/{id}` |
| NewsController | `/api/news` | GET `/?count=N`, GET `/category/{cat}`, POST, DELETE `/{id}` |
| DashboardController | `/api/dashboard` | GET `/` (requires auth) |

---

## Frontend Routes

| Path | Page | Auth Required |
|---|---|---|
| `/` | HomePage | No |
| `/courses` | CoursesPage | No |
| `/courses/:certId` | CourseDetailPage | No |
| `/courses/:certId/topics` | TopicsPage | No |
| `/lessons/:lessonId` | LessonPage | No |
| `/practice/:topicId` | QuestionPracticePage | No |
| `/tests` | MockTestsPage | No |
| `/tests/:testId` | MockTestTakePage | **Yes** |
| `/tests/:testId/result` | TestResultPage | **Yes** |
| `/paths` | CertPathsPage | No |
| `/paths/:pathId` | CertPathDetailPage | No |
| `/news` | NewsPage | No |
| `/dashboard` | DashboardPage | **Yes** |
| `/login` | LoginPage | No |
| `/register` | RegisterPage | No |
| `/forgot-password` | ForgotPasswordPage | No |
| `/reset-password` | ResetPasswordPage | No |

---

## Clean Architecture Patterns

### Adding a New Entity
1. Create entity in `ExamPrep.Domain/Entities/`
2. Add `DbSet<T>` to `ExamPrep.Infrastructure/Data/ExamPrepDbContext.cs`
3. Create interface `IXxxRepository` in `ExamPrep.Application/Interfaces/Repositories/`
4. Create implementation `XxxRepository` in `ExamPrep.Infrastructure/Repositories/`
5. Create DTOs in `ExamPrep.Application/DTOs/`
6. Create service interface in `ExamPrep.Application/Interfaces/Services/`
7. Create service in `ExamPrep.Application/Services/`
8. Register in `ExamPrep.API/Extensions/ServiceCollectionExtensions.cs`
9. Add controller in `ExamPrep.API/Controllers/`
10. Run EF migration

### Adding a New Frontend Page
1. Create `client/src/pages/XxxPage.tsx`
2. Add route in `client/src/App.tsx`
3. Add nav link in `Navbar.tsx` if it's a primary nav destination
4. Add TypeScript types to `client/src/types/index.ts` if needed

---

## Frontend Conventions

- **State**: Local `useState` + direct `apiClient` calls (no Redux — intentionally simple)
- **API calls**: Always via `@/api/apiClient` (Axios instance with `baseURL` + auth interceptor)
- **Auth**: `useAuth()` hook from `AuthContext` — provides `user`, `token`, `login`, `register`, `logout`, `isAuthenticated`
- **Theme**: `useTheme()` hook from `ThemeContext` — provides `theme` (`'dark'|'light'`), `toggleTheme()`
- **Styling**: Tailwind utility classes only — no separate CSS files per component
- **Path alias**: `@/` maps to `client/src/` — always use this for imports
- **Components**: Functional components with hooks; keep under ~150 lines; extract sub-components when larger
- **Icons**: Lucide React only — `import { IconName } from 'lucide-react'`
- **Animations**: Framer Motion for entrance animations; CSS transitions for hover states

### CSS Variables (Dark / Light)
Defined in `client/src/index.css` via `@theme` (dark, default) and `.light` class overrides:

| Variable | Dark | Light |
|---|---|---|
| `--color-background` | `#0a0a0f` | `#fafafa` |
| `--color-foreground` | `#fafafa` | `#0a0a0f` |
| `--color-card` | `#111118` | `#ffffff` |
| `--color-primary` | `#6366f1` | `#4f46e5` |
| `--color-border` | `#27272a` | `#e2e8f0` |
| `--color-muted-foreground` | `#71717a` | `#64748b` |

---

## Domain Entities

| Entity | Key Fields |
|---|---|
| `Certification` | Id, Vendor, Name, Code, Description, Category, Difficulty |
| `Topic` | Id, CertificationId, Name, OrderIndex |
| `Question` | Id, TopicId, CertificationId?, LessonId?, QuestionText, DifficultyLevel |
| `QuestionOption` | Id, QuestionId, OptionText, IsCorrect (never sent to client), OrderIndex |
| `UserQuestionAttempt` | Id, UserId, QuestionId, SelectedOptionId, IsCorrect, AttemptedAt |
| `Module` | Id, CertificationId, Title, OrderIndex |
| `Lesson` | Id, ModuleId, Title, Content, CodeExample, CodeLanguage, ExternalLinks (JSON), OrderIndex |
| `MockTest` | Id, Title, Type, CertificationId, DurationMinutes, NegativeMarking, PassingScore |
| `TestQuestion` | Id, MockTestId, QuestionId, OrderIndex (junction) |
| `TestAttempt` | Id, UserId, MockTestId, Score, CorrectAnswers, WrongAnswers, Skipped, TimeTakenSeconds, Passed, Answers (JSON) |
| `CertPath` | Id, Title, Description, Goal, BadgeColor, EstimatedWeeks |
| `CertPathCourse` | Id, CertPathId, CertificationId, OrderIndex |
| `CertPathTest` | Id, CertPathId, MockTestId |
| `News` | Id, Title, Category, Url, PublishedAt |

---

## Security Rules
- `IsCorrect` on `QuestionOption` is **never** serialized or returned to the client
- Answer validation happens **server-side only** in `MockTestService.SubmitTest()`
- JWT tokens stored in `localStorage` (dev convenience — upgrade to httpOnly cookies for production)
- No hardcoded secrets — connection strings and JWT config in `appsettings.json` (git-ignored in production)

---

## Pending / TODO Features
- [ ] Admin panel — tabbed CRUD (certifications, questions, users, news, mock tests)
- [ ] User profile page
- [ ] Question bookmarking / favourites
- [ ] Leaderboard
- [ ] Email confirmation on register
- [ ] Production deployment config (HTTPS, environment variables)
