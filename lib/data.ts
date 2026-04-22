import { createClient } from './supabase/server';
import { MOCK_EMITEN, MOCK_INTEL } from '@/data/mock';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'local_db.json');

async function getLocalDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    // Return mock data directly if file is missing (especially on Vercel)
    return { emiten: MOCK_EMITEN, intel: MOCK_INTEL };
  }
}

export async function saveIntelLocal(intelData: any) {
  const db = await getLocalDB();
  db.intel.unshift(intelData);
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  } catch (e) {
    console.log("Read-only filesystem detected, data won't persist on Vercel local_db.json");
  }
}

export async function getEmitenList() {
  const supabase = await createClient();
  
  if (supabase) {
    try {
      const { data, error } = await supabase.from('emiten').select('*');
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.log("Supabase fetch error, falling back to local JSON DB");
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
        return data;
      }
    } catch (e) {
      // fallback
    }
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
    } catch (e) {
      // fallback
    }
  }
  
  const db = await getLocalDB();
  if (ticker) {
    return db.intel.filter((i: any) => i.ticker === ticker);
  }
  return db.intel;
}
