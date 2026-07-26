# Frontend Integration Task Plan

**Companion to `TASKS.md` and `project-documentation.md`** — scope: `ai-workflow-automation-hub-web` (React + TypeScript + Vite + MUI), consuming backend repo's Express API.

> Written for another Claude agent picking up FE work cold. Every endpoint below was read directly from `src/routes/*` and `src/schemas/*` in backend repo — treat this file as the source of truth over `project-documentation.md` §12 where they disagree (the doc describes the target design; this file describes what's actually implemented today).

---

## 0. Ground Rules

- **Base URL**: backend serves on `http://localhost:4000` (`PORT` env). All endpoints are under `/api/*` except `GET /health`.
- **Auth**: JWT bearer token from `POST /api/auth/login`. Every other `/api/*` route requires `Authorization: Bearer <token>` (`requireAuth` middleware) and returns `401` if missing/invalid/expired.
- **No self-registration.** There is one seeded admin user (`ADMIN_EMAIL`/`ADMIN_PASSWORD`, via `prisma/seed.ts`). Build a login page only — no signup UI.
- **Rate limits**: all `/api/*` routes share a 100-req/15-min limiter; `/api/auth/login` has its own 10-req/15-min limiter. Handle `429` distinctly from other errors (e.g. "Too many attempts, try again later").
- **Error shape** (from `errorHandler.ts`):
  - Validation (Zod, 400): `{ error: "Validation failed", details: [{ path, message }] }` — map `details` to form field errors.
  - App errors: `{ error: string, details?: string }` — `details` shows up on some 502/503s (Claude/Slack/n8n failures). Show `error` as the primary message; put `details` behind a "show more" if you show it at all.
  - Everything else: `500 { error: "Internal server error" }`.
- **No pagination anywhere.** `GET /api/emails`, `GET /api/crm/records`, `GET /api/workflows` all return full arrays, newest first. Do client-side paging/virtualization if needed — don't build UI for `?page=`/`?limit=` params, the backend ignores them.
- **No update/delete endpoints exist yet** for emails, CRM records, or workflow logs — everything is create + read only. Don't design "edit"/"delete"/"mark resolved" buttons against this API as it stands.

---

## 1. Known Backend Gaps (design around these explicitly)

| Gap                                                                                                                                      | Impact                                                                                 | Recommended FE handling                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| No `POST /api/auth/register`                                                                                                             | Single admin login only                                                                | Login-only auth flow, no signup screen                                                                                              |
| No prompt-template routes (`PromptTemplate` model + service exist, but nothing in `src/routes` exposes them)                             | Module 5 "Prompt Templates" editor has no API to call                                  | Build the screen read-only/disabled with a "backend endpoint pending" note, or skip it until a route lands — don't wire a fake save |
| No `/mcp/tools`, `/mcp/execute` routes (backend Phase 4 incomplete)                                                                      | No MCP UI possible                                                                     | Skip; do not build a Module for this yet                                                                                            |
| No update endpoint for email `status`, CRM records, or workflow logs                                                                     | No "resolve"/"edit" actions                                                            | Detail views are read-only; only new-record creation is a write path                                                                |
| No settings-persistence endpoint for Anthropic key / Slack webhook URL / CRM endpoint                                                    | Those are server `.env` values, not user-editable via API                              | Module 5 Settings shows them as read-only/masked info, not editable form fields, unless/until a backend route exists                |
| `POST /api/workflows/run` triggers n8n **by posting a fresh `{sender, subject, body}` payload**, not by referencing an existing email id | Can't "re-run workflow for email #12" from the Email Inbox as a one-click action today | Model it as "simulate a new inbound email" (a form), not a re-run button on existing rows                                           |

---

## 2. API Reference

All paths below are relative to `/api`. All require `Authorization: Bearer <token>` unless marked **public**.

### Auth

| Method | Path                                              | Body                  | Response                         |
| ------ | ------------------------------------------------- | --------------------- | -------------------------------- |
| POST   | `/auth/login` **(public, rate-limited 10/15min)** | `{ email, password }` | `{ token, user: { id, email } }` |

### Emails

| Method | Path          | Body                                                        | Response       |
| ------ | ------------- | ----------------------------------------------------------- | -------------- |
| GET    | `/emails`     | —                                                           | `Email[]`      |
| GET    | `/emails/:id` | —                                                           | `Email` or 404 |
| POST   | `/emails`     | `{ sender, subject, body, category?, priority?, summary? }` | `Email` (201)  |

`Email`: `{ id, sender, subject, body, category: EmailCategory|null, priority: Priority|null, summary: string|null, status: 'PENDING'|'PROCESSED'|'FAILED', createdAt }`

### AI

| Method | Path          | Body                                                          | Response                                                                                                                                                                                            |
| ------ | ------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/ai/analyze` | `{ sender, senderName?, subject, body, emailId? }`            | `{ customerName, company, email, phone, issueSummary, requestedAction, category, priority, summary }` — all extracted fields nullable except category/priority/issueSummary/requestedAction/summary |
| POST   | `/ai/reply`   | analysis object above + `{ sender, subject, body, emailId? }` | `{ subject, body }` (drafted reply)                                                                                                                                                                 |

Both can return `502`/`503`/`504` if Claude fails (timeout/rate-limit/error) — these are logged server-side to `workflow_logs` automatically; surface a retry action in the UI.

### CRM

| Method | Path               | Body                                                                      | Response           |
| ------ | ------------------ | ------------------------------------------------------------------------- | ------------------ |
| GET    | `/crm/records`     | —                                                                         | `CrmRecord[]`      |
| GET    | `/crm/records/:id` | —                                                                         | `CrmRecord` or 404 |
| POST   | `/crm/records`     | `{ customerName: string\|null, email, company?, source, sourceEmailId? }` | `CrmRecord` (201)  |

`CrmRecord`: `{ id, customerName: string|null, email, company: string|null, source, createdAt, sourceEmailId? }`. `source` is a free-text string describing where the record came from (e.g. `"n8n_pipeline"`, `"manual_entry"` — see §5).

### Notifications

| Method | Path                   | Body          | Response                    |
| ------ | ---------------------- | ------------- | --------------------------- |
| POST   | `/notifications/slack` | `{ message }` | `{ status: 'sent' }` or 502 |

### Workflows

| Method | Path             | Body                                                                  | Response                                                                                           |
| ------ | ---------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| GET    | `/workflows`     | —                                                                     | `WorkflowLog[]`                                                                                    |
| POST   | `/workflows/log` | `{ workflow, status, error?, retryCount?, executionTime?, emailId? }` | `WorkflowLog` (201) — mainly used by n8n itself, expose only if you build an internal/debug screen |
| POST   | `/workflows/run` | `{ sender, subject, body }`                                           | `202 { status: 'triggered', result }` or `502`/`503` if `N8N_WEBHOOK_URL` unset/unreachable        |

`WorkflowLog`: `{ id, workflow, status: 'SUCCESS'|'FAILED'|'RETRYING', executionTime: number|null, error: string|null, retryCount, createdAt, emailId? }`

### Dashboard

| Method | Path         | Response                                                                                  |
| ------ | ------------ | ----------------------------------------------------------------------------------------- |
| GET    | `/dashboard` | `{ todayEmails, aiProcessed, salesLeads, supportTickets, failedWorkflows }` (all numbers) |

### Reports

| Method | Path       | Query                          | Response                                                                                                                                                                                 |
| ------ | ---------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/reports` | `?days=30` (1–365, default 30) | `{ emailsPerDay: {date, count}[], categoryDistribution: {category, count}[], priorityDistribution: {priority, count}[], workflowSuccessRate: {total, success, failed, retrying, rate} }` |

**Enums**: `EmailCategory` = `SALES\|SUPPORT\|BILLING\|COMPLAINT\|GENERAL_INQUIRY\|SPAM`. `Priority` = `LOW\|MEDIUM\|HIGH\|CRITICAL`. `EmailStatus` = `PENDING\|PROCESSED\|FAILED`. `WorkflowStatus` = `SUCCESS\|FAILED\|RETRYING`.

---

## 3. Data Layer Conventions

- **Axios instance** (`src/lib/apiClient.ts`): base URL from `VITE_API_BASE_URL`, request interceptor attaches `Authorization` from stored token, response interceptor catches `401` → clear auth state + redirect to `/login`.
- **React Query**: one hook file per resource (`useEmails`, `useEmail(id)`, `useCreateEmail`, `useCrmRecords`, `useCreateCrmRecord`, `useWorkflows`, `useRunWorkflow`, `useDashboard`, `useReports(days)`, `useAnalyzeEmail`, `useDraftReply`). Query keys: `['emails']`, `['emails', id]`, `['crm-records']`, etc. Invalidate the relevant list key on every successful mutation.
- **Auth state**: React Context (`AuthProvider`) holding `{ token, user }`, persisted to `localStorage`. Wrap the router in a `<ProtectedRoute>` that redirects to `/login` when no token is present.
- **Env**: FE needs only `VITE_API_BASE_URL` (e.g. `http://localhost:4000/api`). Nothing else from the backend `.env` is FE-relevant.

---

## 4. Modules & Components

### Module 0 — App Shell & Auth

- `LoginPage` — email/password form → `POST /auth/login`, stores token, redirects to Dashboard. Show 401 as "Invalid email or password", 429 as "Too many attempts".
- `AppLayout` — sidebar nav (Dashboard, Inbox, Customers, Workflows, Reports, Settings) + topbar (user email, logout button).
- `ProtectedRoute`, `AuthProvider`, `apiClient` (axios instance).
- `LogoutButton` — clears token, redirects to `/login`.

### Module 1 — Dashboard

- `StatCard` (reusable) × 5: Today's Emails, AI Processed, Sales Leads, Support Tickets, Failed Workflows — from `GET /dashboard`.
- `WorkflowHealthBanner` — see §5, degraded-mode indicator that also appears here.
- `QuickActions` — "Add Customer Manually", "Run Workflow Manually" buttons linking into Modules 4/3.

### Module 2 — Email Inbox

- `EmailList` — table/list from `GET /emails`, columns: sender, subject, category chip, priority chip, status chip, createdAt. Client-side search/filter/sort (no server-side query params exist).
- `EmailDetail` — original email (sender/subject/body), AI summary/category/priority/status from the row itself.
- `AnalyzeEmailButton` — calls `POST /ai/analyze` with the email's sender/subject/body (+`emailId`), shows returned structured fields; does **not** persist anything itself (analyze is stateless — if you want to keep the result, a separate `POST /emails` or a future PATCH is needed; today, treat it as an on-demand preview).
- `DraftReplyButton` / `ReplyDraftPanel` — calls `POST /ai/reply`, shows the drafted subject/body for the employee to copy/send manually (no send-email endpoint exists).
- `NewEmailForm` — manual `POST /emails` (e.g. logging an email received outside the pipeline).
- `CreateCrmFromEmailButton` — pre-fills the manual CRM form (Module 4) from this email's analyzed fields + `sourceEmailId`. Key link between Modules 2 and 4.
- `CategoryChip`, `PriorityChip`, `StatusChip` (reusable, color-coded — reused in Reports/Dashboard too).

### Module 3 — Workflow Logs

- `WorkflowLogTable` — from `GET /workflows`: workflow name, status chip, executionTime, retryCount, error (truncated/expandable), createdAt.
- `RunWorkflowForm` — `sender`/`subject`/`body` form → `POST /workflows/run`. Surface `503` ("N8N_WEBHOOK_URL is not configured") and `502` distinctly — this is the primary signal that automation is down (feeds `WorkflowHealthBanner`, §5).

### Module 4 — Customers / CRM _(not in the original 5-module doc — added because manual CRM entry needs a home)_

- `CrmRecordList` — from `GET /crm/records`: customerName, email, company, source, createdAt. Client-side search/filter.
- `CrmRecordDetail` — from `GET /crm/records/:id`.
- **`ManualCrmRecordForm`** — the fallback-creation requirement (see §5 for full detail): direct `POST /crm/records`, always available regardless of n8n/automation state.
- `SourceBadge` — visually distinguishes `source: "manual_entry"` (or whatever tag you pick) from pipeline-created records, so staff can see at a glance which records were entered by hand.

### Module 5 — Reports

- `EmailsPerDayChart` (line/bar, Recharts) ← `emailsPerDay`.
- `CategoryDistributionChart` (pie/bar) ← `categoryDistribution`.
- `PriorityDistributionChart` (bar) ← `priorityDistribution`.
- `WorkflowSuccessRateCard` ← `workflowSuccessRate` (total/success/failed/retrying/rate).
- `DateRangeSelector` — drives `?days=` (1–365).

### Module 6 — Settings _(partial — see §1 gaps)_

- `IntegrationStatusPanel` — read-only display of whether Anthropic/Slack/n8n are configured (infer from whether calls succeed/fail, since there's no `/settings` GET; **do not** invent an endpoint that doesn't exist).
- `PromptTemplateEditor` — build as **disabled/read-only with a "not yet available" note**, since no backend route exists (§1). Don't fake a save.
- `SlackTestButton` — `POST /notifications/slack` with a test message, useful to verify the Slack integration is alive independent of the full n8n pipeline.

### Cross-cutting / Shared Components

- `ToastProvider`/snackbar system for mutation success/error feedback.
- `ErrorBoundary` + generic 404/500 pages.
- `EmptyState` (reusable, for empty lists — emails/CRM/workflow logs all start empty on a fresh DB).
- `SkeletonLoader` / loading placeholders for every list & chart.
- `ConfirmDialog` (reusable) — keep in the shared kit even though nothing destructive exists yet; Phase 7 hardening or future PATCH/DELETE routes will need it.
- `DataTable` wrapper — one client-side sortable/filterable table component shared by Inbox, CRM, and Workflow Logs (all three are "full array in, table out" today).
- `WorkflowHealthBanner` — see §5.

---

## 5. Manual CRM Creation (Required Fallback Path)

**Why this exists:** the intended pipeline is n8n → `/ai/analyze` → save email → create CRM record → Slack. If n8n is down (not running, misconfigured, webhook unreachable), **no CRM records get created at all** unless a human can do it directly. `POST /api/crm/records` already exists in the backend and works independently of n8n — the FE's job is to make that path discoverable and fast, not just theoretically possible.

**Requirements:**

1. `ManualCrmRecordForm` must be reachable from a persistent, obvious entry point (Customers module top-level "Add Customer" button) — not buried behind a workflow-status check. Employees create records manually all the time (e.g. a phone call), not only during outages.
2. Fields mirror `createCrmRecordSchema` exactly: `customerName` (text, nullable — allow empty), `email` (required, validated as email), `company` (optional text), `source` (required text — default the input to `"manual_entry"` but let it be edited), `sourceEmailId` (optional, only shown/filled when launched from `CreateCrmFromEmailButton` on an email's detail page).
3. Submission is a direct `POST /crm/records` call — **never routed through `/workflows/run` or n8n**. This is the whole point: it must work even when the automation path is fully down.
4. `WorkflowHealthBanner` (shown on Dashboard + Customers module): derive a "degraded" state from recent `GET /workflows` entries (e.g. last N logs mostly `FAILED`, or a `POST /workflows/run` call returning `502`/`503`). When degraded, show a banner: _"Automated workflow may be unavailable — you can still add customers manually."_ with a button opening `ManualCrmRecordForm`. This is a UX nudge, not a gate — the manual form must remain usable even when this heuristic can't detect an outage.
5. No optimistic-only behavior: on success, invalidate `['crm-records']` and show a confirmation toast; on failure, keep the form populated so the employee doesn't retype.

---

## 6. Error / Loading / Empty State Conventions

- **Loading**: skeletons, not spinners, for every list/chart/detail view.
- **Empty**: `EmptyState` with a call-to-action (e.g. Customers empty → "Add your first customer manually").
- **Mutation errors**: toast with `error` message; Zod `details` mapped to inline field errors when the shape matches known form fields.
- **429**: distinct toast copy ("Too many requests — wait a bit and retry"), don't auto-retry.
- **502/503/504 from `/ai/*` or `/workflows/run`**: treat as "service temporarily unavailable", offer a retry button, and (for `/workflows/run`) surface the `WorkflowHealthBanner` nudge toward manual entry.

---

## 7. Phased Task Checklist

### Phase F0 — Scaffolding

- [ ] Vite + React + TS app, MUI theme, React Router, React Query provider, Axios instance
- [ ] `VITE_API_BASE_URL` in `.env`/`.env.example`
- [ ] `AuthProvider`, `ProtectedRoute`, `apiClient` with 401 interceptor

### Phase F1 — Auth & Shell

- [ ] `LoginPage` wired to `POST /auth/login`
- [ ] `AppLayout` with nav to all modules
- [ ] Logout flow

### Phase F2 — Dashboard (Module 1)

- [ ] 5 `StatCard`s from `GET /dashboard`
- [ ] `WorkflowHealthBanner` wired to `GET /workflows`
- [ ] Quick-action links to manual CRM form and workflow run form

### Phase F3 — Email Inbox (Module 2)

- [ ] List + detail views from `GET /emails`, `GET /emails/:id`
- [ ] `AnalyzeEmailButton` (`POST /ai/analyze`), `DraftReplyButton` (`POST /ai/reply`)
- [ ] `NewEmailForm` (`POST /emails`)
- [ ] `CreateCrmFromEmailButton` linking into Phase F4's form

### Phase F4 — Customers / CRM (Module 4) — **manual creation is core, not stretch**

- [ ] `CrmRecordList` + detail (`GET /crm/records`, `GET /crm/records/:id`)
- [ ] `ManualCrmRecordForm` → `POST /crm/records` (§5), reachable independent of any workflow-status check
- [ ] Wire `CreateCrmFromEmailButton` pre-fill path
- [ ] `SourceBadge` distinguishing manual vs. pipeline-created records

### Phase F5 — Workflow Logs (Module 3)

- [ ] `WorkflowLogTable` from `GET /workflows`
- [ ] `RunWorkflowForm` → `POST /workflows/run`, surfacing 502/503 clearly

### Phase F6 — Reports (Module 5)

- [ ] 4 charts + `DateRangeSelector` from `GET /reports?days=`

### Phase F7 — Settings (Module 6, partial)

- [ ] `IntegrationStatusPanel` (inferred status only)
- [ ] `SlackTestButton` → `POST /notifications/slack`
- [ ] `PromptTemplateEditor` stubbed read-only with "pending backend route" note

### Phase F8 — Polish & Hardening

- [ ] `ToastProvider`, `ErrorBoundary`, `EmptyState`, `SkeletonLoader`, `ConfirmDialog` shared components in place across all modules
- [ ] Manual QA: kill/disconnect n8n, confirm `ManualCrmRecordForm` still creates records successfully and the health banner reacts
- [ ] Manual QA: expired/invalid token → redirected to login from every route
- [ ] README section: FE setup, env vars, `npm run dev`

---

## 8. Explicit Non-Goals (until backend catches up)

- No MCP tool UI (backend Phase 4 unfinished)
- No prompt-template CRUD UI (no backend route)
- No edit/delete for emails, CRM records, or workflow logs (no backend route)
- No server-side pagination/filtering UI (backend returns full arrays only)
