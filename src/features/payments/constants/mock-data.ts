import { PaymentStatus, PaymentType, PaymentMethod } from '@/types';

export const mockPayments = [
  {
    _id: 'p1',
    tenantId: 't1',
    tenantName: 'John Doe',
    roomId: 'r1',
    roomNumber: '101',
    houseId: 'h1',
    houseAddress: '123 Main Street',
    amount: 300,
    paymentType: PaymentType.RENT,
    paymentMethod: PaymentMethod.CASH,
    paymentDate: new Date('2023-02-01'),
    period: { month: 2, year: 2023 },
    status: PaymentStatus.PAID,
    receiptNumber: 'REC-001',
  },
  {
    _id: 'p2',
    tenantId: 't1',
    tenantName: 'John Doe',
    roomId: 'r1',
    roomNumber: '101',
    houseId: 'h1',
    houseAddress: '123 Main Street',
    amount: 300,
    paymentType: PaymentType.RENT,
    paymentMethod: PaymentMethod.TRANSFER,
    paymentDate: new Date('2023-03-02'),
    period: { month: 3, year: 2023 },
    status: PaymentStatus.PAID,
    receiptNumber: 'REC-015',
  },
  {
    _id: 'p3',
    tenantId: 't1',
    tenantName: 'John Doe',
    roomId: 'r1',
    roomNumber: '101',
    houseId: 'h1',
    houseAddress: '123 Main Street',
    amount: 600,
    paymentType: PaymentType.DEPOSIT,
    paymentMethod: PaymentMethod.CASH,
    paymentDate: new Date('2023-01-15'),
    status: PaymentStatus.PAID,
    receiptNumber: 'DEP-001',
  },
  {
    _id: 'p4',
    tenantId: 't2',
    tenantName: 'Jane Smith',
    roomId: 'r2',
    roomNumber: '102',
    houseId: 'h1',
    houseAddress: '123 Main Street',
    amount: 150,
    paymentType: PaymentType.RENT,
    paymentMethod: PaymentMethod.CASH,
    paymentDate: new Date('2023-03-05'),
    period: { month: 3, year: 2023 },
    status: PaymentStatus.PARTIAL,
    receiptNumber: 'REC-018',
  },
  {
    _id: 'p5',
    tenantId: 't3',
    tenantName: 'Mike Johnson',
    roomId: 'r4',
    roomNumber: '201',
    houseId: 'h1',
    houseAddress: '123 Main Street',
    amount: 320,
    paymentType: PaymentType.RENT,
    paymentMethod: PaymentMethod.TRANSFER,
    paymentDate: new Date('2023-03-01'),
    period: { month: 3, year: 2023 },
    status: PaymentStatus.PAID,
    receiptNumber: 'REC-020',
  },
  {
    _id: 'p6',
    tenantId: 't6',
    tenantName: 'Sarah Williams',
    roomId: 'r7',
    roomNumber: '101',
    houseId: 'h2',
    houseAddress: '456 Oak Avenue',
    amount: 250,
    paymentType: PaymentType.RENT,
    paymentMethod: PaymentMethod.CASH,
    paymentDate: new Date('2023-03-10'),
    dueDate: new Date('2023-03-05'),
    period: { month: 3, year: 2023 },
    status: PaymentStatus.LATE,
    receiptNumber: 'REC-022',
  },
];

export const mockHouses = [
  { id: 'h1', address: '123 Main Street' },
  { id: 'h2', address: '456 Oak Avenue' },
  { id: 'h3', address: '789 Pine Road' },
  { id: 'h4', address: '101 Cedar Lane' },
];
