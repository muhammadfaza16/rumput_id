import { sectorsApi } from './client';
import { createClient } from '../supabase/server';
import { calcFundamentalScore, calcProphecy, calcIntelScore } from '../prophecy/engine';

// Helper to extract nested values from Sectors.app response
function extractValue(data: any, path: string[]): number | null {
  let current = data;
  for (const key of path) {
    if (current === undefined || current === null) return null;
    current = current[key];
  }
  return typeof current === 'number' ? current : null;
}

export async function syncEmitenData(ticker: string) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      console.warn('Supabase client not initialized. Sync aborted.');
      return false;
    }

    // 1. Fetch data from Sectors API
    console.log(`Fetching data for ${ticker} from Sectors API...`);
    const reportData = await sectorsApi.getCompany(ticker);
    
    // Asumsi response structure berdasarkan API Sectors.app
    // Kita butuh PBV, ROE, NPL, DER
    // Struktur aktual bisa berbeda, ini adalah referensi kasar
    const pbv = extractValue(reportData, ['valuation', 'pbv']);
    const roe = extractValue(reportData, ['valuation', 'roe']);
    const npl = extractValue(reportData, ['overview', 'npl']); // Hanya untuk bank
    const der = extractValue(reportData, ['overview', 'der']);

    // 2. Kalkulasi Fundamental Score baru
    const fundamentalData = { pbv, roe, npl, der };
    const fundScore = calcFundamentalScore(fundamentalData);

    // 3. Ambil Intel Score saat ini dari database
    const { data: intelReports } = await supabase
      .from('intel_reports')
      .select('rating_overall, created_at')
      .eq('emiten_ticker', ticker)
      .order('created_at', { ascending: false })
      .limit(50);

    const intelScore = calcIntelScore(intelReports || []);

    // 4. Kalkulasi Prophecy Score akhir
    const prophecy = calcProphecy(fundScore, intelScore);

    // 5. Update tabel emiten
    const updateData = {
      pbv,
      roe,
      npl,
      der,
      fundamental_score: fundScore,
      intel_score: intelScore,
      prophecy_score: prophecy.score,
      prophecy_label: prophecy.label,
      data_updated: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('emiten')
      .update(updateData)
      .eq('ticker', ticker);

    if (error) {
      console.error(`Error updating Supabase for ${ticker}:`, error.message);
      return false;
    }

    console.log(`Successfully synced data for ${ticker}. Prophecy: ${prophecy.label}`);
    return true;
  } catch (error) {
    console.error(`Failed to sync data for ${ticker}:`, error);
    return false;
  }
}
