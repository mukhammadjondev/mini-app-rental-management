import axiosInstance from '@/core/axios';
import { IPayment, PaymentStatus } from '@/types/payment';

// Get all payments
export const getAllPayments = async (): Promise<IPayment[]> => {
  const response = await axiosInstance.get('/payments');
  return response.data;
};

// Get payments by house ID
export const getPaymentsByHouseId = async (
  houseId: string
): Promise<IPayment[]> => {
  const response = await axiosInstance.get(`/houses/${houseId}/payments`);
  return response.data;
};

// Get payments by room ID
export const getPaymentsByRoomId = async (
  roomId: string
): Promise<IPayment[]> => {
  const response = await axiosInstance.get(`/rooms/${roomId}/payments`);
  return response.data;
};

// Get payments by tenant ID
export const getPaymentsByTenantId = async (
  tenantId: string
): Promise<IPayment[]> => {
  const response = await axiosInstance.get(`/tenants/${tenantId}/payments`);
  return response.data;
};

// Get payment by ID
export const getPaymentById = async (id: string): Promise<IPayment> => {
  const response = await axiosInstance.get(`/payments/${id}`);
  return response.data;
};

// Create new payment
export const createPayment = async (
  payment: Omit<IPayment, '_id' | 'createdAt' | 'updatedAt'>
): Promise<IPayment> => {
  const response = await axiosInstance.post('/payments', payment);
  return response.data;
};

// Update payment
export const updatePayment = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<IPayment>;
}): Promise<IPayment> => {
  const response = await axiosInstance.put(`/payments/${id}`, data);
  return response.data;
};

// Delete payment
export const deletePayment = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/payments/${id}`);
};

// Update payment status
export const updatePaymentStatus = async ({
  id,
  status,
}: {
  id: string;
  status: PaymentStatus;
}): Promise<IPayment> => {
  const response = await axiosInstance.patch(`/payments/${id}/status`, {
    status,
  });
  return response.data;
};
