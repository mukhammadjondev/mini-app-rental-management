import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { House, Room } from '@/models';
import mongoose from 'mongoose';

// Uyga tegishli barcha xonalarni olish
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Noto'g'ri ID formati" },
        { status: 400 }
      );
    }

    // Uy mavjudligini tekshirish
    const house = await House.findById(id);
    if (!house) {
      return NextResponse.json({ error: 'Uy topilmadi' }, { status: 404 });
    }

    const query: { houseId: string; status?: string } = { houseId: id };
    if (status) {
      query.status = status;
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
