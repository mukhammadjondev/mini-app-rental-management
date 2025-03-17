import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { House, Room } from '@/models';

// Barcha xonalarni olish
export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const houseId = searchParams.get('houseId');

    const query: { status?: string; houseId?: string } = {};
    if (status) {
      query.status = status;
    }
    if (houseId) {
      query.houseId = houseId;
    }

    const rooms = await Room.find(query);
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json(
      { error: `Xonalarni olishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}

// Yangi xona qo'shish
export async function POST(req: NextRequest) {
  await connectToDatabase();
  try {
    const roomData = await req.json();

    // House mavjudligini tekshirish
    const house = await House.findById(roomData.houseId);
    if (!house) {
      return NextResponse.json(
        { error: "Ko'rsatilgan uy mavjud emas" },
        { status: 404 }
      );
    }

    const newRoom = await Room.create(roomData);

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Xona qo'shishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}
