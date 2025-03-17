export enum PaymentType {
  RENT = 'rent',
  DEPOSIT = 'deposit',
  FINE = 'fine',
  OTHER = 'other',
}

export enum PaymentMethod {
  CASH = 'cash',
  TRANSFER = 'transfer',
  CARD = 'card',
  OTHER = 'other',
}

export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  LATE = 'late',
  PARTIAL = 'partial',
}

export interface IPayment {
  _id: string;
  tenantId: string;
  roomId: string;
  houseId: string;
  amount: number;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  dueDate?: Date;
  period?: {
    month: number; // 1-12
    year: number;
  };
  status: PaymentStatus;
  notes?: string;
  receiptNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
