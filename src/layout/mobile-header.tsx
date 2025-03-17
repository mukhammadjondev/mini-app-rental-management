'use client';

import { useState } from 'react';
import { ArrowLeft, Bell, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { t } from '@/lib/translations';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
  notifications?: number;
  onNotificationsClick?: () => void;
}

export function MobileHeader({
  title,
  showBack = false,
  onBack,
  showSearch = false,
  notifications = 0,
  onNotificationsClick,
}: MobileHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchClose = () => setSearchOpen(false);
  const handleSearchOpen = () => setSearchOpen(true);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4">
      {showBack && (
        <Button variant="ghost" size="icon" className="mr-1" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">{t('back')}</span>
        </Button>
      )}

      {searchOpen ? (
        <div className="flex flex-1 items-center">
          <Input
            type="search"
            placeholder={t('search')}
            className="h-9 flex-1"
            autoFocus
          />
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={handleSearchClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">{t('closeSearch')}</span>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>

          <div className="flex items-center gap-2">
            {showSearch && (
              <Button variant="ghost" size="icon" onClick={handleSearchOpen}>
                <Search className="h-5 w-5" />
                <span className="sr-only">{t('search')}</span>
              </Button>
            )}

            {onNotificationsClick && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={onNotificationsClick}
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {notifications}
                  </Badge>
                )}
                <span className="sr-only">{t('notifications')}</span>
              </Button>
            )}
          </div>
        </>
      )}
    </header>
  );
}
