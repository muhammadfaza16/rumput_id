"use client";

import { useEffect, useState } from "react";

// Deterministic fallback for SSR
const FALLBACK_TICKERS = [
  { code: "IHSG", change: 0.82 },
  { code: "LQ45", change: -0.14 },
  { code: "IDX30", change: 0.35 },
  { code: "BBCA", change: 1.80 },
  { code: "BBRI", change: -0.60 },
  { code: "BMRI", change: 0.92 },
  { code: "GOTO", change: -3.40 },
  { code: "BREN", change: 4.20 },
  { code: "PWON", change: 0.50 },
  { code: "FAST", change: -1.45 },
  { code: "BSDE", change: 0.80 },
  { code: "MAPI", change: -2.30 },
  { code: "BRIS", change: 3.40 },
  { code: "BOCA", change: 1.25 },
];

export default function TickerTape() {
  const [tickers, setTickers] = useState(FALLBACK_TICKERS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Try to fetch real index data from our API
    fetch("/api/indices")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.length > 0) {
          setTickers(data.map((d: any) => ({
            code: d.index_code || d.code,
            change: d.change_pct ?? d.change ?? 0,
          })));
        }
      })
      .catch(() => { /* use fallback */ });
  }, []);

  const items = tickers;
  const doubled = [...items, ...items]; // seamless loop

  return (
    <div className="ticker-tape" aria-label="Market ticker">
      <div className="ticker-track">
        {doubled.map((t, i) => (
          <span key={i} className="ticker-item" style={{ color: t.change >= 0 ? "var(--color-bull)" : "var(--color-bear)" }}>
            {t.code}{" "}
            <span>{t.change >= 0 ? "▲" : "▼"} {Math.abs(t.change).toFixed(1)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}
