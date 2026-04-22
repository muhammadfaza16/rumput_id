"use client";

import React, { useState, useEffect } from 'react';

export default function StatusBar() {
  const [now, setNow] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="statusbar">
      <div className="statusbar-items">
        <div className="statusbar-item">
          <span className="statusbar-ok">●</span>
          <span>Sectors.app API: OK</span>
        </div>
        <div className="statusbar-item">
          <span className="statusbar-ok">●</span>
          <span>Supabase: Connected</span>
        </div>
        <div className="statusbar-item">
          <span>Data updated: {mounted ? now.toLocaleTimeString("id-ID") : "--:--:--"}</span>
        </div>
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "var(--text-muted)" }}>
        RUMPUT.ID v0.1.0-MVP · "Terminal Hedge Fund. Isi Laporan Warung."
      </div>
    </div>
  );
}
