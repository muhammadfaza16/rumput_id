// ─── MOCK DATA (Fallback when Supabase is empty) ────────────────────────────
// Structure mirrors the IDX scraper output exactly.

export const MOCK_EMITEN = [
  // ─── PERBANKAN ──────────────────────────────────────────────
  { ticker: "BBCA", nama: "Bank Central Asia", sektor: "Keuangan", sub_sektor: "Bank", pbv: 4.21, per: 18.73, roe: 22.14, der: 5.12, eps: 1283, npl: 1.8, bvps: 6089, last_price: 9825, market_cap: 1210000000, fundamental_score: 70, intel_score: 82, prophecy_score: 76, prophecy_label: "HOLD KERAS", emoji: "diamond",
    shareholders: [{ name: "PT Dwimuria Investama Mandala", pct: 54.94 }, { name: "Publik (Domestik)", pct: 22.31 }, { name: "Publik (Asing)", pct: 22.75 }],
    directors: [{ name: "Jahja Setiaatmadja", position: "Presiden Direktur" }, { name: "Vera Eve Lim", position: "Wakil Presiden Direktur" }],
    commissioners: [{ name: "Djohan Emir Setijoso", position: "Presiden Komisaris" }],
  },
  { ticker: "BBRI", nama: "Bank Rakyat Indonesia", sektor: "Keuangan", sub_sektor: "Bank", pbv: 2.10, per: 12.41, roe: 18.40, der: 5.88, eps: 382, npl: 2.9, bvps: 2290, last_price: 4810, market_cap: 725000000, fundamental_score: 72, intel_score: 44, prophecy_score: 58, prophecy_label: "POTENSI AKUISISI", emoji: "glass",
    shareholders: [{ name: "Negara Republik Indonesia", pct: 53.19 }, { name: "Publik", pct: 46.81 }],
    directors: [{ name: "Sunarso", position: "Direktur Utama" }],
    commissioners: [{ name: "Kartika Wirjoatmodjo", position: "Komisaris Utama" }],
  },
  { ticker: "BMRI", nama: "Bank Mandiri", sektor: "Keuangan", sub_sektor: "Bank", pbv: 1.80, per: 9.82, roe: 19.20, der: 5.42, eps: 640, npl: 2.1, bvps: 3511, last_price: 6275, market_cap: 584000000, fundamental_score: 75, intel_score: 71, prophecy_score: 73, prophecy_label: "HOLD KERAS", emoji: "diamond",
    shareholders: [{ name: "Negara Republik Indonesia", pct: 60.00 }, { name: "Publik", pct: 40.00 }],
    directors: [{ name: "Darmawan Junaidi", position: "Direktur Utama" }],
    commissioners: [{ name: "Chatib Basri", position: "Komisaris Utama" }],
  },
  { ticker: "BRIS", nama: "Bank Syariah Indonesia", sektor: "Keuangan", sub_sektor: "Bank Syariah", pbv: 1.40, per: 11.50, roe: 16.10, der: 4.10, eps: 152, npl: 2.3, bvps: 1248, last_price: 1745, market_cap: 72000000, fundamental_score: 77, intel_score: 63, prophecy_score: 70, prophecy_label: "HOLD KERAS", emoji: "diamond",
    shareholders: [{ name: "PT Bank Mandiri", pct: 50.83 }, { name: "Publik", pct: 49.17 }],
    directors: [{ name: "Hery Gunardi", position: "Direktur Utama" }],
    commissioners: [],
  },

  // ─── PROPERTI ───────────────────────────────────────────────
  { ticker: "PWON", nama: "Pakuwon Jati", sektor: "Properti & Real Estat", sub_sektor: "Properti", pbv: 0.70, per: 6.82, roe: 11.20, der: 0.42, eps: 42, npl: null, bvps: 410, last_price: 288, market_cap: 13800000, fundamental_score: 81, intel_score: 38, prophecy_score: 59.5, prophecy_label: "POTENSI AKUISISI", emoji: "glass",
    shareholders: [{ name: "PT Pakuwon Arthaniaga", pct: 33.32 }, { name: "Publik", pct: 66.68 }],
    directors: [{ name: "Scott Andrew Haryanto Wongsodirdjo", position: "Presiden Direktur" }],
    commissioners: [],
  },
  { ticker: "BSDE", nama: "Bumi Serpong Damai", sektor: "Properti & Real Estat", sub_sektor: "Properti", pbv: 0.50, per: 7.90, roe: 7.10, der: 0.61, eps: 89, npl: null, bvps: 1398, last_price: 700, market_cap: 13000000, fundamental_score: 62, intel_score: 29, prophecy_score: 45.5, prophecy_label: "HINDARI TOTAL", emoji: "skull",
    shareholders: [{ name: "Sinarmas Land Limited", pct: 51.47 }, { name: "Publik", pct: 48.53 }],
    directors: [{ name: "Hermawan Wijaya", position: "Direktur Utama" }],
    commissioners: [],
  },
  { ticker: "SMRA", nama: "Summarecon Agung", sektor: "Properti & Real Estat", sub_sektor: "Properti", pbv: 0.90, per: 14.20, roe: 6.30, der: 1.52, eps: 28, npl: null, bvps: 440, last_price: 398, market_cap: 5700000, fundamental_score: 45, intel_score: 55, prophecy_score: 50, prophecy_label: "JEBAKAN BATMAN", emoji: "warning",
    shareholders: [{ name: "PT Sinarmegah Jayasentosa", pct: 25.43 }, { name: "Publik", pct: 74.57 }],
    directors: [{ name: "Adrianto Pitoyo Adhi", position: "Presiden Direktur" }],
    commissioners: [],
  },

  // ─── F&B / RITEL ────────────────────────────────────────────
  { ticker: "FAST", nama: "Fast Food Indonesia", sektor: "Barang Konsumen", sub_sektor: "Restoran", pbv: 3.10, per: 22.40, roe: 14.80, der: 0.89, eps: 54, npl: null, bvps: 389, last_price: 1210, market_cap: 7200000, fundamental_score: 48, intel_score: 76, prophecy_score: 62, prophecy_label: "JEBAKAN BATMAN", emoji: "warning",
    shareholders: [{ name: "PT Gelael Pratama", pct: 43.84 }, { name: "Publik", pct: 56.16 }],
    directors: [{ name: "Andy Subali Salim", position: "Presiden Direktur" }],
    commissioners: [],
  },
  { ticker: "MAPI", nama: "Mitra Adiperkasa", sektor: "Barang Konsumen", sub_sektor: "Ritel", pbv: 2.80, per: 31.20, roe: 9.30, der: 1.64, eps: 61, npl: null, bvps: 682, last_price: 1905, market_cap: 32000000, fundamental_score: 41, intel_score: 35, prophecy_score: 38, prophecy_label: "HINDARI TOTAL", emoji: "skull",
    shareholders: [{ name: "Hartono Tjahjadi", pct: 20.09 }, { name: "Publik", pct: 79.91 }],
    directors: [{ name: "Fetty Kwartati", position: "Presiden Direktur" }],
    commissioners: [],
  },
  { ticker: "BOCA", nama: "Rebocca Anugrah Mandiri", sektor: "Barang Konsumen", sub_sektor: "Makanan & Minuman", pbv: 1.20, per: 15.80, roe: 8.50, der: 0.35, eps: 18, npl: null, bvps: 231, last_price: 278, market_cap: 1500000, fundamental_score: 55, intel_score: 45, prophecy_score: 50, prophecy_label: "POTENSI AKUISISI", emoji: "glass",
    shareholders: [{ name: "PT Rebocca Group", pct: 62.40 }, { name: "Publik", pct: 37.60 }],
    directors: [],
    commissioners: [],
  },

  // ─── TEKNOLOGI ──────────────────────────────────────────────
  { ticker: "GOTO", nama: "GoTo Gojek Tokopedia", sektor: "Teknologi", sub_sektor: "Platform Digital", pbv: null, per: null, roe: -12.50, der: 0.18, eps: -8, npl: null, bvps: null, last_price: 84, market_cap: 98000000, fundamental_score: 15, intel_score: 50, prophecy_score: 32.5, prophecy_label: "HINDARI TOTAL", emoji: "skull",
    shareholders: [{ name: "SoftBank Group", pct: 8.72 }, { name: "Alibaba Group", pct: 7.81 }, { name: "Publik", pct: 83.47 }],
    directors: [{ name: "Patrick Walujo", position: "CEO" }],
    commissioners: [],
  },
  { ticker: "BREN", nama: "Barito Renewables Energy", sektor: "Energi", sub_sektor: "Energi Terbarukan", pbv: 52.30, per: 142.50, roe: 24.80, der: 2.31, eps: 72, npl: null, bvps: 196, last_price: 7100, market_cap: 480000000, fundamental_score: 30, intel_score: 50, prophecy_score: 40, prophecy_label: "HINDARI TOTAL", emoji: "skull",
    shareholders: [{ name: "PT Prajogo Pangestu", pct: 68.57 }, { name: "Publik", pct: 31.43 }],
    directors: [{ name: "Leks Marantika", position: "Presiden Direktur" }],
    commissioners: [],
  },
];

export const MOCK_INTEL = [
  { ticker: "BBCA", lokasi: "Cabang BCA Sudirman", kota: "Jakarta", kategori: "Satpam", rating: 5, catatan: "Pak Budi satpamnya ramah banget, sampe inget nama gue. Bullish.", waktu: "2 jam lalu", nick: "ValueHunterJkt" },
  { ticker: "BBRI", lokasi: "BRI KCP Kebayoran", kota: "Jakarta", kategori: "Teller", rating: 2, catatan: "Antrian 45 menit. Kursinya goyang-goyang. NPL tinggi nih kayaknya.", waktu: "5 jam lalu", nick: "Analis Anonim" },
  { ticker: "PWON", lokasi: "Pakuwon Mall Surabaya", kota: "Surabaya", kategori: "Sabun", rating: 2, catatan: "Sabun toiletnya habis dari siang. Ini mall premium? Bearish.", waktu: "1 hari lalu", nick: "SurabayaInvestor" },
  { ticker: "FAST", lokasi: "KFC Thamrin", kota: "Jakarta", kategori: "Tisu", rating: 4, catatan: "Tisu berlimpah, lantai bersih. Tapi valuasinya tetep kemahalan boss.", waktu: "1 hari lalu", nick: "TissuAnalyst" },
  { ticker: "BMRI", lokasi: "Bank Mandiri SCBD", kota: "Jakarta", kategori: "Lobi", rating: 4, catatan: "Lobih mewah, AC dingin, satpam senyum. Ini vibes emiten grade A.", waktu: "2 hari lalu", nick: "HedgeFundBego" },
  { ticker: "GOTO", lokasi: "Kantor GoTo Pasaraya", kota: "Jakarta", kategori: "Kantor", rating: 1, catatan: "Lantai 3 kosong. Yang kerja tinggal setengah. Bearish banget.", waktu: "3 hari lalu", nick: "TechBearID" },
  { ticker: "BREN", lokasi: "PLTA Poso", kota: "Sulawesi Tengah", kategori: "Fasilitas", rating: 3, catatan: "Turbin jalan, tapi akses jalannya ancur. Susah dinilai ini.", waktu: "4 hari lalu", nick: "EnergyScout" },
];

export const MOCK_INDICES = [
  { index_code: "COMPOSITE", index_name: "IDX Composite (IHSG)", close_price: 7284.52, change: 59.32, change_pct: 0.82 },
  { index_code: "LQ45", index_name: "LQ45", close_price: 982.31, change: -1.38, change_pct: -0.14 },
  { index_code: "IDX30", index_name: "IDX30", close_price: 512.88, change: 1.79, change_pct: 0.35 },
  { index_code: "IDXHIDIV20", index_name: "IDX High Dividend 20", close_price: 421.15, change: 5.04, change_pct: 1.21 },
  { index_code: "IDXBUMN20", index_name: "IDX BUMN20", close_price: 348.72, change: -2.11, change_pct: -0.60 },
  { index_code: "IDXESGL", index_name: "IDX ESG Leaders", close_price: 158.44, change: 0.92, change_pct: 0.58 },
];

export const PROPHECY_COLORS = {
  "HOLD KERAS":       { bg: "rgba(0,255,136,0.12)", border: "rgba(0,255,136,0.4)",  text: "#00FF88", glow: "0 0 20px rgba(0,255,136,0.3)" },
  "POTENSI AKUISISI": { bg: "rgba(255,170,0,0.12)",  border: "rgba(255,170,0,0.4)",  text: "#FFAA00", glow: "0 0 20px rgba(255,170,0,0.3)" },
  "JEBAKAN BATMAN":   { bg: "rgba(255,68,102,0.12)", border: "rgba(255,68,102,0.4)", text: "#FF4466", glow: "0 0 20px rgba(255,68,102,0.3)" },
  "HINDARI TOTAL":    { bg: "rgba(255,34,68,0.15)",  border: "rgba(255,34,68,0.5)",  text: "#FF2244", glow: "0 0 20px rgba(255,34,68,0.4)" },
};

export const PROPHECY_DESC: Record<string, string> = {
  "HOLD KERAS":       "Fundamental kuat, lapangan oke.",
  "POTENSI AKUISISI": "Murah tapi ada yang bau di lapangan.",
  "JEBAKAN BATMAN":   "Lapangan oke tapi valuasi kemahalan.",
  "HINDARI TOTAL":    "Bubar jalan. Tidak ada yang selamat.",
};

// ─── Sector config ────────────────────────────────────────────────────────────
export const SEKTOR_LIST = [
  { nama: "Keuangan", slug: "keuangan", icon: "bank", teori: "Teori Satpam" },
  { nama: "Properti & Real Estat", slug: "properti", icon: "building", teori: "Teori Parkir & Lobi" },
  { nama: "Barang Konsumen", slug: "konsumen", icon: "burger", teori: "Teori Tisu & Sabun" },
  { nama: "Teknologi", slug: "teknologi", icon: "laptop", teori: "Teori Kantor Kosong" },
  { nama: "Energi", slug: "energi", icon: "lightning", teori: "Teori Turbin" },
  { nama: "Infrastruktur", slug: "infrastruktur", icon: "building", teori: "Teori Tol" },
  { nama: "Kesehatan", slug: "kesehatan", icon: "pill", teori: "Teori Antrian RS" },
  { nama: "Industri", slug: "industri", icon: "pickaxe", teori: "Teori Pabrik" },
  { nama: "Transportasi & Logistik", slug: "transportasi", icon: "antenna", teori: "Teori Armada" },
  { nama: "Bahan Baku", slug: "bahan-baku", icon: "pickaxe", teori: "Teori Tambang" },
  { nama: "Telekomunikasi", slug: "telekomunikasi", icon: "antenna", teori: "Teori Sinyal" },
];
