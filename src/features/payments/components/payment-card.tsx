import { JSX } from 'react';
import { Calendar, Edit, Home, Trash, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SwipeAction } from '@/components/ui/swipe-action';
import { IPayment, PaymentStatus, PaymentType } from '@/types';
import { t } from '@/lib/translations';
import { formatDate } from '@/lib/format-date';

const paymentStatusBadge: Record<PaymentStatus, JSX.Element> = {
  [PaymentStatus.PAID]: <Badge className="bg-green-500">{t('paid')}</Badge>,
  [PaymentStatus.PENDING]: (
    <Badge className="bg-yellow-500">{t('pending')}</Badge>
  ),
  [PaymentStatus.LATE]: <Badge className="bg-red-500">{t('late')}</Badge>,
  [PaymentStatus.PARTIAL]: (
    <Badge className="bg-blue-500">{t('partial')}</Badge>
  ),
};

interface PaymentCardProps {
  payment: IPayment;
  onEdit: () => void;
  onDelete: () => void;
}

export function PaymentCard({ payment, onEdit, onDelete }: PaymentCardProps) {
  return (
    <SwipeAction
      leftAction={{
        label: t('edit'),
        icon: <Edit className="h-4 w-4" />,
        onAction: onEdit,
        variant: 'default',
      }}
      rightAction={{
        label: t('delete'),
        icon: <Trash className="h-4 w-4" />,
        onAction: onDelete,
        variant: 'destructive',
      }}
    >
      <Card className="overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">
                {payment.paymentType === PaymentType.RENT
                  ? `${t('rent')} - ${payment.tenantId}`
                  : payment.paymentType === PaymentType.DEPOSIT
                  ? `${t('deposit')} - ${payment.tenantId}`
                  : payment.paymentType}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('receipt')}: #{payment.receiptNumber}
              </p>
            </div>
            {paymentStatusBadge[payment.status]}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3 mb-2">
            <div className="flex items-center">
              <User className="h-4 w-4 text-muted-foreground mr-1.5" />
              <span className="text-sm truncate">{payment.tenantId}</span>
            </div>
            <div className="flex items-center">
              <Home className="h-4 w-4 text-muted-foreground mr-1.5" />
              <span className="text-sm truncate">
                {t('room')} {payment.roomId}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(payment.paymentDate)}
            </div>
            <div className="text-lg font-bold">${payment.amount}</div>
          </div>
        </CardContent>
      </Card>
    </SwipeAction>
  );
}
