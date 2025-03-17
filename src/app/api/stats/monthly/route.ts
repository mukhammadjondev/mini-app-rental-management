import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Room, Expense, Payment } from '@/models';
import {
  ExpenseType,
  RoomStatus,
  PaymentStatus,
  PaymentType,
  MonthlyStats,
} from '@/types';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const houseId = searchParams.get('houseId');
    const year = searchParams.get('year');

    // Default yil joriy yil bo'ladi
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    // Asosiy query
    const query: Record<string, unknown> = {};
    if (houseId) {
      query.houseId = houseId;
    }

    // 12 oy uchun statistikani saqlash
    const monthlyStats: MonthlyStats[] = [];

    // Har bir oy uchun ma'lumot yig'ish
    for (let month = 1; month <= 12; month++) {
      // Oylik so'rov
      const monthlyQuery = {
        ...query,
        'period.month': month,
        'period.year': currentYear,
      };

      // Xonalar va band xonalar soni
      const roomQuery = houseId ? { houseId } : {};
      const totalRooms = await Room.countDocuments(roomQuery);
      const occupiedRooms = await Room.countDocuments({
        ...roomQuery,
        status: RoomStatus.OCCUPIED,
      });

      // Band xonalar foizi
      const occupancyRate =
        totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

      // To'langan ijara summasi
      const payments = await Payment.find({
        ...monthlyQuery,
        paymentType: PaymentType.RENT,
        status: PaymentStatus.PAID,
      });

      const totalIncome = payments.reduce(
        (sum, payment) => sum + (payment.amount as number),
        0
      );

      // Xarajatlar
      const expenses = await Expense.find(monthlyQuery);
      const totalExpenses = expenses.reduce(
        (sum, expense) => sum + (expense.amount as number),
        0
      );

      // Xarajatlarni turlar bo'yicha taqsimlash
      interface ExpensesByType {
        [key: string]: number;
      }

      const expensesByType: ExpensesByType = {};
      for (const expense of expenses) {
        const expenseType = expense.expenseType as string;
        expensesByType[expenseType] =
          (expensesByType[expenseType] || 0) + (expense.amount as number);
      }

      // Oylik statistika
      monthlyStats.push({
        month,
        totalIncome,
        totalExpenses,
        netIncome: totalIncome - totalExpenses,
        occupancyRate,
        expenses: {
          electricity: expensesByType[ExpenseType.ELECTRICITY] || 0,
          water: expensesByType[ExpenseType.WATER] || 0,
          gas: expensesByType[ExpenseType.GAS] || 0,
          maintenance: expensesByType[ExpenseType.MAINTENANCE] || 0,
          other:
            (expensesByType[ExpenseType.REPAIR] || 0) +
            (expensesByType[ExpenseType.TAX] || 0) +
            (expensesByType[ExpenseType.CLEANING] || 0) +
            (expensesByType[ExpenseType.SECURITY] || 0) +
            (expensesByType[ExpenseType.OTHER] || 0),
        },
      });
    }

    return NextResponse.json({
      year: currentYear,
      months: monthlyStats,
    });
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    return NextResponse.json(
      {
        error: `Oylik statistikani olishda xatolik: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
