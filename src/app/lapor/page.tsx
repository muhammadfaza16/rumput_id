"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_EMITEN } from '@/data/mock';
import { getIcon, DoodleStar } from '@/components/ui/Doodles';
import { submitIntelAction } from '@/app/actions';

export default function LaporIntel() {
  const [ticker, setTicker] = useState('');
  const [kategori, setKategori] = useState('');
  const [rating, setRating] = useState(0);
  const [lokasi, setLokasi] = useState('');
  const [kota, setKota] = useState('');
  const [catatan, setCatatan] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !kategori || !rating) return;
    
    setIsPending(true);
    const formData = new FormData();
    formData.append('ticker', ticker);
    formData.append('kategori', kategori);
    formData.append('lokasi', lokasi);
    formData.append('kota', kota);
    formData.append('rating', rating.toString());
    formData.append('catatan', catatan);

    await submitIntelAction(formData);
    
    setSubmitted(true);
    setIsPending(false);
    
    setTimeout(() => {
      setSubmitted(false);
      setTicker('');
      setKategori('');
      setLokasi('');
      setKota('');
      setRating(0);
      setCatatan('');
    }, 5000);
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <Link href="/" className="sidebar-item" style={{ padding: '16px', color: 'var(--accent)', textDecoration: 'none' }}>
          <span className="icon" style={{ display: 'flex' }}>{getIcon('arrow-left', { size: 16 })}</span>
          <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.1em' }}>BACK TO SCREENER</span>
        </Link>
      </aside>

      <main className="main" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--accent)', marginBottom: '8px' }}>
            [ LAPOR_INTEL_LAPANGAN ]
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Kirimkan hasil observasi lapangan lo. Anonymity is guaranteed. We don't track who you are, we only track the cookies.
          </p>
        </div>

        {submitted ? (
          <div className="card-glow" style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-tertiary)', border: '1px solid var(--border-accent)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--accent)', marginBottom: '16px' }}>{getIcon('check', { size: 48 })}</div>
            <h2 style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>TRANSMISSION SUCCESS</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Intel berhasil diamankan di database Rumput ID.<br/>Prophecy Engine sedang memproses data lu.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-glow" style={{ padding: '32px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                TARGET EMITEN
              </label>
              <select 
                value={ticker} 
                onChange={e => setTicker(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontFamily: 'var(--font-data)', borderRadius: '4px' }}
              >
                <option value="">-- PILIH TICKER --</option>
                {MOCK_EMITEN.map(e => (
                  <option key={e.ticker} value={e.ticker}>{e.ticker} - {e.nama}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                KATEGORI INTEL
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Satpam', 'Teller', 'Toilet / Sabun', 'Tisu / Saus', 'Lobi / AC', 'Parkiran'].map(cat => (
                  <div 
                    key={cat}
                    onClick={() => setKategori(cat)}
                    className={`filter-chip ${kategori === cat ? 'active' : ''}`}
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  LOKASI (Nama Cabang / Mall)
                </label>
                <input 
                  type="text"
                  value={lokasi}
                  onChange={e => setLokasi(e.target.value)}
                  placeholder="Cth: KCP Sudirman, GI..."
                  required
                  style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  KOTA
                </label>
                <input 
                  type="text"
                  value={kota}
                  onChange={e => setKota(e.target.value)}
                  placeholder="Cth: Jakarta Selatan"
                  required
                  style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                RATING LAPANGAN
              </label>
              <div style={{ display: 'flex', gap: '8px', fontSize: '24px', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <div 
                    key={star} 
                    onClick={() => setRating(star)}
                    style={{ color: star <= rating ? 'var(--color-neutral)' : 'var(--border-default)', transition: 'color 0.2s', display: 'flex' }}
                  >
                    <DoodleStar filled={star <= rating} size={28} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                CATATAN RAHASIA (Max 280 char)
              </label>
              <textarea 
                value={catatan}
                onChange={e => setCatatan(e.target.value)}
                maxLength={280}
                required
                placeholder="Deskripsikan kondisi lapangan sejelas mungkin..."
                style={{ width: '100%', height: '120px', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', borderRadius: '4px', resize: 'vertical' }}
              />
              <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {catatan.length}/280
              </div>
            </div>

            <button 
              type="submit" 
              className="filter-chip active"
              style={{ width: '100%', padding: '16px', fontSize: '14px', textAlign: 'center', justifyContent: 'center', fontWeight: 'bold' }}
              disabled={!ticker || !kategori || !rating}
            >
              SUBMIT INTEL REPORT
            </button>

          </form>
        )}
      </main>
    </div>
  );
}
