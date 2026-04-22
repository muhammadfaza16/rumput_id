"""
Rumput ID — Financial Ratios Scraper
Fetches PBV, PER, ROE, DER, EPS, NPL and other financial ratios from IDX.
"""
import json
import os
from idx_client import IDXClient
from config import ENDPOINTS, FINANCIAL_RATIO_PARAMS, DATA_DIR


def scrape_financial_ratios(client: IDXClient) -> list:
    """Fetch all financial ratio data (paginated)."""
    print("\n═══ Fetching Financial Ratios ═══")

    all_data = client.get_paginated(
        ENDPOINTS["financial_ratio"],
        base_params=FINANCIAL_RATIO_PARAMS,
        page_key="pageNumber",
    )

    print(f"  ✓ Fetched {len(all_data)} financial ratio records")
    return all_data


def transform_for_supabase(records: list) -> dict:
    """
    Transform financial ratio records into a ticker-keyed dict.
    Each value contains the fundamental fields we need for Prophecy Engine.
    """
    by_ticker = {}

    for record in records:
        ticker = record.get("KodeEmiten", "").strip()
        if not ticker:
            continue

        # Parse numeric fields safely
        def parse_num(val):
            if val is None or val == "" or val == "-":
                return None
            try:
                return float(str(val).replace(",", ""))
            except (ValueError, TypeError):
                return None

        row = {
            "ticker": ticker,
            "pbv": parse_num(record.get("PBV")),
            "per": parse_num(record.get("PER")),
            "roe": parse_num(record.get("ROE")),
            "der": parse_num(record.get("DER")),
            "eps": parse_num(record.get("EPS")),
            "npl": parse_num(record.get("NPL")),
            "bvps": parse_num(record.get("BV")),  # Book Value per Share
            "last_price": parse_num(record.get("LastPrice") or record.get("ClosePrice")),
            "market_cap": parse_num(record.get("MarketCap")),
            "nama": record.get("NamaEmiten", ""),
            "sektor": record.get("Sektor", ""),
        }

        by_ticker[ticker] = row

    print(f"  ✓ Transformed {len(by_ticker)} tickers with financial data")
    return by_ticker


def calc_fundamental_score(row: dict) -> int:
    """Calculate fundamental score (0-100) using Prophecy Engine formula."""
    score = 50  # baseline

    pbv = row.get("pbv")
    roe = row.get("roe")
    npl = row.get("npl")
    der = row.get("der")

    # PBV: lower is better (fair value ~1.0)
    if pbv is not None:
        if pbv < 0.5:      score += 25
        elif pbv < 1.0:    score += 15
        elif pbv < 1.5:    score += 5
        elif pbv > 5.0:    score -= 25
        elif pbv > 3.0:    score -= 15

    # ROE: higher is better (threshold 15%)
    if roe is not None:
        if roe > 20:       score += 20
        elif roe > 15:     score += 12
        elif roe > 10:     score += 5
        elif roe < 0:      score -= 25
        elif roe < 5:      score -= 10

    # NPL (banks only): lower is better (< 5% healthy)
    if npl is not None:
        if npl < 2:        score += 15
        elif npl < 5:      score += 5
        elif npl > 10:     score -= 20
        elif npl > 5:      score -= 10

    # DER: lower is better (< 1 ideal for non-banks)
    if der is not None and npl is None:  # skip DER for banks
        if der < 0.5:      score += 10
        elif der < 1.0:    score += 5
        elif der > 4.0:    score -= 20
        elif der > 2.0:    score -= 10

    return max(0, min(100, score))


def calc_prophecy_label(fund_score: int, intel_score: int = 50) -> tuple:
    """
    Calculate Prophecy label from scores.
    Returns (prophecy_score, label, emoji).
    """
    prophecy_score = (fund_score * 0.5) + (intel_score * 0.5)
    fund_good = fund_score >= 55
    intel_good = intel_score >= 55

    if fund_good and intel_good:
        return prophecy_score, "HOLD KERAS", "diamond"
    elif fund_good and not intel_good:
        return prophecy_score, "POTENSI AKUISISI", "glass"
    elif not fund_good and intel_good:
        return prophecy_score, "JEBAKAN BATMAN", "warning"
    else:
        return prophecy_score, "HINDARI TOTAL", "skull"


def enrich_with_scores(financials: dict) -> list:
    """Add fundamental_score and prophecy to each ticker."""
    rows = []
    for ticker, data in financials.items():
        fund_score = calc_fundamental_score(data)
        prophecy_score, prophecy_label, emoji = calc_prophecy_label(fund_score)

        data["fundamental_score"] = fund_score
        data["intel_score"] = 50  # default neutral until intel reports exist
        data["prophecy_score"] = prophecy_score
        data["prophecy_label"] = prophecy_label
        data["emoji"] = emoji
        rows.append(data)

    print(f"  ✓ Enriched {len(rows)} tickers with Prophecy scores")
    return rows


def run(client: IDXClient = None) -> list:
    """Main entry point. Returns enriched financial data."""
    own_client = client is None
    if own_client:
        client = IDXClient()

    try:
        raw = scrape_financial_ratios(client)
        if not raw:
            return []

        # Save raw
        raw_path = os.path.join(DATA_DIR, "financial_ratios_raw.json")
        with open(raw_path, "w", encoding="utf-8") as f:
            json.dump(raw, f, indent=2, ensure_ascii=False)

        financials = transform_for_supabase(raw)
        enriched = enrich_with_scores(financials)

        return enriched

    finally:
        if own_client:
            client.close()


if __name__ == "__main__":
    rows = run()
    output = os.path.join(DATA_DIR, "financials_enriched.json")
    with open(output, "w", encoding="utf-8") as f:
        json.dump(rows, f, indent=2, ensure_ascii=False)
    print(f"\n✓ Saved {len(rows)} enriched records to {output}")
