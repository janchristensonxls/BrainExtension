# Local-First Architecture (Current State)

## Stack
- Frontend: React 19 + TanStack Router + Vite
- Local-first sync/data: `jazz-tools` (`co.map`, `co.list`, `co.record`)
- Auth: `better-auth` + `jazz-tools/better-auth` plugin
- Sync peer: Jazz Cloud (`wss://cloud.jazz.tools/?key=...`)

## Current Data Ownership Model
- Account schema: `MyAppAccount` in `src/schema.ts`
- Account root keeps `myProjects: co.list(Project)`
- Each `Project` is a Jazz CoValue (`src/coTypes/data.ts`)
- Project members are shared by mutating owner group (`project.$jazz.owner.addMember(...)`)

## Current Project Model
`Project` currently stores:
- `name`
- `description?`
- `createdAt`
- `items: co.list(Item)` (explicit field)
- `propertyDefinitions: co.list(ItemPropertyDefinition)`
- `views?: co.list(ViewDefinitionMap)`

`Item` stores:
- `title`
- `values: co.record<string, PropertyValue>`

`PropertyValue` supports:
- string, number, boolean, date, string[] (tags), calendar entry object, null

## What Is Already Good
- Property-definition driven model is flexible and local-first friendly.
- Views are defined per project (`table`, `kanban`, `calendar`, `list`).
- UI already resolves CoValues lazily and renders by property metadata.

## Gaps To Address
- `editor.options` and `view.filters` are JSON strings; typed objects would be safer.
- No first-class planning primitives yet (recurrence, effort units, dependencies, assignee, board lanes, schedule windows).
- No documented conventions for "canonical" property keys per view type.

## Sync/Auth Notes
- Client sync config in `src/main.tsx` uses `when: "never"` (offline-only behavior unless changed).
- Server auth adapter in `server/auth.ts` points to same Jazz Cloud peer.
- `trustedOrigins` currently includes `http://localhost:3000`.

## Practical Next Step
Adopt a canonical "work item" schema extension (see `docs/DATA_MODEL_CALENDAR_PLANNER_KANBAN.md`) while keeping the current property-definition mechanism for custom fields.
