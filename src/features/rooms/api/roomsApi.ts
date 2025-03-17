import axiosInstance from '@/core/axios';
import { IRoom, RoomStatus } from '@/types/room';

// Get all rooms
export const getAllRooms = async (): Promise<IRoom[]> => {
  const response = await axiosInstance.get('/rooms');
  return response.data;
};

// Get rooms by house ID
export const getRoomsByHouseId = async (houseId: string): Promise<IRoom[]> => {
  const response = await axiosInstance.get(`/houses/${houseId}/rooms`);
  return response.data;
};

// Get room by ID
export const getRoomById = async (id: string): Promise<IRoom> => {
  const response = await axiosInstance.get(`/rooms/${id}`);
  return response.data;
};

// Create new room
export const createRoom = async (
  room: Omit<IRoom, '_id' | 'createdAt' | 'updatedAt'>
): Promise<IRoom> => {
  const response = await axiosInstance.post('/rooms', room);
  return response.data;
};

// Update room
export const updateRoom = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<IRoom>;
}): Promise<IRoom> => {
  const response = await axiosInstance.put(`/rooms/${id}`, data);
  return response.data;
};

// Delete room
export const deleteRoom = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/rooms/${id}`);
};

// Update room status
export const updateRoomStatus = async ({
  id,
  status,
}: {
  id: string;
  status: RoomStatus;
}): Promise<IRoom> => {
  const response = await axiosInstance.patch(`/rooms/${id}/status`, { status });
  return response.data;
};
