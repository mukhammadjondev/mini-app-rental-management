import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Room, Expense, Payment } from '@/models';
import {
  ExpenseType,
  RoomStatus,
  PaymentStatus,
  PaymentType,
  YearlyStatsSummary,
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

    // Yillik statistika
    const yearlyStats: YearlyStatsSummary = {
      totalIncome: 0,
      totalExpenses: 0,
      netIncome: 0,
      averageOccupancyRate: 0,
      expenses: {
        electricity: 0,
        water: 0,
        gas: 0,
        maintenance: 0,
        other: 0,
      },
      monthlyData: [],
    };

    // Har bir oy uchun ma'lumotlarni saqlash
    const monthlyOccupancyRates: number[] = [];

    interface ExpensesByType {
      [key: string]: number;
    }

    const expensesByType: ExpensesByType = {};

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
      monthlyOccupancyRates.push(occupancyRate);

      // To'langan ijara summasi
      const payments = await Payment.find({
        ...monthlyQuery,
        paymentType: PaymentType.RENT,
        status: PaymentStatus.PAID,
      });

      const monthlyIncome = payments.reduce(
        (sum, payment) => sum + (payment.amount as number),
        0
      );

      // Xarajatlar
      const expenses = await Expense.find(monthlyQuery);
      const monthlyExpenses = expenses.reduce(
        (sum, expense) => sum + (expense.amount as number),
        0
      );

      // Xarajatlarni turlar bo'yicha taqsimlash
      for (const expense of expenses) {
        const expenseType = expense.expenseType as string;
        expensesByType[expenseType] =
          (expensesByType[expenseType] || 0) + (expense.amount as number);
      }

      // Oylik ma'lumotlar
      yearlyStats.monthlyData.push({
        month,
        income: monthlyIncome,
        expenses: monthlyExpenses,
        netIncome: monthlyIncome - monthlyExpenses,
      });

      // Umumiy yig'indini hisoblash
      yearlyStats.totalIncome += monthlyIncome;
      yearlyStats.totalExpenses += monthlyExpenses;
    }

    // Sof daromad
    yearlyStats.netIncome = yearlyStats.totalIncome - yearlyStats.totalExpenses;

    // O'rtacha band xonalar foizi
    yearlyStats.averageOccupancyRate =
      monthlyOccupancyRates.length > 0
        ? Math.round(
            monthlyOccupancyRates.reduce((sum, rate) => sum + rate, 0) /
              monthlyOccupancyRates.length
          )
        : 0;

    // Xarajatlarni turlar bo'yicha taqsimlash
    yearlyStats.expenses = {
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
    };

    return NextResponse.json({
      year: currentYear,
      ...yearlyStats,
    });
  } catch (error) {
    console.error('Error fetching yearly stats:', error);
    return NextResponse.json(
      {
        error: `Yillik statistikani olishda xatolik: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
