import { NextResponse } from 'next/server';
import { getMarketIndices } from '@/lib/data';

export async function GET() {
  try {
    const indices = await getMarketIndices();
    return NextResponse.json(indices);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
