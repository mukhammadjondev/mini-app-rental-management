'use client';

import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { type PropsWithChildren, useEffect } from 'react';
import { miniApp, useLaunchParams, useSignal } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';

import { init } from '@/core/init';
import { MobileHeader } from '@/layout/mobile-header';
import { BottomNavigation } from '@/layout/bottom-navigation';
import { useTelegramMock } from '@/hooks/useTelegramMock';
import { useClientOnce } from '@/hooks/useClientOnce';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorPage } from '@/components/ErrorPage';

function RootInner({ children }: PropsWithChildren) {
  const isDev = process.env.NODE_ENV === 'development';
  const pathname = usePathname();
  const router = useRouter();

  const showBack =
    pathname.includes('/tenants/') || pathname.includes('/payments/');

  if (isDev) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTelegramMock();
  }

  const lp = useLaunchParams();
  const debug = isDev || lp.startParam === 'debug';

  useClientOnce(() => {
    init(debug);
  });

  const isDark = useSignal(miniApp.isDark);
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(false ? 'dark' : 'light');
  }, [isDark, setTheme]);

  return (
    <AppRoot
      appearance={false ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <MobileHeader
        title="App Title"
        showBack={showBack}
        onBack={() => router.back()}
        showSearch={!['/', '/more'].includes(pathname)}
        notifications={3}
        onNotificationsClick={() => router.push('/notifications')}
      />
      <main className="flex-1 p-4 pt-16 pb-20">{children}</main>
      <BottomNavigation />
    </AppRoot>
  );
}

export function Root(props: PropsWithChildren) {
  return (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  );
}
