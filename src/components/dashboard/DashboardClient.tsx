"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PROPHECY_COLORS, PROPHECY_DESC } from "@/data/mock";
import { getIcon, DoodleStar } from "@/components/ui/Doodles";

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function ScoreBar({ score, color }: { score: number; color?: string }) {
  const barColor = score >= 60 ? "#00FF88" : score >= 40 ? "#FFAA00" : "#FF4466";
  return (
    <div className="score-wrap">
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${score}%`, background: color || barColor }} />
      </div>
      <span className="score-num" style={{ color: color || barColor }}>{score}</span>
    </div>
  );
}

function ProphecyBadge({ label, emoji }: { label: keyof typeof PROPHECY_COLORS; emoji: string }) {
  const style = PROPHECY_COLORS[label] || PROPHECY_COLORS["HINDARI TOTAL"];
  return (
    <span className="prophecy-badge" style={{
      background: style.bg,
      borderColor: style.border,
      color: style.text,
      boxShadow: style.glow,
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

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function DashboardClient({ initialEmiten, initialIntel }: { initialEmiten: any[], initialIntel: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("screener");
  const [activeSector, setActiveSector] = useState("Semua");
  const [activeFilter, setActiveFilter] = useState("Semua");

  const sectors = ["Semua", "Perbankan", "Properti", "F&B"];
  const prophecyFilters = ["Semua", "HOLD KERAS", "POTENSI AKUISISI", "JEBAKAN BATMAN", "HINDARI TOTAL"];

  const filteredEmiten = initialEmiten.filter(e => {
    const sectorMatch = activeSector === "Semua" || e.sektor === activeSector;
    const propMatch   = activeFilter === "Semua" || e.prophecy === activeFilter;
    return sectorMatch && propMatch;
  });

  const holdCount    = initialEmiten.filter(e => e.prophecy === "HOLD KERAS").length;
  const akuisisiCount = initialEmiten.filter(e => e.prophecy === "POTENSI AKUISISI").length;

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
        {[
          { name: "Perbankan", icon: "bank", count: 4, featured: true },
          { name: "F&B / Ritel", icon: "burger", count: 4, featured: true },
          { name: "Properti", icon: "building", count: 4, featured: true },
          { name: "Teknologi", icon: "laptop", count: 0, featured: false },
          { name: "Energi", icon: "lightning", count: 0, featured: false },
          { name: "Tambang", icon: "pickaxe", count: 0, featured: false },
          { name: "Farmasi", icon: "pill", count: 0, featured: false },
          { name: "Telco", icon: "antenna", count: 0, featured: false },
        ].map(s => (
          <div key={s.name} className={`sidebar-item ${activeSector === s.name ? "active" : ""}`}
            onClick={() => setActiveSector(activeSector === s.name ? "Semua" : s.name)}>
            <span className="icon" style={{ display: 'flex' }}>{getIcon(s.icon, { size: 16 })}</span>
            <span style={{ flex: 1, fontSize: "12px" }}>{s.name}</span>
            <span className={`sidebar-badge ${s.featured ? "featured" : ""}`}>
              {s.count > 0 ? s.count : "—"}
            </span>
          </div>
        ))}

        <div style={{ marginTop: "auto", padding: "20px 0" }}>
          <div className="card-glow" style={{ padding: "16px", background: "rgba(0,255,136,0.03)", border: "1px solid rgba(0,255,136,0.1)" }}>
            <div style={{ fontSize: "10px", color: "var(--accent)", marginBottom: "4px" }}>BULLISH SIGNAL</div>
            <div style={{ fontSize: "18px", fontFamily: "var(--font-data)" }}>{holdCount + akuisisiCount} EMITEN</div>
            <div style={{ fontSize: "9px", color: "var(--text-muted)", marginTop: "4px" }}>Screener mendeteksi akumulasi masif pada {sectors.length} sektor.</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        {/* Header / Tabs */}
        <div className="tabs">
          <button className={`tab-btn ${activeTab === "screener" ? "active" : ""}`} onClick={() => setActiveTab("screener")}>SCREENER</button>
          <button className={`tab-btn ${activeTab === "prophecy" ? "active" : ""}`} onClick={() => setActiveTab("prophecy")}>PROPHECY GUIDE</button>
          <button className={`tab-btn ${activeTab === "feed" ? "active" : ""}`} onClick={() => setActiveTab("feed")}>INTEL FEED</button>
        </div>

        {/* ── SCREENER TAB ── */}
        {activeTab === "screener" && (
          <>
            <div className="filters">
              {prophecyFilters.map(f => (
                <button key={f} className={`filter-chip ${activeFilter === f ? "active" : ""}`} onClick={() => setActiveFilter(f)}>
                  {f}
                </button>
              ))}
            </div>

            <table className="screener-table">
              <thead>
                <tr>
                  <th>EMITEN</th>
                  <th>PROPHECY</th>
                  <th>FUND</th>
                  <th>INTEL</th>
                  <th>PBV</th>
                  <th>ROE</th>
                  <th style={{ textAlign: "right" }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmiten.map((e, i) => (
                  <tr key={i} className="table-row-hover" onClick={() => router.push(`/emiten/${e.ticker}`)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div className="ticker-cell">
                        <span className="ticker-badge">{e.ticker}</span>
                        <span className="ticker-name">{e.nama}</span>
                      </div>
                    </td>
                    <td><ProphecyBadge label={e.prophecy as any} emoji={e.emoji} /></td>
                    <td><ScoreBar score={e.fundScore} /></td>
                    <td><ScoreBar score={e.intelScore} /></td>
                    <td className="data-val">{e.pbv}x</td>
                    <td className="data-val" style={{ color: e.roe > 15 ? "var(--color-bull)" : "inherit" }}>{e.roe}%</td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn-icon">{getIcon('external', { size: 14 })}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ── PROPHECY GUIDE TAB ── */}
        {activeTab === "prophecy" && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
                THE PROPHECY ENGINE — Formula 50/50
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.7", maxWidth: "600px" }}>
                Setiap emiten mendapat dua nilai: <span style={{ color: "var(--accent)" }}>Fundamental Score</span> dari data keuangan resmi, dan <span style={{ color: "var(--accent)" }}>Intel Score</span> dari laporan komunitas di lapangan. Keduanya digabung dengan bobot 50/50 untuk menghasilkan label Prophecy.
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

            <div className="section-header">
              <span className="section-title">Distribusi Saat Ini</span>
            </div>
            {Object.keys(PROPHECY_COLORS).map(label => {
              const count = initialEmiten.filter(e => e.prophecy === label).length;
              const pct   = (count / initialEmiten.length) * 100;
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

        {/* ── FEED TAB ── */}
        {activeTab === "feed" && (
          <>
            <div className="section-header">
              <span className="section-title">Intel Lapangan Terbaru</span>
              <span className="section-count">{initialIntel.length} laporan</span>
            </div>
            <div className="feed-grid">
              {initialIntel.map((intel, i) => (
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
                  <div className="intel-catatan">"{intel.catatan}"</div>
                  <div className="intel-footer">
                    <Stars rating={intel.rating} />
                    <span className="intel-nick">— {intel.nick}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
