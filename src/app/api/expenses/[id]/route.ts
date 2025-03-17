import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Expense, House, Room } from '@/models';

// Ma'lum bir xarajatni olish
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  try {
    const expense = await Expense.findById(params.id)
      .populate('houseId', 'address')
      .populate('roomId', 'roomNumber');

    if (!expense) {
      return NextResponse.json({ error: 'Xarajat topilmadi' }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json(
      { error: `Xarajatni olishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}

// Xarajatni yangilash
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  try {
    const expenseData = await req.json();
    const expenseId = params.id;

    // Uy mavjudligini tekshirish
    if (expenseData.houseId) {
      const house = await House.findById(expenseData.houseId);
      if (!house) {
        return NextResponse.json(
          { error: "Ko'rsatilgan uy mavjud emas" },
          { status: 404 }
        );
      }
    }

    // Agar xona ID berilgan bo'lsa, xona mavjudligini tekshirish
    if (expenseData.roomId) {
      const room = await Room.findById(expenseData.roomId);
      if (!room) {
        return NextResponse.json(
          { error: "Ko'rsatilgan xona mavjud emas" },
          { status: 404 }
        );
      }

      // Xona va uy bir-biriga mos kelishini tekshirish
      if (
        expenseData.houseId &&
        room.houseId.toString() !== expenseData.houseId
      ) {
        return NextResponse.json(
          {
            error: 'Xona va uy bir-biriga mos kelmaydi',
          },
          { status: 400 }
        );
      }
    }

    // Xarajat sanasi o'zgargan bo'lsa period ma'lumotini ham yangilash
    if (expenseData.expenseDate) {
      const date = new Date(expenseData.expenseDate);
      expenseData.period = {
        month: date.getMonth() + 1, // 0-11 => 1-12
        year: date.getFullYear(),
      };
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      expenseData,
      { new: true }
    );

    if (!updatedExpense) {
      return NextResponse.json({ error: 'Xarajat topilmadi' }, { status: 404 });
    }

    return NextResponse.json(updatedExpense);
  } catch (error) {
    return NextResponse.json(
      { error: `Xarajatni yangilashda xatolik: ${error}` },
      { status: 500 }
    );
  }
}

// Xarajatni o'chirish
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  try {
    const expenseId = params.id;
    const deletedExpense = await Expense.findByIdAndDelete(expenseId);

    if (!deletedExpense) {
      return NextResponse.json({ error: 'Xarajat topilmadi' }, { status: 404 });
    }

    return NextResponse.json({ message: "Xarajat muvaffaqiyatli o'chirildi" });
  } catch (error) {
    return NextResponse.json(
      { error: `Xarajatni o'chirishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}
