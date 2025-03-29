'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { IHouse, IRoom } from '@/types';
import HouseDetail from '@/features/houses/components/house-detail';
import { mockHouses, mockRooms } from '@/features/houses/constants/mock-data';

export default function HouseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [house, setHouse] = useState<IHouse | null>(null);
  const [rooms, setRooms] = useState<IRoom[]>([]);

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const foundHouse = mockHouses.find(h => h._id === params.id);
    const houseRooms = mockRooms[params.id] || [];

    if (foundHouse) {
      setHouse(foundHouse);
      setRooms(houseRooms);
    } else {
      // House not found, redirect to properties page
      router.push('/properties');
    }
  }, [params.id, router]);

  if (!house) {
    return <div>Loading...</div>;
  }

  return <HouseDetail house={house} rooms={rooms} />;
}
