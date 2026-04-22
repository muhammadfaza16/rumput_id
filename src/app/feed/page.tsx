import React from 'react';
import Link from 'next/link';
import { getIcon, DoodleStar } from '@/components/ui/Doodles';
import { getIntelReports } from '@/lib/data';

export default async function IntelFeed() {
  const intelList = await getIntelReports();
  
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-label">Filter Feed</div>
        <Link href="/feed" className="sidebar-item active">
          <span className="icon" style={{ display: 'flex' }}>{getIcon('globe', { size: 16 })}</span>
          <span style={{ flex: 1 }}>Semua Emiten</span>
        </Link>
        <Link href="/feed?sort=trending" className="sidebar-item">
          <span className="icon" style={{ display: 'flex' }}>{getIcon('fire', { size: 16 })}</span>
          <span style={{ flex: 1 }}>Trending Hari Ini</span>
        </Link>
      </aside>

      <main className="main" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="section-title" style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>Global Intel Feed</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Memonitor semua laporan masuk dari lapangan secara real-time.</p>
          </div>
          <Link href="/lapor" className="filter-chip active" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{getIcon('plus', { size: 14 })}</span> LAPOR INTEL
          </Link>
        </div>

        <div className="feed-grid">
          {intelList.map((intel: any, i: number) => (
            <div key={i} className="intel-card">
              <div className="intel-header">
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <Link href={`/emiten/${intel.ticker}`} className="intel-ticker" style={{ textDecoration: 'none' }}>
                    {intel.ticker}
                  </Link>
                  <span className="intel-categ">{intel.kategori}</span>
                  <span className="intel-meta">
                    <span>{intel.lokasi}</span>
                    <span className="sep">·</span>
                    <span>{intel.kota}</span>
                  </span>
                </div>
                <span className="intel-time">{intel.waktu}</span>
              </div>
              <div className="intel-catatan" style={{ fontSize: '15px' }}>"{intel.catatan}"</div>
              <div className="intel-footer">
                <div className="intel-rating" style={{ display: 'flex', gap: '2px' }}>
                  {[1,2,3,4,5].map(star => (
                    <DoodleStar key={star} filled={star <= intel.rating} size={14} style={{ color: star <= intel.rating ? '#FFAA00' : 'var(--text-muted)' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-data)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {getIcon('arrow-up', { size: 14 })} 12
                  </span>
                  <span className="intel-nick">— {intel.nick}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button className="filter-chip" style={{ background: 'transparent' }}>MUAT LEBIH BANYAK...</button>
        </div>
      </main>
    </div>
  );
}
