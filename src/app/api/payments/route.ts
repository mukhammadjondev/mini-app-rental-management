import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Payment, Tenant } from '@/models';

// Barcha to'lovlarni olish
export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const tenantId = searchParams.get('tenantId');
    const houseId = searchParams.get('houseId');
    const roomId = searchParams.get('roomId');
    const paymentType = searchParams.get('paymentType');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const query: Record<string, unknown> = {};

    if (status) query.status = status;
    if (tenantId) query.tenantId = tenantId;
    if (houseId) query.houseId = houseId;
    if (roomId) query.roomId = roomId;
    if (paymentType) query.paymentType = paymentType;

    if (month && year) {
      query['period.month'] = parseInt(month);
      query['period.year'] = parseInt(year);
    } else if (month) {
      query['period.month'] = parseInt(month);
    } else if (year) {
      query['period.year'] = parseInt(year);
    }

    const payments = await Payment.find(query);
    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json(
      { error: `To'lovlarni olishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}

// Yangi to'lov qo'shish
export async function POST(req: NextRequest) {
  await connectToDatabase();
  try {
    const paymentData = await req.json();

    // Ijarachi mavjudligini tekshirish
    const tenant = await Tenant.findById(paymentData.tenantId);
    if (!tenant) {
      return NextResponse.json(
        { error: "Ko'rsatilgan ijarachi mavjud emas" },
        { status: 404 }
      );
    }

    // To'lov ma'lumotlarini tenant ma'lumotlari bilan solishtirish
    if (
      tenant.roomId.toString() !== paymentData.roomId ||
      tenant.houseId.toString() !== paymentData.houseId
    ) {
      return NextResponse.json(
        {
          error: "To'lov ma'lumotlari ijarachi ma'lumotlariga mos kelmaydi",
        },
        { status: 400 }
      );
    }

    const newPayment = await Payment.create(paymentData);

    // To'lov qo'shilganda ijarachi balansini yangilash
    if (paymentData.paymentType === 'rent') {
      await Tenant.findByIdAndUpdate(paymentData.tenantId, {
        $inc: { balance: paymentData.amount },
      });
    }

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `To'lov qo'shishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}
