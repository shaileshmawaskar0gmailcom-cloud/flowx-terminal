# FlowX Terminal

Standalone, original, analysis-focused order-flow and market-analysis terminal for desktop and Android browsers. It uses free public data only and is built only from [docs/ATAS_FEATURE_SPEC.md](docs/ATAS_FEATURE_SPEC.md). It does not depend on any other project.

**Status:** Phase 2 (foundation and guardrails) is in progress. No terminal features exist yet; [docs/FEATURE_CHECKLIST.md](docs/FEATURE_CHECKLIST.md) tracks every spec item.

## Documents

- [docs/DATA_ARCHITECTURE.md](docs/DATA_ARCHITECTURE.md): how it is built
- [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md): decisions, phases, testing, working agreement
- [docs/FEATURE_CHECKLIST.md](docs/FEATURE_CHECKLIST.md): status of every spec item
- [docs/decisions/0001-approved-plan.md](docs/decisions/0001-approved-plan.md): approved decisions and conditions
- [docs/METHODOLOGY.md](docs/METHODOLOGY.md) and [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md): skeletons until Phase 3

## Development

Needs Node 22 and pnpm 10.

```text
pnpm install
pnpm check    # guard tests, guards, lint, typecheck, unit tests
```

CI runs the same checks on every pull request and posts a report as a comment.
