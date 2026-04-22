import React from 'react';

// Wrapper component to provide consistent styling and SVG properties
const DoodleBase = ({ children, className = '', size = 24 }: { children: React.ReactNode, className?: string, size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`doodle ${className}`}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    {children}
  </svg>
);

// ─── PROPHECY ENGINE ────────────────────────────────────────────────────────

// 💎 Hold Keras
export const DoodleDiamond = (props: any) => (
  <DoodleBase {...props}>
    <path d="M4.5 9L12 21L19.5 9L15.5 3H8.5L4.5 9Z" />
    <path d="M4.5 9H19.5" />
    <path d="M12 21L8.5 9L12 3L15.5 9L12 21Z" />
  </DoodleBase>
);

// 🔍 Potensi Akuisisi
export const DoodleMagnifyingGlass = (props: any) => (
  <DoodleBase {...props}>
    <circle cx="10" cy="10" r="6" />
    <path d="M14 14L20 20" />
    {/* Jagged glare for sketchy feel */}
    <path d="M8 7Q9 6 10 7" strokeWidth="1" />
  </DoodleBase>
);

// ⚠️ Jebakan Batman
export const DoodleWarning = (props: any) => (
  <DoodleBase {...props}>
    <path d="M12 3L22 20H2L12 3Z" />
    <path d="M12 9V14" />
    <circle cx="12" cy="17" r="0.5" fill="currentColor" />
  </DoodleBase>
);

// 💀 Hindari Total
export const DoodleSkull = (props: any) => (
  <DoodleBase {...props}>
    <path d="M12 3C8.5 3 6 5.5 6 9C6 11 7 12.5 7.5 14H16.5C17 12.5 18 11 18 9C18 5.5 15.5 3 12 3Z" />
    <path d="M9 14V17C9 18 10 19 10 19H14C14 19 15 18 15 17V14" />
    <circle cx="9.5" cy="9.5" r="1.5" />
    <circle cx="14.5" cy="9.5" r="1.5" />
    <path d="M12 12V14" />
    <path d="M10 17H14" />
  </DoodleBase>
);

// ─── SEKTOR EKONOMI ────────────────────────────────────────────────────────

// 🏦 Perbankan
export const DoodleBank = (props: any) => (
  <DoodleBase {...props}>
    <path d="M2 21H22" />
    <path d="M12 3L3 9H21L12 3Z" />
    <path d="M6 13V17M10 13V17M14 13V17M18 13V17" />
    <path d="M4 21V19H20V21" />
    <path d="M4 9V11H20V9" />
  </DoodleBase>
);

// 🍔 F&B / Ritel
export const DoodleBurger = (props: any) => (
  <DoodleBase {...props}>
    <path d="M5 14C5 12 7 11 12 11C17 11 19 12 19 14C19 16 17 17 12 17C7 17 5 16 5 14Z" />
    <path d="M6 10C6 6 8 5 12 5C16 5 18 6 18 10" />
    <path d="M6 18H18C18 19 16 20 12 20C8 20 6 19 6 18Z" />
    <path d="M9 7L10 8M14 7L13 8" />
  </DoodleBase>
);

// 🏢 Properti
export const DoodleBuilding = (props: any) => (
  <DoodleBase {...props}>
    <path d="M5 21V5C5 4 6 3 7 3H17C18 3 19 4 19 5V21" />
    <path d="M2 21H22" />
    <path d="M9 7H11M13 7H15" />
    <path d="M9 11H11M13 11H15" />
    <path d="M9 15H11M13 15H15" />
    <path d="M10 21V18H14V21" />
  </DoodleBase>
);

// 💻 Teknologi
export const DoodleLaptop = (props: any) => (
  <DoodleBase {...props}>
    <path d="M4 16H20V6C20 5 19 4 18 4H6C5 4 4 5 4 6V16Z" />
    <path d="M2 19C2 17 3 16 4 16H20C21 16 22 17 22 19V20H2V19Z" />
    <path d="M10 16H14" />
  </DoodleBase>
);

// ⚡ Energi
export const DoodleLightning = (props: any) => (
  <DoodleBase {...props}>
    <path d="M13 2L4 13H12L11 22L20 11H12L13 2Z" />
  </DoodleBase>
);

// ⛏️ Tambang
export const DoodlePickaxe = (props: any) => (
  <DoodleBase {...props}>
    <path d="M20 10C20 10 18 4 14 4C10 4 4 6 4 6L6 8L16 12L20 10Z" />
    <path d="M8 6L18 16L16 18L6 8Z" />
  </DoodleBase>
);

// 💊 Farmasi
export const DoodlePill = (props: any) => (
  <DoodleBase {...props}>
    <path d="M17 7L7 17C5 19 3 19 3 19C3 19 3 17 5 15L15 5C17 3 19 3 19 3C19 3 19 5 17 7Z" />
    <path d="M10 10L14 14" />
    <path d="M7 17L5 19M17 7L19 5" />
  </DoodleBase>
);

// 📡 Telco
export const DoodleAntenna = (props: any) => (
  <DoodleBase {...props}>
    <path d="M12 20V12" />
    <circle cx="12" cy="10" r="2" />
    <path d="M7 7C8 5.5 10 4.5 12 4.5C14 4.5 16 5.5 17 7" />
    <path d="M4 4C6 2 9 1 12 1C15 1 18 2 20 4" />
    <path d="M9 20H15" />
  </DoodleBase>
);

// ─── INDEKS & UI ELEMENTS ──────────────────────────────────────────────────

// 📊 IDX Composite
export const DoodleChart = (props: any) => (
  <DoodleBase {...props}>
    <path d="M3 21H21" />
    <path d="M5 21V12M9 21V15M13 21V9M17 21V5" />
    <path d="M5 12L9 15L13 9L17 5L20 7" strokeWidth="1" />
  </DoodleBase>
);

// ⭐/★ Star (Filled / Empty handled by fill/stroke overrides via props/CSS)
export const DoodleStar = ({ filled, ...props }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={props.size || 24}
    height={props.size || 24}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`doodle ${props.className || ''}`}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" />
  </svg>
);

// 🏆 IDX30
export const DoodleTrophy = (props: any) => (
  <DoodleBase {...props}>
    <path d="M7 4H17M7 4V10C7 13 9 15 12 15C15 15 17 13 17 10V4M7 4H4C3 4 3 6 4 7C5 8 6 9 7 9M17 4H20C21 4 21 6 20 7C19 8 18 9 17 9" />
    <path d="M12 15V20M9 20H15" />
  </DoodleBase>
);

// 🌍 Semua Emiten (Globe)
export const DoodleGlobe = (props: any) => (
  <DoodleBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3C10 6 9 9 9 12C9 15 10 18 12 21C14 18 15 15 15 12C15 9 14 6 12 3Z" />
    <path d="M3 12H21" />
    <path d="M4 8H20M4 16H20" />
  </DoodleBase>
);

// 🔥 Trending
export const DoodleFire = (props: any) => (
  <DoodleBase {...props}>
    <path d="M12 21C9 21 7 18 7 15C7 10 12 3 12 3C12 3 17 8 17 13C17 15 16 17 14 19" />
    <path d="M12 21C12 21 14 20 14 17C14 15 12 13 12 13C12 13 11 15 11 16C11 18 12 21 12 21Z" />
  </DoodleBase>
);

// ✅ Success Check
export const DoodleCheck = (props: any) => (
  <DoodleBase {...props}>
    <path d="M5 12L10 17L20 7" />
  </DoodleBase>
);

// 🕵️‍♂️ Detective / Empty State
export const DoodleDetective = (props: any) => (
  <DoodleBase {...props}>
    <path d="M5 11H19" />
    <path d="M7 11V7C7 5 9 3 12 3C15 3 17 5 17 7V11" />
    <circle cx="9" cy="15" r="2" />
    <circle cx="15" cy="15" r="2" />
    <path d="M11 15H13" />
    <path d="M12 18C12 18 13 19 15 19" />
  </DoodleBase>
);

// ▲ Upvote Arrow
export const DoodleArrowUp = (props: any) => (
  <DoodleBase {...props}>
    <path d="M12 20V4M5 11L12 4L19 11" />
  </DoodleBase>
);

// ← Arrow Left
export const DoodleArrowLeft = (props: any) => (
  <DoodleBase {...props}>
    <path d="M20 12H4M11 5L4 12L11 19" />
  </DoodleBase>
);

// + Plus
export const DoodlePlus = (props: any) => (
  <DoodleBase {...props}>
    <path d="M12 5V19M5 12H19" />
  </DoodleBase>
);

// ─── ICON MAP HELPER ────────────────────────────────────────────────────────

// Helper untuk gampang render icon via string ID dari database/mock
export const IconMap: Record<string, React.FC<any>> = {
  "diamond": DoodleDiamond,
  "glass": DoodleMagnifyingGlass,
  "warning": DoodleWarning,
  "skull": DoodleSkull,
  "bank": DoodleBank,
  "burger": DoodleBurger,
  "building": DoodleBuilding,
  "laptop": DoodleLaptop,
  "lightning": DoodleLightning,
  "pickaxe": DoodlePickaxe,
  "pill": DoodlePill,
  "antenna": DoodleAntenna,
  "chart": DoodleChart,
  "star": DoodleStar,
  "trophy": DoodleTrophy,
  "globe": DoodleGlobe,
  "fire": DoodleFire,
  "check": DoodleCheck,
  "detective": DoodleDetective,
  "arrow-up": DoodleArrowUp,
  "arrow-left": DoodleArrowLeft,
  "plus": DoodlePlus,
};

export const getIcon = (id: string, props?: any) => {
  const IconComponent = IconMap[id];
  return IconComponent ? <IconComponent {...props} /> : null;
};
