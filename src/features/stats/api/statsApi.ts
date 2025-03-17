import axiosInstance from '@/core/axios';
import { MonthlyStats, YearlyStatsSummary } from '@/types/stats';

// Get monthly stats
export const getMonthlyStats = async (
  month: number,
  year: number
): Promise<MonthlyStats> => {
  const response = await axiosInstance.get('/stats/monthly', {
    params: { month, year },
  });
  return response.data;
};

// Get monthly stats by house ID
export const getMonthlyStatsByHouseId = async (
  houseId: string,
  month: number,
  year: number
): Promise<MonthlyStats> => {
  const response = await axiosInstance.get(`/stats/monthly/house/${houseId}`, {
    params: { month, year },
  });
  return response.data;
};

// Get yearly stats
export const getYearlyStats = async (
  year: number
): Promise<YearlyStatsSummary> => {
  const response = await axiosInstance.get('/stats/yearly', {
    params: { year },
  });
  return response.data;
};

// Get yearly stats by house ID
export const getYearlyStatsByHouseId = async (
  houseId: string,
  year: number
): Promise<YearlyStatsSummary> => {
  const response = await axiosInstance.get(`/stats/yearly/house/${houseId}`, {
    params: { year },
  });
  return response.data;
};

// Get occupancy rate
export const getOccupancyRate = async (
  month?: number,
  year?: number
): Promise<{ rate: number }> => {
  const response = await axiosInstance.get('/stats/occupancy', {
    params: { month, year },
  });
  return response.data;
};

// Get house occupancy rate
export const getHouseOccupancyRate = async (
  houseId: string,
  month?: number,
  year?: number
): Promise<{ rate: number }> => {
  const response = await axiosInstance.get(
    `/stats/occupancy/house/${houseId}`,
    {
      params: { month, year },
    }
  );
  return response.data;
};
