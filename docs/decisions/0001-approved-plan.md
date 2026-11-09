# ADR-0001: Approved architecture decisions and conditions

**Date:** 2026-11-08 · **Status:** Accepted · **Decided by:** project owner

## Context

FlowX Terminal is built only from docs/ATAS_FEATURE_SPEC.md as a completely independent project. A draft architecture and implementation plan was proposed with seven decisions. The owner approved all seven and attached five conditions.

## Decisions

- **D1** TypeScript web app (PWA) for desktop and Android Chrome.
- **D2** Client-only recording in v1; optional 24/7 Collector later.
- **D3** USDT-margined perpetuals for BTC, ETH and SOL on Binance, Bybit and OKX.
- **D4** COMEX Gold: no free tick or depth data expected; delayed price/OHLCV only if a free source is confirmed; order-flow modules show Unavailable.
- **D5** Deribit added as an extra free provider for BTC options and GEX.
- **D6** Paper/demo trading only; no live order routing.
- **D7** Analysis-first vertical slices.

## Conditions

- **AP1** Deribit stays a separate BTC options/GEX adapter. Its data is never mixed with perpetual futures order flow.
- **AP2** Client-only recording clearly shows when recording is active or stopped.
- **AP3** Missing Gold tick, depth and order-flow data is never fabricated; status shows Unavailable or Delayed accurately.
- **AP4** Calculations and replay engines are consistent between live and recorded data.
- **AP5** FlowX stays completely independent from the owner’s other projects.

## Consequences

- Event domains (futures, options, price) are separate in types, adapters, recorder streams and engines.
- The recorder is an explicit state machine and its indicator is derived from that state.
- A data-status model (Live, Delayed, Stale, Gap, Degraded, Recorded, Unavailable) is computed by the data engine and shown as computed.
- Engines read time only from an injected Clock and have no live-only branches; a parity test gates CI.
- A CI guard keeps dependencies, imports and tsconfig paths inside this repository.
- Each condition has a row in FEATURE_CHECKLIST.md (AP.01–AP.05) and tests listed in IMPLEMENTATION_PLAN.md.
