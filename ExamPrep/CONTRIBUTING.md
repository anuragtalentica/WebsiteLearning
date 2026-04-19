# Contributing to ExamPrep

Thank you for your interest in contributing to ExamPrep. This document provides guidelines and instructions for contributing to the project.

## Setting Up the Development Environment

### Prerequisites

- Node.js 18 or later
- .NET 8 SDK
- SQL Server LocalDB
- A code editor (Visual Studio, VS Code, or Rider recommended)

### Setup Steps

1. Fork and clone the repository:

```bash
git clone <your-fork-url>
cd ExamPrep
```

2. Start the backend:

```bash
cd src/ExamPrep.API
dotnet restore
dotnet run
```

The database is automatically created and seeded on first run in development mode.

3. Start the frontend:

```bash
cd client
npm install
npm run dev
```

4. Verify the setup by navigating to `http://localhost:5173` and confirming the homepage loads with certifications.

## Code Style Conventions

### C# (.NET Backend)

- Follow standard C# naming conventions (PascalCase for public members, camelCase for local variables)
- Use file-scoped namespaces
- Use nullable reference types
- Keep controllers thin -- business logic belongs in Application services
- Use DTOs for all API responses; never expose domain entities directly
- Wrap all API responses in `ApiResponse<T>` for consistency

### TypeScript (React Frontend)

- Use functional components with hooks
- Use TypeScript strict mode
- Name component files with PascalCase (e.g., `HomePage.tsx`)
- Name utility/service files with camelCase (e.g., `apiClient.ts`)
- Use React Context for shared state rather than prop drilling
- Keep components focused on a single responsibility

### General

- Write descriptive commit messages
- Keep functions short and focused
- Add comments only when the code is not self-explanatory

## Branch Naming

Use the following naming conventions for branches:

- `feature/<short-description>` -- New features (e.g., `feature/timed-exams`)
- `fix/<short-description>` -- Bug fixes (e.g., `fix/login-redirect`)
- `refactor/<short-description>` -- Code refactoring
- `docs/<short-description>` -- Documentation changes

## Pull Request Process

1. Create a branch from `main` using the naming convention above.
2. Make your changes, ensuring the code compiles and runs correctly.
3. Test your changes manually (backend via Swagger, frontend in browser).
4. Run the frontend linter:

```bash
cd client
npm run lint
```

5. Commit your changes with a clear, descriptive message.
6. Push your branch and open a pull request against `main`.
7. In the PR description, include:
   - A summary of the changes
   - Any relevant screenshots for UI changes
   - Steps to test the changes
8. Wait for review and address any feedback.

## Adding New Certifications and Questions

One of the most valuable contributions is expanding the question bank. Follow these steps to add a new certification or questions to an existing one.

### Adding a New Certification

1. Open the seed data file at `src/ExamPrep.Infrastructure/Data/SeedData.cs`.
2. Add a new `Certification` entry with the vendor, name, code, and description.
3. Add `Topic` entries associated with the new certification.
4. Add `Question` and `QuestionOption` entries under the appropriate topics.
5. Ensure each question has exactly one option with `IsCorrect = true`.
6. Run the application to verify the seed data loads correctly.

### Adding Questions to an Existing Certification

1. Open `SeedData.cs` and locate the certification's topic section.
2. Add new `Question` records with:
   - Clear, well-formatted question text
   - 4 answer options (A, B, C, D)
   - Exactly one correct option marked with `IsCorrect = true`
   - A helpful explanation that describes why the correct answer is right
   - An appropriate difficulty level (1 = easy, 2 = medium, 3 = hard)
3. Maintain consistent `OrderIndex` values for options (0, 1, 2, 3).
4. Test by running the app and navigating to the topic to verify questions appear.

### Question Quality Guidelines

- Questions should be relevant to the certification exam objectives
- Avoid trick questions; focus on testing genuine understanding
- Explanations should be educational and help users learn the concept
- Incorrect options (distractors) should be plausible but clearly wrong
- Reference official documentation or study guides when possible

## Reporting Issues

When reporting a bug, include:

- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Browser and OS information (for frontend issues)
- Any error messages from the browser console or server logs
