"""
Rumput ID — IDX HTTP Client
Anti-block HTTP client using curl_cffi with Chrome impersonation.
"""
import time
import json
from curl_cffi import requests
from config import IDX_HEADERS, REQUEST_DELAY, ERROR_SLEEP, RATE_LIMIT_SLEEP, REQUEST_TIMEOUT


class IDXClient:
    """HTTP client for IDX internal endpoints with anti-block measures."""

    def __init__(self):
        self.session = requests.Session(impersonate="chrome")
        self.request_count = 0

    def get(self, url: str, params: dict = None, retries: int = 3) -> dict | None:
        """
        Fetch JSON from IDX endpoint with retry logic.
        Returns parsed JSON dict or None on failure.
        """
        for attempt in range(1, retries + 1):
            try:
                print(f"  [GET] {url.split('/primary/')[-1][:60]}... (attempt {attempt})")

                response = self.session.get(
                    url,
                    params=params,
                    headers=IDX_HEADERS,
                    timeout=REQUEST_TIMEOUT,
                )

                status = response.status_code
                self.request_count += 1

                if status == 200:
                    try:
                        data = response.json()
                        time.sleep(REQUEST_DELAY)
                        return data
                    except json.JSONDecodeError:
                        print(f"  [WARN] Status 200 but invalid JSON. Snippet: {response.text[:200]}")
                        return None

                elif status == 429:
                    print(f"  [RATE LIMITED] Sleeping {RATE_LIMIT_SLEEP}s...")
                    time.sleep(RATE_LIMIT_SLEEP)
                    continue

                elif status == 403:
                    print(f"  [BLOCKED] 403 Forbidden. Sleeping {ERROR_SLEEP}s...")
                    time.sleep(ERROR_SLEEP)
                    continue

                else:
                    print(f"  [ERROR] Status {status}. Snippet: {response.text[:200]}")
                    if attempt < retries:
                        time.sleep(ERROR_SLEEP)
                    continue

            except Exception as e:
                print(f"  [EXCEPTION] {type(e).__name__}: {e}")
                if attempt < retries:
                    time.sleep(ERROR_SLEEP)
                continue

        print(f"  [FAIL] All {retries} attempts failed.")
        return None

    def get_paginated(self, url: str, base_params: dict, page_key: str = "pageNumber") -> list:
        """
        Fetch all pages from a paginated IDX endpoint.
        Returns combined list of all records.
        """
        all_data = []
        page = 1

        while True:
            params = {**base_params, page_key: page}
            data = self.get(url, params=params)

            if not data or not data.get("data") or len(data["data"]) == 0:
                break

            records = data["data"]
            all_data.extend(records)
            print(f"  Page {page}: {len(records)} records (total: {len(all_data)})")
            page += 1

        return all_data

    def close(self):
        """Close the session."""
        self.session.close()
        print(f"\n  Session closed. Total requests: {self.request_count}")
