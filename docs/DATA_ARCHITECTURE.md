# FlowX Terminal — Data and System Architecture

**Status:** Approved v1 · 2026-11-08
**Companions:** [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) (phases, testing, working agreement) · [FEATURE_CHECKLIST.md](FEATURE_CHECKLIST.md) (status of every spec item) · [decisions/0001-approved-plan.md](decisions/0001-approved-plan.md) (approved decisions and conditions) · [METHODOLOGY.md](METHODOLOGY.md) (formulas) · [DATA_SOURCES.md](DATA_SOURCES.md) (verified source facts). Requirements: [ATAS_FEATURE_SPEC.md](ATAS_FEATURE_SPEC.md).

FlowX Terminal is a standalone, original, analysis-focused order-flow and market-analysis terminal that runs in the browser on desktop and Android (installable PWA). It uses free public data only and does not import from or depend on any other project.

## 1. Principles

1. **Independent.** Built only from the spec. No imports from, links to or data from any other project (enforced by a CI check).
2. **Real data only.** No random, simulated, interpolated or placeholder market data in runtime code (lint rule plus bundle check). Tests may use recorded real captures and hand-computed known-answer vectors, which never ship in the app.
3. **Data honesty.** Every instrument and stream has an explicit status: Live, Delayed (with measured delay), Stale, Gap, Degraded, Recorded or Unavailable. No code path synthesizes missing data: no pseudo-ticks from candles, no delta estimated from candle direction, no substitute instrument presented as the requested one.
4. **Provenance.** Every value carries venue, stream, exchange time, receive time, and confirmed or estimated. Missing data is shown as missing.
5. **One order book per venue and instrument.** Cross-exchange views compare venues side by side; combined views exist only for trade-derived numbers and are labeled combined.
6. **Domain separation.** Futures order flow (Binance, Bybit and OKX perpetuals), options data (Deribit, BTC options only) and price-only data (gold) are separate event domains with separate adapters, event types, recorder streams and engines. Their data is never mixed. The only cross-domain use is a derived overlay (for example gamma levels drawn on a chart), labeled with its source.
7. **Live and recorded parity.** The same engines run on live and recorded data. Engines receive events through one interface and time through an injected Clock. There are no live-only calculation paths. A parity test is a CI gate.
8. **Visible recording.** Client-only recording always shows whether it is active or stopped, and the indicator is derived from the recorder’s real state.
9. **No dead controls.** Every setting is declared in a typed schema, consumed by an engine or view, and covered by a test proving it changes the output.
10. **Nothing is complete because its UI exists.** Status ladder: Not Started, In Progress, Implemented, Tested, Verified (see IMPLEMENTATION_PLAN.md).
11. **Originality.** No ATAS code, branding or private algorithms. Where the spec uses ATAS-style names (CVD Pro, Market Power, Smart DOM), we build original definitions from public order-flow concepts, document the formulas in METHODOLOGY.md and use our own UI names.

**Spec wording about an “existing” project.** Spec rules 1–5 and the lines about an existing data-provider architecture and an existing GEX module assume prior code. This repository started with only the spec and the project is declared independent, so nothing was inherited. The same protection applies to modules as they are completed: a Verified module is frozen.

## 2. Platform and technology

- **Tooling:** TypeScript (strict), pnpm monorepo, Vite, ESLint, Vitest, Playwright, fast-check, GitHub Actions CI.
- **UI:** React for panels, forms and settings only. Market visuals are drawn on Canvas 2D, with WebGL for the heatmap and very dense footprints, behind a Renderer interface.
- **Concurrency:** one data-engine worker (sockets and normalization) and a pool of calculation workers, exchanging typed arrays by transfer. SharedArrayBuffer is an optional optimization that needs cross-origin isolation.
- **Storage:** OPFS columnar chunk files for ticks and book deltas; IndexedDB for settings, layouts, alerts, journal and metadata; versioned schemas with migrations; quota monitor and persistent-storage request.
- **Delivery:** static installable PWA. v1 has no backend, no accounts, no API keys and no telemetry; all data stays on the device.
- **Android realities:** background tabs lose WebSockets, so the app offers an optional Wake Lock while a workspace is visible, reconnects with backfill, and records any unrecoverable interval as a gap. Android defaults use less history and fewer visible modules.
- **Only if profiling demands it:** WASM for hot loops; Capacitor or Tauri wrappers.

## 3. System architecture

```text
Free public sources (REST + WebSocket)
   │
   ├─ Futures providers: Binance Futures · Bybit · OKX    (trades, order books, OI, funding, liquidations)
   ├─ Options provider:  Deribit, BTC options only        (chains, IV, greeks, OI, option trades)
   └─ Gold provider:     free GC source, if confirmed     (delayed price/OHLCV only)
        │  raw messages → normalized events (separate domains and event types)
Data engine (worker): time sync · dedupe · book sync · gap detection · backfill · quality monitor
        │  typed event bus (domain / venue / instrument / stream)
        ├── Recorder (explicit state: recording / stopped / gap) → Storage (OPFS + IndexedDB)
        ├── Replay source (same event interface and Clock abstraction as live)
        └── Calculation engines (workers, incremental, no wall-clock access)
               │  provenance-tagged typed arrays
Modules (chart, DOM, tape, profile, heatmap, GEX, ...) → Canvas renderers
        │
Workspace shell (layout, linking, settings, alerts, data-status and recording indicators)
```

- **Event-sourced:** engines see only normalized events and cannot tell live from replayed data, so replay, paper trading and tests exercise the same code.
- **Pure and incremental:** engines are deterministic, update incrementally and run in workers; the main thread only draws.
- **One-way flow:** modules never talk to exchanges; they read engine outputs.
- **Capability-gated UI:** a feature is enabled only when the selected provider declares the data it needs; otherwise it states exactly what is missing.

## 4. Data engine

- **Provider contracts.** Three small interfaces, each with capability flags and health reporting: FuturesProvider (instruments, trades, order books, klines, mark and funding, open interest, liquidations, long/short, historical trades), OptionsProvider (BTC option chains, implied volatility, greeks, open interest, option trades) and PriceProvider (price/OHLCV only, with measured delay). Planned: Binance Futures, Bybit and OKX (futures); Deribit (options, BTC only, a separate adapter); a free gold-price source if one is confirmed (price). Providers are replaceable behind their interface.
- **Data status model.** Every capability of every instrument reports one of: Live, Delayed (measured delay), Stale (age), Gap (interval), Degraded (fallback in use), Recorded, Unavailable (with the missing data source). Status is computed by the data engine, not by views, and shown exactly as computed. For COMEX Gold, tick, depth and order-flow capabilities are Unavailable unless a free source with real tick and depth data is confirmed; price/OHLCV is Delayed with its measured delay, or Unavailable. If a provider gives no timestamps the label is Delayed (delay unknown), never an invented number. Gold-linked instruments on other venues may exist only as separately named instruments, never as GC.
- **Normalized events.** Futures domain: trade, book snapshot, book delta, mark and funding, open interest, liquidation. Options domain: option quote, option trade, chain snapshot. Price domain: price, bar. Each carries venue, instrument, exchange time, receive time, ids or sequence, and provenance. Prices are integer ticks and quantities integer steps, so volume, delta and CVD sums are exact; conversion to display units happens only at the edge.
- **Instruments and units.** Tick size, quantity step, contract size and quantity unit are loaded from each exchange’s metadata at runtime, never hard-coded. Venues that quote in contracts are converted to base-asset volume, keeping the native unit. GC uses a static spec table (100 troy oz per contract, 0.10 tick = $10) with its source cited.
- **Time.** Per-venue clock offset comes from server-time endpoints (median of samples, round-trip adjusted) and is re-estimated periodically. Bars use exchange time, so they are identical across reloads and replays; receive time drives latency and stale detection. Components read time only from an injected Clock.
- **Trades.** Aggressor side: Binance from the buyer-is-maker flag, Bybit and OKX from the reported taker side. Dedupe by venue, instrument and trade id within a bounded window. Exchange-aggregated trades are labeled as such, never shown as raw fills.
- **Order-book sync (per-venue protocol).** Binance: buffered diff stream plus REST snapshot, with continuity checked through the update-id chain. Bybit: snapshot then deltas with update id and sequence; a snapshot reset overwrites the book. OKX: snapshot plus incrementals with sequence ids and checksum verification. Any gap or mismatch triggers resubscribe and a fresh snapshot, and is logged. Books are kept per venue; no merged book exists in the model.
- **Resilience.** Exponential backoff with jitter, heartbeat watchdogs, automatic resubscribe, REST backfill of trades missed during a disconnect, REST polling fallback for open interest, funding and ratios, and a labeled degraded mode if sockets are unavailable. Unrecoverable intervals become gap markers on charts and are excluded from confirmed statistics.
- **Quality monitor.** Per stream: message rate, last-message age, sequence gaps, reconnects, clock skew and fallback state, shown in a status bar and per-module banners. Stale data freezes live-derived values, shows its age and blocks alerts.
- **Recorder.** An explicit state machine per instrument, venue and stream: Recording, Partial, Paused (gap in progress), Stopped, Unavailable (storage problem). It records lossless normalized events plus status and gap markers, never derived values. A persistent status-bar indicator (text and icon, not color alone, also on Android) shows the global state; tapping it lists every stream with its state, start time, last write, stored size and covered window. When stopped it says: Not recording — data from now on will not be available for replay. The indicator reads the recorder’s state directly, never a separate flag, and a test enforces that.
- **Storage and retention.** Trades as columnar chunks; order books as periodic snapshots plus deltas, so the book can be rebuilt at any recorded time; a coverage map records what exists. Editable defaults: trades 30 days on desktop and 7 on Android, book deltas 7 days and 24 hours. Derived bars and profiles are rebuildable caches. Export and import supported.
- **Verification.** The exchange details above are the current understanding. Phase 3 starts with a data-source spike that checks them against official docs and live responses and writes DATA_SOURCES.md (endpoints, limits, browser access, geo-restrictions, history depth, field mappings, quirks).

## 5. Data availability by market (confirmed in the spike)

- **BTC, ETH, SOL perpetuals on Binance, Bybit, OKX:** trades with aggressor side, L2 depth over WebSocket with snapshots, klines, mark price, funding, open interest with history, liquidation feeds and long/short ratios are expected to be free and public. Some liquidation feeds are throttled, so they are labeled partial.
- **Historical ticks:** REST pagination is rate-limited, so deep history backfills slowly in the background with a progress display; bulk exchange archives may not be fetchable from a browser, so file import is supported. **Historical order-book data is not available free:** DOM and heatmap history exist only where this app (or a Collector) recorded it.
- **COMEX Gold (GC):** real-time tick and depth data for CME gold is licensed, so no free source is expected (to be confirmed). Order-flow, footprint, DOM, tape and heatmap on GC show Unavailable with the reason. Price/OHLCV appears only if a free source is confirmed, labeled Delayed with its measured delay. Nothing is estimated or interpolated.
- **Options and GEX:** BTC options only (per spec), from Deribit’s free public data (to be confirmed), as a separate adapter and event domain. GC options are Unavailable. ETH and SOL options are outside v1. Historical GEX exists only from recorded snapshots.
- **Rule:** when a capability flag is false the UI shows Unavailable followed by the missing data source, and the architecture stays ready for a future source.

## 6. Calculation engines

All engines are pure, incremental, deterministic, run in workers, and are tested with known-answer vectors.

- **Bar engine:** time, tick, volume, delta, range, Renko and reversal bars; custom timeframes; session templates; historical tick charts; atomic rebuild from stored ticks when a calculation setting changes.
- **Cluster engine (footprint):** per-bar, per-price bid/ask volume, delta and trades; horizontal, diagonal and stacked imbalance (ratio and minimum volume configurable); bar POC; cluster search and statistics; absorption, exhaustion, initiative/passive and market-power measures defined by explicit, parameterized rules.
- **Profile engine:** volume profile and TPO/market profile; fixed-range, session, composite, developing, visible-range and anchored variants; POC, VAH, VAL (value-area percentage configurable), naked POC, HVN/LVN, dynamic POC, comparison, custom session templates.
- **Flow engine:** delta; cumulative delta (session, rolling or no reset); per-venue and size-bucket CVD; delta change and divergence; trade speed, frequency and bursts; tape patterns; static and adaptive big-trade thresholds; volume anomalies against a time-of-day baseline; trade aggregation.
- **Book engine:** per-venue books, cumulative depth, depth changes, best bid/ask, spread, imbalance, pressure, concentration, pulling vs stacking (removals count as execution when matching trades occurred, otherwise as cancellation), sweeps, gaps, absorption. Iceberg estimates appear only as observed refill patterns with their evidence events, never as asserted hidden orders.
- **Liquidity engine:** heatmap grids (time by price) built from recorded book data, added/removed liquidity layers, migration tracking, large-order detection.
- **Market-stats engine:** open interest and changes, funding, liquidations, long/short ratios, VWAP and anchored VWAP, session statistics, realized volatility and ATR, swing-based market structure, market strength, cross-venue comparison (premium, delta divergence, OI and funding by venue).
- **GEX engine:** per-strike and per-expiry gamma exposure, net and absolute GEX, gamma flip, call and put walls, vanna, charm, options flow, gamma heatmap; Black-Scholes from provider implied volatility and open interest, cross-checked against provider greeks where given. It consumes only options-domain events, including the provider’s own index price.
- **Domain boundary:** the flow, book, cluster, profile and liquidity engines accept only futures-domain events; this is enforced by types, so options or price events cannot reach them.
- **Indicator runtime:** plug-in contract with typed parameter schema, inputs (bars, ticks, book, OI), outputs (lines, histograms, markers, cells, regions), incremental updates, overlay or subwindow placement, templates and combinations. v1 custom indicators use a safe expression language plus a combination builder; sandboxed scripting is a later option.
- **Alert engine:** conditions evaluated on engine outputs; hooks from Phase 3, manager and UI in Phase 6.

**Confirmed vs estimated.** Confirmed: volume, bid/ask volume, delta (from aggressor-flagged trades), reported open interest, funding and liquidations as reported. Estimated, and labeled so in the UI and exports: absorption, exhaustion, initiative/passive, market power, iceberg and hidden-liquidity inferences, pulling-vs-cancel attribution, GEX and gamma flip (they assume dealer positioning, which is not observable), market strength. Each estimator’s formula, parameters, defaults and limits go in METHODOLOGY.md.

**Live and recorded parity.** Engines are pure functions of the event sequence and their settings. They read time only from the injected Clock (wall-clock access is lint-banned inside engine packages), have no live-only branches and keep serializable state. The recorder stores lossless normalized events, so replay re-emits identical input. The parity test feeds one recording through the pipeline in live mode (batched, jittered delivery) and in replay mode (virtual clock) and requires identical engine output hashes.

## 7. UI and workspace

- **Module framework:** each module registers an id, typed settings schema, required capabilities, minimum size and link-group support. Modules: chart, DOM, tape, profile, liquidity heatmap, market analysis, GEX, watchlist, alerts, replay, trading, journal, diagnostics.
- **Status bar:** always visible, also in the Android layout: global data status and the recording indicator. Per-module banners show Unavailable, Delayed, Stale or Gap states exactly as computed by the data engine.
- **Settings:** forms generated from the typed schema with validation, groups, presets, reset to defaults (per setting, group and module), import/export and migrations. Settings that affect calculations trigger a worker recalculation with progress and an atomic swap.
- **Linking:** color link groups sync instrument, timeframe (optional), crosshair time and visible range across charts and modules.
- **Layouts:** desktop supports docking, floating, resizable panels, pop-out windows and saved workspaces. Android uses a stack/tabs layout with an optional two-pane split. Any module expands to full screen.
- **Rendering:** canvas layers; virtualized DOM ladder and tape (only visible rows drawn); footprint level-of-detail by zoom; heatmap as a GPU texture; redraw of dirty regions only.
- **Look:** dark, compact, high-density; monospace tabular numbers; customizable colors, fonts, transparency and color-blind-safe palettes; Android gestures (pan, pinch zoom, long-press crosshair, two-finger measure); desktop shortcuts and context menus.

## 8. Paper trading, replay and journal

- **Execution interface:** submit, modify, cancel, positions and fills behind one contract. v1 ships the Paper venue only; there is no live routing.
- **Paper fills:** market orders walk the real order-book snapshot at submission (real slippage). Where no book exists (for example replay without recorded book data) a trade-based model with configured slippage is used and the fill is labeled modeled. Limit orders use a queue-position model (conservative, neutral or optimistic). Stops trigger on last or mark price. Maker/taker fees and funding are editable and applied.
- **Orders and positions:** market, limit, stop, stop-limit, trailing stop, bracket, OCO, modify and cancel; average entry; real-time P&L using correct tick value and contract size; risk-based sizing from stop distance; quantity controls; hotkeys; one-click with confirmation settings; order history. Margin and liquidation simulation are outside v1.
- **Replay:** a virtual clock drives recorded trades (and recorded book deltas where they exist) through the same engines. Speed control, pause, resume, step by trade, bar or time, multi-instrument replay by timestamp merge. DOM replay is offered only for intervals in the coverage map; otherwise the module says no book was recorded. The same recording and settings must produce identical output (tested by hash).
- **Strategy testing:** strategies implement a small event API, run in a worker on replay or live-paper data, and place orders through the execution interface; results go to the journal.
- **Journal:** trades (paper, replay, manual), net P&L, win rate, profit factor, drawdown, average win/loss, risk/reward, commissions, session statistics, tags, notes, equity curve, analytics, CSV/JSON export.

## 9. Repository structure and spec map

```text
flowx-terminal/
├── apps/
│   ├── terminal/       PWA shell, layout, module registry
│   └── collector/      optional 24/7 recorder (later)
├── packages/
│   ├── core/           event types by domain, units, time, status models, provenance
│   ├── providers/      binance-futures, bybit, okx, deribit-options, gold-price
│   ├── data-engine/    streams, sync, dedupe, backfill, quality monitor, recorder
│   ├── storage/        OPFS chunks, IndexedDB repos, retention
│   ├── engines/        bars, clusters, profiles, flow, book, liquidity, stats, gex
│   ├── indicators/     framework + built-ins
│   ├── charting/       scales, layers, drawings, renderers
│   ├── alerts/ replay/ execution/ journal/
│   ├── ui-kit/         dark theme, dense components, settings forms
│   └── testing/        fixture loader, replay harness
├── tests/              end-to-end tests, fixtures from real captures
├── tools/              guard checks, capture scripts, benchmarks
└── docs/               spec, architecture, plan, checklist, methodology, data sources, decisions/
```

Spec map: A charting + bar engine + indicator runtime · B profile engine · C cluster and flow engines · D book engine + DOM module · E flow engine + tape module · F liquidity engine + heatmap · G indicator runtime · H market-stats engine · I GEX engine + Deribit options adapter · J execution (paper) + traders · K replay + paper simulator · L alert engine · M watchlist · N workspace shell · O journal · P settings framework (shared by all).
