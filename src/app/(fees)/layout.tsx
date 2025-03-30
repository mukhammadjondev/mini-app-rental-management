'use client';

import { usePathname, useRouter } from 'next/navigation';
import { t } from '@/lib/translations';
import { TabsList } from '@telegram-apps/telegram-ui';

const labels = [
  { value: '/payments', label: t('payments') },
  { value: '/expenses', label: t('expenses') },
];

export default function FeesLayout({
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
