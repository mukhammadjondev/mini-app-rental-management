import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { PaymentStatus, PaymentType } from '@/types';
import { t } from '@/lib/translations';
import { DateRange } from 'react-day-picker';

interface PaymentFiltersProps {
  statusFilter: string;
  typeFilter: string;
  houseFilter: string;
  dateRange: DateRange;
  houses: Array<{ id: string; address: string }>;
  onStatusFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onHouseFilterChange: (value: string) => void;
  onDateRangeChange: (dateRange: DateRange) => void;
  onClearFilters: () => void;
}

export function PaymentFilters({
  statusFilter,
  typeFilter,
  houseFilter,
  dateRange,
  houses,
  onStatusFilterChange,
  onTypeFilterChange,
  onHouseFilterChange,
  onDateRangeChange,
  onClearFilters,
}: PaymentFiltersProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-3 bg-muted p-4 rounded-lg">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder={t('status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value={PaymentStatus.PAID}>{t('paid')}</SelectItem>
              <SelectItem value={PaymentStatus.PENDING}>
                {t('pending')}
              </SelectItem>
              <SelectItem value={PaymentStatus.LATE}>{t('late')}</SelectItem>
              <SelectItem value={PaymentStatus.PARTIAL}>
                {t('partial')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder={t('type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value={PaymentType.RENT}>{t('rent')}</SelectItem>
              <SelectItem value={PaymentType.DEPOSIT}>
                {t('deposit')}
              </SelectItem>
              <SelectItem value={PaymentType.FINE}>{t('fine')}</SelectItem>
              <SelectItem value={PaymentType.OTHER}>{t('other')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Select value={houseFilter} onValueChange={onHouseFilterChange}>
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder={t('house')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allHouses')}</SelectItem>
            {houses.map(house => (
              <SelectItem key={house.id} value={house.id}>
                {house.address}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {dateRange.from && dateRange.to ? (
                <span>
                  {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                </span>
              ) : (
                <span>{t('dateRange')}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <DateRangePicker
              initialDateRange={dateRange}
              onUpdate={onDateRangeChange}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button variant="secondary" className="w-full" onClick={onClearFilters}>
        {t('clearFilters')}
      </Button>
    </div>
  );
}
