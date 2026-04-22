"use client";

import React, { useRef, useState } from 'react';
import { getIcon } from './Doodles';

interface ShareCardProps {
  ticker: string;
  nama: string;
  prophecyLabel: string;
  emoji: string;
  fundScore: number;
  intelScore: number;
}

export default function ShareCard({ ticker, nama, prophecyLabel, emoji, fundScore, intelScore }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // In a real implementation, we would use html2canvas to convert the div to an image
  // and then use the Web Share API to share it. For MVP, we will copy a formatted text.
  const handleShare = async () => {
    const text = `[RUMPUT ID PROPHECY]\n\n${ticker} - ${nama}\nStatus: ${emoji} ${prophecyLabel}\n\nFundamental: ${fundScore}/100\nIntel Lapangan: ${intelScore}/100\n\nCek selengkapnya di rumput.id/emiten/${ticker}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Prophecy untuk ${ticker}`,
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <>
      <button 
        onClick={handleShare}
        className="filter-chip active" 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontWeight: 'bold' }}
      >
        <span>{copied ? '✓ COPIED' : '🔗 SHARE PROPHECY'}</span>
      </button>

      {/* Hidden Card for Future Image Generation */}
      <div className="share-card-container">
        <div ref={cardRef} style={{
          width: '600px',
          height: '315px', // OpenGraph standard ratio
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          padding: '40px',
          fontFamily: 'var(--font-body)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '1px solid var(--border-accent)',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)', fontSize: '14px', marginBottom: '8px' }}>
              RUMPUT.ID PROPHECY ENGINE
            </div>
            <div style={{ fontSize: '48px', fontFamily: 'var(--font-data)', fontWeight: 'bold', lineHeight: 1, marginBottom: '8px' }}>
              {ticker}
            </div>
            <div style={{ fontSize: '20px', color: 'var(--text-secondary)' }}>{nama}</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>FUNDAMENTAL</div>
                <div style={{ fontSize: '24px', fontFamily: 'var(--font-data)', color: fundScore >= 55 ? 'var(--color-bull)' : 'var(--color-bear)' }}>{fundScore}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>INTEL SCORE</div>
                <div style={{ fontSize: '24px', fontFamily: 'var(--font-data)', color: intelScore >= 55 ? 'var(--color-bull)' : 'var(--color-bear)' }}>{intelScore}</div>
              </div>
            </div>

            <div style={{
              fontSize: '24px',
              fontFamily: 'var(--font-display)',
              fontWeight: 'bold',
              border: '2px solid',
              padding: '8px 16px',
              borderRadius: '4px',
              borderColor: 'var(--accent)', // Simplified for MVP
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {getIcon(emoji, { size: 28 })} {prophecyLabel}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
