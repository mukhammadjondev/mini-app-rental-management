'use client';

import * as React from 'react';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { t } from '@/lib/translations';

interface DateRangePickerProps {
  className?: string;
  initialDateRange?: DateRange;
  onUpdate: (dateRange: DateRange) => void;
}

export function DateRangePicker({
  className,
  initialDateRange,
  onUpdate,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    initialDateRange
  );

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    if (range) {
      onUpdate(range);
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={handleSelect}
        numberOfMonths={2}
      />
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setDate(undefined);
            onUpdate({ from: undefined, to: undefined });
          }}
        >
          {t('clear')}
        </Button>
        <Button
          size="sm"
          onClick={() => {
            if (date?.from && date?.to) {
              onUpdate(date);
            }
          }}
        >
          {t('apply')}
        </Button>
      </div>
    </div>
  );
}
