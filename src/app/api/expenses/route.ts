import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Expense, House, Room } from '@/models';

// Barcha xarajatlarni olish
export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const houseId = searchParams.get('houseId');
    const roomId = searchParams.get('roomId');
    const expenseType = searchParams.get('expenseType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const query: Record<string, unknown> = {};

    if (houseId) {
      query.houseId = houseId;
    }
    if (roomId) {
      query.roomId = roomId;
    }
    if (expenseType) {
      query.expenseType = expenseType;
    }

    // Vaqt oralig'i bo'yicha filtrlash
    if (startDate || endDate) {
      query.expenseDate = {};
      if (startDate) {
        query.expenseDate = { $gte: new Date(startDate) };
      }
      if (endDate) {
        query.expenseDate = {
          ...(query.expenseDate || {}),
          $lte: new Date(endDate),
        };
      }
    }

    // Oy va yil bo'yicha filtrlash
    if (month && year) {
      query['period.month'] = parseInt(month);
      query['period.year'] = parseInt(year);
    } else if (year) {
      query['period.year'] = parseInt(year);
    }

    const expenses = await Expense.find(query)
      .sort({ expenseDate: -1 })
      .populate('houseId', 'address')
      .populate('roomId', 'roomNumber');

    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json(
      { error: `Xarajatlarni olishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}

// Yangi xarajat qo'shish
export async function POST(req: NextRequest) {
  await connectToDatabase();
  try {
    const expenseData = await req.json();

    // Uy mavjudligini tekshirish
    const house = await House.findById(expenseData.houseId);
    if (!house) {
      return NextResponse.json(
        { error: "Ko'rsatilgan uy mavjud emas" },
        { status: 404 }
      );
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
      if (room.houseId.toString() !== expenseData.houseId) {
        return NextResponse.json(
          {
            error: 'Xona va uy bir-biriga mos kelmaydi',
          },
          { status: 400 }
        );
      }
    }

    // Xarajat sanasi uchun period (oy, yil) ma'lumotini avtomatik qo'shish
    if (expenseData.expenseDate && !expenseData.period) {
      const date = new Date(expenseData.expenseDate);
      expenseData.period = {
        month: date.getMonth() + 1, // 0-11 => 1-12
        year: date.getFullYear(),
      };
    }

    const newExpense = await Expense.create(expenseData);
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Xarajat qo'shishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}
