"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TopBar() {
  const [now, setNow] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
          <div className="logo-dot" />
          RUMPUT.ID
        </Link>
        <nav className="nav-links">
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`} style={{ textDecoration: 'none' }}>SCREENER</Link>
          <Link href="/sektor" className={`nav-link ${pathname.startsWith('/sektor') ? 'active' : ''}`} style={{ textDecoration: 'none' }}>SEKTOR</Link>
          <Link href="/lapor" className={`nav-link ${pathname === '/lapor' ? 'active' : ''}`} style={{ textDecoration: 'none' }}>LAPOR INTEL</Link>
          <Link href="/feed" className={`nav-link ${pathname === '/feed' ? 'active' : ''}`} style={{ textDecoration: 'none' }}>FEED</Link>
        </nav>
      </div>
      <div className="topbar-right">
        <div className="market-status">
          <div className="status-dot" />
          <span>BEI LIVE</span>
          <span style={{ color: "var(--text-muted)", marginLeft: "8px" }}>
            {mounted ? now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--"}
          </span>
        </div>
      </div>
    </div>
  );
}
