# Codex Context for This Repository

## Purpose
This repository is evolving toward a local-first work management app with shared data model support for:
- Calendar
- Planner
- Kanban

## Architecture Quick Map
- Client entry: `src/main.tsx`
- Jazz account schema: `src/schema.ts`
- Domain CoTypes: `src/coTypes/data.ts`
- Protected project list: `src/routes/_protected/index.tsx`
- Project detail route: `src/routes/_protected/$projectId.tsx`
- Property rendering: `src/components/propertyViews/PropertyView.tsx`
- Table projection: `src/components/views/TableView.tsx`
- Auth server adapter: `server/auth.ts`

## Current Behavior Notes
- Account root owns `myProjects`.
- New projects are seeded with property definitions + a default table view.
- Items currently rely on `values` (`co.record`) and property definitions.
- Sync config currently sets `when: "never"` in `JazzReactProvider`.

## Conventions To Preserve
- Jazz entities: `co.map` + exported `Input`/`Value` aliases.
- Property definitions drive editor/presentation metadata.
- Keep route-level `resolve` shape explicit for CoValue loading.

## Known Risks / Debt
- JSON string configs (`editor.options`, `filters`) reduce type safety.
- Some files include encoding artifacts (`…`, `→`, `–`) and should be normalized.

## Codex Working Rules for Future Tasks
- Prefer extending schema in backward-compatible steps (migrations + fallback reads).
- Add canonical fields for cross-view logic; use custom record only for non-canonical fields.
- Keep view adapters thin: transform data close to rendering component.
- When adding properties, update both:
  - property definition presets
  - view-level visible keys/config

## Next High-Value Tasks
1. Introduce canonical work-item fields in `src/coTypes/data.ts`.
2. Add typed `KanbanView` and `CalendarView` components using canonical keys.
3. Add migration/backfill helper for existing project items.
4. Add tests for projection logic (status grouping, calendar range mapping).
