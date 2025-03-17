import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllExpenses,
  getExpenseById,
  getExpensesByHouseId,
  getExpensesByRoomId,
  getExpensesByType,
  getExpensesByDateRange,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../api/expensesApi';
import { IExpense, ExpenseType } from '@/types/expense';

// Query keys
export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...expenseKeys.lists(), { filters }] as const,
  byHouse: (houseId: string) => [...expenseKeys.lists(), { houseId }] as const,
  byRoom: (roomId: string) => [...expenseKeys.lists(), { roomId }] as const,
  byType: (type: ExpenseType) => [...expenseKeys.lists(), { type }] as const,
  byDateRange: (startDate: Date, endDate: Date) =>
    [...expenseKeys.lists(), { startDate, endDate }] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
};

// Get all expenses
export const useExpenses = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: expenseKeys.list(filters || {}),
    queryFn: () => getAllExpenses(),
  });
};

// Get expense by ID
export const useExpense = (id: string) => {
  return useQuery({
    queryKey: expenseKeys.detail(id),
    queryFn: () => getExpenseById(id),
    enabled: !!id,
  });
};

// Get expenses by house ID
export const useExpensesByHouse = (houseId: string) => {
  return useQuery({
    queryKey: expenseKeys.byHouse(houseId),
    queryFn: () => getExpensesByHouseId(houseId),
    enabled: !!houseId,
  });
};

// Get expenses by room ID
export const useExpensesByRoom = (roomId: string) => {
  return useQuery({
    queryKey: expenseKeys.byRoom(roomId),
    queryFn: () => getExpensesByRoomId(roomId),
    enabled: !!roomId,
  });
};

// Get expenses by type
export const useExpensesByType = (type: ExpenseType) => {
  return useQuery({
    queryKey: expenseKeys.byType(type),
    queryFn: () => getExpensesByType(type),
    enabled: !!type,
  });
};

// Get expenses by date range
export const useExpensesByDateRange = (startDate: Date, endDate: Date) => {
  return useQuery({
    queryKey: expenseKeys.byDateRange(startDate, endDate),
    queryFn: () => getExpensesByDateRange(startDate, endDate),
    enabled: !!(startDate && endDate),
  });
};

// Create expense
export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expense: Omit<IExpense, '_id' | 'createdAt' | 'updatedAt'>) =>
      createExpense(expense),
    onSuccess: newExpense => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });

      if (newExpense.houseId) {
        queryClient.invalidateQueries({
          queryKey: expenseKeys.byHouse(newExpense.houseId),
        });
      }

      if (newExpense.roomId) {
        queryClient.invalidateQueries({
          queryKey: expenseKeys.byRoom(newExpense.roomId),
        });
      }
    },
  });
};

// Update expense
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IExpense> }) =>
      updateExpense({ id, data }),
    onSuccess: updatedExpense => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: expenseKeys.detail(updatedExpense._id),
      });

      if (updatedExpense.houseId) {
        queryClient.invalidateQueries({
          queryKey: expenseKeys.byHouse(updatedExpense.houseId),
        });
      }

      if (updatedExpense.roomId) {
        queryClient.invalidateQueries({
          queryKey: expenseKeys.byRoom(updatedExpense.roomId),
        });
      }
    },
  });
};

// Delete expense
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expenseKeys.detail(id) });
      // We can't invalidate by houseId or roomId since we don't have them after deletion
    },
  });
};
