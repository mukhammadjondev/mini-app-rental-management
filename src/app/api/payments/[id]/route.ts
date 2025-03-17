import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Payment, Tenant } from '@/models';
import mongoose from 'mongoose';

// Bitta to'lovni ID bo'yicha olish
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

    const payment = await Payment.findById(id);

    if (!payment) {
      return NextResponse.json({ error: "To'lov topilmadi" }, { status: 404 });
    }

    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json(
      { error: `To'lovni olishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}

// To'lovni yangilash
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

    const currentPayment = await Payment.findById(id);
    if (!currentPayment) {
      return NextResponse.json({ error: "To'lov topilmadi" }, { status: 404 });
    }

    // To'lov summasi o'zgargan bo'lsa, ijarachi balansini ham yangilash
    if (
      updateData.amount &&
      updateData.amount !== currentPayment.amount &&
      currentPayment.paymentType === 'rent'
    ) {
      const difference = updateData.amount - currentPayment.amount;
      await Tenant.findByIdAndUpdate(currentPayment.tenantId, {
        $inc: { balance: difference },
      });
    }

    const updatedPayment = await Payment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedPayment);
  } catch (error) {
    return NextResponse.json(
      { error: `To'lovni yangilashda xatolik: ${error}` },
      { status: 500 }
    );
  }
}

// To'lovni o'chirish
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

    const payment = await Payment.findById(id);

    if (!payment) {
      return NextResponse.json({ error: "To'lov topilmadi" }, { status: 404 });
    }

    // To'lov o'chirilganda ijarachi balansini yangilash
    if (payment.paymentType === 'rent') {
      await Tenant.findByIdAndUpdate(payment.tenantId, {
        $inc: { balance: -payment.amount },
      });
    }

    await Payment.findByIdAndDelete(id);

    return NextResponse.json({ message: "To'lov muvaffaqiyatli o'chirildi" });
  } catch (error) {
    return NextResponse.json(
      { error: `To'lovni o'chirishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}
