'use client';

import { useState } from 'react';
import { TabsList } from '@telegram-apps/telegram-ui';
import { t } from '@/lib/translations';
import HousesList from '@/features/houses/components/houses-list';
import RoomsList from '@/features/rooms/components/rooms-list';

const labels = [
  { value: 'houses', label: t('houses') },
  { value: 'rooms', label: t('rooms') },
];

export default function PropertiesPage() {
  const [selected, setSelected] = useState(labels[0].value);

  return (
    <div className="pb-4">
      <TabsList className="mb-4">
        {labels.map(({ value, label }) => (
          <TabsList.Item
            key={value}
            selected={selected === value}
            onClick={() => setSelected(value)}
          >
            {label}
          </TabsList.Item>
        ))}
      </TabsList>

      {selected === 'houses' ? <HousesList /> : <RoomsList />}
    </div>
  );
}
