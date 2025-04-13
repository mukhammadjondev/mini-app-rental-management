import { t } from '@/lib/translations';
import { HouseStatus } from '@/types';

export const houseStatusColor: Record<HouseStatus, string> = {
  [HouseStatus.ACTIVE]: 'bg-green-500',
  [HouseStatus.INACTIVE]: 'bg-gray-500',
  [HouseStatus.MAINTENANCE]: 'bg-yellow-500',
};

export const houseStatusOptions = [
  { label: t('all'), value: 'all' },
  { label: t('active'), value: HouseStatus.ACTIVE },
  { label: t('inactive'), value: HouseStatus.INACTIVE },
  { label: t('maintenance'), value: HouseStatus.MAINTENANCE },
];
