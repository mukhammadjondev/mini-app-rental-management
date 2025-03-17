import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllRooms,
  getRoomsByHouseId,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomStatus,
} from '../api/roomsApi';
import { IRoom, RoomStatus } from '@/types/room';

// Query keys
export const roomKeys = {
  all: ['rooms'] as const,
  lists: () => [...roomKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...roomKeys.lists(), { filters }] as const,
  byHouse: (houseId: string) => [...roomKeys.lists(), { houseId }] as const,
  details: () => [...roomKeys.all, 'detail'] as const,
  detail: (id: string) => [...roomKeys.details(), id] as const,
};

// Get all rooms
export const useRooms = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: roomKeys.list(filters || {}),
    queryFn: () => getAllRooms(),
  });
};

// Get rooms by house ID
export const useRoomsByHouse = (houseId: string) => {
  return useQuery({
    queryKey: roomKeys.byHouse(houseId),
    queryFn: () => getRoomsByHouseId(houseId),
    enabled: !!houseId,
  });
};

// Get room by ID
export const useRoom = (id: string) => {
  return useQuery({
    queryKey: roomKeys.detail(id),
    queryFn: () => getRoomById(id),
    enabled: !!id,
  });
};

// Create room
export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (room: Omit<IRoom, '_id' | 'createdAt' | 'updatedAt'>) =>
      createRoom(room),
    onSuccess: newRoom => {
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: roomKeys.byHouse(newRoom.houseId),
      });
    },
  });
};

// Update room
export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IRoom> }) =>
      updateRoom({ id, data }),
    onSuccess: updatedRoom => {
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: roomKeys.detail(updatedRoom._id!),
      });
      queryClient.invalidateQueries({
        queryKey: roomKeys.byHouse(updatedRoom.houseId),
      });
    },
  });
};

// Delete room
export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRoom(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(id) });
      // Note: We can't invalidate by houseId since we don't have it after deletion
      // A workaround would be to pass {id, houseId} to the mutation
    },
  });
};

// Update room status
export const useUpdateRoomStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: RoomStatus }) =>
      updateRoomStatus({ id, status }),
    onSuccess: updatedRoom => {
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: roomKeys.detail(updatedRoom._id!),
      });
      queryClient.invalidateQueries({
        queryKey: roomKeys.byHouse(updatedRoom.houseId),
      });
    },
  });
};
