# AI Workflow Automation Hub — Web

React + TypeScript app built with Vite.

## Stack

- [Vite](https://vite.dev) + [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) (Oxc-powered)
- React 19 + TypeScript (strict mode)
- [React Router](https://reactrouter.com) for routing, [TanStack Query](https://tanstack.com/query) for server state, [Axios](https://axios-http.com) for HTTP
- [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite` (no PostCSS config needed)
- [Oxlint](https://oxc.rs) for linting, [Prettier](https://prettier.io) for formatting
- [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/react) for testing
- [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged) pre-commit checks

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

This app consumes the `ai-workflow-automation-hub` backend API. Point `VITE_API_BASE_URL` at a running
instance of it (default `http://localhost:4000/api`) and seed an admin user there (`prisma/seed.ts`) —
there is no self-registration, only login.

## App shell & auth

- `src/lib/apiClient.ts` — shared Axios instance. Attaches `Authorization: Bearer <token>` from storage on
  every request; on a `401` response it clears stored auth and hard-redirects to `/login`.
- `src/lib/authStorage.ts` — single source of truth for persisting `{ token, user }` to `localStorage`.
- `src/features/auth/` — `AuthProvider`/`useAuth` (React Context), `useLogin` (React Query mutation for
  `POST /auth/login`), `LoginPage`, `LogoutButton`, `ProtectedRoute` (redirects to `/login` when signed out).
- `src/components/layout/AppLayout.tsx` — sidebar nav + topbar shell wrapping all authenticated routes.
- `src/pages/` — one route per module; most are placeholder stubs pending their own implementation phase.

## Scripts

| Script                 | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Start the dev server with HMR        |
| `npm run build`        | Type-check and build for production  |
| `npm run preview`      | Preview the production build locally |
| `npm run lint`         | Lint source files with Oxlint        |
| `npm run format`       | Format all files with Prettier       |
| `npm run format:check` | Check formatting without writing     |
| `npm run typecheck`    | Type-check without emitting          |
| `npm test`             | Run the test suite once              |
| `npm run test:watch`   | Run tests in watch mode              |

## Project conventions

- Import from `src/` using the `@/` alias (e.g. `import App from '@/App'`).
- Environment variables must be prefixed with `VITE_` to be exposed to client code; see `.env.example`.
- A pre-commit hook lints and formats staged files automatically.
- Tailwind is enabled globally via `@import 'tailwindcss';` in `src/index.css`; use utility classes directly in JSX.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
