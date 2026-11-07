# TIMS Admin Frontend Plan

## Scope
Build only the frontend for a tertiary institution management and academic information system. This first delivery establishes the reusable application shell, dashboard experience, RBAC-aware navigation, theme settings, and representative module pages using realistic demo data. Backend APIs, authentication persistence, database, and server-side enforcement are intentionally out of scope for this phase; the UI is structured so these can be wired in later.

## Implementation approach
- React + Vite + TypeScript strict mode.
- Bootstrap 5.3 for responsive layout, grids, table patterns, and spacing conventions.
- Tailwind CSS with a `tw-` prefix for shadcn-style component primitives without conflicting with Bootstrap utilities.
- Poppins throughout the interface, with CSS custom properties for semantic colors.
- `lucide-react` for shadcn-compatible icons, with accessible labels on icon-only controls.
- React Router route map for Dashboard, Admissions, Students, Academics, Registration, Examinations, Finance, Reports, Users & Roles, and Settings.
- Reusable shell pieces: `AppSidebar`, `AppHeader`, `PageHeader`, `StatCard`, `StatusBadge`, `PermissionGuard`, `Toast`, and theme controls.
- Recharts for the enrolment trend and faculty distribution visualizations.
- SweetAlert2 for destructive/reset confirmations; `react-hot-toast` for non-blocking feedback.
- Demo RBAC state is held in a small typed context with role templates and permission IDs. Navigation and page actions read permissions rather than hardcoding role names.
- Theme settings are persisted to localStorage and exposed through semantic CSS variables so institution admins can customize primary, secondary, success, warning, error, and info colors later via an API.

## Project structure
- `src/app/`: router, providers, app shell, and typed application context.
- `src/components/`: reusable UI primitives and layout components.
- `src/data/`: typed demo data and navigation definitions.
- `src/pages/`: route-level dashboard, module, and settings screens.
- `src/styles/`: global design tokens, Bootstrap/Tailwind integration, and responsive overrides.
- `public/manus-routes.json`: complete static route manifest for Preview.

## Design direction
### Alternatives considered
- Swiss academic operations — 0.08: strict grids, restrained type, and print-inspired information density.
- Civic digital campus — 0.06: calm institutional blue, accessible contrast, and public-service clarity.
- Editorial command centre — 0.04: strong typographic hierarchy, modular panels, and narrative data presentation.

### Chosen style: Civic digital campus

**Design Movement:** Civic digital campus: a modern public-service dashboard adapted for institutional operations.

**Core Principles:** calm authority, fast scanning, visible system status, and respectful density.

**Color Philosophy:** deep institutional blue anchors trust and governance; teal marks progress and active operations; soft slate neutrals keep long work sessions comfortable; semantic colors are reserved for meaning and remain configurable.

**Layout Paradigm:** persistent left navigation with a compact utility rail and a wide operational canvas. Important context stays close to the page title; dashboard panels are arranged as a rhythm of summary, trend, and action rather than a wall of equal cards.

**Signature Elements:** a narrow blue accent rail on active navigation, rounded metric tiles with tiny trend indicators, and a “today at a glance” activity timeline.

**Interaction Philosophy:** actions should be reversible or clearly confirmed, success should be acknowledged without interrupting work, and permission-limited actions should feel intentionally unavailable rather than mysteriously absent.

**Animation:** subtle 160–220ms easing for navigation, card hover, and drawer transitions; honor `prefers-reduced-motion`; no decorative continuous motion.

**Typography System:** Poppins 700 for page titles, 600 for section labels and buttons, 500 for navigation and table labels, 400 for body copy. Use tight tracking for uppercase micro-labels and generous line-height for helper copy.

**Brand Essence:** the operating layer for confident institutional decisions — clear, governed, dependable.

**Brand Voice:** concise, operational, and supportive. Example lines: “Keep the semester moving.” and “Review what needs your attention today.”

**Wordmark & Logo:** a compact “T” formed from two offset institutional bars, paired with the TIMS wordmark; the mark is represented in the UI by a layered two-tone monogram tile.

**Signature Brand Color:** `#174A84`, the institutional blue used as the durable identity anchor.

## Frontend/backend serving
This phase is a static frontend served by Vite on port 3000. All current figures and lists are local demo data marked as such in code. The query/data boundaries are kept typed and route-level so TanStack Query and a typed API client can be added without replacing the visual layer.

## Expanded module architecture
The operational frontend now uses a dedicated `ModuleWorkspace` component for all repeatable institutional modules, a shared `app-context.tsx` for typed RBAC and theme state, and a shared modal shell for create, filter, and detail workflows. Module-specific titles, icons, permissions, and demo rows remain in `src/data.ts`, so a future API adapter can replace the local records without rewriting route or presentation logic.
