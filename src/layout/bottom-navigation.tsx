'use client';

import { usePathname } from 'next/navigation';
import { Home, Building, Users, CreditCard } from 'lucide-react';
import { Tabbar } from '@telegram-apps/telegram-ui';
import { t } from '@/lib/translations';
import { Link } from '@/components/Link/Link';

const navItems = [
  {
    label: t('home'),
    icon: Home,
    path: '/',
    activePaths: ['/'],
  },
  {
    label: t('properties'),
    icon: Building,
    path: '/properties/houses',
    activePaths: ['/properties', '/houses', '/rooms'],
  },
  {
    label: t('tenants'),
    icon: Users,
    path: '/tenants',
    activePaths: ['/tenants'],
  },
  {
    label: t('payments'),
    icon: CreditCard,
    path: '/payments',
    activePaths: ['/payments', '/expenses'],
  },
  // {
  //   label: t('more'),
  //   icon: MoreHorizontal,
  //   path: '/more',
  //   activePaths: [
  //     '/more',
  //     '/statistics',
  //     '/documents',
  //     '/maintenance',
  //     '/notifications',
  //   ],
  // },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <Tabbar className="z-50">
      {navItems.map(({ label, icon: Icon, path, activePaths }) => {
        const isActive = activePaths.some(p =>
          p === '/' ? pathname === '/' : pathname.startsWith(p)
        );

        return (
          <Tabbar.Item key={label} text={label} selected={isActive}>
            <Link href={path}>
              <Icon className="h-5 w-5" />
            </Link>
          </Tabbar.Item>
        );
      })}
    </Tabbar>
  );
}
