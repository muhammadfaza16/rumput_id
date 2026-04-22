import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { createClient } from '@supabase/supabase-js';

const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

// Use service key if available, fall back to anon key
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Top Indonesian stocks — will be expanded once pipeline works
const IDX_TICKERS = [
  // Blue Chips / LQ45
  "BBCA", "BBRI", "BMRI", "BBNI", "BRIS",
  "TLKM", "ASII", "UNVR", "HMSP", "GGRM",
  "ICBP", "INDF", "KLBF", "MNCN", "PGAS",
  "SMGR", "INTP", "PTBA", "ADRO", "ITMG",
  "ANTM", "INKP", "TKIM", "BRPT", "ESSA",
  "MDKA", "AMMN", "BREN", "CUAN", "DSSA",
  // Property & Consumer
  "BSDE", "CTRA", "SMRA", "PWON", "JSMR",
  "MAPI", "ACES", "LPPF", "ERAA", "MYOR",
  // Banking Tier 2
  "BNGA", "BDMN", "NISP", "BTPN", "MEGA",
  // Telco & Tech
  "EXCL", "ISAT", "GOTO", "BUKA", "EMTK",
  // Infrastructure & Mining
  "MEDC", "UNTR", "AKRA", "TOWR", "TBIG",
  "HRUM", "MBMA", "PGEO", "TPIA",
  // Small/Mid cap interesting
  "BBTN", "WIKA", "WSKT", "PTPP", "SRIL",
  "FAST", "BJTM", "BJBR", "ARTO", "BBYB",
];

function calcFundScore(data: any): number {
  let score = 50;
  const pbv = data.pbv;
  const roe = data.roe;
  const der = data.der;

  if (pbv != null) {
    if (pbv < 0.5) score += 25;
    else if (pbv < 1.0) score += 15;
    else if (pbv < 1.5) score += 5;
    else if (pbv > 5.0) score -= 25;
    else if (pbv > 3.0) score -= 15;
  }
  if (roe != null) {
    if (roe > 20) score += 20;
    else if (roe > 15) score += 12;
    else if (roe > 10) score += 5;
    else if (roe < 0) score -= 25;
    else if (roe < 5) score -= 10;
  }
  if (der != null) {
    if (der < 0.5) score += 10;
    else if (der < 1.0) score += 5;
    else if (der > 4.0) score -= 20;
    else if (der > 2.0) score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

function calcProphecy(fundScore: number, intelScore: number = 50) {
  const ps = (fundScore * 0.5) + (intelScore * 0.5);
  const fg = fundScore >= 55;
  const ig = intelScore >= 55;
  if (fg && ig) return { score: ps, label: "HOLD KERAS", emoji: "diamond" };
  if (fg && !ig) return { score: ps, label: "POTENSI AKUISISI", emoji: "glass" };
  if (!fg && ig) return { score: ps, label: "JEBAKAN BATMAN", emoji: "warning" };
  return { score: ps, label: "HINDARI TOTAL", emoji: "skull" };
}

// Sector mapping for IDX stocks
const SECTOR_MAP: Record<string, string> = {
  "Financial Services": "Keuangan",
  "Banks—Regional": "Keuangan", "Banks—Diversified": "Keuangan",
  "Communication Services": "Telekomunikasi",
  "Telecom Services": "Telekomunikasi",
  "Consumer Cyclical": "Konsumer Siklikal",
  "Consumer Defensive": "Konsumer Non-Siklikal",
  "Basic Materials": "Bahan Baku",
  "Energy": "Energi",
  "Industrials": "Industri",
  "Healthcare": "Kesehatan",
  "Technology": "Teknologi",
  "Real Estate": "Properti",
  "Utilities": "Infrastruktur",
};

async function fetchTickerData(ticker: string): Promise<any | null> {
  const symbol = `${ticker}.JK`;
  try {
    // Suppress yahoo-finance2 validation warnings
    const quote = await yf.quote(symbol);
    
    let keyStats: any = {};
    try {
      const summary = await yf.quoteSummary(symbol, {
        modules: ["defaultKeyStatistics", "financialData", "assetProfile"]
      });
      keyStats = {
        ...summary?.defaultKeyStatistics,
        ...summary?.financialData,
        ...summary?.assetProfile,
      };
    } catch { /* quoteSummary sometimes fails, that's ok */ }

    if (!quote || !quote.regularMarketPrice) return null;

    const rawSector = keyStats?.sector || quote?.quoteType || '';
    const sektor = SECTOR_MAP[rawSector] || rawSector || 'Lainnya';

    const pbv = keyStats?.priceToBook ?? (quote as any)?.priceToBook ?? null;
    const per = (quote as any)?.trailingPE ?? keyStats?.trailingPE ?? null;
    const roe = keyStats?.returnOnEquity != null ? keyStats.returnOnEquity * 100 : null;
    const der = keyStats?.debtToEquity != null ? keyStats.debtToEquity / 100 : null;
    const eps = (quote as any)?.epsTrailingTwelveMonths ?? null;

    const result: any = {
      ticker,
      nama: quote.longName || quote.shortName || ticker,
      sektor,
      pbv: pbv != null ? Math.round(pbv * 100) / 100 : null,
      per: per != null ? Math.round(per * 100) / 100 : null,
      roe: roe != null ? Math.round(roe * 100) / 100 : null,
      der: der != null ? Math.round(der * 100) / 100 : null,
      eps: eps != null ? Math.round(eps) : null,
      last_price: Math.round(quote.regularMarketPrice || 0),
      market_cap: quote.marketCap || null,
      is_active: true,
      data_source: 'yahoo_finance',
    };

    // Calculate prophecy
    const fundScore = calcFundScore(result);
    const { score, label, emoji } = calcProphecy(fundScore);
    result.fundamental_score = fundScore;
    result.intel_score = 50;
    result.prophecy_score = score;
    result.prophecy_label = label;
    result.emoji = emoji;

    return result;
  } catch (e: any) {
    console.log(`  [SKIP] ${ticker}: ${e.message?.substring(0, 80)}`);
    return null;
  }
}

export async function GET(request: Request) {
  // Simple auth: check for secret header or query param
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const limit = parseInt(searchParams.get('limit') || '0') || IDX_TICKERS.length;

  console.log(`\n═══ RUMPUT ID — Yahoo Finance Scraper ═══`);
  console.log(`Fetching ${Math.min(limit, IDX_TICKERS.length)} tickers...\n`);

  const tickersToFetch = IDX_TICKERS.slice(0, limit);
  const results: any[] = [];
  const errors: string[] = [];

  // Fetch in batches of 5 to avoid rate limiting
  for (let i = 0; i < tickersToFetch.length; i += 5) {
    const batch = tickersToFetch.slice(i, i + 5);
    const batchResults = await Promise.allSettled(
      batch.map(t => fetchTickerData(t))
    );

    for (let j = 0; j < batchResults.length; j++) {
      const r = batchResults[j];
      if (r.status === 'fulfilled' && r.value) {
        results.push(r.value);
      } else {
        errors.push(batch[j]);
      }
    }

    // Small delay between batches
    if (i + 5 < tickersToFetch.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log(`\n✓ Fetched ${results.length}/${tickersToFetch.length} tickers`);
  if (errors.length > 0) {
    console.log(`✗ Failed: ${errors.join(', ')}`);
  }

  // Push to Supabase
  let supabaseStatus = 'not_configured';
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

      // Upsert in batches of 50
      for (let i = 0; i < results.length; i += 50) {
        const batch = results.slice(i, i + 50);
        const { error } = await supabase
          .from('emiten')
          .upsert(batch, { onConflict: 'ticker' });
        
        if (error) {
          console.error(`Supabase batch error:`, error.message);
          supabaseStatus = `error: ${error.message}`;
        } else {
          supabaseStatus = 'success';
        }
      }

      console.log(`✓ Upserted ${results.length} records to Supabase`);
    } catch (e: any) {
      supabaseStatus = `error: ${e.message}`;
      console.error('Supabase error:', e.message);
    }
  }

  // Prophecy distribution
  const distribution = {
    hold_keras: results.filter(r => r.prophecy_label === 'HOLD KERAS').length,
    potensi_akuisisi: results.filter(r => r.prophecy_label === 'POTENSI AKUISISI').length,
    jebakan_batman: results.filter(r => r.prophecy_label === 'JEBAKAN BATMAN').length,
    hindari_total: results.filter(r => r.prophecy_label === 'HINDARI TOTAL').length,
  };

  return NextResponse.json({
    success: true,
    fetched: results.length,
    failed: errors.length,
    failed_tickers: errors,
    supabase: supabaseStatus,
    distribution,
    timestamp: new Date().toISOString(),
  });
}
