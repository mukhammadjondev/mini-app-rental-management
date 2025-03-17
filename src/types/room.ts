export enum RoomStatus {
  VACANT = 'vacant',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance',
}

export interface IRoom {
  _id?: string;
  houseId: string;
  roomNumber: string;
  monthlyRent: number;
  description?: string;
  status: RoomStatus;
  amenities?: string[];
  currentTenants?: string[] | null;
  maxTenants: number;
  createdAt?: Date;
  updatedAt?: Date;
}
