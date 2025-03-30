'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, CreditCard } from 'lucide-react';
import { t } from '@/lib/translations';
import { PaymentFilters } from './payment-filter';
import { PaymentCard } from './payment-card';
import { mockHouses, mockPayments } from '../constants/mock-data';
import { DateRange } from 'react-day-picker';

export default function PaymentsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [tenantFilter, setTenantFilter] = useState<string>('all');
  const [houseFilter, setHouseFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter the payments using useMemo for performance
  const filteredPayments = useMemo(() => {
    return mockPayments.filter(payment => {
      const matchesSearch =
        payment.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.receiptNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.houseAddress.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || payment.status === statusFilter;
      const matchesType =
        typeFilter === 'all' || payment.paymentType === typeFilter;
      const matchesTenant =
        tenantFilter === 'all' || payment.tenantId === tenantFilter;
      const matchesHouse =
        houseFilter === 'all' || payment.houseId === houseFilter;

      let matchesDateRange = true;
      if (dateRange.from && dateRange.to) {
        const paymentDate = new Date(payment.paymentDate);
        matchesDateRange =
          paymentDate >= dateRange.from && paymentDate <= dateRange.to;
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesTenant &&
        matchesHouse &&
        matchesDateRange
      );
    });
  }, [
    searchTerm,
    statusFilter,
    typeFilter,
    tenantFilter,
    houseFilter,
    dateRange,
  ]);

  // Group payments by month using useMemo to avoid recalculation
  const groupedPayments = useMemo(() => {
    return filteredPayments.reduce((groups, payment) => {
      const date = new Date(payment.paymentDate);
      const monthYear = `${date.toLocaleString('default', {
        month: 'long',
      })} ${date.getFullYear()}`;

      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }

      groups[monthYear].push(payment);
      return groups;
    }, {} as Record<string, typeof mockPayments>);
  }, [filteredPayments]);

  const clearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setTenantFilter('all');
    setHouseFilter('all');
    setDateRange({ from: undefined, to: undefined });
  };

  const handleEditPayment = (paymentId: string) => {
    console.log('Edit payment', paymentId);
  };

  const handleDeletePayment = (paymentId: string) => {
    console.log('Delete payment', paymentId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder={t('searchPayments')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'bg-muted' : ''}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {showFilters && (
        <PaymentFilters
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          houseFilter={houseFilter}
          dateRange={dateRange}
          houses={mockHouses}
          onStatusFilterChange={setStatusFilter}
          onTypeFilterChange={setTypeFilter}
          onHouseFilterChange={setHouseFilter}
          onDateRangeChange={setDateRange}
          onClearFilters={clearFilters}
        />
      )}

      <div className="space-y-6">
        {Object.entries(groupedPayments).map(([monthYear, payments]) => (
          <div key={monthYear} className="space-y-3">
            <h3 className="text-sm font-medium sticky top-14 bg-background py-2 z-10">
              {monthYear}
            </h3>

            <div className="space-y-3">
              {payments.map(payment => (
                <PaymentCard
                  key={payment._id}
                  payment={payment}
                  onEdit={() => handleEditPayment(payment._id)}
                  onDelete={() => handleDeletePayment(payment._id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredPayments.length === 0 && <EmptyState />}
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="text-center py-8">
      <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="mt-2 text-lg font-medium">{t('noPaymentsFound')}</h3>
      <p className="text-sm text-muted-foreground">
        {t('tryAdjustingFilters')}
      </p>
    </div>
  );
}
