export const MOCK_EMITEN = [
  { ticker: "BBCA", nama: "Bank Central Asia", sektor: "Perbankan", pbv: 4.2, roe: 22.1, npl: 1.8, fundScore: 68, intelScore: 82, prophecy: "HOLD KERAS", emoji: "diamond", slug: "perbankan" },
  { ticker: "BBRI", nama: "Bank Rakyat Indonesia", sektor: "Perbankan", pbv: 2.1, roe: 18.4, npl: 2.9, fundScore: 72, intelScore: 44, prophecy: "POTENSI AKUISISI", emoji: "glass", slug: "perbankan" },
  { ticker: "BMRI", nama: "Bank Mandiri", sektor: "Perbankan", pbv: 1.8, roe: 19.2, npl: 2.1, fundScore: 75, intelScore: 71, prophecy: "HOLD KERAS", emoji: "diamond", slug: "perbankan" },
  { ticker: "PWON", nama: "Pakuwon Jati", sektor: "Properti", pbv: 0.7, roe: 11.2, npl: null, fundScore: 81, intelScore: 38, prophecy: "POTENSI AKUISISI", emoji: "glass", slug: "properti" },
  { ticker: "FAST", nama: "Fast Food Indonesia", sektor: "F&B", pbv: 3.1, roe: 14.8, npl: null, fundScore: 48, intelScore: 76, prophecy: "JEBAKAN BATMAN", emoji: "warning", slug: "fnb" },
  { ticker: "BSDE", nama: "BSD City", sektor: "Properti", pbv: 0.5, roe: 7.1, npl: null, fundScore: 62, intelScore: 29, prophecy: "JEBAKAN BATMAN", emoji: "warning", slug: "properti" },
  { ticker: "MAPI", nama: "Mitra Adiperkasa", sektor: "F&B", pbv: 2.8, roe: 9.3, npl: null, fundScore: 41, intelScore: 35, prophecy: "HINDARI TOTAL", emoji: "skull", slug: "fnb" },
  { ticker: "BRIS", nama: "BSI Bank Syariah", sektor: "Perbankan", pbv: 1.4, roe: 16.1, npl: 2.3, fundScore: 77, intelScore: 63, prophecy: "HOLD KERAS", emoji: "diamond", slug: "perbankan" },
];

export const MOCK_INTEL = [
  { ticker: "BBCA", lokasi: "Cabang BCA Sudirman", kota: "Jakarta", kategori: "Satpam", rating: 5, catatan: "Pak Budi satpamnya ramah banget, sampe inget nama gue. Bullish.", waktu: "2 jam lalu", nick: "ValueHunterJkt" },
  { ticker: "BBRI", lokasi: "BRI KCP Kebayoran", kota: "Jakarta", kategori: "Teller", rating: 2, catatan: "Antrian 45 menit. Kursinya goyang-goyang. NPL tinggi nih kayaknya.", waktu: "5 jam lalu", nick: "Analis Anonim" },
  { ticker: "PWON", lokasi: "Pakuwon Mall Surabaya", kota: "Surabaya", kategori: "Sabun", rating: 2, catatan: "Sabun toiletnya habis dari siang. Ini mall premium? Bearish.", waktu: "1 hari lalu", nick: "SurabayaInvestor" },
  { ticker: "FAST", lokasi: "KFC Thamrin", kota: "Jakarta", kategori: "Tisu", rating: 4, catatan: "Tisu berlimpah, lantai bersih. Tapi valuasinya tetep kemahalan boss.", waktu: "1 hari lalu", nick: "TissuAnalyst" },
  { ticker: "BMRI", lokasi: "Bank Mandiri SCBD", kota: "Jakarta", kategori: "Lobi", rating: 4, catatan: "Lobih mewah, AC dingin, satpam senyum. Ini vibes emiten grade A.", waktu: "2 hari lalu", nick: "HedgeFundBego" },
];

export const PROPHECY_COLORS = {
  "HOLD KERAS":       { bg: "rgba(0,255,136,0.12)", border: "rgba(0,255,136,0.4)",  text: "#00FF88", glow: "0 0 20px rgba(0,255,136,0.3)" },
  "POTENSI AKUISISI": { bg: "rgba(255,170,0,0.12)",  border: "rgba(255,170,0,0.4)",  text: "#FFAA00", glow: "0 0 20px rgba(255,170,0,0.3)" },
  "JEBAKAN BATMAN":   { bg: "rgba(255,68,102,0.12)", border: "rgba(255,68,102,0.4)", text: "#FF4466", glow: "0 0 20px rgba(255,68,102,0.3)" },
  "HINDARI TOTAL":    { bg: "rgba(255,34,68,0.15)",  border: "rgba(255,34,68,0.5)",  text: "#FF2244", glow: "0 0 20px rgba(255,34,68,0.4)" },
};

export const PROPHECY_DESC = {
  "HOLD KERAS":       "Fundamental kuat, lapangan oke.",
  "POTENSI AKUISISI": "Murah tapi ada yang bau di lapangan.",
  "JEBAKAN BATMAN":   "Lapangan oke tapi valuasi kemahalan.",
  "HINDARI TOTAL":    "Bubar jalan. Tidak ada yang selamat.",
};
