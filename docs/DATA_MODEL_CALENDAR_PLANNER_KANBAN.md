# Flexible Data Model for Calendar / Planner / Kanban

## Goals
- One shared local-first model that supports multiple projections:
  - Calendar (time-based)
  - Planner (priority/effort/goals)
  - Kanban (status/lane flow)
- Keep custom fields extensible without schema rewrites.
- Preserve offline-first edits and conflict-friendly semantics.

## Recommended Pattern
Use a **hybrid schema**:
- Keep strongly-typed canonical fields for cross-view behavior.
- Keep `customValues` (`co.record`) for project-specific extensions.
- Keep property definitions for rendering/editor metadata.

## Canonical Work Item Shape (Proposed)

```ts
const WorkStatus = z.enum(["backlog", "todo", "in_progress", "blocked", "done", "archived"]);
const WorkType = z.enum(["task", "event", "note", "milestone"]);

const WorkItem = co.map({
  title: z.string(),
  description: z.string().optional(),

  // Planner + Kanban
  status: WorkStatus,
  priority: z.number().min(0).max(4).optional(),
  estimate: z.number().optional(),
  assigneeAccountIds: z.array(z.string()).optional(),
  labels: z.array(z.string()).optional(),

  // Calendar
  startAt: z.string().optional(), // ISO datetime
  endAt: z.string().optional(),   // ISO datetime
  allDay: z.boolean().optional(),
  timezone: z.string().optional(),

  // Planning/graph
  parentId: z.string().optional(),
  dependencyIds: z.array(z.string()).optional(),

  createdAt: z.string(),
  updatedAt: z.string(),

  // Flexible extension
  customValues: co.record(z.string(), propertyValueSchema),
});
```

## Project Shape (Proposed)

```ts
const Project = co.map({
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string(),

  items: co.list(WorkItem),
  itemDefinitions: co.list(ItemPropertyDefinition),
  viewDefinitions: co.list(ViewDefinition),
  workflow: co.optional(WorkflowConfig),
});
```

## View Config Conventions
Define explicit per-view configs instead of generic JSON strings when possible.

```ts
const TableViewConfig = z.object({
  visibleKeys: z.array(z.string()),
  sort: z.array(z.object({ key: z.string(), dir: z.enum(["asc", "desc"]) })),
});

const KanbanViewConfig = z.object({
  laneKey: z.string(),                // usually "status"
  laneOrder: z.array(z.string()),
  wipLimits: z.record(z.string(), z.number()).optional(),
});

const CalendarViewConfig = z.object({
  startKey: z.string(),               // usually "startAt"
  endKey: z.string().optional(),      // usually "endAt"
  allDayKey: z.string().optional(),   // usually "allDay"
  defaultSpanMinutes: z.number().optional(),
});
```

## Canonical Keys to Standardize
Use these keys by default so components can be generic:
- `status`
- `priority`
- `estimate`
- `startAt`
- `endAt`
- `allDay`
- `labels`
- `assigneeAccountIds`

## Migration Strategy
1. Add canonical fields to `Item` (or introduce `WorkItem`) without removing `values`.
2. Backfill from existing `values` keys (`dueDate`, `status`, `tags`, etc.).
3. Update views to read canonical fields first, fallback to legacy `values`.
4. Replace JSON-string configs with typed maps incrementally.
5. After stabilization, deprecate redundant legacy keys.

## Conflict/Sync Semantics (Jazz)
- Prefer small independent fields over large JSON blobs.
- Keep lists for naturally ordered entities (lane order, project item ids).
- Keep records for sparse custom fields.
- Store timestamps as ISO strings for consistent serialization.

## Suggested First Implementation Slice
- Add canonical fields: `status`, `startAt`, `endAt`, `allDay`, `priority`, `labels`.
- Implement one Kanban lane grouping by canonical `status`.
- Implement one Calendar projection from `startAt`/`endAt`.
- Keep existing table + `PropertyView` pipeline for custom fields.
