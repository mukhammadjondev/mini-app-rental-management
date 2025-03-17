import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllHouses,
  getHouseById,
  createHouse,
  updateHouse,
  deleteHouse,
  updateHouseStatus,
} from '../api/housesApi';
import { IHouse, HouseStatus } from '@/types/house';

// Query keys
export const houseKeys = {
  all: ['houses'] as const,
  lists: () => [...houseKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...houseKeys.lists(), { filters }] as const,
  details: () => [...houseKeys.all, 'detail'] as const,
  detail: (id: string) => [...houseKeys.details(), id] as const,
};

// Get all houses
export const useHouses = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: houseKeys.list(filters || {}),
    queryFn: () => getAllHouses(),
  });
};

// Get house by ID
export const useHouse = (id: string) => {
  return useQuery({
    queryKey: houseKeys.detail(id),
    queryFn: () => getHouseById(id),
    enabled: !!id,
  });
};

// Create house
export const useCreateHouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (house: Omit<IHouse, '_id' | 'createdAt' | 'updatedAt'>) =>
      createHouse(house),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: houseKeys.lists() });
    },
  });
};

// Update house
export const useUpdateHouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IHouse> }) =>
      updateHouse({ id, data }),
    onSuccess: updatedHouse => {
      queryClient.invalidateQueries({ queryKey: houseKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: houseKeys.detail(updatedHouse._id!),
      });
    },
  });
};

// Delete house
export const useDeleteHouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteHouse(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: houseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: houseKeys.detail(id) });
    },
  });
};

// Update house status
export const useUpdateHouseStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: HouseStatus }) =>
      updateHouseStatus({ id, status }),
    onSuccess: updatedHouse => {
      queryClient.invalidateQueries({ queryKey: houseKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: houseKeys.detail(updatedHouse._id!),
      });
    },
  });
};
