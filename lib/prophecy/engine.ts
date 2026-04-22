// The Prophecy Engine v1.0
// Rumus 50% Fundamental / 50% Intel

type ProphecyLabel = 'HOLD KERAS' | 'POTENSI AKUISISI' | 'JEBAKAN BATMAN' | 'HINDARI TOTAL';

export interface EmitenFundamental {
  pbv: number | null;
  roe: number | null;
  npl: number | null;
  der: number | null;
}

export interface IntelReport {
  rating_overall: number;
  created_at: string;
}

export function calcFundamentalScore(emiten: EmitenFundamental): number {
  let score = 50; // baseline

  // PBV: makin rendah makin bagus (nilai wajar = 1.0)
  if (emiten.pbv !== null) {
    if (emiten.pbv < 0.5)       score += 25;
    else if (emiten.pbv < 1.0)  score += 15;
    else if (emiten.pbv < 1.5)  score += 5;
    else if (emiten.pbv > 3.0)  score -= 15;
    else if (emiten.pbv > 5.0)  score -= 25;
  }

  // ROE: makin tinggi makin bagus (threshold: 15%)
  if (emiten.roe !== null) {
    if (emiten.roe > 20)        score += 20;
    else if (emiten.roe > 15)   score += 12;
    else if (emiten.roe > 10)   score += 5;
    else if (emiten.roe < 5)    score -= 10;
    else if (emiten.roe < 0)    score -= 25;
  }

  // NPL (khusus bank): makin rendah makin bagus (< 5% = sehat)
  if (emiten.npl !== null) {
    if (emiten.npl < 2)         score += 15;
    else if (emiten.npl < 5)    score += 5;
    else if (emiten.npl > 5)    score -= 10;
    else if (emiten.npl > 10)   score -= 20;
  }

  // DER: makin rendah makin bagus (< 1 = ideal untuk non-bank)
  if (emiten.der !== null && emiten.npl === null) {
    if (emiten.der < 0.5)       score += 10;
    else if (emiten.der < 1.0)  score += 5;
    else if (emiten.der > 2.0)  score -= 10;
    else if (emiten.der > 4.0)  score -= 20;
  }

  return Math.max(0, Math.min(100, score));
}

export function calcIntelScore(reports: IntelReport[]): number {
  if (reports.length === 0) return 50; // default neutral jika belum ada intel

  // TODO: filter 90 hari terakhir
  const recentReports = reports.slice(0, 50); // max 50 laporan terbaru

  const avgOverall = recentReports.reduce((sum, r) => sum + r.rating_overall, 0) / recentReports.length;

  // Convert 1-5 scale ke 0-100
  return ((avgOverall - 1) / 4) * 100;
}

export function calcProphecy(fundScore: number, intelScore: number): {
  score: number;
  label: ProphecyLabel;
  emoji: string;
  desc: string;
} {
  const prophecyScore = (fundScore * 0.5) + (intelScore * 0.5);
  const fundGood  = fundScore  >= 55;
  const intelGood = intelScore >= 55;

  if (fundGood && intelGood)   return { score: prophecyScore, label: 'HOLD KERAS',        emoji: 'diamond', desc: 'Fundamental kuat, pelayanan lapangan oke. Ini yang lo cari.' };
  if (fundGood && !intelGood)  return { score: prophecyScore, label: 'POTENSI AKUISISI',  emoji: 'glass', desc: 'Harga murah, tapi ada yang bau. Siapa yang mau beli ini?' };
  if (!fundGood && intelGood)  return { score: prophecyScore, label: 'JEBAKAN BATMAN',    emoji: 'warning', desc: 'Pelayanan oke tapi valuasinya kemahalan. Hati-hati.' };
  return                              { score: prophecyScore, label: 'HINDARI TOTAL',      emoji: 'skull', desc: 'Fundamental buruk, lapangan amburadul. Ini saham apa tempat sampah?' };
}
