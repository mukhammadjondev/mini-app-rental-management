import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Tenant, Room } from '@/models';
import mongoose from 'mongoose';

// Bitta xonani ID bo'yicha olish
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

    const room = await Room.findById(id);

    if (!room) {
      return NextResponse.json({ error: 'Xona topilmadi' }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (error) {
    return NextResponse.json(
      { error: `Xonani olishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}

// Xonani yangilash
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

    const updatedRoom = await Room.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedRoom) {
      return NextResponse.json({ error: 'Xona topilmadi' }, { status: 404 });
    }

    return NextResponse.json(updatedRoom);
  } catch (error) {
    return NextResponse.json(
      { error: `Xonani yangilashda xatolik: ${error}` },
      { status: 500 }
    );
  }
}

// Xonani o'chirish
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

    // O'chirishdan oldin, ushbu xonaga bog'langan ijarachilar bor-yo'qligini tekshirish
    const relatedTenants = await Tenant.findOne({ roomId: id });

    if (relatedTenants) {
      return NextResponse.json(
        {
          error:
            "Bu xona bilan bog'langan ijarachilar mavjud, avval ularni o'chiring",
        },
        { status: 400 }
      );
    }

    const deletedRoom = await Room.findByIdAndDelete(id);

    if (!deletedRoom) {
      return NextResponse.json({ error: 'Xona topilmadi' }, { status: 404 });
    }

    return NextResponse.json({ message: "Xona muvaffaqiyatli o'chirildi" });
  } catch (error) {
    return NextResponse.json(
      { error: `Xonani o'chirishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}
