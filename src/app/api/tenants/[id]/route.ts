import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Room, Tenant } from '@/models';
import mongoose from 'mongoose';

// Bitta ijarachini ID bo'yicha olish
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

    const tenant = await Tenant.findById(id);

    if (!tenant) {
      return NextResponse.json(
        { error: 'Ijarachi topilmadi' },
        { status: 404 }
      );
    }

    return NextResponse.json(tenant);
  } catch (error) {
    return NextResponse.json(
      { error: `Ijarachini olishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}

// Ijarachini yangilash
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

    const currentTenant = await Tenant.findById(id);
    if (!currentTenant) {
      return NextResponse.json(
        { error: 'Ijarachi topilmadi' },
        { status: 404 }
      );
    }

    // Status o'zgargan bo'lsa, xona statusini ham yangilash
    if (updateData.status && updateData.status !== currentTenant.status) {
      // Agar ijarachi 'active' dan boshqa statusga o'tsa
      if (currentTenant.status === 'active' && updateData.status !== 'active') {
        await Room.findByIdAndUpdate(currentTenant.roomId, {
          status: 'vacant',
          $pull: { currentTenants: currentTenant._id },
        });
      }
      // Agar ijarachi boshqa statusdan 'active' ga o'tsa
      else if (
        currentTenant.status !== 'active' &&
        updateData.status === 'active'
      ) {
        // Xonada boshqa active ijarachilar bor-yo'qligini tekshirish
        const activeTenantsCount = await Tenant.countDocuments({
          roomId: currentTenant.roomId,
          status: 'active',
          _id: { $ne: id },
        });

        if (activeTenantsCount > 0) {
          return NextResponse.json(
            {
              error: 'Bu xona allaqachon band qilingan',
            },
            { status: 400 }
          );
        }

        await Room.findByIdAndUpdate(currentTenant.roomId, {
          status: 'occupied',
          $addToSet: { currentTenants: currentTenant._id },
        });
      }
    }

    const updatedTenant = await Tenant.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedTenant);
  } catch (error) {
    return NextResponse.json(
      { error: `Ijarachini yangilashda xatolik: ${error}` },
      { status: 500 }
    );
  }
}

// Ijarachini o'chirish
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

    const tenant = await Tenant.findById(id);

    if (!tenant) {
      return NextResponse.json(
        { error: 'Ijarachi topilmadi' },
        { status: 404 }
      );
    }

    // Ijarachi active bo'lsa, xona statusini o'zgartirish
    if (tenant.status === 'active') {
      await Room.findByIdAndUpdate(tenant.roomId, {
        status: 'vacant',
        $pull: { currentTenants: tenant._id },
      });
    }

    await Tenant.findByIdAndDelete(id);

    return NextResponse.json({ message: "Ijarachi muvaffaqiyatli o'chirildi" });
  } catch (error) {
    return NextResponse.json(
      { error: `Ijarachini o'chirishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}
