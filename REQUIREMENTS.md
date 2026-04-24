# ExamPrep — Product Requirements Document

> **Legend:** ✅ Done | 🚧 In Progress | ⬜ Pending | 🔜 Future (TODO)

---

## 1. Infrastructure & Deployment

| # | Requirement | Status | Notes |
|---|---|---|---|
| 1.1 | Frontend deployed on Vercel | ✅ Done | https://website-learn.vercel.app |
| 1.2 | Backend API deployed on Azure App Service | ✅ Done | https://examprep-api-anurag-hcc8eycmgrcrfjgq.centralindia-01.azurewebsites.net |
| 1.3 | Database on Neon PostgreSQL | ✅ Done | ep-delicate-breeze-anmga8fl |
| 1.4 | CI/CD via GitHub Actions (API auto-deploy on push) | ✅ Done | `.github/workflows/deploy-api.yml` |
| 1.5 | Vercel auto-deploys frontend on push to main | ✅ Done | GitHub integration |
| 1.6 | CORS configured for Vercel → Azure | ✅ Done | `AllowedOrigins__0` env var |
| 1.7 | JWT authentication with role claims | ✅ Done | Roles: Admin, User |
| 1.8 | HTTPS enforced on all endpoints | ✅ Done | Azure handles SSL |

---

## 2. Authentication

| # | Requirement | Status | Notes |
|---|---|---|---|
| 2.1 | User registration (email + password) | ✅ Done | `/api/auth/register` |
| 2.2 | User login | ✅ Done | `/api/auth/login` |
| 2.3 | Forgot password flow | ✅ Done | Token-based reset |
| 2.4 | JWT token with role claim in response | ✅ Done | `role` field in AuthResponse |
| 2.5 | Protected routes (require login) | ✅ Done | `ProtectedRoute` component |
| 2.6 | Admin-only routes | ✅ Done | `AdminRoute` component |
| 2.7 | Google Sign-In | 🔜 Future | Planned for later |
| 2.8 | Email confirmation on register | 🔜 Future | Requires email service setup |
| 2.9 | Switch JWT from localStorage to httpOnly cookies | 🔜 Future | Security hardening |

---

## 3. Admin Panel (`/admin`)

> **Access:** Same `/login` page — admin role redirects to admin panel link in navbar.
> **Admin credentials (seeded):** `admin@examprep.com` / `Admin@123456`

### 3.1 Admin Dashboard
| # | Requirement | Status | Notes |
|---|---|---|---|
| 3.1.1 | Total users count | ✅ Done | `/api/admin/stats` |
| 3.1.2 | Total questions count | ✅ Done | |
| 3.1.3 | Total tests taken count | ✅ Done | |
| 3.1.4 | Total certifications count | ✅ Done | |
| 3.1.5 | Certifications overview table | ✅ Done | |

### 3.2 Certifications CRUD
| # | Requirement | Status | Notes |
|---|---|---|---|
| 3.2.1 | List all certifications | ✅ Done | |
| 3.2.2 | Add new certification (form) | ✅ Done | Fields: vendor, name, code, category, difficulty, description |
| 3.2.3 | Edit certification | ✅ Done | |
| 3.2.4 | Delete certification (cascade) | ✅ Done | Deletes topics, questions, lessons, mock tests |

### 3.3 Topics Management
| # | Requirement | Status | Notes |
|---|---|---|---|
| 3.3.1 | List topics per certification | ✅ Done | `/api/admin/topics/{certId}` |
| 3.3.2 | Add topic | ✅ Done | |
| 3.3.3 | Edit topic | ✅ Done | |
| 3.3.4 | Delete topic | ✅ Done | |

### 3.4 Modules & Lessons CRUD
| # | Requirement | Status | Notes |
|---|---|---|---|
| 3.4.1 | List modules per certification | ✅ Done | Admin Content tab |
| 3.4.2 | Add / edit / delete module | ✅ Done | |
| 3.4.3 | List lessons per module | ✅ Done | |
| 3.4.4 | Add / edit lesson with HTML content editor | ✅ Done | Textarea HTML editor in admin Content tab |
| 3.4.5 | Delete lesson | ✅ Done | |

### 3.5 Questions Management
| # | Requirement | Status | Notes |
|---|---|---|---|
| 3.5.1 | List questions per topic | ✅ Done | Includes options + correct answer for admin |
| 3.5.2 | Add question individually (form) | ✅ Done | 4 options, radio to select correct |
| 3.5.3 | Edit question | ✅ Done | |
| 3.5.4 | Delete question | ✅ Done | |
| 3.5.5 | Question explanation field | ✅ Done | Already on entity, exposed in admin |
| 3.5.6 | Download CSV template for bulk import | ✅ Done | Columns: Question, A, B, C, D, Correct, Explanation, Difficulty, TopicId |
| 3.5.7 | Bulk import via CSV paste | ✅ Done | Paste CSV into textarea, click Import |
| 3.5.8 | Question image field (URL) | ✅ Done | Separate image URL field per question |
| 3.5.9 | Image storage integration (Cloudinary) | 🔜 Future | Skip for now, use URL field |

### 3.6 Mock Tests Management
| # | Requirement | Status | Notes |
|---|---|---|---|
| 3.6.1 | List all mock tests | ✅ Done | |
| 3.6.2 | Create mock test — auto-select questions from topic | ✅ Done | Set count, duration, negative marking, passing score |
| 3.6.3 | Negative marking configurable (0 = disabled, e.g. 0.25) | ✅ Done | |
| 3.6.4 | Edit mock test metadata | ✅ Done | |
| 3.6.5 | Delete mock test | ✅ Done | |

### 3.7 News Management
| # | Requirement | Status | Notes |
|---|---|---|---|
| 3.7.1 | Add news item | ✅ Done | Existing NewsController |
| 3.7.2 | Delete news item | ✅ Done | |
| 3.7.3 | News management tab in Admin Panel | ✅ Done | News tab added to AdminPage |

### 3.8 Users Management
| # | Requirement | Status | Notes |
|---|---|---|---|
| 3.8.1 | List all users with roles | ✅ Done | |
| 3.8.2 | Promote user to Admin | ✅ Done | Toggle Admin/User button in Users tab |
| 3.8.3 | Multiple admin roles (editor vs super admin) | 🔜 Future | Currently single Admin role |

---

## 4. User-Facing Features

### 4.1 Course Browsing
| # | Requirement | Status | Notes |
|---|---|---|---|
| 4.1.1 | Browse all certifications | ✅ Done | `/courses` |
| 4.1.2 | Filter by category and difficulty | ✅ Done | Dropdowns with fix for dark mode |
| 4.1.3 | Search courses | ✅ Done | |
| 4.1.4 | Course detail page with topics | ✅ Done | `/courses/:certId` |
| 4.1.5 | Topics list with question count | ✅ Done | `/courses/:certId/topics` |

### 4.2 Lessons
| # | Requirement | Status | Notes |
|---|---|---|---|
| 4.2.1 | View lesson content | ✅ Done | `/lessons/:lessonId` |
| 4.2.2 | Rich text rendering (HTML) | ✅ Done | dangerouslySetInnerHTML with CSS styling for h1-h3, lists, tables, code |
| 4.2.3 | Code block rendering | ✅ Done | Styled pre/code blocks in lesson-content CSS |
| 4.2.4 | Images and tables in lesson content | ✅ Done | Tables and images supported via HTML renderer |

### 4.3 Practice Mode
| # | Requirement | Status | Notes |
|---|---|---|---|
| 4.3.1 | Practice questions by topic | ✅ Done | `/practice/:topicId` |
| 4.3.2 | Show answer immediately after each question | ✅ Done | Practice mode behavior |
| 4.3.3 | Show explanation after answering | ✅ Done | "See Explanation" button revealed after submitting answer |
| 4.3.4 | Practice vs Exam mode distinction in UI | ✅ Done | Mode banner shown at top of each page |

### 4.4 Mock Tests (Exam Mode)
| # | Requirement | Status | Notes |
|---|---|---|---|
| 4.4.1 | Browse available mock tests | ✅ Done | `/tests` |
| 4.4.2 | Take timed mock test | ✅ Done | `/tests/:testId` |
| 4.4.3 | Auto-submit when timer expires | ✅ Done | Timer calls handleSubmit() when reaches 0 |
| 4.4.4 | View test result (score, pass/fail) | ✅ Done | `/tests/:testId/result` |
| 4.4.5 | Review every question after test (your answer vs correct) | ✅ Done | Paginated review with dot navigator |
| 4.4.6 | Show explanation per question in result review | ✅ Done | "Show Explanation" button per question |
| 4.4.7 | Retry test button | ✅ Done | "Retry Test" button on result page navigates back to test |
| 4.4.8 | Negative marking applied during scoring | ✅ Done | Backend calculates |

### 4.5 Dashboard
| # | Requirement | Status | Notes |
|---|---|---|---|
| 4.5.1 | Questions attempted + accuracy % | ✅ Done | `/dashboard` |
| 4.5.2 | Tests taken + passed count | ✅ Done | |
| 4.5.3 | Recent activity | ✅ Done | |
| 4.5.4 | Courses started | ✅ Done | Count + list on dashboard |
| 4.5.5 | % complete per course (lessons viewed + questions attempted) | ✅ Done | Progress bar on dashboard + course detail page |
| 4.5.6 | Full test history with scores | ✅ Done | Dashboard shows all attempts with correct/wrong/skipped breakdown, show all toggle |
| 4.5.7 | Category performance stats | ✅ Done | |

### 4.6 User Profile
| # | Requirement | Status | Notes |
|---|---|---|---|
| 4.6.1 | View profile (name, email, role) | ✅ Done | `/profile` page with avatar initials |
| 4.6.2 | Edit display name | ✅ Done | Inline edit form on profile page |
| 4.6.3 | Change password | ✅ Done | Change password form with validation |
| 4.6.4 | View personal stats summary | ✅ Done | Covered by Dashboard page |

### 4.7 Question Bookmarking
| # | Requirement | Status | Notes |
|---|---|---|---|
| 4.7.1 | Bookmark / unsave a question during practice | ✅ Done | Bookmark icon on each question (logged-in users only) |
| 4.7.2 | View saved questions on dashboard | ✅ Done | Expandable bookmarks card on dashboard with answers + explanation |

### 4.8 Leaderboard
| # | Requirement | Status | Notes |
|---|---|---|---|
| 4.8.1 | Global leaderboard (ranked by test scores) | ✅ Done | `/leaderboard` — avg score, best score, tests passed |
| 4.8.2 | Per-certification leaderboard | ✅ Done | Dropdown filter on leaderboard page |

---

## 5. General UX

| # | Requirement | Status | Notes |
|---|---|---|---|
| 5.1 | Dark / light theme toggle | ✅ Done | Persisted in localStorage |
| 5.2 | Mobile responsive design | ✅ Done | Tailwind responsive classes |
| 5.3 | News ticker on homepage | ✅ Done | Horizontal scrolling banner |
| 5.4 | Certification paths page | ✅ Done | `/paths` |
| 5.5 | News page | ✅ Done | `/news` |
| 5.6 | About / Privacy / Terms pages | ✅ Done | Static pages |
| 5.7 | Email notifications (new courses/tests) | 🔜 Future | Requires email service |

---

## 6. Pending Backend Work

| # | Requirement | Status | Notes |
|---|---|---|---|
| 6.1 | `UserLessonProgress` entity + migration | ✅ Done | Migration `AddUserLessonProgress` applied |
| 6.2 | `UserBookmark` entity + migration | ✅ Done | EF migration `AddUserBookmark` applied |
| 6.3 | Leaderboard endpoint | ✅ Done | `GET /api/leaderboard` and `/api/leaderboard/certification/{id}` |
| 6.4 | Course progress endpoint | ✅ Done | `GET /api/progress/courses` and `/api/progress/lessons/ids` |
| 6.5 | Detailed test result endpoint (question-by-question) | ✅ Done | `GET /api/mocktests/attempts/{id}/review` |
| 6.6 | Admin: Modules & Lessons CRUD endpoints | ✅ Done | `/api/admin/modules` and `/api/admin/lessons` |
| 6.7 | Remove `/startup-error` diagnostic endpoint | ✅ Done | Removed from Program.cs |

---

## 7. Implementation Priority Order

| Priority | Feature | Effort |
|---|---|---|
| 🔴 High | Admin: Modules & Lessons tab (with TipTap editor) | Large |
| 🔴 High | Admin: News tab | Small |
| 🔴 High | Mock test auto-submit on timer expiry | Small |
| 🔴 High | Test result review (question-by-question + explanations) | Medium |
| 🟡 Medium | Practice mode: show explanation after answer | Small |
| 🟡 Medium | Dashboard: courses started + % complete | Medium |
| 🟡 Medium | User profile page | Small |
| 🟢 Low | Question bookmarking | Medium |
| 🟢 Low | Leaderboard | Medium |
| 🟢 Low | Rich text lesson rendering | Small |
| ⚪ Future | Google Sign-In | Large |
| ⚪ Future | Email notifications | Large |
| ⚪ Future | Image storage (Cloudinary) | Medium |
| ⚪ Future | Multiple admin roles | Medium |

---

## 8. MVP Readiness — Must-Fix Before Launch

> Features and issues identified during full application review (2026-04-23). These must be resolved before the platform is considered production-ready for real users.

### 8.1 Security Issues (Critical)
| # | Issue | Status | Notes |
|---|---|---|---|
| 8.1.1 | Remove dev reset token exposed in ForgotPasswordPage UI | ✅ Done | Replaced with "Check your email" confirmation message. Token never sent to client. |
| 8.1.2 | Sanitize HTML lesson content before rendering | ✅ Done | `DOMPurify.sanitize()` wraps all `dangerouslySetInnerHTML` in LessonPage. |
| 8.1.3 | Rate limiting on auth endpoints | ✅ Done | ASP.NET Core `AddRateLimiter` — 10 req/min per IP on `/register`, `/login`, `/forgot-password`. |

### 8.2 UX Gaps (High Priority)
| # | Feature | Status | Notes |
|---|---|---|---|
| 8.2.1 | 404 Not Found page | ✅ Done | `NotFoundPage.tsx` + catch-all `*` route in App.tsx. |
| 8.2.2 | Browser unload warning during mock test | ✅ Done | `beforeunload` + `useBlocker` (data router) in MockTestTakePage — blocks both SPA nav and browser close. |
| 8.2.3 | Toast/snackbar notification system | ✅ Done | `sonner` installed; `<Toaster>` in App.tsx. Ready to call `toast.success()` / `toast.error()` throughout the app. |
| 8.2.4 | Password strength guidance on Register | ✅ Done | Hint text below password field lists all complexity requirements. |
| 8.2.5 | User's best score shown on Mock Tests page | ✅ Done | `GET /api/mocktests/my-best-scores` endpoint + overlay on each test card showing best % and pass/fail. |
| 8.2.6 | Empty state pages | ✅ Done | All critical pages have empty states with CTAs. |

### 8.3 Branding / SEO
| # | Feature | Status | Notes |
|---|---|---|---|
| 8.3.1 | Favicon | ✅ Done | `/public/favicon.svg` already present; linked in `index.html`. |
| 8.3.2 | `<meta>` title and description tags | ✅ Done | `index.html` now has descriptive `<title>`, `name="description"`, and `theme-color`. |
| 8.3.3 | Open Graph tags for social sharing | ✅ Done | `og:title`, `og:description`, `og:image`, `og:type`, `twitter:card` added to `index.html`. |

### 8.4 Content Accuracy
| # | Feature | Status | Notes |
|---|---|---|---|
| 8.4.1 | AboutPage — replace hardcoded cert list with dynamic data | ✅ Done | AboutPage now fetches `/api/certifications` and renders the live list with skeleton loading. |
| 8.4.2 | Terms of Service and Privacy Policy — real content | ⬜ Pending | Current pages have placeholder text. Must have real legal content before accepting real users. |

---

## 9. UX Improvements — User Perspective Audit (2026-04-23)

> Identified by analyzing the app from a first-time user's perspective. Items 1–13 implemented; item 14 deferred.

| # | Issue | Priority | Status | Notes |
|---|---|---|---|---|
| 1 | No post-registration onboarding | Critical | ✅ Done | Register redirects to `/courses` with welcome banner + `newUser` state. |
| 2 | Login wall on tests with no warning | Critical | ✅ Done | MockTestsPage shows lock icon + "Sign in to Start" button for guests instead of silently redirecting. |
| 3 | News ticker during study | Critical | ✅ Done | `QUIET_ROUTES` in App.tsx hides NewsTicker on `/lessons/`, `/practice/`, `/tests/`. |
| 4 | Dead end after last lesson | High | ✅ Done | Module completion card shown after last lesson — links to practice topics and mock tests. |
| 5 | Empty dashboard for new users | High | ✅ Done | Get-started checklist shown when user has zero activity (questions, tests, courses). |
| 6 | Can't sample questions without account | High | ✅ Done | `/questions/{id}/submit` no longer requires auth — guests can answer questions, progress not saved. Practice ready screen shows sign-in CTA for guests. |
| 7 | No lesson position (3 of 9) | Medium | ✅ Done | LessonNav API now returns `currentPosition` + `totalInModule`. Badge shows "Lesson X of Y". |
| 8 | No practice ready screen | Medium | ✅ Done | QuestionPracticePage shows a splash screen (topic name, question count, difficulty breakdown) before starting. |
| 9 | No progress on courses list | Medium | ✅ Done | CoursesPage fetches `/progress/courses` and overlays progress bar + % on each started course card. |
| 10 | All modules collapsed on load | Medium | ✅ Done | CourseDetailPage auto-expands and loads the first module on mount. |
| 11 | No next steps after test result | Medium | ✅ Done | TestResultPage shows "What's Next?" card with links to study course, more tests, dashboard, and practice wrong answers. |
| 12 | User not highlighted in leaderboard | Low | ✅ Done | Current user's row highlighted with primary ring + "(You)" label matched by `user.fullName`. |
| 13 | Back button broken (history vs route) | Low | ✅ Done | LessonPage back button uses `navigate('/courses/:certId')` from nav API, falls back to `navigate(-1)`. |
| 14 | No keyboard shortcuts in exam | Low | ⬜ Deferred | Would allow 1–4 to select options, Enter to submit. Planned for future. |
