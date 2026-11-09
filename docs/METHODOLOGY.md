# FlowX Terminal — Methodology

**Status:** skeleton (Phase 1). Nothing here is implemented yet.

Every calculation that is not a plain sum or count is documented here before it is built: definition, inputs, parameters and defaults, confirmed-or-estimated label, known limits and known-answer test vectors. Formulas come from public, textbook order-flow and options concepts. No ATAS code or private algorithms are used, and UI names are our own. See [DATA_ARCHITECTURE.md](DATA_ARCHITECTURE.md) for the engines that use them.

## Entry template

- **Name and UI label**
- **Definition** (formula or rule, in plain terms)
- **Inputs** (event types and domain: futures, options or price)
- **Parameters and defaults** (each one is a typed, tested setting)
- **Label:** confirmed or estimated, and why
- **Known limits** (data gaps, venue differences, what it cannot tell)
- **Test vectors** (hand-computed inputs and expected outputs)

## Confirmed values (no entry needed beyond the definition)

Volume, bid/ask volume, delta from aggressor-flagged trades, and open interest, funding and liquidations as reported by the venue.

## Estimated values (each needs an entry before implementation)

Absorption, exhaustion, initiative and passive activity, market power, pulling-versus-cancel attribution, refill-pattern (iceberg) observations, hidden-liquidity inference, adaptive big-trade thresholds, volume anomalies, tape patterns, market structure, market strength, and GEX (net, absolute, flip, walls, vanna, charm, options flow).

## Entries

None yet.
