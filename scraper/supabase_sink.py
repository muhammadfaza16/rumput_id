"""
Rumput ID — Supabase Data Sink
Upserts scraped data into Supabase tables.
"""
import json
from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_SERVICE_KEY


def get_client() -> Client | None:
    """Create Supabase client. Returns None if not configured."""
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("  [WARN] Supabase not configured. Data will only be saved locally.")
        return None
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def upsert_emiten(client: Client, profiles: list, financials: list):
    """
    Merge profile + financial data and upsert into `emiten` table.
    Financial data takes precedence for overlapping fields.
    """
    if not client:
        print("  [SKIP] No Supabase client, skipping upsert.")
        return

    # Build financial lookup by ticker
    fin_by_ticker = {}
    for f in financials:
        fin_by_ticker[f["ticker"]] = f

    merged = []
    for profile in profiles:
        ticker = profile["ticker"]
        fin = fin_by_ticker.get(ticker, {})

        row = {
            "ticker": ticker,
            "nama": fin.get("nama") or profile.get("nama", ""),
            "sektor": fin.get("sektor") or profile.get("sektor", ""),
            "sub_sektor": profile.get("sub_sektor", ""),
            "alamat": profile.get("alamat", ""),
            "telepon": profile.get("telepon", ""),
            "website": profile.get("website", ""),
            "email": profile.get("email", ""),
            "tanggal_pencatatan": profile.get("tanggal_pencatatan", ""),
            "papan_pencatatan": profile.get("papan_pencatatan", ""),
            "shareholders": json.dumps(profile.get("shareholders", [])),
            "directors": json.dumps(profile.get("directors", [])),
            "commissioners": json.dumps(profile.get("commissioners", [])),
            "pbv": fin.get("pbv"),
            "per": fin.get("per"),
            "roe": fin.get("roe"),
            "der": fin.get("der"),
            "eps": fin.get("eps"),
            "npl": fin.get("npl"),
            "bvps": fin.get("bvps"),
            "last_price": fin.get("last_price"),
            "market_cap": fin.get("market_cap"),
            "fundamental_score": fin.get("fundamental_score"),
            "intel_score": fin.get("intel_score", 50),
            "prophecy_score": fin.get("prophecy_score"),
            "prophecy_label": fin.get("prophecy_label"),
            "emoji": fin.get("emoji", ""),
            "is_active": True,
            "data_source": "idx_scraper",
        }
        merged.append(row)

    # Also add any financials-only tickers not in profiles
    profile_tickers = {p["ticker"] for p in profiles}
    for ticker, fin in fin_by_ticker.items():
        if ticker not in profile_tickers:
            merged.append({
                "ticker": ticker,
                "nama": fin.get("nama", ""),
                "sektor": fin.get("sektor", ""),
                "pbv": fin.get("pbv"),
                "per": fin.get("per"),
                "roe": fin.get("roe"),
                "der": fin.get("der"),
                "eps": fin.get("eps"),
                "npl": fin.get("npl"),
                "last_price": fin.get("last_price"),
                "market_cap": fin.get("market_cap"),
                "fundamental_score": fin.get("fundamental_score"),
                "intel_score": fin.get("intel_score", 50),
                "prophecy_score": fin.get("prophecy_score"),
                "prophecy_label": fin.get("prophecy_label"),
                "emoji": fin.get("emoji", ""),
                "is_active": True,
                "data_source": "idx_scraper",
            })

    print(f"\n═══ Upserting {len(merged)} emiten to Supabase ═══")

    # Upsert in batches of 100
    batch_size = 100
    for i in range(0, len(merged), batch_size):
        batch = merged[i:i + batch_size]
        try:
            result = client.table("emiten").upsert(
                batch,
                on_conflict="ticker"
            ).execute()
            print(f"  Batch {i // batch_size + 1}: upserted {len(batch)} rows")
        except Exception as e:
            print(f"  [ERROR] Batch {i // batch_size + 1}: {e}")

    print(f"  ✓ Upsert complete")


def upsert_indices(client: Client, indices: list):
    """Upsert index summary data."""
    if not client or not indices:
        return

    print(f"\n═══ Upserting {len(indices)} indices to Supabase ═══")
    try:
        result = client.table("market_indices").upsert(
            indices,
            on_conflict="index_code"
        ).execute()
        print(f"  ✓ Upserted {len(indices)} indices")
    except Exception as e:
        print(f"  [ERROR] Index upsert: {e}")
