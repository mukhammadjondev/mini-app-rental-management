// src/types/house
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

// src/types/room
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

// src/types/tenant
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

// src/types/payment
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

// src/types/expense
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

// src/types/stats
// Monthly summary interface for reports
export interface IMonthlySummary {
  month: number;
  year: number;
  totalRents: number;
  totalExpenses: number;
  netIncome: number;
  totalPaidRents: number;
  totalUnpaidRents: number;
  occupancyRate: number;
  expenses: {
    electricity: number;
    water: number;
    gas: number;
    maintenance: number;
    other: number;
  };
}

export interface MonthlyStats {
  month: number;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  occupancyRate: number;
  expenses: {
    electricity: number;
    water: number;
    gas: number;
    maintenance: number;
    other: number;
  };
}

export interface YearlyStatsSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  averageOccupancyRate: number;
  expenses: {
    electricity: number;
    water: number;
    gas: number;
    maintenance: number;
    other: number;
  };
  monthlyData: {
    month: number;
    income: number;
    expenses: number;
    netIncome: number;
  }[];
}
