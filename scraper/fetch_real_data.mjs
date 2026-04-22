/**
 * Rumput ID — Quick IDX Data Fetcher (Node.js)
 * Fetches real financial data from IDX and writes it to mock.ts
 * Run: node scraper/fetch_real_data.mjs
 */
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const IDX_BASE = "https://www.idx.co.id/primary";

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "Referer": "https://www.idx.co.id/id/data-pasar/laporan-statistik/digital-statistic/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`Failed to parse JSON from ${url}: ${data.substring(0, 200)}`)); }
      });
    }).on('error', reject);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log("═══ RUMPUT ID — Fetching Real IDX Data ═══\n");

  // 1. Fetch financial ratios (the big one)
  console.log("Step 1: Fetching financial ratios...");
  let allFinancials = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `${IDX_BASE}/DigitalStatistic/GetApiDataPaginated?urlName=LINK_FINANCIAL_DATA_RATIO&periodQuarter=4&periodYear=2024&type=yearly&isPrint=false&cumulative=false&pageSize=100&pageNumber=${page}&orderBy=&search=`;
    try {
      console.log(`  Page ${page}...`);
      const data = await fetchJSON(url);
      if (data && data.data && data.data.length > 0) {
        allFinancials.push(...data.data);
        console.log(`  Got ${data.data.length} records (total: ${allFinancials.length})`);
        page++;
        await sleep(1500);
      } else {
        hasMore = false;
      }
    } catch (e) {
      console.log(`  Error on page ${page}: ${e.message}`);
      hasMore = false;
    }
  }

  console.log(`\n✓ Total financial records: ${allFinancials.length}`);

  // 2. Fetch company list
  console.log("\nStep 2: Fetching company list...");
  let companies = [];
  try {
    const url = `${IDX_BASE}/ListedCompany/GetCompanyProfiles?start=0&length=9999`;
    const data = await fetchJSON(url);
    if (data && data.data) {
      companies = data.data;
      console.log(`✓ Got ${companies.length} companies`);
    }
  } catch (e) {
    console.log(`  Error: ${e.message}`);
  }

  // 3. Fetch index summary
  console.log("\nStep 3: Fetching index summary...");
  let indices = [];
  try {
    const url = `${IDX_BASE}/TradingSummary/GetIndexSummary?length=9999&start=0`;
    const data = await fetchJSON(url);
    if (data && data.data) {
      indices = data.data;
      console.log(`✓ Got ${indices.length} indices`);
    }
  } catch (e) {
    console.log(`  Error: ${e.message}`);
  }

  // Save raw data
  const dataDir = path.join(__dirname, 'data');
  fs.mkdirSync(dataDir, { recursive: true });

  fs.writeFileSync(path.join(dataDir, 'financials_raw.json'), JSON.stringify(allFinancials, null, 2));
  fs.writeFileSync(path.join(dataDir, 'companies_raw.json'), JSON.stringify(companies, null, 2));
  fs.writeFileSync(path.join(dataDir, 'indices_raw.json'), JSON.stringify(indices, null, 2));

  console.log(`\n✓ Raw data saved to scraper/data/`);

  // 4. Transform into mock.ts format
  console.log("\nStep 4: Transforming data...");

  // Build financial lookup
  const finByTicker = {};
  for (const f of allFinancials) {
    const ticker = (f.KodeEmiten || '').trim();
    if (!ticker) continue;

    const parse = (v) => {
      if (v == null || v === '' || v === '-') return null;
      const n = parseFloat(String(v).replace(/,/g, ''));
      return isNaN(n) ? null : n;
    };

    finByTicker[ticker] = {
      ticker,
      nama: f.NamaEmiten || '',
      sektor: f.Sektor || '',
      pbv: parse(f.PBV),
      per: parse(f.PER),
      roe: parse(f.ROE),
      der: parse(f.DER),
      eps: parse(f.EPS),
      npl: parse(f.NPL),
      bvps: parse(f.BV),
      last_price: parse(f.LastPrice) || parse(f.ClosePrice),
      market_cap: parse(f.MarketCap),
    };
  }

  // Build company lookup
  const compByTicker = {};
  for (const c of companies) {
    const ticker = (c.KodeEmiten || '').trim();
    if (!ticker) continue;
    compByTicker[ticker] = {
      sektor: c.Sektor || '',
      sub_sektor: c.SubSektor || '',
      tanggal_pencatatan: c.TanggalPencatatan || '',
      papan_pencatatan: c.PapanPencatatan || '',
    };
  }

  // Calc fundamental score
  function calcFundScore(e) {
    let score = 50;
    if (e.pbv != null) {
      if (e.pbv < 0.5) score += 25;
      else if (e.pbv < 1.0) score += 15;
      else if (e.pbv < 1.5) score += 5;
      else if (e.pbv > 5.0) score -= 25;
      else if (e.pbv > 3.0) score -= 15;
    }
    if (e.roe != null) {
      if (e.roe > 20) score += 20;
      else if (e.roe > 15) score += 12;
      else if (e.roe > 10) score += 5;
      else if (e.roe < 0) score -= 25;
      else if (e.roe < 5) score -= 10;
    }
    if (e.npl != null) {
      if (e.npl < 2) score += 15;
      else if (e.npl < 5) score += 5;
      else if (e.npl > 10) score -= 20;
      else if (e.npl > 5) score -= 10;
    }
    if (e.der != null && e.npl == null) {
      if (e.der < 0.5) score += 10;
      else if (e.der < 1.0) score += 5;
      else if (e.der > 4.0) score -= 20;
      else if (e.der > 2.0) score -= 10;
    }
    return Math.max(0, Math.min(100, score));
  }

  function calcProphecy(fundScore, intelScore = 50) {
    const ps = (fundScore * 0.5) + (intelScore * 0.5);
    const fg = fundScore >= 55;
    const ig = intelScore >= 55;
    if (fg && ig) return { score: ps, label: "HOLD KERAS", emoji: "diamond" };
    if (fg && !ig) return { score: ps, label: "POTENSI AKUISISI", emoji: "glass" };
    if (!fg && ig) return { score: ps, label: "JEBAKAN BATMAN", emoji: "warning" };
    return { score: ps, label: "HINDARI TOTAL", emoji: "skull" };
  }

  // Merge and enrich
  const allEmiten = [];
  const tickers = new Set([...Object.keys(finByTicker), ...Object.keys(compByTicker)]);

  for (const ticker of tickers) {
    const fin = finByTicker[ticker] || {};
    const comp = compByTicker[ticker] || {};

    const merged = {
      ticker,
      nama: fin.nama || '',
      sektor: fin.sektor || comp.sektor || '',
      sub_sektor: comp.sub_sektor || '',
      pbv: fin.pbv,
      per: fin.per,
      roe: fin.roe,
      der: fin.der,
      eps: fin.eps,
      npl: fin.npl,
      bvps: fin.bvps,
      last_price: fin.last_price,
      market_cap: fin.market_cap,
      shareholders: [],
      directors: [],
      commissioners: [],
    };

    const fundScore = calcFundScore(merged);
    const { score, label, emoji } = calcProphecy(fundScore);

    merged.fundamental_score = fundScore;
    merged.intel_score = 50;
    merged.prophecy_score = score;
    merged.prophecy_label = label;
    merged.emoji = emoji;

    allEmiten.push(merged);
  }

  // Sort by prophecy score desc
  allEmiten.sort((a, b) => (b.prophecy_score || 0) - (a.prophecy_score || 0));

  console.log(`✓ Transformed ${allEmiten.length} emiten with Prophecy scores`);

  // Transform indices
  const transformedIndices = indices.slice(0, 20).map(idx => ({
    index_code: (idx.StockCode || '').trim(),
    index_name: (idx.StockName || '').trim(),
    close_price: parseFloat(idx.Close) || null,
    change: parseFloat(idx.Change) || null,
    change_pct: parseFloat(idx.PerChange) || null,
  }));

  // Save transformed
  fs.writeFileSync(path.join(dataDir, 'emiten_transformed.json'), JSON.stringify(allEmiten, null, 2));
  fs.writeFileSync(path.join(dataDir, 'indices_transformed.json'), JSON.stringify(transformedIndices, null, 2));

  console.log(`\n═══ SUMMARY ═══`);
  console.log(`Emiten: ${allEmiten.length}`);
  console.log(`Indices: ${transformedIndices.length}`);
  console.log(`HOLD KERAS: ${allEmiten.filter(e => e.prophecy_label === 'HOLD KERAS').length}`);
  console.log(`POTENSI AKUISISI: ${allEmiten.filter(e => e.prophecy_label === 'POTENSI AKUISISI').length}`);
  console.log(`JEBAKAN BATMAN: ${allEmiten.filter(e => e.prophecy_label === 'JEBAKAN BATMAN').length}`);
  console.log(`HINDARI TOTAL: ${allEmiten.filter(e => e.prophecy_label === 'HINDARI TOTAL').length}`);
  console.log(`\nDone! Run: node scraper/generate_mock.mjs to update mock.ts`);
}

main().catch(e => { console.error(e); process.exit(1); });
