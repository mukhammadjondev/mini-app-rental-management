import axiosInstance from '@/core/axios';
import { IHouse, HouseStatus } from '@/types/house';

// Get all houses
export const getAllHouses = async (): Promise<IHouse[]> => {
  const response = await axiosInstance.get('/houses');
  return response.data;
};

// Get house by ID
export const getHouseById = async (id: string): Promise<IHouse> => {
  const response = await axiosInstance.get(`/houses/${id}`);
  return response.data;
};

// Create new house
export const createHouse = async (
  house: Omit<IHouse, '_id' | 'createdAt' | 'updatedAt'>
): Promise<IHouse> => {
  const response = await axiosInstance.post('/houses', house);
  return response.data;
};

// Update house
export const updateHouse = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<IHouse>;
}): Promise<IHouse> => {
  const response = await axiosInstance.put(`/houses/${id}`, data);
  return response.data;
};

// Delete house
export const deleteHouse = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/houses/${id}`);
};

// Update house status
export const updateHouseStatus = async ({
  id,
  status,
}: {
  id: string;
  status: HouseStatus;
}): Promise<IHouse> => {
  const response = await axiosInstance.patch(`/houses/${id}/status`, {
    status,
  });
  return response.data;
};
