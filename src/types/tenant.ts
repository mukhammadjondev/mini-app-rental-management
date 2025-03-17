export enum TenantStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  FORMER = 'former',
}

export interface ITenant {
  _id?: string;
  name: string;
  phoneNumber: string;
  identificationDocument?: string;
  rentStartDate: Date;
  rentEndDate?: Date;
  monthlyRent: number;
  securityDeposit: number;
  balance: number;
  roomId: string;
  houseId: string;
  status: TenantStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
