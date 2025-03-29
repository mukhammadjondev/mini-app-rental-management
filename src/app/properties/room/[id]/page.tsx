'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { IRoom } from '@/types';
import RoomDetail from '@/features/rooms/components/room-detail';
import {
  mockRooms,
  mockTenants,
  mockPayments,
  mockMaintenance,
} from '@/features/rooms/constants/mock-data';

export default function RoomDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [room, setRoom] = useState<IRoom | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    // Find the room from all rooms in all houses
    let foundRoom: IRoom | null = null;

    // Iterate through all houses to find the room
    const roomMatch = mockRooms.find(r => r._id === params.id);
    if (roomMatch) {
      foundRoom = roomMatch;
    }

    if (foundRoom) {
      setRoom(foundRoom);
    } else {
      // Room not found, redirect to properties page
      router.push('/properties');
    }

    setLoading(false);
  }, [params.id, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!room) {
    return <div>Room not found</div>;
  }

  // Filter data specific to this room
  const roomTenants = mockTenants.filter(tenant =>
    room.currentTenants?.includes(tenant.id)
  );

  const roomPayments = mockPayments.filter(payment =>
    room.currentTenants?.includes(payment.tenantId)
  );

  // For maintenance, we'd typically filter by room ID
  const roomMaintenance = mockMaintenance.filter(item => item.id === room._id);

  return (
    <RoomDetail
      room={room}
      tenants={roomTenants}
      payments={roomPayments}
      maintenance={roomMaintenance}
    />
  );
}
