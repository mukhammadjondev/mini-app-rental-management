'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Building,
  Users,
  CreditCard,
  MoreHorizontal,
} from 'lucide-react';
import { t } from '@/lib/translations';
import { cn } from '@/lib/utils';

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
    path: '/properties',
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
  {
    label: t('more'),
    icon: MoreHorizontal,
    path: '/more',
    activePaths: [
      '/more',
      '/statistics',
      '/documents',
      '/maintenance',
      '/notifications',
    ],
  },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="grid grid-cols-5 h-16">
        {navItems.map(({ label, icon: Icon, path, activePaths }) => {
          const isActive = activePaths.some(p =>
            p === '/' ? pathname === '/' : pathname.startsWith(p)
          );

          return (
            <Link
              key={label}
              href={path}
              className={cn(
                'flex flex-col items-center justify-center gap-1',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
