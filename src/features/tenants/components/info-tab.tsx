import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { t } from '@/lib/translations';
import { formatDate } from '@/lib/format-date';
import { type ITenant } from '@/types';

interface TenantInfoTabProps {
  tenant: ITenant;
  houseAddress: string;
  roomNumber: string;
}

export default function TenantInfoTab({
  tenant,
  houseAddress,
  roomNumber,
}: TenantInfoTabProps) {
  return (
    <>
      <Card>
        <CardContent className="p-4 space-y-2">
          <CardTitle className="text-base">{t('personalInfo')}</CardTitle>
          <div className="grid grid-cols-2 gap-4">
            <InfoField label={t('fullName')} value={tenant.name} />
            <InfoField label={t('phoneNumber')} value={tenant.phoneNumber} />
          </div>

          {tenant.identificationDocument && (
            <InfoField
              label={t('idDocument')}
              value={tenant.identificationDocument}
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <InfoField
              label={t('rentStartDate')}
              value={formatDate(tenant.rentStartDate)}
            />
            {tenant.rentEndDate && (
              <InfoField
                label={t('rentEndDate')}
                value={formatDate(tenant.rentEndDate)}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <CardTitle className="text-base">{t('rentalInfo')}</CardTitle>
          <div className="grid grid-cols-2 gap-4">
            <InfoField label={t('house')} value={houseAddress} />
            <InfoField label={t('room')} value={`${t('room')} ${roomNumber}`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoField
              label={t('monthlyRent')}
              value={`$${tenant.monthlyRent}`}
            />
            <InfoField
              label={t('securityDeposit')}
              value={`$${tenant.securityDeposit}`}
            />
          </div>

          <div>
            <span className="text-sm text-muted-foreground">
              {t('currentBalance')}
            </span>
            <div
              className={`font-medium ${
                tenant.balance < 0 ? 'text-red-500' : 'text-green-500'
              }`}
            >
              ${Math.abs(tenant.balance)}{' '}
              {tenant.balance < 0 ? t('due') : t('credit')}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="text-sm text-muted-foreground">{label}</span>
    <div className="font-medium">{value}</div>
  </div>
);
