"use server";

import { saveIntelLocal } from '@/lib/data';

export async function submitIntelAction(formData: FormData) {
  const ticker = formData.get('ticker') as string;
  const kategori = formData.get('kategori') as string;
  const rating = parseInt(formData.get('rating') as string);
  const catatan = formData.get('catatan') as string;

  const lokasi = formData.get('lokasi') as string || "Anon Location";
  const kota = formData.get('kota') as string || "Anon City";

  if (!ticker || !kategori || !rating) return { success: false };

  const intelData = {
    ticker,
    kategori,
    rating,
    catatan,
    waktu: "Baru saja",
    lokasi,
    kota,
    nick: "Anon"
  };

  // Programmatically save to JSON database
  await saveIntelLocal(intelData);

  // Recalculate prophecy after new intel is submitted
  // await recalculateProphecy(ticker);

  return { success: true };
}
