import axiosInstance from '@/core/axios';
import { IExpense, ExpenseType } from '@/types/expense';

// Get all expenses
export const getAllExpenses = async (): Promise<IExpense[]> => {
  const response = await axiosInstance.get('/expenses');
  return response.data;
};

// Get expense by ID
export const getExpenseById = async (id: string): Promise<IExpense> => {
  const response = await axiosInstance.get(`/expenses/${id}`);
  return response.data;
};

// Get expenses by house ID
export const getExpensesByHouseId = async (
  houseId: string
): Promise<IExpense[]> => {
  const response = await axiosInstance.get(`/houses/${houseId}/expenses`);
  return response.data;
};

// Get expenses by room ID
export const getExpensesByRoomId = async (
  roomId: string
): Promise<IExpense[]> => {
  const response = await axiosInstance.get(`/rooms/${roomId}/expenses`);
  return response.data;
};

// Get expenses by type
export const getExpensesByType = async (
  type: ExpenseType
): Promise<IExpense[]> => {
  const response = await axiosInstance.get(`/expenses/type/${type}`);
  return response.data;
};

// Get expenses by date range
export const getExpensesByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<IExpense[]> => {
  const response = await axiosInstance.get('/expenses/date-range', {
    params: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
  });
  return response.data;
};

// Create new expense
export const createExpense = async (
  expense: Omit<IExpense, '_id' | 'createdAt' | 'updatedAt'>
): Promise<IExpense> => {
  const response = await axiosInstance.post('/expenses', expense);
  return response.data;
};

// Update expense
export const updateExpense = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<IExpense>;
}): Promise<IExpense> => {
  const response = await axiosInstance.put(`/expenses/${id}`, data);
  return response.data;
};

// Delete expense
export const deleteExpense = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/expenses/${id}`);
};
