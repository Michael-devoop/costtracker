@AGENTS.md

# Construction Cost Tracker — Build Progress

## Project Overview
A full-stack Next.js 16 construction cost tracking web app with Tailwind CSS 4, dark-mode-first glassmorphism UI, and JSON-file data storage (MVP — no external DB).

## Architecture
- **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- **Data:** JSON file storage at `data/db.json` (no Prisma/PostgreSQL for MVP)
- **Auth:** Simplified demo auth (no real JWT/NextAuth for MVP)
- **Styling:** Dark-mode-first, glassmorphism, indigo/purple accent palette

## Completed Components

### Foundation
- `src/types/index.ts` — All TypeScript interfaces (User, Project, BudgetCategory, CostEntry, Vendor, etc.)
- `src/lib/utils.ts` — Utility functions (formatCurrency, formatDate, cn, generateId, calculateVariance, etc.)
- `src/lib/validators.ts` — Input validation for projects, cost entries, categories, vendors
- `src/lib/db.ts` — JSON file-based database layer with typed CRUD functions
- `data/db.json` — Seed data: 4 projects, 25 categories, 7 vendors, 27 cost entries, change orders, notifications

### Design System
- `src/app/globals.css` — Complete design system: CSS custom properties, glassmorphism, animations, form inputs, tables, progress bars, scrollbars

### UI Components
- `src/components/ui/Button.tsx` — Primary/secondary/danger/ghost variants with loading spinner
- `src/components/ui/Card.tsx` — Glassmorphic card with CardHeader, CardMetric sub-components
- `src/components/ui/Modal.tsx` — Animated modal with backdrop blur and keyboard escape

### Layout Components
- `src/components/layout/Sidebar.tsx` — Collapsible sidebar with nav links, logo, user footer
- `src/components/layout/Navbar.tsx` — Top bar with breadcrumbs, search, notifications, mobile menu

### Dashboard Components
- `src/components/dashboard/ProjectCard.tsx` — Project summary card with budget progress bar
- `src/components/dashboard/BudgetSummaryCard.tsx` — Four-card metrics grid
- `src/components/reports/BudgetChart.tsx` — CSS-only horizontal bar chart (budget vs actual)

### Cost Entry Components
- `src/components/costs/CostEntryForm.tsx` — Quick-entry form with validation
- `src/components/costs/CostEntryTable.tsx` — Sortable table with status badges and actions

### API Routes
- `src/app/api/projects/route.ts` — GET all / POST create
- `src/app/api/projects/[id]/route.ts` — GET / PUT / DELETE single project
- `src/app/api/projects/[id]/summary/route.ts` — GET budget-vs-actual summary
- `src/app/api/categories/route.ts` — GET by projectId / POST create
- `src/app/api/costs/route.ts` — GET by projectId / POST create
- `src/app/api/costs/[id]/route.ts` — GET / PUT / DELETE single cost entry
- `src/app/api/vendors/route.ts` — GET all / POST create

### Hooks
- `src/hooks/useProjects.ts` — Projects fetching and creation
- `src/hooks/useCosts.ts` — Cost entry CRUD with parallel data fetching

### Pages
- `src/app/layout.tsx` — Root layout with Inter font and SEO metadata
- `src/app/page.tsx` — Redirects to /dashboard
- `src/app/(auth)/login/page.tsx` — Glassmorphic login with demo credentials
- `src/app/(auth)/register/page.tsx` — Registration page
- `src/app/(dashboard)/layout.tsx` — Dashboard shell with Sidebar + Navbar
- `src/app/(dashboard)/dashboard/page.tsx` — Portfolio dashboard (server component)
- `src/app/(dashboard)/projects/page.tsx` — Projects list table
- `src/app/(dashboard)/projects/[id]/page.tsx` — Project detail with metrics, chart, recent costs
- `src/app/(dashboard)/projects/[id]/costs/page.tsx` — Cost entries with modal form
- `src/app/(dashboard)/projects/[id]/categories/page.tsx` — Budget categories table
- `src/app/(dashboard)/projects/[id]/vendors/page.tsx` — Vendor cards
- `src/app/(dashboard)/projects/[id]/change-orders/page.tsx` — Change orders table
- `src/app/(dashboard)/projects/[id]/reports/page.tsx` — Budget summary report + chart
- `src/app/(dashboard)/settings/page.tsx` — Profile, preferences, notifications

## Key Design Decisions
1. **JSON file storage** instead of PostgreSQL — keeps MVP portable, no Docker/DB setup needed
2. **Server components** for dashboard and detail pages — data fetched at build/request time
3. **Client components** only where needed (costs page, modals, sidebar nav)
4. **Next.js 16 async params** — all `params` are `Promise<>` and awaited
5. **No external chart library** — CSS-only bar charts for MVP
6. **Tailwind CSS 4** `@import "tailwindcss"` + `@theme inline` syntax

## What's NOT Built Yet (Phase 2+)
- Full authentication (NextAuth + bcrypt + JWT)
- Prisma + PostgreSQL migration
- File upload for receipts
- PDF/Excel export
- Email notifications
- OCR receipt scanning
- Payment tracking
- Multi-user real-time
