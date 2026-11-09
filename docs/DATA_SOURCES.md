# FlowX Terminal — Data Sources

**Status:** skeleton (Phase 1). Every fact about a source stays unverified until the Phase 3 data-source spike checks it against official documentation and live responses. Nothing here is a claim yet. See [DATA_ARCHITECTURE.md](DATA_ARCHITECTURE.md) for how sources plug in.

## Planned sources (free and public only)

| Source | Domain | Used for | Status |
|---|---|---|---|
| Binance Futures | futures | trades, order book, klines, mark price, funding, open interest, liquidations, long/short | Unverified |
| Bybit | futures | same as above | Unverified |
| OKX | futures | same as above | Unverified |
| Deribit | options (BTC only) | option chains, implied volatility, greeks, open interest, option trades | Unverified |
| Gold price source | price | COMEX Gold price/OHLCV only, if a free source is confirmed | Unverified (may not exist) |

Gold tick, depth and order-flow data are expected to be Unavailable. They are never estimated or interpolated.

## Facts to verify per source (spike template)

- Endpoints and streams used, with field mappings to normalized events
- Authentication needed (none expected)
- Rate limits and connection limits
- Access from a browser (CORS, WebSocket origin rules)
- Geo or IP restrictions
- History depth and pagination for trades and klines
- Order-book protocol: snapshot, deltas, sequence ids, checksums
- Aggressor-side semantics
- Contract specifications: tick size, quantity step, contract size, quantity unit
- Timestamp semantics and server-time endpoint
- Known quirks and outages
- Date verified and how (docs link, live capture)

## Verified facts

None yet.
