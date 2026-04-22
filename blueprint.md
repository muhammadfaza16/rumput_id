# RUMPUT ID — Master Blueprint v1.0
> "Terminal Hedge Fund. Isi Laporan Warung."

---

## KEPUTUSAN FINAL (TIDAK BISA DIUBAH)

| Parameter | Keputusan |
|---|---|
| Nama | **Rumput ID** |
| Data Saham | **Sectors.app API** (IDX-native, fundamental clean) |
| Scope | **Semua sektor, 3 dikurasi serius** |
| Prophecy Weight | **50% Fundamental / 50% Intel** |
| Auth MVP | **Anonymous submit** (Google Auth di Phase 2) |
| Stack | Next.js 14 (App Router) + TypeScript + Supabase + Vanilla CSS |

---

## DESIGN SYSTEM

### Konsep Visual: "Classified Terminal"
Seperti Bloomberg Terminal yang bocor ke grup WhatsApp alumni SMA.
Data serius, konten konyol, kontras inilah yang viral.

### Color Palette
```css
:root {
  /* Base */
  --bg-primary:    #0A0A0F;   /* Near-black, bukan pure black */
  --bg-secondary:  #0F0F1A;   /* Panel background */
  --bg-tertiary:   #141428;   /* Card background */
  --bg-elevated:   #1A1A35;   /* Elevated card / modal */

  /* Border */
  --border-subtle:  rgba(255,255,255,0.06);
  --border-default: rgba(255,255,255,0.10);
  --border-accent:  rgba(0,255,136,0.30);

  /* Text */
  --text-primary:   #E8E8F0;
  --text-secondary: #8888AA;
  --text-muted:     #44445A;
  --text-inverse:   #0A0A0F;

  /* Accent — "Rumput" Green */
  --accent-primary:   #00FF88;  /* Neon green utama */
  --accent-dim:       #00CC6A;  /* Hover state */
  --accent-glow:      rgba(0,255,136,0.15);
  --accent-glow-hard: rgba(0,255,136,0.30);

  /* Semantic */
  --color-bull:    #00FF88;   /* Positif / naik */
  --color-bear:    #FF4466;   /* Negatif / turun */
  --color-neutral: #FFAA00;   /* Netral / warning */
  --color-muted:   #5566AA;   /* Belum ada data */

  /* Prophecy States */
  --prophecy-hold:     #00FF88;  /* HOLD KERAS */
  --prophecy-akuisisi: #FFAA00;  /* POTENSI AKUISISI */
  --prophecy-jebakan:  #FF4466;  /* JEBAKAN BATMAN */
  --prophecy-hindari:  #FF2244;  /* HINDARI TOTAL */
}
```

### Typography
```css
/* Display / Header: IBM Plex Mono — monospace terminal feel */
/* Body: DM Sans — readable, modern, tidak membosankan */
/* Data / Numbers: JetBrains Mono — perfect untuk angka finansial */

@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');

--font-display: 'IBM Plex Mono', monospace;
--font-body:    'DM Sans', sans-serif;
--font-data:    'JetBrains Mono', monospace;
```

### Spacing & Radius
```css
--radius-sm:  4px;
--radius-md:  8px;
--radius-lg:  12px;
--radius-xl:  16px;
--radius-pill: 999px;
```

### Signature Effects
```css
/* Terminal scanline overlay */
.scanlines::after {
  content: '';
  position: fixed; inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.03) 2px,
    rgba(0,0,0,0.03) 4px
  );
  pointer-events: none; z-index: 9999;
}

/* Green glow card */
.card-glow {
  box-shadow:
    0 0 0 1px var(--border-default),
    0 4px 24px rgba(0,0,0,0.4),
    inset 0 1px 0 rgba(255,255,255,0.05);
}
.card-glow:hover {
  box-shadow:
    0 0 0 1px var(--border-accent),
    0 8px 40px rgba(0,0,0,0.6),
    0 0 30px var(--accent-glow),
    inset 0 1px 0 rgba(255,255,255,0.08);
}

/* Ticker tape animation */
@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
```

---

## DATABASE SCHEMA (Supabase PostgreSQL)

### Table 1: `emiten`
```sql
CREATE TABLE emiten (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticker        VARCHAR(10) UNIQUE NOT NULL,  -- 'BBCA', 'TLKM'
  nama          TEXT NOT NULL,                 -- 'Bank Central Asia'
  sektor        TEXT NOT NULL,                 -- 'Perbankan'
  sub_sektor    TEXT,                          -- 'Bank Umum Swasta'
  logo_url      TEXT,
  deskripsi     TEXT,

  -- Cache dari Sectors.app API (refresh setiap 24 jam)
  pbv           DECIMAL(8,4),    -- Price-to-Book Value
  roe           DECIMAL(8,4),    -- Return on Equity (%)
  npl           DECIMAL(8,4),    -- Non-Performing Loan (khusus bank)
  der           DECIMAL(8,4),    -- Debt-to-Equity Ratio
  per           DECIMAL(8,4),    -- Price-to-Earnings Ratio
  market_cap    BIGINT,          -- dalam jutaan IDR
  last_price    INTEGER,         -- harga terakhir dalam IDR

  -- Computed scores (di-update setiap ada intel baru)
  fundamental_score  DECIMAL(5,2),  -- 0-100
  intel_score        DECIMAL(5,2),  -- 0-100
  prophecy_score     DECIMAL(5,2),  -- 0-100, average keduanya
  prophecy_label     TEXT,          -- 'HOLD KERAS' | 'POTENSI AKUISISI' | 'JEBAKAN' | 'HINDARI'

  -- Metadata
  is_active     BOOLEAN DEFAULT true,
  data_updated  TIMESTAMP WITH TIME ZONE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table 2: `intel_reports`
```sql
CREATE TABLE intel_reports (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  emiten_id       UUID REFERENCES emiten(id) ON DELETE CASCADE,
  emiten_ticker   VARCHAR(10) NOT NULL,  -- denormalized untuk query cepat

  -- Identity (anonymous-first)
  session_id      TEXT NOT NULL,   -- fingerprint browser, bukan user ID
  user_id         UUID,            -- nullable, diisi saat Phase 2 (Google Auth)
  nickname        TEXT DEFAULT 'Analis Anonim',

  -- The Intel
  lokasi          TEXT,            -- 'Cabang BCA Sudirman', 'KFC Pondok Indah'
  kota            TEXT,
  kategori_intel  TEXT NOT NULL,   -- 'Satpam', 'Tisu', 'Sabun', 'Parkir', dll

  -- Ratings (1-5)
  rating_keramahan    SMALLINT CHECK (rating_keramahan BETWEEN 1 AND 5),
  rating_kebersihan   SMALLINT CHECK (rating_kebersihan BETWEEN 1 AND 5),
  rating_kelengkapan  SMALLINT CHECK (rating_kelengkapan BETWEEN 1 AND 5),
  rating_overall      SMALLINT CHECK (rating_overall BETWEEN 1 AND 5) NOT NULL,

  catatan         TEXT,           -- free text, max 280 char
  foto_url        TEXT,           -- optional photo upload

  -- Gamification
  upvotes         INTEGER DEFAULT 0,
  is_verified     BOOLEAN DEFAULT false,  -- curated by admin

  -- Anti-spam
  ip_hash         TEXT,           -- hashed IP untuk rate limiting
  is_flagged      BOOLEAN DEFAULT false,

  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table 3: `sektor_config`
```sql
CREATE TABLE sektor_config (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_sektor     TEXT UNIQUE NOT NULL,   -- 'Perbankan'
  slug            TEXT UNIQUE NOT NULL,   -- 'perbankan'
  icon            TEXT,                   -- emoji atau icon name
  teori_name      TEXT,                   -- 'Teori Satpam'
  teori_desc      TEXT,                   -- deskripsi teori konyol
  kategori_intel  TEXT[],                 -- ['Satpam', 'Teller', 'ATM', 'Parkir']
  is_featured     BOOLEAN DEFAULT false,  -- 3 sektor dikurasi
  emiten_count    INTEGER DEFAULT 0,
  intel_count     INTEGER DEFAULT 0,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table 4: `upvotes` (anti-double-vote)
```sql
CREATE TABLE upvotes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id   UUID REFERENCES intel_reports(id) ON DELETE CASCADE,
  session_id  TEXT NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(report_id, session_id)
);
```

### Indexes Penting
```sql
CREATE INDEX idx_emiten_sektor ON emiten(sektor);
CREATE INDEX idx_emiten_prophecy ON emiten(prophecy_score DESC);
CREATE INDEX idx_intel_emiten ON intel_reports(emiten_ticker);
CREATE INDEX idx_intel_created ON intel_reports(created_at DESC);
CREATE INDEX idx_intel_session ON intel_reports(session_id);
```

### RLS Policies (Row Level Security)
```sql
-- Semua orang bisa READ emiten & sektor
ALTER TABLE emiten ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read emiten" ON emiten FOR SELECT USING (true);

-- Semua orang bisa READ intel (yang tidak di-flag)
ALTER TABLE intel_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read intel" ON intel_reports FOR SELECT USING (is_flagged = false);

-- Anonymous INSERT intel (rate limiting via aplikasi)
CREATE POLICY "Anonymous insert intel" ON intel_reports FOR INSERT WITH CHECK (true);
```

---

## THE PROPHECY ENGINE — Formula Final

### Step 1: Fundamental Score (0-100)
```typescript
function calcFundamentalScore(emiten: Emiten): number {
  let score = 50; // baseline

  // PBV: makin rendah makin bagus (nilai wajar = 1.0)
  if (emiten.pbv !== null) {
    if (emiten.pbv < 0.5)       score += 25;
    else if (emiten.pbv < 1.0)  score += 15;
    else if (emiten.pbv < 1.5)  score += 5;
    else if (emiten.pbv > 3.0)  score -= 15;
    else if (emiten.pbv > 5.0)  score -= 25;
  }

  // ROE: makin tinggi makin bagus (threshold: 15%)
  if (emiten.roe !== null) {
    if (emiten.roe > 20)        score += 20;
    else if (emiten.roe > 15)   score += 12;
    else if (emiten.roe > 10)   score += 5;
    else if (emiten.roe < 5)    score -= 10;
    else if (emiten.roe < 0)    score -= 25;
  }

  // NPL (khusus bank): makin rendah makin bagus (< 5% = sehat)
  if (emiten.npl !== null) {
    if (emiten.npl < 2)         score += 15;
    else if (emiten.npl < 5)    score += 5;
    else if (emiten.npl > 5)    score -= 10;
    else if (emiten.npl > 10)   score -= 20;
  }

  // DER: makin rendah makin bagus (< 1 = ideal untuk non-bank)
  if (emiten.der !== null && emiten.npl === null) {
    if (emiten.der < 0.5)       score += 10;
    else if (emiten.der < 1.0)  score += 5;
    else if (emiten.der > 2.0)  score -= 10;
    else if (emiten.der > 4.0)  score -= 20;
  }

  return Math.max(0, Math.min(100, score));
}
```

### Step 2: Intel Score (0-100)
```typescript
function calcIntelScore(reports: IntelReport[]): number {
  if (reports.length === 0) return 50; // default neutral jika belum ada intel

  const recentReports = reports
    .filter(r => /* dalam 90 hari terakhir */)
    .slice(0, 50); // max 50 laporan terbaru

  const avgOverall = recentReports.reduce((sum, r) => sum + r.rating_overall, 0)
    / recentReports.length;

  // Convert 1-5 scale ke 0-100
  return ((avgOverall - 1) / 4) * 100;
}
```

### Step 3: Prophecy Matrix (50/50)
```typescript
type ProphecyLabel = 'HOLD KERAS' | 'POTENSI AKUISISI' | 'JEBAKAN BATMAN' | 'HINDARI TOTAL';

function calcProphecy(fundScore: number, intelScore: number): {
  score: number;
  label: ProphecyLabel;
  emoji: string;
  desc: string;
} {
  const prophecyScore = (fundScore * 0.5) + (intelScore * 0.5);
  const fundGood  = fundScore  >= 55;
  const intelGood = intelScore >= 55;

  if (fundGood && intelGood)   return { score: prophecyScore, label: 'HOLD KERAS',        emoji: '💎', desc: 'Fundamental kuat, pelayanan lapangan oke. Ini yang lo cari.' };
  if (fundGood && !intelGood)  return { score: prophecyScore, label: 'POTENSI AKUISISI',  emoji: '🔍', desc: 'Harga murah, tapi ada yang bau. Siapa yang mau beli ini?' };
  if (!fundGood && intelGood)  return { score: prophecyScore, label: 'JEBAKAN BATMAN',    emoji: '⚠️', desc: 'Pelayanan oke tapi valuasinya kemahalan. Hati-hati.' };
  return                              { score: prophecyScore, label: 'HINDARI TOTAL',      emoji: '💀', desc: 'Fundamental buruk, lapangan amburadul. Ini saham apa tempat sampah?' };
}
```

---

## DIRECTORY STRUCTURE

```
rumput-id/
├── app/
│   ├── layout.tsx              # Root layout + scanline effect
│   ├── page.tsx                # Landing / Dashboard utama
│   ├── globals.css             # Design system CSS variables
│   │
│   ├── sektor/
│   │   └── [slug]/
│   │       └── page.tsx        # Halaman per sektor
│   │
│   ├── emiten/
│   │   └── [ticker]/
│   │       └── page.tsx        # Detail emiten + prophecy + feed intel
│   │
│   ├── lapor/
│   │   └── page.tsx            # Form submit intel lapangan
│   │
│   ├── feed/
│   │   └── page.tsx            # Global intel feed (leaderboard)
│   │
│   └── api/
│       ├── emiten/
│       │   └── route.ts        # GET emiten list dengan filter
│       ├── intel/
│       │   └── route.ts        # POST intel report
│       ├── prophecy/
│       │   └── [ticker]/
│       │       └── route.ts    # GET prophecy calculation
│       └── sync/
│           └── route.ts        # POST sync data dari Sectors.app (cron)
│
├── components/
│   ├── ui/
│   │   ├── TickerTape.tsx      # Scrolling ticker di top bar
│   │   ├── ProphecyBadge.tsx   # Badge warna prophecy label
│   │   ├── ScoreBar.tsx        # Progress bar untuk scores
│   │   ├── SectorCard.tsx      # Card per sektor di dashboard
│   │   └── IntelCard.tsx       # Card satu laporan intel
│   │
│   ├── screener/
│   │   ├── EmitenTable.tsx     # Tabel utama screener
│   │   ├── FilterBar.tsx       # Filter sektor, PBV range, dll
│   │   └── EmitenRow.tsx       # Satu baris di tabel
│   │
│   ├── intel/
│   │   ├── IntelForm.tsx       # Form laporan lapangan
│   │   ├── IntelFeed.tsx       # Feed laporan
│   │   └── RatingInput.tsx     # Komponen rating bintang
│   │
│   └── layout/
│       ├── TopBar.tsx          # Navigation + ticker tape
│       ├── Sidebar.tsx         # Sektor navigation
│       └── StatusBar.tsx       # Bottom status bar ala terminal
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── types.ts            # Generated types dari schema
│   │
│   ├── sectors-api/
│   │   ├── client.ts           # Sectors.app API wrapper
│   │   └── sync.ts             # Logic sync data ke Supabase
│   │
│   ├── prophecy/
│   │   └── engine.ts           # THE PROPHECY ENGINE formula
│   │
│   └── utils/
│       ├── format.ts           # Format angka IDR, %, dll
│       ├── session.ts          # Anonymous session management
│       └── ratelimit.ts        # Anti-spam logic
│
├── data/
│   └── seed/
│       ├── emiten.json         # 12 emiten seed (3 sektor x 4)
│       ├── sektor.json         # Config 11 sektor IDX
│       └── intel-mock.json     # Mock intel untuk dev
│
├── types/
│   └── index.ts                # Shared TypeScript types
│
└── supabase/
    ├── migrations/
    │   └── 001_initial_schema.sql
    └── seed.sql
```

---

## SEED DATA — 12 Emiten Awal

### Sektor Perbankan (Teori Satpam)
| Ticker | Nama | Teori |
|--------|------|-------|
| BBCA | Bank Central Asia | Keramahan Satpam & Speed Teller |
| BBRI | Bank Rakyat Indonesia | Kelayakan Kursi Antrian |
| BMRI | Bank Mandiri | Kemewahan Lobi Kantor Pusat |
| BRIS | BSI (Bank Syariah Indonesia) | Kesabaran CS & Ketersediaan ATM |

### Sektor F&B / Ritel (Teori Tisu & Sabun)
| Ticker | Nama | Teori |
|--------|------|-------|
| MAPI | Mitra Adiperkasa (Starbucks, etc) | Kualitas Toilet & Sabun Cuci Tangan |
| FAST | Fast Food Indonesia (KFC) | Kelimpahan Tisu & Kecepatan Antrian |
| PZZA | Sarimelati Kencana (Pizza Hut) | Kebersihan Meja & Ketersediaan Lada |
| CMRY | Cisarua Mountain Dairy (Cimory) | Kesegaran Produk di Minimarket |

### Sektor Properti (Teori Parkir & Lobi)
| Ticker | Nama | Teori |
|--------|------|-------|
| PWON | Pakuwon Jati (Pakuwon Mall) | Kualitas Sabun Toilet & Wangi Lobi |
| BSDE | BSD City (Sinar Mas Land) | Kondisi Taman & Kerapian Kantor Pemasaran |
| SMRA | Summarecon Agung | Ketersediaan Parkir & Kecepatan Lift |
| CTRA | Ciputra Development | Keramahan Security & Kebersihan Showroom |

---

## ANTI-SPAM STRATEGY (Anonymous Submit)

### Lapisan Pertahanan
1. **Rate Limiting**: Maks 3 laporan per session_id per emiten per 24 jam
2. **IP Hashing**: Hash IP untuk deteksi abuse tanpa menyimpan IP asli
3. **Cooldown UX**: Setelah submit, form disable 10 menit untuk emiten yang sama
4. **Minimum Length**: Kolom `catatan` minimum 20 karakter jika diisi
5. **Flag System**: User lain bisa flag laporan mencurigakan
6. **Admin Review**: Laporan dengan flag ≥ 3 otomatis disembunyikan

### Session ID Generation
```typescript
// Kombinasi browser fingerprint yang tidak menyimpan PII
function generateSessionId(): string {
  const components = [
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency,
  ].join('|');
  return btoa(components).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
}
```

---

## PHASE CHECKLIST

### Phase 0 (Sebelum coding — HARI INI)
- [ ] Daftar Sectors.app, dapat API key
- [ ] Test endpoint: `GET /api/idx/company/{ticker}` untuk BBCA
- [ ] Konfirmasi field yang tersedia: PBV, ROE, NPL, DER
- [ ] Setup Supabase project baru
- [ ] Run migration SQL
- [ ] Seed 12 emiten + 3 sektor config

### Phase 1 (Foundation — 2-3 hari)
- [ ] `npx create-next-app@latest rumput-id --typescript --app --tailwind=false`
- [ ] Setup design system (globals.css dengan semua CSS variables)
- [ ] TopBar + scanline effect
- [ ] Supabase client setup
- [ ] Sectors.app client wrapper

### Phase 2 (Core UI — 3-4 hari)
- [ ] Dashboard: ticker tape + sector cards + screener table
- [ ] Halaman sektor: grid emiten dengan prophecy badge
- [ ] Halaman emiten: detail + scores + intel feed
- [ ] Form laporan intel
- [ ] Intel feed global

### Phase 3 (Engine + Polish — 2-3 hari)
- [ ] Prophecy Engine live (bukan mock)
- [ ] Cron job sync Sectors.app data
- [ ] Anti-spam implementation
- [ ] Share card untuk viral mechanic
- [ ] Mobile responsive polish

**Total estimasi MVP: 7-10 hari kerja**
