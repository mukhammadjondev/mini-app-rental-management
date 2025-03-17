import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import House from '@/models/house';

// Uylar ro'yxatini olish
export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = {};
    if (status) {
      query = { status };
    }

    const houses = await House.find(query);
    return NextResponse.json(houses);
  } catch (error) {
    return NextResponse.json(
      { error: `Uylarni olishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}

// Yangi uy qo'shish
export async function POST(req: NextRequest) {
  await connectToDatabase();
  try {
    const houseData = await req.json();
    const newHouse = await House.create(houseData);

    return NextResponse.json(newHouse, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Uy qo'shishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}
