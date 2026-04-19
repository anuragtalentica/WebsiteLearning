# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2026-04-07

### Added

- Initial MVP release of ExamPrep platform
- .NET 8 Web API backend with Clean Architecture (API, Application, Domain, Infrastructure layers)
- React 19 + TypeScript frontend with Vite 8
- SQL Server LocalDB with Entity Framework Core
- ASP.NET Identity integration for user management
- JWT Bearer authentication with token-based login
- User registration and login functionality
- Forgot password and reset password flow
- 7 IT certifications: AZ-900, CLF-C02, SY0-701, SAA-C03, 220-1101, ACE, AZ-104
- 121+ multiple-choice questions across all certifications
- Topic-based organization of questions within each certification
- Server-side answer validation (correct answers never exposed to the client)
- Detailed explanations displayed after answering each question
- Per-user attempt tracking and history
- Protected routes requiring authentication for practice pages
- Consistent API response wrapper (ApiResponse) across all endpoints
- Swagger / OpenAPI documentation available in development mode
- CORS configuration for React development server
- Automatic database creation and seeding in development mode
- Responsive navigation bar with authentication-aware links
- Client-side routing with React Router 7
- Authentication state management via React Context
