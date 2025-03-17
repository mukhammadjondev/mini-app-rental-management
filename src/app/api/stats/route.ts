import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { House, Room, Tenant, Expense, Payment } from '@/models';
import {
  ExpenseType,
  IMonthlySummary,
  RoomStatus,
  TenantStatus,
  PaymentStatus,
  PaymentType,
} from '@/types';

// Umumiy statistikani olish
export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const houseId = searchParams.get('houseId');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    // Hozirgi oy va yil agar parametrlar berilmagan bo'lsa
    const currentDate = new Date();
    const currentMonth = month ? parseInt(month) : currentDate.getMonth() + 1; // 0-11 => 1-12
    const currentYear = year ? parseInt(year) : currentDate.getFullYear();

    // Asosiy query
    const query: Record<string, unknown> = {};
    if (houseId) {
      query.houseId = houseId;
    }

    // Statistika ma'lumotlari
    interface Stats {
      houses: number;
      rooms: number;
      tenants: number;
      vacantRooms: number;
      occupiedRooms: number;
      occupancyRate: number;
      totalIncome: number;
      totalExpenses: number;
      netIncome: number;
      unpaidRents: number;
      monthlySummary: IMonthlySummary | null;
    }

    const stats: Stats = {
      houses: 0,
      rooms: 0,
      tenants: 0,
      vacantRooms: 0,
      occupiedRooms: 0,
      occupancyRate: 0,
      totalIncome: 0,
      totalExpenses: 0,
      netIncome: 0,
      unpaidRents: 0,
      monthlySummary: null,
    };

    // Uylar soni
    stats.houses = await House.countDocuments(query);

    // Xonalar soni
    const roomQuery = houseId ? { houseId } : {};
    stats.rooms = await Room.countDocuments(roomQuery);

    // Bo'sh va band xonalar soni
    stats.vacantRooms = await Room.countDocuments({
      ...roomQuery,
      status: RoomStatus.VACANT,
    });

    stats.occupiedRooms = await Room.countDocuments({
      ...roomQuery,
      status: RoomStatus.OCCUPIED,
    });

    // Band xonalar foizi
    stats.occupancyRate =
      stats.rooms > 0
        ? Math.round((stats.occupiedRooms / stats.rooms) * 100)
        : 0;

    // Ijarachilar soni
    const tenantQuery = { ...query, status: TenantStatus.ACTIVE };
    stats.tenants = await Tenant.countDocuments(tenantQuery);

    // Oylik ma'lumotlar
    const monthlyQuery = {
      ...query,
      'period.month': currentMonth,
      'period.year': currentYear,
    };

    // To'langan ijara summasi
    const payments = await Payment.find({
      ...monthlyQuery,
      paymentType: PaymentType.RENT,
      status: PaymentStatus.PAID,
    });

    stats.totalIncome = payments.reduce(
      (sum, payment) => sum + (payment.amount as number),
      0
    );

    // To'lanmagan ijara summasi
    const activeTenants = await Tenant.find(tenantQuery);
    const expectedRent = activeTenants.reduce(
      (sum, tenant) => sum + (tenant.monthlyRent as number),
      0
    );

    stats.unpaidRents = Math.max(0, expectedRent - stats.totalIncome);

    // Xarajatlar
    const expenses = await Expense.find(monthlyQuery);
    stats.totalExpenses = expenses.reduce(
      (sum, expense) => sum + (expense.amount as number),
      0
    );

    // Sof daromad
    stats.netIncome = stats.totalIncome - stats.totalExpenses;

    // Oylik umumiy ma'lumot
    interface ExpensesByType {
      [key: string]: number;
    }

    const expensesByType: ExpensesByType = {};
    for (const expense of expenses) {
      const expenseType = expense.expenseType as string;
      expensesByType[expenseType] =
        (expensesByType[expenseType] || 0) + (expense.amount as number);
    }

    stats.monthlySummary = {
      month: currentMonth,
      year: currentYear,
      totalRents: expectedRent,
      totalExpenses: stats.totalExpenses,
      netIncome: stats.netIncome,
      totalPaidRents: stats.totalIncome,
      totalUnpaidRents: stats.unpaidRents,
      occupancyRate: stats.occupancyRate,
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
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      {
        error: `Statistikani olishda xatolik: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
