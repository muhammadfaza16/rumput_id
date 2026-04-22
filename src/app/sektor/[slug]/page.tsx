import React from 'react';
import Link from 'next/link';
import { PROPHECY_COLORS } from '@/data/mock';
import { getIcon } from '@/components/ui/Doodles';
import { getEmitenList } from '@/lib/data';

export default async function SektorDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allEmiten = await getEmitenList();
  const emitenList = allEmiten.filter((e: any) => e.slug === slug);
  const sektorName = emitenList.length > 0 ? emitenList[0].sektor : slug;

  return (
    <div className="layout">
      <aside className="sidebar">
        <Link href="/sektor" className="sidebar-item" style={{ padding: '16px', color: 'var(--accent)', textDecoration: 'none' }}>
          <span className="icon" style={{ display: 'flex' }}>{getIcon('arrow-left', { size: 16 })}</span>
          <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.1em' }}>BACK TO SEKTOR</span>
        </Link>
      </aside>

      <main className="main" style={{ maxWidth: '1000px' }}>
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              SEKTOR
            </div>
            <h1 style={{ fontFamily: 'var(--font-data)', fontSize: '32px', color: 'var(--text-primary)', lineHeight: '1', marginBottom: '8px' }}>
              {sektorName.toUpperCase()}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Menampilkan {emitenList.length} emiten dalam sektor ini.
            </p>
          </div>
        </div>

        <div className="sector-grid">
          {emitenList.length > 0 ? emitenList.map(e => {
            const prophecyStyle = PROPHECY_COLORS[e.prophecy as keyof typeof PROPHECY_COLORS] || PROPHECY_COLORS["HINDARI TOTAL"];
            
            return (
              <Link href={`/emiten/${e.ticker}`} key={e.ticker} style={{ textDecoration: 'none' }}>
                <div className="card-glow sector-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="ticker-badge" style={{ fontSize: '14px', padding: '4px 10px' }}>{e.ticker}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', padding: '4px 8px', borderRadius: '3px', border: `1px solid ${prophecyStyle.border}`, color: prophecyStyle.text, background: prophecyStyle.bg, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {getIcon(e.emoji, { size: 14 })} {e.prophecy}
                    </span>
                  </div>
                  
                  <div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '16px' }}>{e.nama}</div>
                  </div>
                  
                  <div className="stats-bar" style={{ display: 'flex', gap: '16px', marginBottom: 0 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>FUND SCORE</div>
                      <div style={{ fontSize: '16px', fontFamily: 'var(--font-data)', color: e.fundScore >= 55 ? 'var(--color-bull)' : 'var(--color-bear)' }}>{e.fundScore}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>INTEL SCORE</div>
                      <div style={{ fontSize: '16px', fontFamily: 'var(--font-data)', color: e.intelScore >= 55 ? 'var(--color-bull)' : 'var(--color-bear)' }}>{e.intelScore}</div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          }) : (
            <div style={{ color: 'var(--text-muted)' }}>Belum ada emiten di sektor ini.</div>
          )}
        </div>
      </main>
    </div>
  );
}
