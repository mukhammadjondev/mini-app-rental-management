import { t } from '@/lib/translations';
import { RoomStatus } from '@/types';

export const roomStatusColor: Record<RoomStatus, string> = {
  [RoomStatus.OCCUPIED]: 'bg-green-500',
  [RoomStatus.VACANT]: 'bg-blue-500',
  [RoomStatus.RESERVED]: 'bg-purple-500',
  [RoomStatus.MAINTENANCE]: 'bg-yellow-500',
};

export const roomStatusOptions: Record<RoomStatus, string> = {
  [RoomStatus.OCCUPIED]: t('occupied'),
  [RoomStatus.VACANT]: t('vacant'),
  [RoomStatus.RESERVED]: t('reserved'),
  [RoomStatus.MAINTENANCE]: t('maintenance'),
};
