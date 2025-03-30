import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Phone, Calendar, DollarSign, CreditCard } from 'lucide-react';
import { t } from '@/lib/translations';
import { formatDate } from '@/lib/format-date';
import { type ITenant } from '@/types';
import { tenantStatusBadge } from '../constants/label';

interface TenantSummaryCardProps {
  tenant: ITenant;
  houseAddress: string;
  roomNumber: string;
}

export default function TenantSummaryCard({
  tenant,
  houseAddress,
  roomNumber,
}: TenantSummaryCardProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{tenant.name}</CardTitle>
            <CardDescription className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              {tenant.phoneNumber}
            </CardDescription>
          </div>
          {tenantStatusBadge[tenant.status]}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <InfoItem
            icon={<Home className="h-5 w-5 text-muted-foreground" />}
            label={t('location')}
            value={`${houseAddress}, ${t('room')} ${roomNumber}`}
          />
          <InfoItem
            icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
            label={t('startDate')}
            value={formatDate(tenant.rentStartDate)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <InfoItem
            icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
            label={t('monthlyRent')}
            value={`$${tenant.monthlyRent}`}
          />
          <InfoItem
            icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
            label={t('securityDeposit')}
            value={`$${tenant.securityDeposit}`}
          />
        </div>

        <BalanceDisplay balance={tenant.balance} />

        <div className="flex space-x-2 w-full">
          <Button className="flex-1">
            <CreditCard className="h-4 w-4 mr-2" />
            {t('recordPayment')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center space-x-2">
    {icon}
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-base">{value}</div>
    </div>
  </div>
);

const BalanceDisplay = ({ balance }: { balance: number }) => (
  <div className="flex items-center space-x-2">
    <DollarSign
      className={`h-5 w-5 ${balance < 0 ? 'text-red-500' : 'text-green-500'}`}
    />
    <div>
      <div className="text-sm font-medium">{t('currentBalance')}</div>
      <div
        className={`text-xl font-bold ${
          balance < 0 ? 'text-red-500' : 'text-green-500'
        }`}
      >
        ${Math.abs(balance)} {balance < 0 ? t('due') : t('credit')}
      </div>
    </div>
  </div>
);
