import React from 'react';
import Link from 'next/link';
import { getIcon } from '@/components/ui/Doodles';

const SECTORS = [
  { nama: "Perbankan", slug: "perbankan", icon: "bank", desc: "Teori Satpam & Permen Lobi", count: 4 },
  { nama: "F&B / Ritel", slug: "fnb", icon: "burger", desc: "Teori Tisu & Saus Sambal", count: 2 },
  { nama: "Properti", slug: "properti", icon: "building", desc: "Teori Sabun Cuci Tangan", count: 2 },
];

export default function SektorList() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <Link href="/" className="sidebar-item" style={{ padding: '16px', color: 'var(--accent)', textDecoration: 'none' }}>
          <span className="icon" style={{ display: 'flex' }}>{getIcon('arrow-left', { size: 16 })}</span>
          <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.1em' }}>BACK TO SCREENER</span>
        </Link>
      </aside>

      <main className="main" style={{ maxWidth: '1000px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 className="section-title" style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Sektor Tersedia
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Kurasi 3 sektor paling krusial untuk analisis Prophecy. Sektor lain akan menyusul di Phase 3.
          </p>
        </div>

        <div className="sector-grid">
          {SECTORS.map(s => (
            <Link href={`/sektor/${s.slug}`} key={s.slug} style={{ textDecoration: 'none' }}>
              <div className="card-glow sector-card">
                <div className="sector-icon" style={{ display: 'flex', color: 'var(--accent)' }}>{getIcon(s.icon, { size: 32 })}</div>
                <h3 className="sector-name" style={{ color: 'var(--text-primary)' }}>{s.nama}</h3>
                <p className="sector-teori">{s.desc}</p>
                <div className="sector-stats">
                  <span>{s.count} Emiten</span>
                  <span>Lihat Detail →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
