'use client';

import { usePathname, useRouter } from 'next/navigation';
import { TabsList } from '@telegram-apps/telegram-ui';
import { t } from '@/lib/translations';

const labels = [
  { value: '/properties/houses', label: t('houses') },
  { value: '/properties/rooms', label: t('rooms') },
];

export default function PropertiesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const path = usePathname();

  return (
    <div className="pb-4">
      <TabsList className="mb-4">
        {labels.map(({ value, label }) => (
          <TabsList.Item
            key={value}
            selected={path === value}
            onClick={() => router.push(value)}
          >
            {label}
          </TabsList.Item>
        ))}
      </TabsList>

      {children}
    </div>
  );
}
