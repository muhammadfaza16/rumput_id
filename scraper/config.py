"""
Rumput ID — IDX Scraper Configuration
Centralized config for all scraper modules.
"""
import os
from dotenv import load_dotenv

load_dotenv()

# ─── IDX Endpoints ───────────────────────────────────────────────────────────
IDX_BASE = "https://www.idx.co.id/primary"

ENDPOINTS = {
    "company_list":    f"{IDX_BASE}/ListedCompany/GetCompanyProfiles",
    "company_detail":  f"{IDX_BASE}/ListedCompany/GetCompanyProfilesDetail",
    "financial_ratio": f"{IDX_BASE}/DigitalStatistic/GetApiDataPaginated",
    "index_summary":   f"{IDX_BASE}/TradingSummary/GetIndexSummary",
    "news":            f"{IDX_BASE}/home/content",
}

# ─── IDX Request Headers ─────────────────────────────────────────────────────
IDX_HEADERS = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "Referer": "https://www.idx.co.id/id/perusahaan-tercatat/profil-perusahaan/",
}

# ─── Rate Limiting ────────────────────────────────────────────────────────────
REQUEST_DELAY = 1.0        # seconds between successful requests
ERROR_SLEEP   = 60         # seconds to sleep on error (not 5 min like nichsedge; we're gentler)
RATE_LIMIT_SLEEP = 30      # seconds on 429
REQUEST_TIMEOUT  = 30      # seconds

# ─── Supabase ─────────────────────────────────────────────────────────────────
SUPABASE_URL = os.getenv("SUPABASE_URL", os.getenv("NEXT_PUBLIC_SUPABASE_URL", ""))
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

# ─── Financial Ratio Defaults ─────────────────────────────────────────────────
FINANCIAL_RATIO_PARAMS = {
    "urlName": "LINK_FINANCIAL_DATA_RATIO",
    "periodQuarter": 4,
    "periodYear": 2024,
    "type": "yearly",
    "isPrint": "false",
    "cumulative": "false",
    "pageSize": 100,
    "orderBy": "",
    "search": "",
}

# ─── Output Paths (for local JSON fallback) ───────────────────────────────────
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)
