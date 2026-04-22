-- ═══════════════════════════════════════════════════════════════════
-- RUMPUT ID — Full Database Schema v2.0
-- Run this in Supabase SQL Editor to set up all tables.
-- ═══════════════════════════════════════════════════════════════════

-- Table 1: emiten (company data + financial ratios + prophecy scores)
CREATE TABLE IF NOT EXISTS emiten (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticker            VARCHAR(10) UNIQUE NOT NULL,
  nama              TEXT NOT NULL DEFAULT '',
  sektor            TEXT NOT NULL DEFAULT '',
  sub_sektor        TEXT DEFAULT '',
  alamat            TEXT DEFAULT '',
  telepon           TEXT DEFAULT '',
  website           TEXT DEFAULT '',
  email             TEXT DEFAULT '',
  tanggal_pencatatan TEXT DEFAULT '',
  papan_pencatatan  TEXT DEFAULT '',

  -- Ownership & Board (JSONB arrays)
  shareholders      JSONB DEFAULT '[]'::jsonb,
  directors         JSONB DEFAULT '[]'::jsonb,
  commissioners     JSONB DEFAULT '[]'::jsonb,

  -- Financial Ratios (from IDX scraper)
  pbv               DECIMAL(10,4),
  per               DECIMAL(10,4),
  roe               DECIMAL(10,4),
  der               DECIMAL(10,4),
  eps               DECIMAL(12,2),
  npl               DECIMAL(10,4),
  bvps              DECIMAL(12,2),
  last_price        INTEGER,
  market_cap        BIGINT,

  -- Prophecy Engine Scores
  fundamental_score DECIMAL(5,2) DEFAULT 50,
  intel_score       DECIMAL(5,2) DEFAULT 50,
  prophecy_score    DECIMAL(5,2) DEFAULT 50,
  prophecy_label    TEXT DEFAULT 'POTENSI AKUISISI',
  emoji             TEXT DEFAULT 'glass',

  -- Metadata
  is_active         BOOLEAN DEFAULT true,
  data_source       TEXT DEFAULT 'mock',
  data_updated      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 2: intel_reports (crowdsourced field reports)
CREATE TABLE IF NOT EXISTS intel_reports (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  emiten_ticker     VARCHAR(10) NOT NULL,
  session_id        TEXT NOT NULL DEFAULT 'anonymous',
  nickname          TEXT DEFAULT 'Analis Anonim',
  lokasi            TEXT DEFAULT '',
  kota              TEXT DEFAULT '',
  kategori          TEXT NOT NULL DEFAULT 'Umum',
  rating            SMALLINT CHECK (rating BETWEEN 1 AND 5) DEFAULT 3,
  catatan           TEXT DEFAULT '',
  waktu             TEXT DEFAULT '',
  is_flagged        BOOLEAN DEFAULT false,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 3: market_indices (IHSG, LQ45, IDX30, etc.)
CREATE TABLE IF NOT EXISTS market_indices (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  index_code        VARCHAR(20) UNIQUE NOT NULL,
  index_name        TEXT DEFAULT '',
  prev_close        DECIMAL(12,2),
  open_price        DECIMAL(12,2),
  high_price        DECIMAL(12,2),
  low_price         DECIMAL(12,2),
  close_price       DECIMAL(12,2),
  change            DECIMAL(12,2),
  change_pct        DECIMAL(8,4),
  volume            BIGINT,
  value             BIGINT,
  frequency         INTEGER,
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══ Indexes ═══
CREATE INDEX IF NOT EXISTS idx_emiten_sektor ON emiten(sektor);
CREATE INDEX IF NOT EXISTS idx_emiten_prophecy ON emiten(prophecy_score DESC);
CREATE INDEX IF NOT EXISTS idx_emiten_ticker ON emiten(ticker);
CREATE INDEX IF NOT EXISTS idx_intel_emiten ON intel_reports(emiten_ticker);
CREATE INDEX IF NOT EXISTS idx_intel_created ON intel_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_indices_code ON market_indices(index_code);

-- ═══ Row Level Security ═══
ALTER TABLE emiten ENABLE ROW LEVEL SECURITY;
ALTER TABLE intel_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_indices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read emiten" ON emiten FOR SELECT USING (true);
CREATE POLICY "Service write emiten" ON emiten FOR ALL USING (true);

CREATE POLICY "Public read intel" ON intel_reports FOR SELECT USING (is_flagged = false);
CREATE POLICY "Public insert intel" ON intel_reports FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read indices" ON market_indices FOR SELECT USING (true);
CREATE POLICY "Service write indices" ON market_indices FOR ALL USING (true);
