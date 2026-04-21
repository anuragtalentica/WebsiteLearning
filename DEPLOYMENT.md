# ExamPrep — Production Deployment Guide

## Architecture Overview

| Layer | Service | URL |
|---|---|---|
| Frontend | Vercel | https://website-learn.vercel.app |
| Backend API | Azure App Service | https://examprep-api-anurag-hcc8eycmgrcrfjgq.centralindia-01.azurewebsites.net |
| Database | Neon (PostgreSQL) | ep-delicate-breeze-anmga8fl.c-6.us-east-1.aws.neon.tech |

---

## 1. Azure App Service Configuration

### App Service Settings
- **Name**: examprep-api-anurag
- **Region**: Central India
- **Plan**: Free (F1) — 32-bit, Windows
- **Runtime Stack**: .NET 10
- **Operating System**: Windows

### Required Environment Variables
Set these in **Azure portal → examprep-api-anurag → Settings → Environment variables**:

| Name | Value |
|---|---|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `AllowedOrigins__0` | `https://website-learn.vercel.app` |
| `ConnectionStrings__DefaultConnection` | `Host=<neon-host>;Database=neondb;Username=neondb_owner;Password=<password>;SSL Mode=Require;Trust Server Certificate=true` |
| `Jwt__Key` | your secret key (min 32 characters) |
| `Jwt__Issuer` | `ExamPrep` |
| `Jwt__Audience` | `ExamPrepUsers` |

> **Get the Npgsql connection string from**: Neon dashboard → your project → Connection Details → switch to "Npgsql" format

### GitHub Secrets (for CI/CD)
Set these in **GitHub → repo Settings → Secrets and variables → Actions**:

| Secret | Value |
|---|---|
| `AZURE_APP_NAME` | `examprep-api-anurag` |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Full XML content from Azure portal → App Service → Download publish profile |

> **To get publish profile**: Azure portal → examprep-api-anurag → Overview → "Download publish profile" button

---

## 2. Vercel Configuration

### Environment Variables
Set in **Vercel → project → Settings → Environment Variables**:

| Name | Value |
|---|---|
| `VITE_API_URL` | `https://examprep-api-anurag-hcc8eycmgrcrfjgq.centralindia-01.azurewebsites.net` |

> After changing any Vercel env var, trigger a **Redeploy** — Vite bakes env vars in at build time.

### Deployment
Vercel auto-deploys on every push to `main` via GitHub integration. No manual setup needed after initial connection.

---

## 3. CI/CD Pipeline (GitHub Actions)

### Workflow: `.github/workflows/deploy-api.yml`
- **Triggers**: push to `main` touching `ExamPrep/src/**`, `ExamPrep/ExamPrep.slnx`, or the workflow file itself
- **What it does**: builds and publishes the .NET API, deploys to Azure App Service via publish profile

### No frontend workflow needed
Vercel watches the `main` branch directly. The file `.github/workflows/deploy-frontend.yml` was deleted — do not recreate it.

---

## 4. Database (Neon PostgreSQL)

- **Project**: rapid-resonance-07812352
- **Branch**: production (default)
- **Compute**: ep-delicate-breeze-anmga8fl (Active)
- Schema is managed by EF Core — tables are created automatically on first startup via `EnsureCreatedAsync()`
- Seed data runs on every startup (safe — checks before inserting)

---

## 5. Key Files

| File | Purpose |
|---|---|
| `ExamPrep/src/ExamPrep.API/web.config` | Tells IIS/Azure how to run the ASP.NET Core app (required for Windows App Service) |
| `ExamPrep/src/ExamPrep.API/appsettings.json` | Default config — Azure env vars override these at runtime |
| `ExamPrep/src/ExamPrep.API/Program.cs` | Startup: DB seeding wrapped in try-catch so startup errors don't crash the app |
| `ExamPrep/client/src/api/apiClient.ts` | Frontend API base URL — reads from `VITE_API_URL` env var |

---

## 6. Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| `ERR_NAME_NOT_RESOLVED` on API calls | Wrong API URL in Vercel `VITE_API_URL` | Update to the full Azure default domain and redeploy Vercel |
| CORS error on API calls | `AllowedOrigins__0` in Azure doesn't match Vercel URL | Update Azure env var, restart App Service |
| HTTP 500.30 — app failed to start | Startup exception (bad connection string, missing JWT key) | Visit `/startup-error` endpoint to see the exception |
| HTTP 500.32 — ANCM Failed to Load dll | Bitness mismatch (x64 publish on 32-bit plan) | Publish framework-dependent (no `-r` flag) or upgrade plan to 64-bit |
| Dropdown options invisible in dark mode | Native `<select>` options inherit page theme | Set `style={{ background: '#fff', color: '#000' }}` on `<option>` elements |
| Neon connection string error | PostgreSQL URL format (`postgresql://`) not supported by Npgsql | Use Npgsql format: `Host=...;Database=...;Username=...;Password=...;SSL Mode=Require` |
