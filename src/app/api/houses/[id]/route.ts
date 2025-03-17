import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import { House, Room } from '@/models';

// Bitta uyni ID bo'yicha olish
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Noto'g'ri ID formati" },
        { status: 400 }
      );
    }

    const house = await House.findById(id);

    if (!house) {
      return NextResponse.json({ error: 'Uy topilmadi' }, { status: 404 });
    }

    return NextResponse.json(house);
  } catch (error) {
    return NextResponse.json(
      { error: `Uyni olishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}

// Uyni yangilash
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  try {
    const { id } = params;
    const updateData = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Noto'g'ri ID formati" },
        { status: 400 }
      );
    }

    const updatedHouse = await House.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedHouse) {
      return NextResponse.json({ error: 'Uy topilmadi' }, { status: 404 });
    }

    return NextResponse.json(updatedHouse);
  } catch (error) {
    return NextResponse.json(
      { error: `Uyni yangilashda xatolik: ${error}` },
      { status: 500 }
    );
  }
}

// Uyni o'chirish
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Noto'g'ri ID formati" },
        { status: 400 }
      );
    }

    // O'chirishdan oldin, ushbu uyga bog'langan xonalar bor-yo'qligini tekshirish
    const relatedRooms = await Room.findOne({ houseId: id });

    if (relatedRooms) {
      return NextResponse.json(
        {
          error:
            "Bu uy bilan bog'langan xonalar mavjud, avval ularni o'chiring",
        },
        { status: 400 }
      );
    }

    const deletedHouse = await House.findByIdAndDelete(id);

    if (!deletedHouse) {
      return NextResponse.json({ error: 'Uy topilmadi' }, { status: 404 });
    }

    return NextResponse.json({ message: "Uy muvaffaqiyatli o'chirildi" });
  } catch (error) {
    return NextResponse.json(
      { error: `Uyni o'chirishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}
