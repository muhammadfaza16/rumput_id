import { NextResponse } from 'next/server';
import { syncEmitenData } from '@/lib/sectors-api/sync';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // Check for authorization header (simple secret key for cron)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not configured' }, { status: 500 });
    }

    // Get all active emiten
    const { data: emitenList, error } = await supabase
      .from('emiten')
      .select('ticker')
      .eq('is_active', true);

    if (error || !emitenList) {
      return NextResponse.json({ error: 'Failed to fetch emiten list' }, { status: 500 });
    }

    const results = [];
    
    // Sync sequentially to avoid rate limits (or use Promise.all if allowed)
    for (const emiten of emitenList) {
      const success = await syncEmitenData(emiten.ticker);
      results.push({ ticker: emiten.ticker, success });
      
      // Delay to respect API rate limits (e.g. 500ms)
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return NextResponse.json({
      message: 'Sync completed',
      results
    });

  } catch (error) {
    console.error('API Sync Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
