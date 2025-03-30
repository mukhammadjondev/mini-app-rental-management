import { ExpenseType } from '@/types';

export const expenseTypeIcons: Record<ExpenseType, string> = {
  [ExpenseType.ELECTRICITY]: '⚡',
  [ExpenseType.WATER]: '💧',
  [ExpenseType.GAS]: '🔥',
  [ExpenseType.REPAIR]: '🔧',
  [ExpenseType.MAINTENANCE]: '🔨',
  [ExpenseType.TAX]: '📝',
  [ExpenseType.CLEANING]: '🧹',
  [ExpenseType.SECURITY]: '🔒',
  [ExpenseType.OTHER]: '📋',
};
