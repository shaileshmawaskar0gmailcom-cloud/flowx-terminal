# FlowX Terminal — Feature Checklist

**Source:** [ATAS_FEATURE_SPEC.md](ATAS_FEATURE_SPEC.md). Items mirror the spec text. A CI check (added in Phase 2) enforces that every spec item is listed exactly once and that statuses follow the rules below.
**Total:** 277 items — 272 from the spec (238 module features in A–P plus 34 platform requirements) and 5 approval conditions (AP).
**Related:** [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) · [DATA_ARCHITECTURE.md](DATA_ARCHITECTURE.md)

**Statuses:** Not Started · In Progress · Implemented · Tested · Verified

- Implemented: code, UI and settings exist and build.
- Tested: automated tests pass (known-answer vectors, parity, settings coverage). Evidence required.
- Verified: validated on real data with a saved report and accepted by the owner. Evidence required.
- A status above In Progress without evidence is invalid. A UI alone is never Implemented.
- Updated after every implementation phase and sub-step. Evidence is a link or reference (CI run, report, commit).

## A. Charting

Packages: charting, engines (bars), indicators

| ID | Item | Status | Evidence |
|---|---|---|---|
| A.01 | Multiple synchronized charts | Not Started | — |
| A.02 | Candlestick, Cluster, Footprint, Line, Bar | Not Started | — |
| A.03 | Tick, Volume, Delta, Range, Renko, Reversal | Not Started | — |
| A.04 | Custom timeframes | Not Started | — |
| A.05 | Historical tick charts | Not Started | — |
| A.06 | Session-based charts | Not Started | — |
| A.07 | Multiple chart panels | Not Started | — |
| A.08 | Independent chart settings | Not Started | — |
| A.09 | Price and time scaling | Not Started | — |
| A.10 | Zoom, pan, crosshair and measurement | Not Started | — |
| A.11 | Chart linking and instrument synchronization | Not Started | — |
| A.12 | Drawing tools and templates | Not Started | — |
| A.13 | Indicator overlays and subwindows | Not Started | — |
| A.14 | Automatic chart recalculation | Not Started | — |

## B. Volume and market profile

Packages: engines (profiles)

| ID | Item | Status | Evidence |
|---|---|---|---|
| B.01 | Volume Profile | Not Started | — |
| B.02 | Market Profile | Not Started | — |
| B.03 | TPO | Not Started | — |
| B.04 | Fixed Range Profile | Not Started | — |
| B.05 | Session Profile | Not Started | — |
| B.06 | Composite Profile | Not Started | — |
| B.07 | Developing Profile | Not Started | — |
| B.08 | Visible Range Profile | Not Started | — |
| B.09 | Anchored Profile | Not Started | — |
| B.10 | POC, VAH, VAL | Not Started | — |
| B.11 | Naked POC | Not Started | — |
| B.12 | Volume Nodes | Not Started | — |
| B.13 | High/Low Volume Areas | Not Started | — |
| B.14 | Dynamic POC | Not Started | — |
| B.15 | Profile comparison | Not Started | — |
| B.16 | Custom session templates | Not Started | — |

## C. Order flow

Packages: engines (clusters, flow)

| ID | Item | Status | Evidence |
|---|---|---|---|
| C.01 | Delta | Not Started | — |
| C.02 | Cumulative Delta | Not Started | — |
| C.03 | CVD Pro | Not Started | — |
| C.04 | Multi-CVD | Not Started | — |
| C.05 | Delta Divergence | Not Started | — |
| C.06 | Delta Change | Not Started | — |
| C.07 | Bid/Ask Volume | Not Started | — |
| C.08 | Volume Imbalance | Not Started | — |
| C.09 | Diagonal Imbalance | Not Started | — |
| C.10 | Stacked Imbalance | Not Started | — |
| C.11 | Absorption Detection | Not Started | — |
| C.12 | Exhaustion Detection | Not Started | — |
| C.13 | Initiative Activity | Not Started | — |
| C.14 | Passive Activity | Not Started | — |
| C.15 | Market Power | Not Started | — |
| C.16 | Cluster Search | Not Started | — |
| C.17 | Cluster Statistics | Not Started | — |
| C.18 | Order Flow Indicator | Not Started | — |
| C.19 | Trade Speed | Not Started | — |
| C.20 | Tape Patterns | Not Started | — |
| C.21 | Volume Anomalies | Not Started | — |
| C.22 | Large Trade Detection | Not Started | — |
| C.23 | Trade Aggregation | Not Started | — |
| C.24 | Hidden Liquidity Estimates | Not Started | — |

## D. Depth of market (DOM)

Packages: engines (book), terminal app (DOM module)

| ID | Item | Status | Evidence |
|---|---|---|---|
| D.01 | Full Depth of Market | Not Started | — |
| D.02 | Bid/Ask ladder | Not Started | — |
| D.03 | Real-time order-book updates | Not Started | — |
| D.04 | Market Depth columns | Not Started | — |
| D.05 | Cumulative Depth | Not Started | — |
| D.06 | Depth Changes | Not Started | — |
| D.07 | DOM Levels | Not Started | — |
| D.08 | Liquidity Map | Not Started | — |
| D.09 | Pulling and Stacking | Not Started | — |
| D.10 | Order-book imbalance | Not Started | — |
| D.11 | Liquidity concentration | Not Started | — |
| D.12 | Liquidity absorption estimates | Not Started | — |
| D.13 | Best Bid/Ask | Not Started | — |
| D.14 | Spread monitoring | Not Started | — |
| D.15 | Order-book pressure | Not Started | — |
| D.16 | Historical DOM changes | Not Started | — |
| D.17 | Rolling Footprint | Not Started | — |
| D.18 | Mini Footprint | Not Started | — |
| D.19 | Integrated Market Profile | Not Started | — |
| D.20 | Custom DOM columns | Not Started | — |
| D.21 | Adjustable price levels | Not Started | — |
| D.22 | Custom filters and color schemes | Not Started | — |

## E. Time and sales / tape

Packages: engines (flow), terminal app (tape module)

| ID | Item | Status | Evidence |
|---|---|---|---|
| E.01 | Real-time Time & Sales | Not Started | — |
| E.02 | Smart Tape | Not Started | — |
| E.03 | Trade aggregation | Not Started | — |
| E.04 | Large Prints | Not Started | — |
| E.05 | Big Trades | Not Started | — |
| E.06 | Adaptive Big Trades | Not Started | — |
| E.07 | Trade Speed | Not Started | — |
| E.08 | Trade Frequency | Not Started | — |
| E.09 | Buy/Sell aggression | Not Started | — |
| E.10 | Volume filters | Not Started | — |
| E.11 | Minimum and maximum trade size | Not Started | — |
| E.12 | Cumulative trade mode | Not Started | — |
| E.13 | Historical tape | Not Started | — |
| E.14 | Trade burst detection | Not Started | — |
| E.15 | Tape Patterns | Not Started | — |
| E.16 | Freeze, replay and filtering | Not Started | — |

## F. Liquidity heatmap and analysis

Packages: engines (liquidity), terminal app (heatmap module)

| ID | Item | Status | Evidence |
|---|---|---|---|
| F.01 | Historical liquidity heatmap | Not Started | — |
| F.02 | Resting liquidity | Not Started | — |
| F.03 | Added/removed liquidity | Not Started | — |
| F.04 | Liquidity migration | Not Started | — |
| F.05 | Pulling and Stacking | Not Started | — |
| F.06 | Large order detection | Not Started | — |
| F.07 | Liquidity absorption | Not Started | — |
| F.08 | Liquidity sweeps | Not Started | — |
| F.09 | Liquidity gaps | Not Started | — |
| F.10 | Iceberg estimates where observable | Not Started | — |
| F.11 | Order-book imbalance | Not Started | — |
| F.12 | Liquidity concentration | Not Started | — |
| F.13 | Historical liquidity tracking | Not Started | — |

## G. Indicators

Packages: indicators

| ID | Item | Status | Evidence |
|---|---|---|---|
| G.01 | Order Flow indicators | Not Started | — |
| G.02 | Volume indicators | Not Started | — |
| G.03 | Delta indicators | Not Started | — |
| G.04 | DOM indicators | Not Started | — |
| G.05 | Liquidity indicators | Not Started | — |
| G.06 | Profile indicators | Not Started | — |
| G.07 | Volatility indicators | Not Started | — |
| G.08 | Statistical indicators | Not Started | — |
| G.09 | Custom user indicators | Not Started | — |
| G.10 | Multiple indicators per chart | Not Started | — |
| G.11 | Individual parameter settings | Not Started | — |
| G.12 | Custom calculation periods | Not Started | — |
| G.13 | Alert integration | Not Started | — |
| G.14 | Indicator templates | Not Started | — |
| G.15 | Indicator combinations | Not Started | — |

## H. Market analysis

Packages: engines (stats)

| ID | Item | Status | Evidence |
|---|---|---|---|
| H.01 | Open Interest | Not Started | — |
| H.02 | OI Changes | Not Started | — |
| H.03 | Funding Rates | Not Started | — |
| H.04 | Liquidations | Not Started | — |
| H.05 | Long/Short Statistics where available | Not Started | — |
| H.06 | Volume Delta | Not Started | — |
| H.07 | Market Structure | Not Started | — |
| H.08 | VWAP and Anchored VWAP | Not Started | — |
| H.09 | Session Statistics | Not Started | — |
| H.10 | Volatility Measurements | Not Started | — |
| H.11 | Market Strength | Not Started | — |
| H.12 | Cross-Exchange Comparison | Not Started | — |

## I. GEX and options

Packages: engines (gex), providers (deribit-options)

| ID | Item | Status | Evidence |
|---|---|---|---|
| I.01 | Net GEX | Not Started | — |
| I.02 | Absolute GEX | Not Started | — |
| I.03 | Gamma Flip | Not Started | — |
| I.04 | Call Wall | Not Started | — |
| I.05 | Put Wall | Not Started | — |
| I.06 | GEX by Strike | Not Started | — |
| I.07 | GEX by Expiry | Not Started | — |
| I.08 | Vanna | Not Started | — |
| I.09 | Charm | Not Started | — |
| I.10 | Options Flow | Not Started | — |
| I.11 | Gamma Heatmap | Not Started | — |
| I.12 | Historical GEX | Not Started | — |
| I.13 | BTC Options and COMEX Gold Options | Not Started | — |

## J. Trading interface (paper only)

Packages: execution

| ID | Item | Status | Evidence |
|---|---|---|---|
| J.01 | Chart Trader | Not Started | — |
| J.02 | DOM Trader | Not Started | — |
| J.03 | Market Orders | Not Started | — |
| J.04 | Limit Orders | Not Started | — |
| J.05 | Stop Orders | Not Started | — |
| J.06 | Stop Limit Orders | Not Started | — |
| J.07 | Order modification and cancellation | Not Started | — |
| J.08 | Position management | Not Started | — |
| J.09 | Average Entry Price | Not Started | — |
| J.10 | Real-time P&L | Not Started | — |
| J.11 | Stop Loss and Take Profit | Not Started | — |
| J.12 | Trailing Stop | Not Started | — |
| J.13 | Bracket Orders | Not Started | — |
| J.14 | OCO | Not Started | — |
| J.15 | Risk-based position sizing | Not Started | — |
| J.16 | Quantity controls | Not Started | — |
| J.17 | Trading hotkeys | Not Started | — |
| J.18 | One-click execution with confirmation settings | Not Started | — |
| J.19 | Order history | Not Started | — |

## K. Demo and replay

Packages: replay, execution

| ID | Item | Status | Evidence |
|---|---|---|---|
| K.01 | Configurable demo balance | Not Started | — |
| K.02 | Realistic commissions and slippage | Not Started | — |
| K.03 | Paper trading | Not Started | — |
| K.04 | Chart-based order placement | Not Started | — |
| K.05 | Historical tick replay | Not Started | — |
| K.06 | Historical DOM replay | Not Started | — |
| K.07 | Historical Time & Sales replay | Not Started | — |
| K.08 | Replay speed controls | Not Started | — |
| K.09 | Pause, resume and step-by-step playback | Not Started | — |
| K.10 | Multi-instrument replay | Not Started | — |
| K.11 | Replay-based paper trading | Not Started | — |
| K.12 | Strategy testing | Not Started | — |

## L. Alerts

Packages: alerts

| ID | Item | Status | Evidence |
|---|---|---|---|
| L.01 | Price alerts | Not Started | — |
| L.02 | Volume alerts | Not Started | — |
| L.03 | Delta alerts | Not Started | — |
| L.04 | CVD alerts | Not Started | — |
| L.05 | DOM alerts | Not Started | — |
| L.06 | Liquidity alerts | Not Started | — |
| L.07 | Big Trade alerts | Not Started | — |
| L.08 | Imbalance alerts | Not Started | — |
| L.09 | OI alerts | Not Started | — |
| L.10 | GEX alerts | Not Started | — |
| L.11 | Custom indicator conditions | Not Started | — |
| L.12 | Sound and in-app notifications | Not Started | — |
| L.13 | Configurable alert thresholds | Not Started | — |

## M. Watchlist and market monitor

Packages: terminal app (watchlist module)

| ID | Item | Status | Evidence |
|---|---|---|---|
| M.01 | Multiple watchlists | Not Started | — |
| M.02 | BTC, ETH, SOL and GC | Not Started | — |
| M.03 | Live price and volume | Not Started | — |
| M.04 | Delta and OI | Not Started | — |
| M.05 | Market activity | Not Started | — |
| M.06 | Spread | Not Started | — |
| M.07 | Volatility | Not Started | — |
| M.08 | Exchange selection | Not Started | — |
| M.09 | Synchronized instrument switching | Not Started | — |

## N. Workspace and layout

Packages: terminal app (workspace shell)

| ID | Item | Status | Evidence |
|---|---|---|---|
| N.01 | Multiple workspaces | Not Started | — |
| N.02 | Multi-window layouts | Not Started | — |
| N.03 | Resizable panels | Not Started | — |
| N.04 | Floating modules | Not Started | — |
| N.05 | Dockable modules | Not Started | — |
| N.06 | Custom templates | Not Started | — |
| N.07 | Save and restore layouts | Not Started | — |
| N.08 | Linked charts | Not Started | — |
| N.09 | Keyboard shortcuts | Not Started | — |
| N.10 | Context menus | Not Started | — |
| N.11 | Individual module settings | Not Started | — |
| N.12 | Import/export settings | Not Started | — |

## O. Journal and statistics

Packages: journal

| ID | Item | Status | Evidence |
|---|---|---|---|
| O.01 | Trade history | Not Started | — |
| O.02 | Net P&L | Not Started | — |
| O.03 | Win rate | Not Started | — |
| O.04 | Profit factor | Not Started | — |
| O.05 | Drawdown | Not Started | — |
| O.06 | Average win/loss | Not Started | — |
| O.07 | Risk/reward | Not Started | — |
| O.08 | Commission tracking | Not Started | — |
| O.09 | Session statistics | Not Started | — |
| O.10 | Trade tags | Not Started | — |
| O.11 | Strategy notes | Not Started | — |
| O.12 | Performance analytics | Not Started | — |

## P. Settings

Packages: ui-kit (settings framework), shared by all modules

| ID | Item | Status | Evidence |
|---|---|---|---|
| P.01 | Calculation settings | Not Started | — |
| P.02 | Data-source settings | Not Started | — |
| P.03 | Display settings | Not Started | — |
| P.04 | Filters | Not Started | — |
| P.05 | Colors | Not Started | — |
| P.06 | Fonts | Not Started | — |
| P.07 | Transparency | Not Started | — |
| P.08 | Aggregation | Not Started | — |
| P.09 | Precision | Not Started | — |
| P.10 | Update frequency | Not Started | — |
| P.11 | Historical depth | Not Started | — |
| P.12 | Session settings | Not Started | — |
| P.13 | Alerts | Not Started | — |
| P.14 | Hotkeys | Not Started | — |
| P.15 | Templates | Not Started | — |
| P.16 | Reset and restore defaults | Not Started | — |

## Platform: data engine (DE)

Packages: data-engine, providers, storage

| ID | Item | Status | Evidence |
|---|---|---|---|
| DE.01 | Centralized real-time data engine | Not Started | — |
| DE.02 | Exchange-specific adapters | Not Started | — |
| DE.03 | WebSocket reconnection | Not Started | — |
| DE.04 | REST fallback | Not Started | — |
| DE.05 | Tick normalization | Not Started | — |
| DE.06 | Timestamp synchronization | Not Started | — |
| DE.07 | Trade deduplication | Not Started | — |
| DE.08 | Order-book snapshot synchronization | Not Started | — |
| DE.09 | Sequence-gap detection | Not Started | — |
| DE.10 | Historical storage | Not Started | — |
| DE.11 | Incremental calculations | Not Started | — |
| DE.12 | Efficient memory management | Not Started | — |
| DE.13 | Data-quality monitoring | Not Started | — |
| DE.14 | Stale-data detection | Not Started | — |
| DE.15 | Exchange-specific contract specifications | Not Started | — |

## Platform: accuracy (AC)

Packages: all engines and the data engine

| ID | Item | Status | Evidence |
|---|---|---|---|
| AC.01 | Use actual exchange trades and order-book data | Not Started | — |
| AC.02 | Preserve exchange-specific liquidity | Not Started | — |
| AC.03 | Never mix different exchanges as one order book | Not Started | — |
| AC.04 | Clearly distinguish estimated and confirmed values | Not Started | — |
| AC.05 | Never fabricate iceberg orders or hidden positions | Not Started | — |
| AC.06 | Correctly handle missing data | Not Started | — |
| AC.07 | Display data source and timestamps | Not Started | — |
| AC.08 | Ensure calculations use correct tick sizes, contract multipliers and volume units | Not Started | — |

## Platform: performance (PF)

Packages: all packages, charting

| ID | Item | Status | Evidence |
|---|---|---|---|
| PF.01 | Low-latency data processing | Not Started | — |
| PF.02 | Smooth charts | Not Started | — |
| PF.03 | Efficient rendering | Not Started | — |
| PF.04 | Virtualized DOM levels | Not Started | — |
| PF.05 | Incremental indicator calculations | Not Started | — |
| PF.06 | Web Workers where supported | Not Started | — |
| PF.07 | Efficient historical caching | Not Started | — |
| PF.08 | Responsive Android and desktop interface | Not Started | — |

## Platform: design (DS)

Packages: ui-kit, terminal app

| ID | Item | Status | Evidence |
|---|---|---|---|
| DS.01 | Professional institutional terminal: dark interface, compact controls, customizable panels, high-density market information | Not Started | — |
| DS.02 | Do not sacrifice analytical space for decorative UI | Not Started | — |
| DS.03 | Modules independently resizable and expandable to full screen | Not Started | — |

## Approval conditions (AP)

Details: [decisions/0001-approved-plan.md](decisions/0001-approved-plan.md)

| ID | Item | Status | Evidence |
|---|---|---|---|
| AP.01 | Deribit is a separate BTC options/GEX adapter; its data is never mixed with perpetual futures order flow | Not Started | — |
| AP.02 | Client-only recording clearly shows when recording is active or stopped | Not Started | — |
| AP.03 | Missing Gold tick, depth and order-flow data is never fabricated; status shows Unavailable or Delayed accurately | Not Started | — |
| AP.04 | Calculations and replay engines are consistent between live and recorded data | Not Started | — |
| AP.05 | FlowX stays completely independent from the owner’s other projects | Not Started | — |
