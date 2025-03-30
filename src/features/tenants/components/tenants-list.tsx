'use client';

import { useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Home, Phone, Calendar } from 'lucide-react';
import { TenantStatus, type ITenant } from '@/types';
import { t } from '@/lib/translations';
import { formatDate } from '@/lib/format-date';
import { tenantStatusBadge } from '../constants/label';
import { mockRoomNumbers, mockTenants } from '../constants/mock-data';

const TenantCard = ({ tenant }: { tenant: ITenant }) => {
  const router = useRouter();
  return (
    <Card
      key={tenant._id}
      className="overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => router.push(`/tenants/${tenant._id}`)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{tenant.name}</h3>
            <p className="text-xs text-muted-foreground flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              {tenant.phoneNumber}
            </p>
          </div>
          {tenantStatusBadge[tenant.status]}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3 mb-2">
          <div className="flex items-center">
            <Home className="h-4 w-4 text-muted-foreground mr-1.5" />
            <span className="text-sm truncate">
              {t('room')} {mockRoomNumbers[tenant.roomId]}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-muted-foreground mr-1.5" />
            <span className="text-sm truncate">
              {formatDate(tenant.rentStartDate)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="text-sm">${tenant.monthlyRent}/mo</div>
          <div
            className={`text-sm font-medium ${
              tenant.balance < 0 ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {tenant.balance < 0
              ? `-$${Math.abs(tenant.balance)}`
              : `+$${tenant.balance}`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Empty state component
const EmptyState = () => (
  <div className="text-center py-8">
    <Users className="h-12 w-12 mx-auto text-muted-foreground" />
    <h3 className="mt-2 text-lg font-medium">{t('noTenantsFound')}</h3>
    <p className="text-sm text-muted-foreground">{t('tryAdjustingFilters')}</p>
  </div>
);

export default function TenantsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Memoize the search handler to prevent recreating on every render
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  // Memoize the status change handler
  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  // Memoize filtered tenants to avoid recomputing on every render
  const filteredTenants = useMemo(
    () =>
      mockTenants.filter(tenant => {
        const matchesSearch =
          tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tenant.phoneNumber.includes(searchTerm);
        const matchesStatus =
          statusFilter === 'all' || tenant.status === statusFilter;

        return matchesSearch && matchesStatus;
      }),
    [searchTerm, statusFilter]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder={t('searchTenants')}
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-1"
        />
        <Tabs
          value={statusFilter}
          onValueChange={handleStatusChange}
          className="w-auto"
        >
          <TabsList className="grid grid-cols-3 h-9">
            <TabsTrigger value="all" className="text-xs px-2">
              {t('all')}
            </TabsTrigger>
            <TabsTrigger value={TenantStatus.ACTIVE} className="text-xs px-2">
              {t('active')}
            </TabsTrigger>
            <TabsTrigger value={TenantStatus.FORMER} className="text-xs px-2">
              {t('former')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-3">
        {filteredTenants.length > 0 ? (
          filteredTenants.map(tenant => (
            <TenantCard key={tenant._id} tenant={tenant} />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
