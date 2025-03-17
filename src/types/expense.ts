import { PaymentMethod } from './payment';

export enum ExpenseType {
  ELECTRICITY = 'electricity',
  WATER = 'water',
  GAS = 'gas',
  REPAIR = 'repair',
  MAINTENANCE = 'maintenance',
  TAX = 'tax',
  CLEANING = 'cleaning',
  SECURITY = 'security',
  OTHER = 'other',
}

export interface IExpense {
  _id: string;
  houseId: string;
  roomId?: string;
  expenseType: ExpenseType;
  amount: number;
  paymentMethod: PaymentMethod;
  expenseDate: Date;
  period?: {
    month: number; // 1-12
    year: number;
  };
  paidBy: string;
  notes?: string;
  receiptNumber?: string;
  images?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
