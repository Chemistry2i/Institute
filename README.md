# ACMIS

Academic Management Information System for configurable tertiary institutions.

## Current milestone

The repository currently contains a frontend foundation under `frontend/`. It uses React, TypeScript, Vite, Bootstrap, React Router, TanStack Query, React Hook Form, Zod, Lucide icons and Work Sans from Google Fonts, using weight 400 for body text and 500/600 for controls and headings. Bootstrap is the styling system; Tailwind is not used. Accessible shadcn-style Button, Select and Dialog components are kept as reusable source under `frontend/src/components/ui/`, with Radix UI primitives. Theme variables are centralized in `frontend/src/index.css`.

The application shell, navigation, role configuration, access helpers and dashboard are separated by responsibility:

- `frontend/src/components/layout/` contains the application shell.
- `frontend/src/components/shared/` contains reusable module-level UI.
- `frontend/src/config/roles.ts` defines role templates, dashboard summaries, responsibilities and permission identifiers.
- `frontend/src/config/access.ts` centralizes frontend permission checks and role-scoped navigation.
- `frontend/src/features/` contains feature-owned pages and tests.
- `frontend/src/features/settings/` contains the role-scoped settings draft interface.
- `frontend/src/features/registrar/` contains the Registrar dashboard and academic workspace layouts. Search, filters, sort indicators, workflow dialogs and pagination controls are present; operational records, approvals and exports require backend APIs.

The Student role is included with self-service permissions for the student's own records. Role switching is only a development preview; it does not provide an authenticated student account.

The role selector is a development preview only. It is not authentication or an authorization boundary. A backend must derive the signed-in identity and permissions, scope records server-side, and enforce every protected operation before this system is used with institutional data. Dashboard metrics, activity charts and system-health data are intentionally empty until connected to real APIs. The Super Administrator has the first independent dashboard implementation; remaining role dashboards are being developed one role at a time.

## Frontend development

```bash
cd frontend
npm install
npm run dev
```

Run checks with `npm run build`, `npm run lint` and `npm test` from `frontend/`.

## Next implementation milestones

1. Expand the frontend design-system components and feature workflows.
2. Implement backend authentication, institution scope and server-enforced permissions.
3. Add institution and academic structure configuration.
4. Implement admissions and student records, then registration, teaching and results.
5. Add finance and remaining student services with audit, reporting and workflow tests.

Academic policies, approval chains, regulatory reports and finance rules remain institution-configurable decisions and must be confirmed before they are encoded as mandatory behavior.
