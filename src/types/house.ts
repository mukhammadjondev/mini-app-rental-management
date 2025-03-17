export enum HouseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

export interface IHouse {
  _id?: string;
  address: string;
  totalRooms: number;
  monthlyBaseRent: number;
  description?: string;
  status: HouseStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
