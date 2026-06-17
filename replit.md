# શ્રીમતી ડી વી પટેલ ઉ.મા.શાળા ખડોદી બોરવાઈ — School Management Website

A complete school management website for Shrimati DV Patel Upper Secondary School, Khadodi Borvai (ખડોદી-બોરવાઈ), with public-facing pages and a full admin dashboard, built in Gujarati Unicode.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000/8080)
- `pnpm --filter @workspace/school run dev` — run the school website frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required secrets: `MONGODB_URI`, `CLOUDINARY_API_SECRET`
- Required env vars: `CLOUDINARY_CLOUD_NAME=dg7400fxz`, `CLOUDINARY_API_KEY=693423314473277`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (artifact: `artifacts/school`)
- API: Express 5 (artifact: `artifacts/api-server`)
- DB: MongoDB via Mongoose (cloud: MongoDB Atlas)
- File storage: Cloudinary (cloud_name: dg7400fxz)
- Validation: Zod (`zod/v4`)
- API codegen: Orval (from OpenAPI spec)
- Auth: JWT (`jsonwebtoken` + `bcrypt`)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks (do not edit manually)
- `lib/db/src/schema/` — Drizzle ORM table definitions
- `artifacts/api-server/src/routes/` — all Express route handlers
- `artifacts/school/src/pages/` — public/ and admin/ page components

## Product

**Public website:**
- Home — hero, stats, principal's message, quick links
- About — school history, trust info, principal message
- Management — management committee members
- Facilities — school facilities grid
- Staff Directory — searchable staff cards with Gujarati names, subjects, qualifications
- Students — class-filterable student directory
- Results (Top Students) — medal ranking by year and class
- Notice Board — published notices with dates
- Photo Gallery — masonry photo grid with lightbox
- Contact — address, phone, email, map link

**Admin Dashboard (JWT-protected):**
- Dashboard — stats cards + bar chart (students by class)
- Staff CRUD — add/edit/delete staff with photo upload
- Students CRUD — tabular list with add/edit/delete
- Top Students CRUD — rank entry per class per year
- Notices CRUD — with publish/draft toggle
- Gallery — photo upload and delete
- Caste Stats — form + pie chart (ST/OBC/SC/General)
- School Info — edit all school details
- Contact Info — edit phone, email, map link

## Admin Credentials

- Email: `dvpatelhighschool@gmail.com`
- Password: `dvpatel@123`

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → typed React Query hooks everywhere
- JWT stored in `localStorage` under key `school_token`; `setAuthTokenGetter` wired in `main.tsx` so all generated API hooks auto-attach the `Authorization: Bearer` header
- All text (UI labels, data) written in Gujarati Unicode; English subtitles provided for navigation clarity
- School primary color: Dark Blue `#0A2342` (`--primary: 213 73% 15%`)
- File uploads use `multer` on `/api/upload`; files served from `/api/uploads/:filename`
- DB seeded with realistic Gujarati sample data (staff, students, top students, notices)

## Gotchas

- After adding new route files to `artifacts/api-server/src/routes/`, you must restart the `artifacts/api-server: API Server` workflow for changes to take effect
- Run `pnpm run typecheck:libs` first if you change anything in `lib/db` (to rebuild lib declarations before checking artifact packages)
- `<p>` tags must NOT wrap Skeleton components (which render as `<div>`) — use `<div>` instead to avoid React hydration errors
- Staff `subjects_taught` is a `text[]` Postgres column; insert using `{...}` array literal syntax, not JSON strings
- Do not use `pnpm dev` at workspace root — use workflow restart instead

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
