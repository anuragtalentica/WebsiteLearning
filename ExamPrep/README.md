# ExamPrep

A full-stack exam preparation platform for IT certification practice, inspired by ExamTopics. Users can browse certifications, study by topic, and practice multiple-choice questions with instant feedback and detailed explanations.

## Tech Stack

**Frontend**
- React 19 with TypeScript
- Vite 8 (dev server and build tool)
- React Router 7 (client-side routing)
- Axios (HTTP client)

**Backend**
- .NET 8 Web API (C#)
- Entity Framework Core (ORM)
- SQL Server LocalDB
- ASP.NET Identity (user management)
- JWT Bearer Authentication
- Swagger / OpenAPI (dev documentation)

## Features

- Browse 7 IT certifications with organized topic structures:
  - **AZ-900** -- Microsoft Azure Fundamentals
  - **CLF-C02** -- AWS Cloud Practitioner
  - **SY0-701** -- CompTIA Security+
  - **SAA-C03** -- AWS Solutions Architect Associate
  - **220-1101** -- CompTIA A+
  - **ACE** -- Google Cloud Associate Cloud Engineer
  - **AZ-104** -- Microsoft Azure Administrator
- 121+ multiple-choice questions across all certifications
- Topic-based question organization within each certification
- User registration and login with JWT authentication
- Password reset flow (forgot password / reset password)
- Server-side answer validation (correct answers never exposed to the client)
- Detailed explanations shown after answering
- Per-user attempt tracking and history
- Protected practice routes requiring authentication
- Responsive UI with navigation bar
- Swagger UI available in development mode

## Prerequisites

- **Node.js 18+** and npm
- **.NET 8 SDK**
- **SQL Server LocalDB** (included with Visual Studio or installable separately)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd ExamPrep
```

### 2. Start the backend API

```bash
cd src/ExamPrep.API
dotnet run
```

The API starts at `https://localhost:5001` (or the port configured in `launchSettings.json`). On first run in development mode, the database is automatically created and seeded with certification data.

Swagger UI is available at `https://localhost:5001/swagger` during development.

### 3. Start the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

The React app starts at `http://localhost:5173` and proxies API requests to the backend.

### 4. Open the app

Navigate to `http://localhost:5173` in your browser. Register an account to start practicing questions.

## Project Structure

```
ExamPrep/
  src/
    ExamPrep.API/              # ASP.NET Web API (entry point, controllers, middleware)
      Controllers/
        AuthController.cs       # Register, login, forgot/reset password
        CertificationsController.cs  # List and detail certifications
        QuestionsController.cs  # Get questions, submit answers
      Extensions/               # Service registration extensions
      Models/                   # API response wrappers
      Program.cs                # App configuration and startup
    ExamPrep.Application/       # Business logic layer
      DTOs/                     # Data transfer objects
      Interfaces/               # Service contracts
      Services/                 # Service implementations
    ExamPrep.Domain/            # Core domain entities
      Entities/
        Certification.cs
        Topic.cs
        Question.cs
        QuestionOption.cs
        UserQuestionAttempt.cs
    ExamPrep.Infrastructure/    # Data access and external concerns
      Data/
        ExamPrepDbContext.cs     # EF Core DbContext with Identity
        SeedData.cs             # Initial certification and question data
  client/                       # React frontend
    src/
      components/               # Reusable UI components
        Layout/
          Navbar.tsx
          ProtectedRoute.tsx
      context/
        AuthContext.tsx          # Authentication state management
      pages/
        HomePage.tsx
        LoginPage.tsx
        RegisterPage.tsx
        ForgotPasswordPage.tsx
        ResetPasswordPage.tsx
        TopicsPage.tsx
        QuestionPracticePage.tsx
      services/                 # API client utilities
      App.tsx                   # Root component with routing
      main.tsx                  # Entry point
```

## API Endpoints

| Method | Endpoint                        | Auth     | Description                          |
|--------|---------------------------------|----------|--------------------------------------|
| POST   | `/api/auth/register`            | No       | Register a new user                  |
| POST   | `/api/auth/login`               | No       | Login and receive JWT token          |
| POST   | `/api/auth/forgot-password`     | No       | Request a password reset token       |
| POST   | `/api/auth/reset-password`      | No       | Reset password with token            |
| GET    | `/api/certifications`           | No       | List all certifications              |
| GET    | `/api/certifications/{id}`      | No       | Get certification details and topics |
| GET    | `/api/questions/topic/{topicId}`| No       | Get questions for a topic            |
| GET    | `/api/questions/{id}`           | No       | Get a single question by ID          |
| POST   | `/api/questions/{id}/submit`    | Required | Submit an answer (returns result)    |

## Screenshots

_Screenshots coming soon._

## Future Roadmap

- Timed exam simulations with countdown timer
- Community discussion threads per question
- Analytics dashboard with score history and progress charts
- YouTube video references linked to topics and questions
- Monetization features (premium question banks, subscription tiers)
- Admin panel for managing certifications, topics, and questions
- Question reporting and flagging system
- Dark mode support
- Mobile-optimized layout improvements
