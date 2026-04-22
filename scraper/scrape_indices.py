"""
Rumput ID — Index Summary Scraper
Fetches IHSG, LQ45, IDX30, and other index data for the ticker tape.
"""
import json
import os
from idx_client import IDXClient
from config import ENDPOINTS, DATA_DIR


def scrape_index_summary(client: IDXClient) -> list:
    """Fetch all index summary data."""
    print("\n═══ Fetching Index Summary ═══")
    data = client.get(
        ENDPOINTS["index_summary"],
        params={"length": 9999, "start": 0}
    )

    if not data or "data" not in data:
        print("  [FAIL] Could not fetch index summary")
        return []

    indices = data["data"]
    print(f"  ✓ Fetched {len(indices)} indices")
    return indices


def transform_for_supabase(indices: list) -> list:
    """Transform index data for Supabase `market_indices` table."""
    rows = []

    for idx in indices:
        def parse_num(val):
            if val is None or val == "" or val == "-":
                return None
            try:
                return float(str(val).replace(",", ""))
            except (ValueError, TypeError):
                return None

        row = {
            "index_code": idx.get("StockCode", "").strip(),
            "index_name": idx.get("StockName", "").strip(),
            "prev_close": parse_num(idx.get("Previous")),
            "open_price": parse_num(idx.get("OpenPrice")),
            "high_price": parse_num(idx.get("High")),
            "low_price": parse_num(idx.get("Low")),
            "close_price": parse_num(idx.get("Close")),
            "change": parse_num(idx.get("Change")),
            "change_pct": parse_num(idx.get("PerChange")),
            "volume": parse_num(idx.get("Volume")),
            "value": parse_num(idx.get("Value")),
            "frequency": parse_num(idx.get("Freq")),
        }
        rows.append(row)

    print(f"  ✓ Transformed {len(rows)} indices")
    return rows


def run(client: IDXClient = None) -> list:
    """Main entry point."""
    own_client = client is None
    if own_client:
        client = IDXClient()

    try:
        raw = scrape_index_summary(client)
        if not raw:
            return []

        rows = transform_for_supabase(raw)

        # Save locally
        output = os.path.join(DATA_DIR, "index_summary.json")
        with open(output, "w", encoding="utf-8") as f:
            json.dump(rows, f, indent=2, ensure_ascii=False)

        return rows

    finally:
        if own_client:
            client.close()


if __name__ == "__main__":
    rows = run()
    print(f"\n✓ Saved {len(rows)} indices")
