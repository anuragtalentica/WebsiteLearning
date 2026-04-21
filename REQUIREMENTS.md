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
| 3.4.1 | List modules per certification | ⬜ Pending | Endpoints exist, admin UI needed |
| 3.4.2 | Add / edit / delete module | ⬜ Pending | |
| 3.4.3 | List lessons per module | ⬜ Pending | |
| 3.4.4 | Add / edit lesson with rich text editor (TipTap) | ⬜ Pending | Bold, tables, images (URL), code blocks |
| 3.4.5 | Delete lesson | ⬜ Pending | |

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
| 3.5.8 | Question image field (URL) | ⬜ Pending | Separate image URL field per question |
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
| 3.7.3 | News management tab in Admin Panel | ⬜ Pending | UI tab not yet added to AdminPage |

### 3.8 Users Management
| # | Requirement | Status | Notes |
|---|---|---|---|
| 3.8.1 | List all users with roles | ✅ Done | |
| 3.8.2 | Promote user to Admin | ⬜ Pending | Role assignment UI |
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
| 4.2.2 | Rich text rendering (TipTap viewer) | ⬜ Pending | Currently plain text |
| 4.2.3 | Code block rendering with syntax highlight | ⬜ Pending | |
| 4.2.4 | Images and tables in lesson content | ⬜ Pending | Depends on TipTap editor in admin |

### 4.3 Practice Mode
| # | Requirement | Status | Notes |
|---|---|---|---|
| 4.3.1 | Practice questions by topic | ✅ Done | `/practice/:topicId` |
| 4.3.2 | Show answer immediately after each question | ✅ Done | Practice mode behavior |
| 4.3.3 | Show explanation after answering | ⬜ Pending | `explanation` field exists, not shown in UI |
| 4.3.4 | Practice vs Exam mode distinction in UI | ⬜ Pending | Needs clearer UX separation |

### 4.4 Mock Tests (Exam Mode)
| # | Requirement | Status | Notes |
|---|---|---|---|
| 4.4.1 | Browse available mock tests | ✅ Done | `/tests` |
| 4.4.2 | Take timed mock test | ✅ Done | `/tests/:testId` |
| 4.4.3 | Auto-submit when timer expires | ⬜ Pending | Currently manual submit only |
| 4.4.4 | View test result (score, pass/fail) | ✅ Done | `/tests/:testId/result` |
| 4.4.5 | Review every question after test (your answer vs correct) | ⬜ Pending | Need detailed result page |
| 4.4.6 | Show explanation per question in result review | ⬜ Pending | |
| 4.4.7 | Retry test button | ⬜ Pending | |
| 4.4.8 | Negative marking applied during scoring | ✅ Done | Backend calculates |

### 4.5 Dashboard
| # | Requirement | Status | Notes |
|---|---|---|---|
| 4.5.1 | Questions attempted + accuracy % | ✅ Done | `/dashboard` |
| 4.5.2 | Tests taken + passed count | ✅ Done | |
| 4.5.3 | Recent activity | ✅ Done | |
| 4.5.4 | Courses started | ⬜ Pending | Requires UserLessonProgress entity |
| 4.5.5 | % complete per course (lessons viewed + questions attempted) | ⬜ Pending | Requires progress tracking |
| 4.5.6 | Full test history with scores | ⬜ Pending | Detailed attempts list |
| 4.5.7 | Category performance stats | ✅ Done | |

### 4.6 User Profile
| # | Requirement | Status | Notes |
|---|---|---|---|
| 4.6.1 | View profile (name, email) | ⬜ Pending | Page not created yet |
| 4.6.2 | Edit display name | ⬜ Pending | |
| 4.6.3 | Change password | ⬜ Pending | |
| 4.6.4 | View personal stats summary | ⬜ Pending | |

### 4.7 Question Bookmarking
| # | Requirement | Status | Notes |
|---|---|---|---|
| 4.7.1 | Bookmark / unsave a question during practice | ⬜ Pending | Needs UserBookmark entity |
| 4.7.2 | View saved questions on dashboard | ⬜ Pending | |

### 4.8 Leaderboard
| # | Requirement | Status | Notes |
|---|---|---|---|
| 4.8.1 | Global leaderboard (ranked by test scores) | ⬜ Pending | |
| 4.8.2 | Per-certification leaderboard | ⬜ Pending | |

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
| 6.1 | `UserLessonProgress` entity + migration | ⬜ Pending | Track lessons viewed per user |
| 6.2 | `UserBookmark` entity + migration | ⬜ Pending | Save bookmarked questions |
| 6.3 | Leaderboard endpoint | ⬜ Pending | Rank users by test scores |
| 6.4 | Course progress endpoint | ⬜ Pending | % complete calculation |
| 6.5 | Detailed test result endpoint (question-by-question) | ⬜ Pending | Return user's answers + correct answers + explanations |
| 6.6 | Admin: Modules & Lessons CRUD endpoints | ⬜ Pending | Endpoints exist, need admin-scoped versions |
| 6.7 | Remove `/startup-error` diagnostic endpoint | ⬜ Pending | Clean up before next major release |

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
