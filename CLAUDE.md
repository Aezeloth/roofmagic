# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Serve built app
npm run typecheck  # Generate React Router types + tsc check
```

No test runner is configured.

## Architecture

**RoofMagic** is an AI-powered roof visualization app. Users upload a photo of their house, and the app renders what it would look like with different roofing materials using Gemini AI.

### Tech Stack

- **React Router v7** (full-stack, SSR enabled) with file-based routing
- **React 19 + TypeScript** (strict mode, path alias `~/*` → `./app/*`)
- **Tailwind CSS v4** with a neobrutalism theme (custom CSS variables in `app/app.css`)
- **Puter.js** — the entire backend (auth, KV storage, file system, CDN hosting, AI)

### Key Directories

- `app/routes/` — Two routes: `home.tsx` (landing/upload) and `visualizer.$id.tsx` (editor)
- `lib/` — All Puter interactions and business logic:
  - `puter.action.ts` — Auth and project CRUD via `puter.workers.exec()`
  - `puter.hosting.ts` — Uploads rendered images to Puter CDN
  - `ai.action.ts` — Calls Puter's `txt2img` (Gemini 2.5 Flash) for roof rendering
  - `constants.ts` — AI prompt, storage paths, timing constants, CDN domain
- `components/` — `navbar.tsx` + `ui/Button.tsx`
- `type.d.ts` — Shared types: `AuthState`, `DesignItem`, `AppStatus`, `Material`, `DesignConfig`

### Data Flow

1. User uploads image → stored in Puter file system (`roofmagic/sources/`)
2. Project metadata saved via Worker API (`VITE_PUTER_WORKER_URL`)
3. AI render triggered → `puter.ai.txt2img()` with `ROOFMAGIC_RENDER_PROMPT`
4. Rendered image hosted on Puter CDN (unique subdomain per user, e.g. `userId-roofmagic.puter.site`)
5. Hosting config cached in Puter KV storage

### Auth & State

Auth state (`isSignedIn`, `userName`, `userId`, `signIn`, `signOut`, `refreshAuth`) lives in `root.tsx` and is passed down via React Router's `Outlet` context. Routes access it with `useOutletContext<AuthState>()`.

### Environment

`VITE_PUTER_WORKER_URL` is required for project save/list operations. Copy `.env.example` to `.env.local`.
