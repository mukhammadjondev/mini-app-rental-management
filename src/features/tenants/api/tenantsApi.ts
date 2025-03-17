import axiosInstance from '@/core/axios';
import { ITenant, TenantStatus } from '@/types/tenant';

// Get all tenants
export const getAllTenants = async (): Promise<ITenant[]> => {
  const response = await axiosInstance.get('/tenants');
  return response.data;
};

// Get tenants by house ID
export const getTenantsByHouseId = async (
  houseId: string
): Promise<ITenant[]> => {
  const response = await axiosInstance.get(`/houses/${houseId}/tenants`);
  return response.data;
};

// Get tenants by room ID
export const getTenantsByRoomId = async (
  roomId: string
): Promise<ITenant[]> => {
  const response = await axiosInstance.get(`/rooms/${roomId}/tenants`);
  return response.data;
};

// Get tenant by ID
export const getTenantById = async (id: string): Promise<ITenant> => {
  const response = await axiosInstance.get(`/tenants/${id}`);
  return response.data;
};

// Create new tenant
export const createTenant = async (
  tenant: Omit<ITenant, '_id' | 'createdAt' | 'updatedAt'>
): Promise<ITenant> => {
  const response = await axiosInstance.post('/tenants', tenant);
  return response.data;
};

// Update tenant
export const updateTenant = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<ITenant>;
}): Promise<ITenant> => {
  const response = await axiosInstance.put(`/tenants/${id}`, data);
  return response.data;
};

// Delete tenant
export const deleteTenant = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/tenants/${id}`);
};

// Update tenant status
export const updateTenantStatus = async ({
  id,
  status,
}: {
  id: string;
  status: TenantStatus;
}): Promise<ITenant> => {
  const response = await axiosInstance.patch(`/tenants/${id}/status`, {
    status,
  });
  return response.data;
};
