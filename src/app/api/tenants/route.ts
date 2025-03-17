import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { House, Room, Tenant } from '@/models';

// Barcha ijarachilarni olish
export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const houseId = searchParams.get('houseId');
    const roomId = searchParams.get('roomId');

    const query: { status?: string; houseId?: string; roomId?: string } = {};
    if (status) {
      query.status = status;
    }
    if (houseId) {
      query.houseId = houseId;
    }
    if (roomId) {
      query.roomId = roomId;
    }

    const tenants = await Tenant.find(query);
    return NextResponse.json(tenants);
  } catch (error) {
    return NextResponse.json(
      { error: `Ijarachilarni olishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}

// Yangi ijarachi qo'shish
export async function POST(req: NextRequest) {
  await connectToDatabase();
  try {
    const tenantData = await req.json();

    // Xona va uy mavjudligini tekshirish
    const room = await Room.findById(tenantData.roomId);
    if (!room) {
      return NextResponse.json(
        { error: "Ko'rsatilgan xona mavjud emas" },
        { status: 404 }
      );
    }

    const house = await House.findById(tenantData.houseId);
    if (!house) {
      return NextResponse.json(
        { error: "Ko'rsatilgan uy mavjud emas" },
        { status: 404 }
      );
    }

    // Xona va uy bir-biriga mos kelishini tekshirish
    if (room.houseId.toString() !== tenantData.houseId) {
      return NextResponse.json(
        {
          error: 'Xona va uy bir-biriga mos kelmaydi',
        },
        { status: 400 }
      );
    }

    // Xonada joy borligini tekshirish
    if (tenantData.status === 'active') {
      const activeTenantsCount = await Tenant.countDocuments({
        roomId: tenantData.roomId,
        status: 'active',
      });

      if (activeTenantsCount >= room.maxTenants) {
        return NextResponse.json(
          {
            error:
              "Bu xonada bo'sh joy qolmagan. Maksimal ijaragirlar soni: " +
              room.maxTenants,
          },
          { status: 400 }
        );
      }
    }

    const newTenant = await Tenant.create(tenantData);

    // Ijarachi qo'shilganda xona statusini yangilash
    if (tenantData.status === 'active') {
      await Room.findByIdAndUpdate(tenantData.roomId, {
        status: 'occupied',
        $push: { currentTenants: newTenant._id },
      });
    }

    return NextResponse.json(newTenant, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Ijarachi qo'shishda xatolik: ${error}` },
      { status: 500 }
    );
  }
}
