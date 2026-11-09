# FlowX Terminal — Implementation Plan

**Status:** Approved v1 · 2026-11-08
**Companions:** [DATA_ARCHITECTURE.md](DATA_ARCHITECTURE.md) · [FEATURE_CHECKLIST.md](FEATURE_CHECKLIST.md) · [decisions/0001-approved-plan.md](decisions/0001-approved-plan.md) · [ATAS_FEATURE_SPEC.md](ATAS_FEATURE_SPEC.md)

## 1. Approved decisions

**Confirmed constraints**

- Completely independent project, built only from the spec, with no dependency on any other project.
- Markets: BTC, ETH and SOL futures, plus COMEX Gold (GC).
- Free data sources only.
- Analysis-focused terminal: analysis modules come first and trading features are paper-only.

**Decisions D1–D7 (approved as proposed)**

- **D1 Platform:** TypeScript web app (PWA) for desktop and Android Chrome. Native wrappers are optional later, not v1.
- **D2 Recording:** client-only in v1. The app records trades and order-book deltas while it is open and marks gaps when it is not. An optional Collector (a 24/7 recorder run on the owner’s own PC or VPS) is designed in but built later. Without it, historical DOM exists only for periods the app was open.
- **D3 Instruments:** USDT-margined perpetuals for BTC, ETH and SOL on Binance, Bybit and OKX. Coin-margined (inverse) contracts are out of scope.
- **D4 COMEX Gold (GC):** no free tick or depth data is expected (to be confirmed). Price/OHLCV only if a free source is confirmed, labeled Delayed; order-flow, DOM and tape show Unavailable. An optional, clearly labeled gold-linked crypto perpetual may exist as a separately named proxy, never presented as GC.
- **D5 Options data for GEX:** Deribit as an extra free provider (not in the spec’s provider list).
- **D6 Trading scope:** paper/demo only. No live order routing is planned.
- **D7 Build order:** vertical slices, analysis first, each fully working before the next starts.

**Conditions attached to the approval**

- **AP1** Deribit stays a separate BTC options/GEX adapter. Its data is never mixed with perpetual futures order flow.
- **AP2** Client-only recording clearly shows when recording is active or stopped.
- **AP3** Missing Gold tick, depth and order-flow data is never fabricated. Status is shown accurately as Unavailable or Delayed.
- **AP4** Calculations and replay engines are consistent between live and recorded data.
- **AP5** FlowX stays completely independent from the owner’s other projects.

## 2. Working agreement

- Phases run in order and none is skipped. A phase starts only after the previous phase’s exit criteria are met or the owner explicitly waives them.
- Completed work is never recreated or replaced. Changes to finished modules go through a pull request with the module’s regression suite.
- Pre-existing files are not modified or deleted without the owner’s approval. New work lands on a branch and a pull request; the owner decides when to merge.
- A feature is never marked above In Progress without evidence, and never Verified without real-data validation and the owner’s acceptance.
- The checklist is updated after every phase and sub-step.
- CI and its saved reports are the evidence for Tested. A Validation Console report, run on the owner’s device, is the evidence for Verified.
- Anything that cannot be tested in the build environment is said plainly, never assumed.

## 3. Phase tracker

| Phase | Name | Status |
|---|---|---|
| 1 | Inventory and plan | Complete (2026-11-08) |
| 2 | Foundation and guardrails | Not Started |
| 3 | Data engine and calculation engines | Not Started |
| 4 | Analysis modules (vertical slices) | Not Started |
| 5 | Integration | Not Started |
| 6 | Alerts, replay, paper trading, journal | Not Started |
| 7 | Test campaign | Not Started |
| 8 | Fix and verify | Not Started |

Sizes are relative (S, M, L, XL), not dates.

## 4. Phased plan

**Phase 1 — Inventory and plan (S).** Architecture, this plan, a checklist of 277 items (272 from the spec plus 5 approval conditions), methodology and data-source skeletons, ADR-0001. *Exit:* the owner approves the plan and decisions. *Status: complete.*

**Phase 2 — Foundation and guardrails (M).**

- 2.1 Workspace, tooling and CI; guard checks (independence, runtime purity and determinism, checklist sync); README.
- 2.2 Core types package: events by domain, provenance, data-status model (Unavailable and Delayed), recorder-state model, Clock and VirtualClock, tick and step units.
- 2.3 Settings framework: typed schema, validation, presets, reset, import/export, migrations, settings-coverage check.
- 2.4 Design tokens, PWA shell, module registry, responsive layout skeleton, status bar with data-status and recording indicators.
- 2.5 Storage skeleton (interfaces, in-memory and browser adapters), test harness, capture tool skeleton.
- 2.6 Module-freeze protocol, deploy preview, Phase 2 exit review.

*Exit:* CI green; the empty shell runs on desktop and Android Chrome (confirmed on the owner’s device).

**Phase 3 — Data engine and calculation engines (L).** In order: data-source spike → instrument registry, units and time sync → Binance adapter end to end (trades, depth, klines, mark/funding, OI, liquidations) → Bybit → OKX → Deribit BTC options adapter (separate domain) → recorder, storage and backfill → quality monitor → bar, cluster, profile, flow and book engines → indicator runtime → gold price source with capability labels. *Exit:* integration tests pass on recorded real captures; the live/recorded parity test passes; Validation Console passes on live feeds; 24-hour soak with induced disconnects.

**Phase 4 — Analysis modules as vertical slices (XL).** Each slice includes UI, settings, alert hooks and tests: (1) chart core, bar types, scaling, crosshair, measure, sessions; (2) footprint and order-flow indicators; (3) DOM and smart tape; (4) volume and market profiles; (5) liquidity heatmap and analysis; (6) indicator library, drawing tools, templates; (7) market analysis; (8) GEX; (9) watchlist and market monitor. *Exit per slice:* its items reach Tested, then Verified.

**Phase 5 — Integration (M).** Workspaces, docking, floating and stack layouts, link groups, templates, save, restore, import and export, hotkeys, context menus, cross-module interactions, unified data-status UI. *Exit:* end-to-end scenarios pass on desktop and phone viewports.

**Phase 6 — Alerts, replay, paper trading, journal (L).** Alert manager (sound, in-app, thresholds); replay engine; paper venue and trading interface; strategy testing; journal and statistics. *Exit:* deterministic replay hashes, paper-fill scenarios, hand-computed journal metrics.

**Phase 7 — Test campaign (M).** Close coverage gaps, fault injection, soak tests, performance budgets on a real mid-range Android phone and desktop, memory-leak checks, accessibility basics, security review.

**Phase 8 — Fix and verify (M).** Triage, fix, rerun, move items to Verified with evidence, final acceptance walk-through per module, v1.0.

**After v1 (not planned yet):** Collector service, sandboxed custom scripting, native wrappers.

## 5. Testing and verification

**Status ladder.**

- Implemented: code, UI and settings exist and build.
- Tested: automated tests pass, including known-answer vectors, replay determinism and the settings-coverage check. Evidence required.
- Verified: validated on real data with a saved report, plus the owner’s acceptance of the interactions. Evidence required.

**Test layers.** Unit and property tests (aggregation and dedupe invariants) on pure engines; integration tests on recorded real exchange captures; fault injection (drops, duplicates, out-of-order, sequence gaps, reconnect storms); end-to-end browser tests including a phone-sized viewport; benchmarks with budgets; 24–72 hour soak runs.

**Tests for the approval conditions.**

- AP1: compile-time tests that options-domain events cannot enter futures engines; separate recorder streams; an import-boundary rule keeping the Deribit adapter out of order-flow code.
- AP2: recorder-state tests (start, stop, disconnect gap, storage failure) and a test that the indicator text is derived from recorder state; UI tests that the indicator is present in desktop and phone layouts.
- AP3: contract tests that the gold provider declares its capabilities; engines refuse instruments lacking aggressor-flagged ticks; a check that no code path builds ticks from bars; tests of the Delayed and Unavailable labels.
- AP4: the live/recorded parity test as a CI gate, plus lint rules banning wall-clock access and live/replay branches in engine packages.
- AP5: the independence guard in CI (package specifiers, imports and tsconfig paths must stay inside this repository).

**Real-data validation examples.** Delta per bar equals 2 × taker-buy volume − volume from Binance klines; bar volume matches kline volume on every venue; OKX book checksums; sequence continuity; profile totals equal bar totals; open interest and funding match venue values; computed greeks match provider greeks within tolerance.

**Validation Console.** An in-app diagnostics module runs these checks against live feeds from the owner’s own network and exports a report. Live validation needs real exchange access, and some exchanges restrict the IP ranges used by cloud CI and build sandboxes, so live checks run on the owner’s device while CI uses recorded captures.

**No dead controls.** CI fails if a setting is unused or has no effect test, or if runtime packages contain random or synthetic data generators.

**Proposed performance budgets (tunable).** 60 fps on desktop and 30 fps on mid-range Android with two visible modules; sustained 3,000 trades/s and 200 book updates/s without queue growth; app-added latency under 50 ms p95; memory under 800 MB on desktop and 350 MB on Android for the default workspace.

**Protecting finished work.** A module marked Verified is frozen: later changes need a pull request, its regression suite and a checklist note. Working features are never removed without the owner’s approval.

## 6. Risks and mitigations

- **GC data:** no free tick or depth source expected → capability labels, free delayed source if confirmed, clear Unavailable states, nothing fabricated.
- **Historical DOM:** cannot be backfilled → recorder from day one in Phase 3, coverage map, visible recording indicator, optional Collector.
- **Browser limits:** background tabs, storage quota, memory → Wake Lock, gap markers, quota monitor, conservative Android defaults.
- **Exchange changes, limits, geo-restrictions:** adapters isolated behind one contract, contract tests on captures, spike confirms current behavior.
- **Phone performance:** level-of-detail rendering, workers, decimation; benchmarks from Phase 3, budgets enforced in Phase 7.
- **Scope size:** 277 items → vertical slices, status ladder, nothing marked ahead of its evidence.
- **Verification access:** live validation needs exchange access from the owner’s device → Validation Console. The build environment has no network access, so CI is the only place automated tests run.

## 7. Progress log

- 2026-11-08 — Plan approved with decisions D1–D7 and conditions AP1–AP5. Phase 1 deliverables committed: checklist and skeletons first, then architecture, implementation plan and ADR-0001.
