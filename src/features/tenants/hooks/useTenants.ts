import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllTenants,
  getTenantsByHouseId,
  getTenantsByRoomId,
  getTenantById,
  createTenant,
  updateTenant,
  deleteTenant,
  updateTenantStatus,
} from '../api/tenantsApi';
import { ITenant, TenantStatus } from '@/types/tenant';

// Query keys
export const tenantKeys = {
  all: ['tenants'] as const,
  lists: () => [...tenantKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...tenantKeys.lists(), { filters }] as const,
  byHouse: (houseId: string) => [...tenantKeys.lists(), { houseId }] as const,
  byRoom: (roomId: string) => [...tenantKeys.lists(), { roomId }] as const,
  details: () => [...tenantKeys.all, 'detail'] as const,
  detail: (id: string) => [...tenantKeys.details(), id] as const,
};

// Get all tenants
export const useTenants = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: tenantKeys.list(filters || {}),
    queryFn: () => getAllTenants(),
  });
};

// Get tenants by house ID
export const useTenantsByHouse = (houseId: string) => {
  return useQuery({
    queryKey: tenantKeys.byHouse(houseId),
    queryFn: () => getTenantsByHouseId(houseId),
    enabled: !!houseId,
  });
};

// Get tenants by room ID
export const useTenantsByRoom = (roomId: string) => {
  return useQuery({
    queryKey: tenantKeys.byRoom(roomId),
    queryFn: () => getTenantsByRoomId(roomId),
    enabled: !!roomId,
  });
};

// Get tenant by ID
export const useTenant = (id: string) => {
  return useQuery({
    queryKey: tenantKeys.detail(id),
    queryFn: () => getTenantById(id),
    enabled: !!id,
  });
};

// Create tenant
export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tenant: Omit<ITenant, '_id' | 'createdAt' | 'updatedAt'>) =>
      createTenant(tenant),
    onSuccess: newTenant => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: tenantKeys.byHouse(newTenant.houseId),
      });
      queryClient.invalidateQueries({
        queryKey: tenantKeys.byRoom(newTenant.roomId),
      });
    },
  });
};

// Update tenant
export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ITenant> }) =>
      updateTenant({ id, data }),
    onSuccess: updatedTenant => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: tenantKeys.detail(updatedTenant._id!),
      });
      queryClient.invalidateQueries({
        queryKey: tenantKeys.byHouse(updatedTenant.houseId),
      });
      queryClient.invalidateQueries({
        queryKey: tenantKeys.byRoom(updatedTenant.roomId),
      });
    },
  });
};

// Delete tenant
export const useDeleteTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTenant(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenantKeys.detail(id) });
      // We can't invalidate by houseId or roomId since we don't have them after deletion
    },
  });
};

// Update tenant status
export const useUpdateTenantStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TenantStatus }) =>
      updateTenantStatus({ id, status }),
    onSuccess: updatedTenant => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: tenantKeys.detail(updatedTenant._id!),
      });
      queryClient.invalidateQueries({
        queryKey: tenantKeys.byHouse(updatedTenant.houseId),
      });
      queryClient.invalidateQueries({
        queryKey: tenantKeys.byRoom(updatedTenant.roomId),
      });
    },
  });
};
