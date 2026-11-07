# TIMS Admin Frontend TODO

## Dashboard and responsive application shell
- [x] Provide a professional, modern, responsive frontend shell with a collapsible left sidebar, top header, breadcrumbs, global search affordance, notifications, theme control, user profile menu, consistent content spacing, page titles, contextual actions, and mobile navigation.
- [x] Use Poppins throughout the application and establish a consistent institutional design system with accessible contrast, visible focus states, reduced-motion support, readable tables, semantic status badges, and clear empty/loading/error patterns where applicable.

## RBAC-aware navigation and permissions
- [x] Implement a typed permission framework that uses permission IDs rather than relying exclusively on role names.
- [x] Seed demo role templates for Super Administrator, ICT Administrator, Institution Head, Academic Registrar, Finance Officer, Lecturer, and Student, with navigation and page actions filtered through permissions.
- [x] Provide a Users & Roles surface that communicates which role is active and which permissions are granted in the frontend demo.

## Core module surfaces
- [x] Provide navigable frontend surfaces for admissions, students, academics, registration, examinations, finance, reports, users & roles, and settings, with representative tables, stats, statuses, filters, and contextual actions.
- [x] Provide an institutional dashboard with enrolment, finance, registration, and academic-performance summaries plus Recharts visualizations and an activity timeline.

## Customizable institution and theme settings
- [x] Provide settings for institution identity and interface preferences.
- [x] Provide semantic color controls for primary, secondary, success, warning, error, and info colors using the initial palette `#174A84`, `#16856B`, `#15803D`, `#B45309`, `#B91C1C`, and `#0369A1`.
- [x] Persist frontend theme choices locally and support light/dark mode.
- [x] Use SweetAlert2 for reset/destructive confirmation and toast notifications for non-blocking success feedback.

## Frontend-only boundary
- [x] Keep backend, database, authentication persistence, and server-side enforcement out of this phase while organizing the UI for later typed API integration.
- [x] Provide a static `GET /manus-routes.json` route manifest synchronized with the implemented page routes.

## Expanded module frontend surfaces and modal workflows
- [x] Provide dedicated frontend routes for learning resources, library management, staff and HR, accommodation, internship and research, student welfare, graduation and alumni, and communications, in addition to admissions, students, academics, registration, examinations, finance, and reports.
- [x] Give each module a typed demo data surface with module-specific copy, operational KPIs, searchable table framing, statuses, pagination framing, and RBAC-aware access.
- [x] Add reusable modal workflows for creating a draft record, applying workspace filters, and reviewing record details, with accessible close actions, keyboard-focusable controls, responsive layouts, and toast feedback.
- [x] Keep Poppins applied across all module headings, navigation, tables, form controls, modal copy, and action buttons.

## Full TIMS frontend gap audit
- [x] Add a public frontend authentication entry screen with institutional email, password visibility, remember-device control, password recovery affordance, and demo-mode messaging.
- [x] Add timetabling and attendance workspaces with schedule conflicts, room and lecturer availability, attendance sessions, low-attendance alerts, correction requests, and summary records.
- [x] Add scholarship and sponsorship workspace for awards, applications, allocations, sponsor balances, and limit exceptions.
- [x] Add quality assurance workspace for evaluations, improvement actions, programme review, and tracer surveys.
- [x] Add procurement and inventory workspace for requisitions, suppliers/stores, asset register updates, and stock alerts.
- [x] Add system administration and audit workspace for audit events, jobs, integrations, imports, and operational monitoring.
- [x] Expand the frontend RBAC role catalog with academic leadership, registrar, admissions, faculty, department, examination, finance, scholarship, HR, library, accommodation, internship, quality, welfare, procurement, auditor, tutor, student, and parent/sponsor role templates.
