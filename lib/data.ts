import { createClient } from './supabase/server';
import { MOCK_EMITEN, MOCK_INTEL, MOCK_INDICES } from '@/data/mock';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'local_db.json');

async function getLocalDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return { emiten: MOCK_EMITEN, intel: MOCK_INTEL, indices: MOCK_INDICES };
  }
}

export async function saveIntelLocal(intelData: any) {
  const db = await getLocalDB();
  db.intel.unshift(intelData);
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  } catch (e) {
    console.log("Read-only filesystem, data won't persist");
  }
}

export async function getEmitenList() {
  const supabase = await createClient();
  
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('emiten')
        .select('*')
        .eq('is_active', true)
        .order('prophecy_score', { ascending: false });
      if (!error && data && data.length > 0) {
        // Parse JSONB fields if they're strings
        return data.map((e: any) => ({
          ...e,
          shareholders: typeof e.shareholders === 'string' ? JSON.parse(e.shareholders) : (e.shareholders || []),
          directors: typeof e.directors === 'string' ? JSON.parse(e.directors) : (e.directors || []),
          commissioners: typeof e.commissioners === 'string' ? JSON.parse(e.commissioners) : (e.commissioners || []),
        }));
      }
    } catch (e) {
      console.log("Supabase fetch error, falling back to local");
    }
  }
  
  const db = await getLocalDB();
  return db.emiten;
}

export async function getEmiten(ticker: string) {
  const supabase = await createClient();
  
  if (supabase) {
    try {
      const { data, error } = await supabase.from('emiten').select('*').eq('ticker', ticker).single();
      if (!error && data) {
        return {
          ...data,
          shareholders: typeof data.shareholders === 'string' ? JSON.parse(data.shareholders) : (data.shareholders || []),
          directors: typeof data.directors === 'string' ? JSON.parse(data.directors) : (data.directors || []),
          commissioners: typeof data.commissioners === 'string' ? JSON.parse(data.commissioners) : (data.commissioners || []),
        };
      }
    } catch (e) { /* fallback */ }
  }
  
  const db = await getLocalDB();
  return db.emiten.find((e: any) => e.ticker === ticker) || null;
}

export async function getIntelReports(ticker?: string) {
  const supabase = await createClient();
  
  if (supabase) {
    try {
      let query = supabase.from('intel_reports').select('*').order('created_at', { ascending: false });
      if (ticker) {
        query = query.eq('emiten_ticker', ticker);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) { /* fallback */ }
  }
  
  const db = await getLocalDB();
  if (ticker) {
    return db.intel.filter((i: any) => i.ticker === ticker);
  }
  return db.intel;
}

export async function getMarketIndices() {
  const supabase = await createClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('market_indices')
        .select('*')
        .order('index_code');
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) { /* fallback */ }
  }

  const db = await getLocalDB();
  return db.indices || MOCK_INDICES;
}

export async function getSektorSummary() {
  const emitenList = await getEmitenList();
  
  // Group by sektor
  const sektorMap: Record<string, any[]> = {};
  for (const e of emitenList) {
    const sektor = e.sektor || "Lainnya";
    if (!sektorMap[sektor]) sektorMap[sektor] = [];
    sektorMap[sektor].push(e);
  }

  // Calculate summary per sektor
  return Object.entries(sektorMap).map(([sektor, list]) => {
    const avgPbv = list.filter((e: any) => e.pbv != null).reduce((s: number, e: any) => s + e.pbv, 0) / (list.filter((e: any) => e.pbv != null).length || 1);
    const avgRoe = list.filter((e: any) => e.roe != null).reduce((s: number, e: any) => s + e.roe, 0) / (list.filter((e: any) => e.roe != null).length || 1);

    const holdCount = list.filter((e: any) => e.prophecy_label === "HOLD KERAS").length;
    const akuisisiCount = list.filter((e: any) => e.prophecy_label === "POTENSI AKUISISI").length;
    const jebakanCount = list.filter((e: any) => e.prophecy_label === "JEBAKAN BATMAN").length;
    const hindariCount = list.filter((e: any) => e.prophecy_label === "HINDARI TOTAL").length;

    return {
      sektor,
      count: list.length,
      avgPbv: Math.round(avgPbv * 100) / 100,
      avgRoe: Math.round(avgRoe * 100) / 100,
      holdCount,
      akuisisiCount,
      jebakanCount,
      hindariCount,
      topEmiten: list.sort((a: any, b: any) => (b.prophecy_score || 0) - (a.prophecy_score || 0)).slice(0, 3),
    };
  }).sort((a, b) => b.count - a.count);
}
