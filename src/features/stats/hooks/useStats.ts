import { useQuery } from '@tanstack/react-query';
import {
  getMonthlyStats,
  getMonthlyStatsByHouseId,
  getYearlyStats,
  getYearlyStatsByHouseId,
  getOccupancyRate,
  getHouseOccupancyRate,
} from '../api/statsApi';

// Query keys
export const statsKeys = {
  all: ['stats'] as const,
  monthly: () => [...statsKeys.all, 'monthly'] as const,
  monthlyByPeriod: (month: number, year: number) =>
    [...statsKeys.monthly(), { month, year }] as const,
  monthlyByHouse: (houseId: string, month: number, year: number) =>
    [...statsKeys.monthly(), { houseId, month, year }] as const,
  yearly: () => [...statsKeys.all, 'yearly'] as const,
  yearlyByYear: (year: number) => [...statsKeys.yearly(), { year }] as const,
  yearlyByHouse: (houseId: string, year: number) =>
    [...statsKeys.yearly(), { houseId, year }] as const,
  occupancy: () => [...statsKeys.all, 'occupancy'] as const,
  occupancyByPeriod: (month?: number, year?: number) =>
    [...statsKeys.occupancy(), { month, year }] as const,
  occupancyByHouse: (houseId: string, month?: number, year?: number) =>
    [...statsKeys.occupancy(), { houseId, month, year }] as const,
};

// Get monthly stats
export const useMonthlyStats = (month: number, year: number) => {
  return useQuery({
    queryKey: statsKeys.monthlyByPeriod(month, year),
    queryFn: () => getMonthlyStats(month, year),
    enabled: !!(month && year),
  });
};

// Get monthly stats by house ID
export const useMonthlyStatsByHouse = (
  houseId: string,
  month: number,
  year: number
) => {
  return useQuery({
    queryKey: statsKeys.monthlyByHouse(houseId, month, year),
    queryFn: () => getMonthlyStatsByHouseId(houseId, month, year),
    enabled: !!(houseId && month && year),
  });
};

// Get yearly stats
export const useYearlyStats = (year: number) => {
  return useQuery({
    queryKey: statsKeys.yearlyByYear(year),
    queryFn: () => getYearlyStats(year),
    enabled: !!year,
  });
};

// Get yearly stats by house ID
export const useYearlyStatsByHouse = (houseId: string, year: number) => {
  return useQuery({
    queryKey: statsKeys.yearlyByHouse(houseId, year),
    queryFn: () => getYearlyStatsByHouseId(houseId, year),
    enabled: !!(houseId && year),
  });
};

// Get occupancy rate
export const useOccupancyRate = (month?: number, year?: number) => {
  return useQuery({
    queryKey: statsKeys.occupancyByPeriod(month, year),
    queryFn: () => getOccupancyRate(month, year),
  });
};

// Get house occupancy rate
export const useHouseOccupancyRate = (
  houseId: string,
  month?: number,
  year?: number
) => {
  return useQuery({
    queryKey: statsKeys.occupancyByHouse(houseId, month, year),
    queryFn: () => getHouseOccupancyRate(houseId, month, year),
    enabled: !!houseId,
  });
};
