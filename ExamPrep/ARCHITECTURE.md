# ExamPrep Architecture

This document describes the architecture, design decisions, and technical details of the ExamPrep platform.

## Clean Architecture Overview

ExamPrep follows Clean Architecture principles with four distinct layers. Dependencies point inward -- outer layers depend on inner layers, never the reverse.

```
+-------------------------------------------------------+
|                     ExamPrep.API                       |
|  (Controllers, Middleware, Program.cs, DI setup)       |
+-------------------------------------------------------+
          |                          |
          v                          v
+-------------------------+  +---------------------------+
| ExamPrep.Application    |  | ExamPrep.Infrastructure   |
| (Services, DTOs,        |  | (DbContext, SeedData,      |
|  Interfaces)            |  |  Repositories)             |
+-------------------------+  +---------------------------+
          |                          |
          v                          v
+-------------------------------------------------------+
|                   ExamPrep.Domain                      |
|          (Entities, Core Business Rules)               |
+-------------------------------------------------------+
```

## Layer Descriptions

### ExamPrep.Domain

The innermost layer containing core business entities with no external dependencies.

- **Certification** -- Represents an IT certification (e.g., AZ-900, CLF-C02)
- **Topic** -- A study topic within a certification, ordered by index
- **Question** -- A multiple-choice question belonging to a topic
- **QuestionOption** -- An answer option for a question, with an IsCorrect flag
- **UserQuestionAttempt** -- Records a user's answer submission and correctness

### ExamPrep.Application

Contains business logic, service interfaces, and data transfer objects.

- **Interfaces/** -- Service contracts (IAuthService, ICertificationService, IQuestionService)
- **Services/** -- Implementations of business logic
- **DTOs/** -- Data transfer objects for API communication, ensuring domain entities are never directly exposed

### ExamPrep.Infrastructure

Handles data persistence and external service integration.

- **ExamPrepDbContext** -- Entity Framework Core context extending IdentityDbContext for user management
- **SeedData** -- Seeds the database with certifications, topics, and questions on first run
- **Entity configurations** -- Fluent API configurations for table constraints and relationships

### ExamPrep.API

The outermost layer handling HTTP concerns.

- **Controllers/** -- REST API endpoints for auth, certifications, and questions
- **Extensions/** -- Service collection extension methods for clean DI registration
- **Models/** -- API response wrapper (ApiResponse<T>) for consistent response format
- **Program.cs** -- Application startup, middleware pipeline, CORS, and Swagger configuration

## Dependency Flow

```
API --> Application (service interfaces + DTOs)
API --> Infrastructure (DI registration, DbContext setup)
Application --> Domain (entities)
Infrastructure --> Domain (entities)
Infrastructure --> Application (implements interfaces)
```

The API layer wires everything together via dependency injection. Application services are registered through extension methods, and Infrastructure provides the concrete implementations.

## Database Schema

The application uses SQL Server LocalDB with Entity Framework Core. ASP.NET Identity tables are included for user management.

### Application Tables

```
+-------------------+       +-------------------+       +-------------------+
| Certifications    |       | Topics            |       | Questions         |
+-------------------+       +-------------------+       +-------------------+
| Id (PK, int)      |<--+   | Id (PK, int)      |<--+   | Id (PK, int)      |
| Vendor (100)      |   |   | CertificationId   |   |   | TopicId (FK)      |
| Name (200)        |   +---| (FK)              |   +---| QuestionText      |
| Code (50, unique) |       | Name (200)        |       | Explanation       |
| Description       |       | OrderIndex        |       | DifficultyLevel   |
| ImageUrl (500)    |       +-------------------+       | CreatedAt         |
| IsActive          |                                   +-------------------+
| CreatedAt         |
+-------------------+

+-------------------+       +------------------------+
| QuestionOptions   |       | UserQuestionAttempts    |
+-------------------+       +------------------------+
| Id (PK, int)      |       | Id (PK, int)           |
| QuestionId (FK)   |       | UserId (string)        |
| OptionText        |       | QuestionId (FK)        |
| IsCorrect (bool)  |       | SelectedOptionId (FK)  |
| OrderIndex        |       | IsCorrect (bool)       |
+-------------------+       | AttemptedAt            |
                            +------------------------+
```

### ASP.NET Identity Tables

Standard Identity tables are automatically created by `IdentityDbContext<IdentityUser>`:

- AspNetUsers
- AspNetRoles
- AspNetUserRoles
- AspNetUserClaims
- AspNetUserLogins
- AspNetUserTokens
- AspNetRoleClaims

### Relationships

- **Certification -> Topics**: One-to-many (cascade delete)
- **Topic -> Questions**: One-to-many (cascade delete)
- **Question -> QuestionOptions**: One-to-many (cascade delete)
- **Question -> UserQuestionAttempts**: One-to-many (cascade delete)
- **QuestionOption -> UserQuestionAttempts**: One-to-many (no action on delete, to prevent circular cascades)
- **UserId** on UserQuestionAttempt references ASP.NET Identity users by string ID

### Indexes

- `Certifications.Code` -- Unique index
- `UserQuestionAttempts (UserId, QuestionId)` -- Composite index for efficient lookup of a user's attempts on a question

## Authentication Flow

The application uses JWT Bearer authentication with ASP.NET Identity for user management.

```
1. User registers via POST /api/auth/register
   -> Identity creates user record
   -> JWT token generated and returned

2. User logs in via POST /api/auth/login
   -> Identity validates credentials
   -> JWT token generated and returned

3. Client stores JWT token (typically in memory or localStorage)
   -> Token included in Authorization header: Bearer <token>

4. Protected endpoints (e.g., POST /api/questions/{id}/submit)
   -> Middleware validates JWT token
   -> UserId extracted from token claims
   -> Request proceeds or returns 401 Unauthorized

5. Password reset flow:
   -> POST /api/auth/forgot-password generates reset token
   -> POST /api/auth/reset-password validates token and updates password
```

### JWT Configuration

- **Issuer**: ExamPrep
- **Audience**: ExamPrepUsers
- **Signing Key**: Configured in appsettings.json (must be 32+ characters)

## Security Design

### Answer Protection

The `IsCorrect` property on `QuestionOption` is never sent to the client in question DTOs. When a user requests questions, the API returns question text and option text only. Correct answer validation happens entirely server-side:

1. Client sends `POST /api/questions/{id}/submit` with the selected option ID
2. Server looks up the option, checks `IsCorrect`, and records the attempt
3. Server returns an `AnswerResultDto` indicating whether the answer was correct, along with the explanation

This prevents users from inspecting network responses to find correct answers before submitting.

### CORS Policy

The API is configured to accept requests only from the React development server at `http://localhost:5173`. This should be updated for production deployments.

### Route Protection

The React frontend uses a `ProtectedRoute` component that checks authentication state before rendering practice pages. Unauthenticated users are redirected to the login page.

## Frontend Architecture

### State Management

Authentication state is managed via React Context (`AuthContext`). The `AuthProvider` wraps the entire application and provides:

- Current user information
- Login/logout functions
- Token management
- Authentication status

### Routing

React Router handles client-side navigation with the following route structure:

| Route                          | Component             | Protected |
|--------------------------------|-----------------------|-----------|
| `/`                            | HomePage              | No        |
| `/login`                       | LoginPage             | No        |
| `/register`                    | RegisterPage          | No        |
| `/forgot-password`             | ForgotPasswordPage    | No        |
| `/reset-password`              | ResetPasswordPage     | No        |
| `/certifications/:certId`     | TopicsPage            | No        |
| `/practice/:topicId`           | QuestionPracticePage  | Yes       |

### API Client

Axios is used as the HTTP client, configured to communicate with the backend API. The client handles JWT token injection in request headers for authenticated endpoints.
