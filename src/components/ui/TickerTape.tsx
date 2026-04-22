"use client";

import React from 'react';

const MOCK_EMITEN_TICKER = [
  { ticker: "BBCA", val: "1.25" }, { ticker: "BBRI", val: "-0.50" }, { ticker: "BMRI", val: "2.10" },
  { ticker: "PWON", val: "0.80" }, { ticker: "FAST", val: "-1.45" }, { ticker: "BSDE", val: "0.30" },
  { ticker: "MAPI", val: "-2.30" }, { ticker: "BRIS", val: "3.40" }
];

export default function TickerTape() {
  const items = [
    ...MOCK_EMITEN_TICKER.map(e => ({ sym: e.ticker, val: e.val })),
    ...MOCK_EMITEN_TICKER.map(e => ({ sym: e.ticker, val: e.val })),
  ];

  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="ticker-item">
            <span className="ticker-sym">{item.sym}</span>
            <span className={parseFloat(item.val) >= 0 ? "ticker-up" : "ticker-down"}>
              {parseFloat(item.val) >= 0 ? "▲" : "▼"} {Math.abs(parseFloat(item.val))}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
