'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Building,
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from 'lucide-react';
import { t } from '@/lib/translations';
import { MetricCard } from '@/features/stats/components/MetricCard';
import { StatsCard } from '@/features/stats/components/StatsCard';
import { Alert, AlertItem } from '@/features/stats/components/AlertItem';
import { Cell, Subheadline } from '@telegram-apps/telegram-ui';
import { ActionButton } from '@/features/stats/components/ActionButton';

interface Activity {
  id: number;
  type: 'payment' | 'expense' | 'tenant' | 'room';
  description: string;
  amount?: number;
  date: string;
}
interface DashboardData {
  totalHouses: number;
  totalRooms: number;
  occupiedRooms: number;
  totalTenants: number;
  pendingPayments: number;
  occupancyRate: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  thisMonthIncome: number;
  lastMonthIncome: number;
  incomeChange: number;
  expenseChange: number;
  alerts: Alert[];
  recentActivity: Activity[];
}

interface MobileDashboardProps {
  onAction: (action: string) => void;
  data?: DashboardData;
}

// Mock data
const defaultDashboardData: DashboardData = {
  totalHouses: 5,
  totalRooms: 24,
  occupiedRooms: 18,
  totalTenants: 22,
  pendingPayments: 3,
  occupancyRate: 75,
  monthlyIncome: 8500,
  monthlyExpenses: 2300,
  thisMonthIncome: 4200,
  lastMonthIncome: 3800,
  incomeChange: 10.5,
  expenseChange: -8.3,
  alerts: [
    {
      id: 1,
      type: 'payment',
      message: '3 rent payments due in 2 days',
      severity: 'high',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: 2,
      type: 'maintenance',
      message: 'Maintenance request for House #2',
      severity: 'medium',
      icon: <AlertTriangle className="h-4 w-4" />,
    },
  ],
  recentActivity: [
    {
      id: 1,
      type: 'payment',
      description: 'Rent payment received from John Doe',
      amount: 850,
      date: '2 hours ago',
    },
    {
      id: 2,
      type: 'expense',
      description: 'Water bill paid for House #3',
      amount: 120,
      date: 'Yesterday',
    },
    {
      id: 3,
      type: 'tenant',
      description: 'New tenant added: Sarah Johnson',
      date: '2 days ago',
    },
  ],
};

const MobileDashboard = ({
  onAction,
  data = defaultDashboardData,
}: MobileDashboardProps) => {
  return (
    <div className="space-y-4 pb-4">
      <div className="grid grid-cols-3 gap-2">
        <MetricCard
          icon={<Building className="h-6 w-6 text-blue-500 mb-1" />}
          title={t('properties')}
          value={data.totalHouses}
          bgClass="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
        />
        <MetricCard
          icon={<Users className="h-6 w-6 text-purple-500 mb-1" />}
          title={t('tenants')}
          value={data.totalTenants}
          bgClass="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900"
        />
        <MetricCard
          icon={<TrendingUp className="h-6 w-6 text-green-500 mb-1" />}
          title={t('occupancy')}
          value={`${data.occupancyRate}%`}
          bgClass="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
        />
      </div>

      {/* Monthly Income */}
      <StatsCard
        title={t('monthlyIncome')}
        value={data.thisMonthIncome}
        changeValue={data.incomeChange}
        previousValue={data.lastMonthIncome}
        progressValue={75}
      />

      {/* Monthly Expenses */}
      <StatsCard
        title={t('monthlyExpenses')}
        value={data.monthlyExpenses}
        changeValue={data.expenseChange}
        previousValue={data.lastMonthIncome * 0.3}
        progressValue={65}
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2">
        <ActionButton
          icon={<CreditCard className="h-5 w-5 text-blue-500" />}
          label={t('addPayment')}
          colorClass="border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30 dark:hover:bg-blue-800/50"
          onClick={() => onAction('addPayment')}
        />
        <ActionButton
          icon={<Users className="h-5 w-5 text-purple-500" />}
          label={t('addTenant')}
          colorClass="border-purple-200 bg-purple-50 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-900/30 dark:hover:bg-purple-800/50"
          onClick={() => onAction('addTenant')}
        />
        <ActionButton
          icon={<DollarSign className="h-5 w-5 text-green-500" />}
          label={t('addExpense')}
          colorClass="border-green-200 bg-green-50 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/30 dark:hover:bg-green-800/50"
          onClick={() => onAction('addExpense')}
        />
      </div>

      {/* Alerts */}
      {data.alerts.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <Subheadline weight="2">{t('alerts')}</Subheadline>
            <div className="space-y-2 mt-2">
              {data.alerts.map(alert => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div>
        <Subheadline weight="2">{t('recentActivity')}</Subheadline>
        <div className="space-y-3 mt-1">
          {data.recentActivity.map(activity => (
            <Cell
              key={activity.id}
              subtitle={
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.date}
                </div>
              }
              after={
                activity.amount && (
                  <span
                    className={`text-sm font-medium flex items-center ${
                      activity.type === 'expense'
                        ? 'text-red-500'
                        : 'text-green-500'
                    }`}
                  >
                    {activity.type === 'expense' ? (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    )}
                    ${activity.amount}
                  </span>
                )
              }
              className="bg-card text-card-foreground rounded-xl border py-6 shadow-sm"
            >
              <div className="text-sm">{activity.description}</div>
            </Cell>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;
