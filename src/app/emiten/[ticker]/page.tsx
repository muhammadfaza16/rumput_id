import React from 'react';
import Link from 'next/link';
import { PROPHECY_COLORS, PROPHECY_DESC } from '@/data/mock';
import ShareCard from '@/components/ui/ShareCard';
import { getIcon, DoodleStar } from '@/components/ui/Doodles';
import { getEmiten, getIntelReports } from '@/lib/data';

export default async function EmitenDetail({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const emiten = await getEmiten(ticker);
  const intelList = await getIntelReports(ticker);

  if (!emiten) {
    return (
      <div className="main">
        <h1 className="section-title" style={{ fontSize: '2rem', color: 'var(--color-bear)' }}>ERROR 404: Ticker Not Found</h1>
        <Link href="/" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
          {getIcon('arrow-left', { size: 14 })} BACK TO SCREENER
        </Link>
      </div>
    );
  }

  const prophecyStyle = PROPHECY_COLORS[emiten.prophecy as keyof typeof PROPHECY_COLORS] || PROPHECY_COLORS["HINDARI TOTAL"];
  const prophecyDesc = PROPHECY_DESC[emiten.prophecy as keyof typeof PROPHECY_DESC];

  return (
    <div className="layout">
      {/* Sidebar untuk navigasi dalam emiten bisa ditaruh sini atau dibiarkan kosong */}
      <aside className="sidebar">
        <Link href="/" className="sidebar-item" style={{ padding: '16px', color: 'var(--accent)', textDecoration: 'none' }}>
          <span className="icon" style={{ display: 'flex' }}>{getIcon('arrow-left', { size: 16 })}</span>
          <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.1em' }}>BACK TO SCREENER</span>
        </Link>
      </aside>

      <main className="main">
        {/* Header Emiten */}
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
              <h1 style={{ fontFamily: 'var(--font-data)', fontSize: '48px', color: 'var(--text-primary)', lineHeight: '1' }}>
                {emiten.ticker}
              </h1>
              <span className="prophecy-badge" style={{
                background: prophecyStyle.bg,
                borderColor: prophecyStyle.border,
                color: prophecyStyle.text,
                boxShadow: prophecyStyle.glow,
                fontSize: '14px',
                padding: '6px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>{getIcon(emiten.emoji, { size: 18 })}</span>
                <span>{emiten.prophecy}</span>
              </span>
            </div>
            <h2 style={{ fontSize: '20px', color: 'var(--text-secondary)', fontWeight: 400 }}>{emiten.nama}</h2>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Sektor: {emiten.sektor}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <ShareCard 
              ticker={emiten.ticker} 
              nama={emiten.nama} 
              prophecyLabel={emiten.prophecy} 
              emoji={emiten.emoji}
              fundScore={emiten.fundScore}
              intelScore={emiten.intelScore}
            />
            <Link href="/lapor" className="filter-chip active" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
              <span>{getIcon('plus', { size: 14 })}</span> LAPOR INTEL
            </Link>
          </div>
        </div>

        {/* Scores & Fundamental */}
        <div className="stats-bar">
          <div className="stat-card" style={{ borderColor: 'var(--border-accent)' }}>
            <div className="stat-label">Fundamental Score</div>
            <div className="stat-value" style={{ color: emiten.fundScore >= 55 ? 'var(--color-bull)' : 'var(--color-bear)' }}>
              {emiten.fundScore}/100
            </div>
            <div className="stat-sub">Sectors.app API</div>
          </div>
          <div className="stat-card" style={{ borderColor: 'var(--border-accent)' }}>
            <div className="stat-label">Intel Score</div>
            <div className="stat-value" style={{ color: emiten.intelScore >= 55 ? 'var(--color-bull)' : 'var(--color-bear)' }}>
              {emiten.intelScore}/100
            </div>
            <div className="stat-sub">Laporan Lapangan</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">PBV</div>
            <div className="stat-value">{emiten.pbv}x</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">ROE</div>
            <div className="stat-value">{emiten.roe}%</div>
          </div>
        </div>

        {/* Prophecy Explanation */}
        <div className="legend-card" style={{ borderColor: prophecyStyle.border, background: prophecyStyle.bg, marginBottom: '40px' }}>
          <div className="legend-title" style={{ color: prophecyStyle.text, fontSize: '16px' }}>
            Analisis Prophecy: {emiten.prophecy}
          </div>
          <div className="legend-desc" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
            {prophecyDesc}
          </div>
        </div>

        {/* Intel Feed */}
        <div className="section-header">
          <span className="section-title">Log Intel Lapangan ({emiten.ticker})</span>
          <span className="section-count">{intelList.length} laporan</span>
        </div>
        
        <div className="feed-grid">
          {intelList.length > 0 ? intelList.map((intel: any, i: number) => (
            <div key={i} className="intel-card">
              <div className="intel-header">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
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
                <div className="intel-rating" style={{ display: 'flex', gap: '2px' }}>
                  {[1,2,3,4,5].map(star => (
                    <DoodleStar key={star} filled={star <= intel.rating} size={14} style={{ color: star <= intel.rating ? '#FFAA00' : 'var(--text-muted)' }} />
                  ))}
                </div>
                <span className="intel-nick">— {intel.nick}</span>
              </div>
            </div>
          )) : (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-default)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--text-secondary)' }}>{getIcon('detective', { size: 48 })}</div>
              <div>Belum ada laporan intel untuk emiten ini.</div>
              <div style={{ marginTop: '16px' }}>
                <Link href="/lapor" className="nav-link">JADILAH INTEL PERTAMA</Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
