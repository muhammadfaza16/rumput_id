"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PROPHECY_COLORS, PROPHECY_DESC, SEKTOR_LIST } from "@/data/mock";
import { getIcon, DoodleStar } from "@/components/ui/Doodles";

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function ScoreBar({ score, color }: { score: number; color?: string }) {
  const barColor = score >= 60 ? "#00FF88" : score >= 40 ? "#FFAA00" : "#FF4466";
  return (
    <div className="score-wrap">
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${score}%`, background: color || barColor }} />
      </div>
      <span className="score-num" style={{ color: color || barColor }}>{Math.round(score)}</span>
    </div>
  );
}

function ProphecyBadge({ label, emoji }: { label: keyof typeof PROPHECY_COLORS; emoji: string }) {
  const style = PROPHECY_COLORS[label] || PROPHECY_COLORS["HINDARI TOTAL"];
  return (
    <span className="prophecy-badge" style={{
      background: style.bg, borderColor: style.border, color: style.text, boxShadow: style.glow,
    }}>
      <span>{getIcon(emoji, { size: 14 })}</span>
      <span>{label}</span>
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="intel-rating" style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map(i => (
        <DoodleStar key={i} filled={i <= rating} size={14} style={{ color: i <= rating ? '#FFAA00' : 'var(--text-muted)' }} />
      ))}
    </div>
  );
}

function formatPrice(price: number | null | undefined): string {
  if (price == null) return "—";
  return new Intl.NumberFormat("id-ID").format(price);
}

function formatMcap(mcap: number | null | undefined): string {
  if (mcap == null) return "—";
  if (mcap >= 1_000_000_000) return `${(mcap / 1_000_000_000).toFixed(1)}T`;
  if (mcap >= 1_000_000) return `${(mcap / 1_000_000).toFixed(1)}M`;
  return `${(mcap / 1_000).toFixed(0)}K`;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function DashboardClient({ initialEmiten, initialIntel }: { initialEmiten: any[], initialIntel: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("emiten");
  const [activeSector, setActiveSector] = useState("Semua");
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("prophecy_score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const prophecyFilters = ["Semua", "HOLD KERAS", "POTENSI AKUISISI", "JEBAKAN BATMAN", "HINDARI TOTAL"];

  // Filter & sort
  const filteredEmiten = initialEmiten
    .filter((e: any) => {
      const sectorMatch = activeSector === "Semua" || e.sektor === activeSector;
      const propMatch = activeFilter === "Semua" || (e.prophecy_label || e.prophecy) === activeFilter;
      const searchMatch = !searchQuery ||
        e.ticker?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.nama?.toLowerCase().includes(searchQuery.toLowerCase());
      return sectorMatch && propMatch && searchMatch;
    })
    .sort((a: any, b: any) => {
      const va = a[sortBy] ?? 0;
      const vb = b[sortBy] ?? 0;
      return sortDir === "desc" ? vb - va : va - vb;
    });

  const holdCount = initialEmiten.filter((e: any) => (e.prophecy_label || e.prophecy) === "HOLD KERAS").length;
  const akuisisiCount = initialEmiten.filter((e: any) => (e.prophecy_label || e.prophecy) === "POTENSI AKUISISI").length;

  function toggleSort(field: string) {
    if (sortBy === field) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  }

  function SortIcon({ field }: { field: string }) {
    if (sortBy !== field) return <span style={{ opacity: 0.3 }}>↕</span>;
    return <span>{sortDir === "desc" ? "↓" : "↑"}</span>;
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-label">Indeks</div>
        {[
          { name: "IDX Composite", icon: "chart" },
          { name: "LQ45", icon: "star" },
          { name: "IDX30", icon: "trophy" },
        ].map(item => (
          <div key={item.name} className="sidebar-item">
            <span className="icon" style={{ display: 'flex' }}>{getIcon(item.icon, { size: 16 })}</span>
            <span style={{ flex: 1 }}>{item.name}</span>
          </div>
        ))}

        <div className="sidebar-label" style={{ marginTop: "16px" }}>Sektor</div>
        {SEKTOR_LIST.map((s: any) => {
          const count = initialEmiten.filter((e: any) => e.sektor === s.nama).length;
          return (
            <div key={s.nama} className={`sidebar-item ${activeSector === s.nama ? "active" : ""}`}
              onClick={() => setActiveSector(activeSector === s.nama ? "Semua" : s.nama)}>
              <span className="icon" style={{ display: 'flex' }}>{getIcon(s.icon, { size: 16 })}</span>
              <span style={{ flex: 1, fontSize: "12px" }}>{s.nama}</span>
              <span className={`sidebar-badge ${count > 0 ? "featured" : ""}`}>
                {count > 0 ? count : "—"}
              </span>
            </div>
          );
        })}

        <div style={{ marginTop: "auto", padding: "20px 0" }}>
          <div className="card-glow" style={{ padding: "16px", background: "rgba(0,255,136,0.03)", border: "1px solid rgba(0,255,136,0.1)" }}>
            <div style={{ fontSize: "10px", color: "var(--accent)", marginBottom: "4px" }}>BULLISH SIGNAL</div>
            <div style={{ fontSize: "18px", fontFamily: "var(--font-data)" }}>{holdCount + akuisisiCount} EMITEN</div>
            <div style={{ fontSize: "9px", color: "var(--text-muted)", marginTop: "4px" }}>
              {holdCount} Hold Keras · {akuisisiCount} Potensi Akuisisi
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        <div className="tabs" style={{ marginBottom: "20px" }}>
          <button className={`tab-btn ${activeTab === "emiten" ? "active" : ""}`} onClick={() => setActiveTab("emiten")}>EMITEN</button>
          <button className={`tab-btn ${activeTab === "intel" ? "active" : ""}`} onClick={() => setActiveTab("intel")}>INTEL</button>
          <button className={`tab-btn ${activeTab === "guide" ? "active" : ""}`} onClick={() => setActiveTab("guide")}>GUIDE</button>
        </div>

        {/* ── EMITEN TAB ── */}
        {activeTab === "emiten" && (
          <>
            {/* Search bar */}
            <div style={{ marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Cari ticker atau nama emiten..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%", padding: "10px 16px", background: "var(--bg-secondary)",
                  border: "1px solid var(--border-default)", borderRadius: "6px",
                  color: "var(--text-primary)", fontFamily: "var(--font-data)", fontSize: "12px",
                  outline: "none",
                }}
              />
            </div>

            <div className="filters">
              {prophecyFilters.map(f => (
                <button key={f} className={`filter-chip ${activeFilter === f ? "active" : ""}`} onClick={() => setActiveFilter(f)}>
                  {f}
                </button>
              ))}
            </div>

            <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "8px", fontFamily: "var(--font-display)", display: "flex", justifyContent: "space-between" }}>
              <span>{filteredEmiten.length} emiten · Click header to sort</span>
              <span style={{ color: "var(--accent)", opacity: 0.8 }}>● LIVE DATA DARI BEI</span>
            </div>

            <table className="screener-table">
              <thead>
                <tr>
                  <th>EMITEN</th>
                  <th>PROPHECY</th>
                  <th onClick={() => toggleSort("fundamental_score")} style={{ cursor: "pointer" }}>FUND <SortIcon field="fundamental_score" /></th>
                  <th onClick={() => toggleSort("intel_score")} style={{ cursor: "pointer" }}>INTEL <SortIcon field="intel_score" /></th>
                  <th onClick={() => toggleSort("pbv")} style={{ cursor: "pointer" }}>PBV <SortIcon field="pbv" /></th>
                  <th onClick={() => toggleSort("roe")} style={{ cursor: "pointer" }}>ROE <SortIcon field="roe" /></th>
                  <th onClick={() => toggleSort("last_price")} style={{ cursor: "pointer" }}>PRICE <SortIcon field="last_price" /></th>
                  <th style={{ textAlign: "right" }}>MCAP</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmiten.map((e: any, i: number) => (
                  <tr key={i} className="table-row-hover" onClick={() => router.push(`/emiten/${e.ticker}`)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div className="ticker-cell">
                        <span className="ticker-badge">{e.ticker}</span>
                        <div>
                          <span className="ticker-name">{e.nama}</span>
                          <div style={{ fontSize: "9px", color: "var(--text-muted)", marginTop: "2px" }}>{e.sektor}</div>
                        </div>
                      </div>
                    </td>
                    <td><ProphecyBadge label={(e.prophecy_label || e.prophecy) as any} emoji={e.emoji} /></td>
                    <td><ScoreBar score={e.fundamental_score || e.fundScore || 50} /></td>
                    <td><ScoreBar score={e.intel_score || e.intelScore || 50} /></td>
                    <td className="data-val" style={{ color: e.pbv != null && e.pbv < 1 ? "var(--color-bull)" : e.pbv != null && e.pbv > 5 ? "var(--color-bear)" : "inherit" }}>
                      {e.pbv != null ? `${e.pbv.toFixed(1)}x` : "—"}
                    </td>
                    <td className="data-val" style={{ color: e.roe != null && e.roe > 15 ? "var(--color-bull)" : e.roe != null && e.roe < 0 ? "var(--color-bear)" : "inherit" }}>
                      {e.roe != null ? `${e.roe.toFixed(1)}%` : "—"}
                    </td>
                    <td className="data-val">{e.last_price ? `Rp ${formatPrice(e.last_price)}` : "—"}</td>
                    <td className="data-val" style={{ textAlign: "right" }}>{formatMcap(e.market_cap)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ── INTEL TAB ── */}
        {activeTab === "intel" && (
          <>
            <div className="section-header">
              <span className="section-title">Intel Lapangan Terbaru</span>
              <span className="section-count">{initialIntel.length} laporan</span>
            </div>
            <div className="feed-grid">
              {initialIntel.map((intel: any, i: number) => (
                <div key={i} className="intel-card">
                  <div className="intel-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span className="intel-ticker">{intel.ticker}</span>
                      <span className="intel-categ">{intel.kategori}</span>
                      <span className="intel-meta">
                        <span>{intel.lokasi}</span>
                        <span className="sep">·</span>
                        <span>{intel.kota}</span>
                      </span>
                    </div>
                    <span className="intel-time">{intel.waktu}</span>
                  </div>
                  <div className="intel-catatan">&ldquo;{intel.catatan}&rdquo;</div>
                  <div className="intel-footer">
                    <Stars rating={intel.rating} />
                    <span className="intel-nick">— {intel.nickname || intel.nick || "Analis Anonim"}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── GUIDE TAB ── */}
        {activeTab === "guide" && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
                THE PROPHECY ENGINE — Formula 50/50
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.7", maxWidth: "600px" }}>
                Setiap emiten mendapat dua nilai: <span style={{ color: "var(--accent)" }}>Fundamental Score</span> dari data keuangan resmi BEI (PBV, ROE, NPL, DER), dan <span style={{ color: "var(--accent)" }}>Intel Score</span> dari laporan komunitas di lapangan. Keduanya digabung dengan bobot 50/50 untuk menghasilkan label Prophecy.
              </div>
            </div>

            <div className="legend-grid">
              {Object.entries(PROPHECY_COLORS).map(([label, style]) => {
                const emojis: Record<string, string> = { "HOLD KERAS": "diamond", "POTENSI AKUISISI": "glass", "JEBAKAN BATMAN": "warning", "HINDARI TOTAL": "skull" };
                return (
                  <div key={label} className="legend-card" style={{ borderColor: style.border, background: style.bg }}>
                    <div className="legend-title" style={{ color: style.text, display: 'flex', alignItems: 'center' }}>
                      {getIcon(emojis[label], { size: 16 })} {label}
                    </div>
                    <div className="legend-desc">{PROPHECY_DESC[label as keyof typeof PROPHECY_DESC]}</div>
                    <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "9px", padding: "2px 8px", borderRadius: "2px", border: `1px solid ${style.border}`, color: style.text }}>
                        {label === "HOLD KERAS" || label === "POTENSI AKUISISI" ? "FUND ≥55" : "FUND <55"}
                      </span>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "9px", padding: "2px 8px", borderRadius: "2px", border: `1px solid ${style.border}`, color: style.text }}>
                        {label === "HOLD KERAS" || label === "JEBAKAN BATMAN" ? "INTEL ≥55" : "INTEL <55"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="section-header" style={{ marginTop: "30px" }}>
              <span className="section-title">Distribusi Saat Ini</span>
              <span className="section-count">{initialEmiten.length} emiten</span>
            </div>
            {Object.keys(PROPHECY_COLORS).map(label => {
              const count = initialEmiten.filter((e: any) => (e.prophecy_label || e.prophecy) === label).length;
              const pct = initialEmiten.length > 0 ? (count / initialEmiten.length) * 100 : 0;
              const style = PROPHECY_COLORS[label as keyof typeof PROPHECY_COLORS];
              return (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                  <div style={{ width: "160px", fontFamily: "var(--font-display)", fontSize: "10px", color: style.text }}>{label}</div>
                  <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: style.text, borderRadius: "3px", transition: "width 0.8s ease" }} />
                  </div>
                  <div style={{ fontFamily: "var(--font-data)", fontSize: "12px", color: style.text, minWidth: "24px" }}>{count}</div>
                </div>
              );
            })}
          </>
        )}
      </main>
    </div>
  );
}

