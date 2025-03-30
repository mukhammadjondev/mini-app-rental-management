'use client';

import { useState, useMemo } from 'react';
import { DollarSign, Calendar, Home, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExpenseType } from '@/types';
import { formatDate } from '@/lib/format-date';
import { t } from '@/lib/translations';
import { expenseTypeIcons } from '../constants/labels';
import { houses, mockExpenses } from '../constants/mock-data';

export default function ExpensesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [houseFilter, setHouseFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Memoize filtered expenses to prevent unnecessary recalculations
  const filteredExpenses = useMemo(() => {
    return mockExpenses.filter(expense => {
      const matchesSearch =
        searchTerm === '' ||
        expense.houseAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.receiptNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (expense.notes &&
          expense.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType =
        typeFilter === 'all' || expense.expenseType === typeFilter;
      const matchesHouse =
        houseFilter === 'all' || expense.houseId === houseFilter;

      return matchesSearch && matchesType && matchesHouse;
    });
  }, [searchTerm, typeFilter, houseFilter]);

  // Memoize grouped expenses to prevent unnecessary recalculations
  const groupedExpenses = useMemo(() => {
    return filteredExpenses.reduce((groups, expense) => {
      const date = new Date(expense.expenseDate);
      const monthYear = `${date.toLocaleString('default', {
        month: 'long',
      })} ${date.getFullYear()}`;

      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }

      groups[monthYear].push(expense);
      return groups;
    }, {} as Record<string, typeof mockExpenses>);
  }, [filteredExpenses]);

  const toggleFilters = () => setShowFilters(prev => !prev);

  return (
    <div className="space-y-4">
      {/* Search and filter controls */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder={t('searchExpenses')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFilters}
          className={showFilters ? 'bg-muted' : ''}
          aria-label="Toggle filters"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Filter options */}
      {showFilters && (
        <div className="grid grid-cols-2 gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder={t('type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              {Object.values(ExpenseType).map(type => (
                <SelectItem key={type} value={type}>
                  {t(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={houseFilter} onValueChange={setHouseFilter}>
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
        </div>
      )}

      {/* Expense list grouped by month */}
      <div className="space-y-6">
        {Object.entries(groupedExpenses).map(([monthYear, expenses]) => (
          <div key={monthYear} className="space-y-3">
            <h3 className="text-sm font-medium sticky top-14 bg-background py-2 z-10">
              {monthYear}
            </h3>

            <div className="space-y-3">
              {expenses.map(expense => (
                <ExpenseCard
                  key={expense._id}
                  expense={expense}
                  onSelect={() => {}}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredExpenses.length === 0 && (
        <div className="text-center py-8">
          <DollarSign className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">{t('noExpensesFound')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('tryAdjustingFilters')}
          </p>
        </div>
      )}
    </div>
  );
}

// Extracted expense card component for better organization
interface ExpenseCardProps {
  expense: (typeof mockExpenses)[0];
  onSelect: () => void;
}

function ExpenseCard({ expense, onSelect }: ExpenseCardProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <span className="text-xl mr-2">
              {expenseTypeIcons[expense.expenseType]}
            </span>
            <div>
              <h3 className="font-medium">
                {t(expense.expenseType)}
                {expense.period &&
                  ` - ${expense.period.month}/${expense.period.year}`}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('receipt')}: #{expense.receiptNumber}
              </p>
            </div>
          </div>
          <div className="text-lg font-bold text-red-500">
            -${expense.amount}
          </div>
        </div>

        <div className="flex items-center mt-3 mb-2">
          <Home className="h-4 w-4 text-muted-foreground mr-1.5" />
          <span className="text-sm truncate">{expense.houseAddress}</span>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(expense.expenseDate)}
          </div>
          <Badge variant="outline">{t(expense.paymentMethod)}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
