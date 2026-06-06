
## Architecture Scaffolding Plan

### 1. Database Schema (Migration)
Create all V1 tables with RLS:
- **profiles** — user profiles with display name, avatar
- **weddings** — wedding entity (couple names, date, cultural background, total budget)
- **wedding_members** — links users to weddings with roles (planner/couple/parent)
- **events** — per-wedding events (Mehndi, Haldi, etc.) with venue, date, guest count
- **vendors** — vendor records per wedding (name, category, status, contact info)
- **contracts** — contract uploads linked to vendors (pdf_url, analysis JSON, risk score, obligations)
- **obligations** — extracted obligations with due dates, amounts, completion status
- **budget_items** — per-event budget lines (category, allocated, spent)
- **guests** — master guest list with per-event tags, RSVP status, relationship side
- **outreach_messages** — vendor outreach drafts with status tracking
- **style_profiles** — planner voice/tone profiles for AI outreach

### 2. Domain Types (`src/types/`)
Centralized TypeScript interfaces for all domain models, replacing inline types in page components.

### 3. React Query Hooks (`src/hooks/`)
Data-fetching hooks for each domain:
- `useWedding` / `useWeddings` — active wedding context
- `useEvents`, `useVendors`, `useContracts`, `useGuests`, `useBudget`, `useOutreach`
- Each hook handles CRUD with optimistic updates

### 4. Wedding Context (`src/contexts/WeddingContext.tsx`)
Tracks the active wedding across all pages. All data hooks scope to the active wedding ID.

### 5. Refactor Pages
Update each page to import from the hooks layer, falling back to sample data when no real data exists. This makes each page "live-ready" without breaking the current demo.

### 6. Shared Components
- `EmptyState` — reusable empty state with CTA
- `DataTable` — generic sortable/filterable table
- `StatCard` — reusable stat card used across dashboard/budget

This creates a clean separation: **Database → Types → Hooks → Components → Pages**, making each feature independently implementable for V1.
