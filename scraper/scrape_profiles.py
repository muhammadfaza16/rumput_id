"""
Rumput ID — Company Profiles Scraper
Fetches all listed companies + detailed profiles (shareholders, board members).
"""
import json
import os
import time
from idx_client import IDXClient
from config import ENDPOINTS, DATA_DIR, REQUEST_DELAY


def scrape_company_list(client: IDXClient) -> list:
    """Fetch list of all listed companies on IDX."""
    print("\n═══ STEP 1: Fetching all listed companies ═══")
    data = client.get(ENDPOINTS["company_list"], params={"start": 0, "length": 9999})

    if not data or "data" not in data:
        print("  [FAIL] Could not fetch company list")
        return []

    companies = data["data"]
    total = data.get("recordsTotal", len(companies))
    print(f"  ✓ Found {total} listed companies")
    return companies


def scrape_company_details(client: IDXClient, companies: list, existing: dict) -> dict:
    """Fetch detailed profile for each company (incremental)."""
    print(f"\n═══ STEP 2: Fetching company details ({len(companies)} total) ═══")
    details = dict(existing)  # start with existing data
    new_count = 0

    for i, company in enumerate(companies):
        ticker = company.get("KodeEmiten", "")
        name = company.get("NamaEmiten", "N/A")

        if not ticker:
            continue

        if ticker in details:
            continue  # already scraped

        print(f"  [{i+1}/{len(companies)}] {ticker} ({name})")
        detail = client.get(
            ENDPOINTS["company_detail"],
            params={"KodeEmiten": ticker, "language": "id-id"}
        )

        if detail:
            details[ticker] = detail
            new_count += 1

            # Save incrementally every 50 companies
            if new_count % 50 == 0:
                _save_details(details)
                print(f"  [CHECKPOINT] Saved {len(details)} company details")
        else:
            print(f"  [SKIP] Failed to fetch {ticker}, continuing...")
            time.sleep(REQUEST_DELAY * 2)

    return details


def _save_details(details: dict):
    """Save company details to local JSON."""
    path = os.path.join(DATA_DIR, "company_details.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(details, f, indent=2, ensure_ascii=False)


def transform_for_supabase(companies: list, details: dict) -> list:
    """
    Transform raw IDX data into Supabase-ready rows for the `emiten` table.
    """
    rows = []
    for company in companies:
        ticker = company.get("KodeEmiten", "")
        if not ticker:
            continue

        detail = details.get(ticker, {})

        # Extract shareholders from detail
        shareholders = []
        for sh in detail.get("Shareholders", []):
            shareholders.append({
                "name": sh.get("ShareholderName", ""),
                "pct": sh.get("ShareholderPercentage", 0),
                "shares": sh.get("ShareholderShares", 0),
            })

        # Extract board members
        directors = []
        for d in detail.get("Directors", []):
            directors.append({
                "name": d.get("DirectorName", ""),
                "position": d.get("DirectorPosition", ""),
            })

        commissioners = []
        for c in detail.get("Commissioners", []):
            commissioners.append({
                "name": c.get("CommissionerName", ""),
                "position": c.get("CommissionerPosition", ""),
            })

        row = {
            "ticker": ticker,
            "nama": company.get("NamaEmiten", ""),
            "sektor": company.get("Sektor", detail.get("Sektor", "")),
            "sub_sektor": company.get("SubSektor", detail.get("SubSektor", "")),
            "alamat": detail.get("Alamat", ""),
            "telepon": detail.get("Telepon", ""),
            "website": detail.get("Website", ""),
            "email": detail.get("Email", ""),
            "tanggal_pencatatan": company.get("TanggalPencatatan", ""),
            "papan_pencatatan": company.get("PapanPencatatan", ""),
            "shareholders": shareholders,
            "directors": directors,
            "commissioners": commissioners,
            "is_active": True,
            "data_source": "idx_scraper",
        }
        rows.append(row)

    print(f"  ✓ Transformed {len(rows)} companies for Supabase")
    return rows


def run(client: IDXClient = None) -> list:
    """Main entry point. Returns Supabase-ready rows."""
    own_client = client is None
    if own_client:
        client = IDXClient()

    try:
        companies = scrape_company_list(client)
        if not companies:
            return []

        # Save company list
        list_path = os.path.join(DATA_DIR, "company_list.json")
        with open(list_path, "w", encoding="utf-8") as f:
            json.dump(companies, f, indent=2, ensure_ascii=False)

        # Load existing details (incremental)
        details_path = os.path.join(DATA_DIR, "company_details.json")
        existing = {}
        if os.path.exists(details_path):
            with open(details_path, "r", encoding="utf-8") as f:
                existing = json.load(f)
            print(f"  Loaded {len(existing)} existing company details")

        details = scrape_company_details(client, companies, existing)
        _save_details(details)

        return transform_for_supabase(companies, details)

    finally:
        if own_client:
            client.close()


if __name__ == "__main__":
    rows = run()
    # Save transformed output
    output = os.path.join(DATA_DIR, "emiten_transformed.json")
    with open(output, "w", encoding="utf-8") as f:
        json.dump(rows, f, indent=2, ensure_ascii=False)
    print(f"\n✓ Saved {len(rows)} emiten to {output}")
