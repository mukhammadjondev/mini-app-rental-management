import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllPayments,
  getPaymentsByHouseId,
  getPaymentsByRoomId,
  getPaymentsByTenantId,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  updatePaymentStatus,
} from '../api/paymentsApi';
import { IPayment, PaymentStatus } from '@/types/payment';

// Query keys
export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...paymentKeys.lists(), { filters }] as const,
  byHouse: (houseId: string) => [...paymentKeys.lists(), { houseId }] as const,
  byRoom: (roomId: string) => [...paymentKeys.lists(), { roomId }] as const,
  byTenant: (tenantId: string) =>
    [...paymentKeys.lists(), { tenantId }] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
};

// Get all payments
export const usePayments = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: paymentKeys.list(filters || {}),
    queryFn: () => getAllPayments(),
  });
};

// Get payments by house ID
export const usePaymentsByHouse = (houseId: string) => {
  return useQuery({
    queryKey: paymentKeys.byHouse(houseId),
    queryFn: () => getPaymentsByHouseId(houseId),
    enabled: !!houseId,
  });
};

// Get payments by room ID
export const usePaymentsByRoom = (roomId: string) => {
  return useQuery({
    queryKey: paymentKeys.byRoom(roomId),
    queryFn: () => getPaymentsByRoomId(roomId),
    enabled: !!roomId,
  });
};

// Get payments by tenant ID
export const usePaymentsByTenant = (tenantId: string) => {
  return useQuery({
    queryKey: paymentKeys.byTenant(tenantId),
    queryFn: () => getPaymentsByTenantId(tenantId),
    enabled: !!tenantId,
  });
};

// Get payment by ID
export const usePayment = (id: string) => {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => getPaymentById(id),
    enabled: !!id,
  });
};

// Create payment
export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payment: Omit<IPayment, '_id' | 'createdAt' | 'updatedAt'>) =>
      createPayment(payment),
    onSuccess: newPayment => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.byHouse(newPayment.houseId),
      });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.byRoom(newPayment.roomId),
      });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.byTenant(newPayment.tenantId),
      });
    },
  });
};

// Update payment
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IPayment> }) =>
      updatePayment({ id, data }),
    onSuccess: updatedPayment => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.detail(updatedPayment._id),
      });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.byHouse(updatedPayment.houseId),
      });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.byRoom(updatedPayment.roomId),
      });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.byTenant(updatedPayment.tenantId),
      });
    },
  });
};

// Delete payment
export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePayment(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(id) });
      // We can't invalidate by related IDs since we don't have them after deletion
    },
  });
};

// Update payment status
export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PaymentStatus }) =>
      updatePaymentStatus({ id, status }),
    onSuccess: updatedPayment => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.detail(updatedPayment._id),
      });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.byHouse(updatedPayment.houseId),
      });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.byRoom(updatedPayment.roomId),
      });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.byTenant(updatedPayment.tenantId),
      });
    },
  });
};
