import { Badge } from '@/components/ui/badge';
import { TenantStatus } from '@/types';
import { t } from '@/lib/translations';

export const tenantStatusBadge = {
  [TenantStatus.ACTIVE]: <Badge className="bg-green-500">{t('active')}</Badge>,
  [TenantStatus.PENDING]: (
    <Badge className="bg-yellow-500">{t('pending')}</Badge>
  ),
  [TenantStatus.FORMER]: <Badge className="bg-gray-500">{t('former')}</Badge>,
};
