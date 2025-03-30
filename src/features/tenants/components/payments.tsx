import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SwipeAction } from '@/components/ui/swipe-action';
import {
  Calendar,
  CreditCard,
  Filter,
  ChevronRight,
  Edit,
  Trash,
} from 'lucide-react';
import { t } from '@/lib/translations';
import { formatDate } from '@/lib/format-date';
import { type ITenant, PaymentStatus, PaymentType } from '@/types';
import { getMockPayments } from '../constants/mock-data';

export default function TenantPaymentsTab({ tenant }: { tenant: ITenant }) {
  const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [showPaymentFilters, setShowPaymentFilters] = useState(false);

  const mockPayments = getMockPayments();

  // Filter tenant payments based on search and status filter
  const filteredTenantPayments = mockPayments
    .filter(payment => payment.tenantId === tenant._id)
    .filter(payment => {
      const matchesSearch =
        payment.receiptNumber
          .toLowerCase()
          .includes(paymentSearchTerm.toLowerCase()) ||
        payment.paymentType
          .toLowerCase()
          .includes(paymentSearchTerm.toLowerCase());
      const matchesStatus =
        paymentStatusFilter === 'all' || payment.status === paymentStatusFilter;

      return matchesSearch && matchesStatus;
    });

  // Group payments by month
  const groupedPayments = filteredTenantPayments.reduce((groups, payment) => {
    const date = new Date(payment.paymentDate);
    const monthYear = `${date.toLocaleString('default', {
      month: 'long',
    })} ${date.getFullYear()}`;

    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }

    groups[monthYear].push(payment);
    return groups;
  }, {} as Record<string, typeof filteredTenantPayments>);

  return (
    <>
      <PaymentSearchFilters
        searchTerm={paymentSearchTerm}
        onSearchChange={setPaymentSearchTerm}
        showFilters={showPaymentFilters}
        onToggleFilters={() => setShowPaymentFilters(!showPaymentFilters)}
        statusFilter={paymentStatusFilter}
        onStatusFilterChange={setPaymentStatusFilter}
      />

      {Object.entries(groupedPayments).length > 0 ? (
        <PaymentsList groupedPayments={groupedPayments} />
      ) : (
        <EmptyPaymentsState />
      )}
    </>
  );
}

function PaymentSearchFilters({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  statusFilter,
  onStatusFilterChange,
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}) {
  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <Input
          placeholder={t('searchPayments')}
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className="flex-1"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleFilters}
          className={showFilters ? 'bg-muted' : ''}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {showFilters && (
        <div className="mb-4">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-9">
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
      )}
    </>
  );
}

function PaymentsList({
  groupedPayments,
}: {
  groupedPayments: Record<string, any[]>;
}) {
  return (
    <div className="space-y-6">
      {Object.entries(groupedPayments).map(([monthYear, payments]) => (
        <div key={monthYear} className="space-y-3">
          <h3 className="text-sm font-medium sticky top-14 bg-background py-2 z-10">
            {monthYear}
          </h3>

          <div className="space-y-3">
            {payments.map(payment => (
              <PaymentCard key={payment._id} payment={payment} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PaymentCard({ payment }: { payment: any }) {
  return (
    <SwipeAction
      leftAction={{
        label: t('edit'),
        icon: <Edit className="h-4 w-4" />,
        onAction: () => console.log('Edit payment', payment._id),
        variant: 'default',
      }}
      rightAction={{
        label: t('delete'),
        icon: <Trash className="h-4 w-4" />,
        onAction: () => console.log('Delete payment', payment._id),
        variant: 'destructive',
      }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">
                {payment.paymentType === PaymentType.RENT
                  ? `${t('rent')} - ${new Date(
                      0,
                      payment.period.month - 1
                    ).toLocaleString('default', {
                      month: 'long',
                    })} ${payment.period?.year}`
                  : `${t('securityDeposit')}`}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('receipt')}: #{payment.receiptNumber}
              </p>
            </div>
            <PaymentStatusBadge status={payment.status} />
          </div>

          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(payment.paymentDate)}
            </div>
            <div className="text-lg font-bold">${payment.amount}</div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <Badge variant="outline">{t(payment.paymentMethod)}</Badge>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </SwipeAction>
  );
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  switch (status) {
    case PaymentStatus.PAID:
      return <Badge className="bg-green-500 text-white">{t('paid')}</Badge>;
    case PaymentStatus.PENDING:
      return <Badge className="bg-yellow-500 text-black">{t('pending')}</Badge>;
    case PaymentStatus.LATE:
      return <Badge className="bg-red-500 text-white">{t('late')}</Badge>;
    case PaymentStatus.PARTIAL:
      return <Badge className="bg-blue-500 text-white">{t('partial')}</Badge>;
    default:
      return <Badge className="bg-gray-500 text-white">{status}</Badge>;
  }
}

function EmptyPaymentsState() {
  return (
    <div className="text-center py-6">
      <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="mt-2 text-lg font-medium">{t('noPayments')}</h3>
      <p className="text-sm text-muted-foreground">{t('noPaymentsRecorded')}</p>
    </div>
  );
}
