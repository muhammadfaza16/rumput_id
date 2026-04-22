"""
Rumput ID — Scraper Orchestrator
Runs all scrapers in sequence and pushes data to Supabase.
"""
import sys
import time
import json
import os
from datetime import datetime

from idx_client import IDXClient
from config import DATA_DIR
import scrape_profiles
import scrape_financials
import scrape_indices
import supabase_sink


def main():
    start = time.time()
    print("╔══════════════════════════════════════════════════╗")
    print("║  RUMPUT ID — IDX Data Pipeline                  ║")
    print(f"║  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}                        ║")
    print("╚══════════════════════════════════════════════════╝")

    client = IDXClient()

    try:
        # 1. Scrape financial ratios (fastest, most impactful)
        financials = scrape_financials.run(client)

        # 2. Scrape company profiles (slower due to per-company detail fetch)
        profiles = scrape_profiles.run(client)

        # 3. Scrape index summary (fast, single request)
        indices = scrape_indices.run(client)

        # 4. Push to Supabase
        sb = supabase_sink.get_client()
        if sb:
            supabase_sink.upsert_emiten(sb, profiles, financials)
            supabase_sink.upsert_indices(sb, indices)
        else:
            print("\n[INFO] Supabase not configured. Data saved to local JSON only.")

        # 5. Summary
        elapsed = time.time() - start
        print(f"\n{'═' * 52}")
        print(f"  Pipeline complete in {elapsed:.1f}s")
        print(f"  Financials: {len(financials)} records")
        print(f"  Profiles:   {len(profiles)} records")
        print(f"  Indices:    {len(indices)} records")
        print(f"  Supabase:   {'Connected' if sb else 'Local-only mode'}")
        print(f"{'═' * 52}")

    except KeyboardInterrupt:
        print("\n[INTERRUPTED] Scraper stopped by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n[FATAL] {type(e).__name__}: {e}")
        sys.exit(1)
    finally:
        client.close()


if __name__ == "__main__":
    main()
