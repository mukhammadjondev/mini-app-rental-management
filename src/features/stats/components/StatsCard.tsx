import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { t } from '@/lib/translations';
import { Progress } from '@telegram-apps/telegram-ui';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const StatsCard = ({
  title,
  value,
  changeValue,
  previousValue,
  progressValue,
}: {
  title: string;
  value: number;
  changeValue: number;
  previousValue: number;
  progressValue: number;
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="text-2xl font-bold">${value}</div>
        </div>
        <Badge
          variant={changeValue >= 0 ? 'default' : 'destructive'}
          className={`flex items-center gap-1 bg-white ${
            changeValue >= 0
              ? 'text-green-600 dark:bg-green-800'
              : 'text-red-600 dark:bg-red-800'
          } dark:text-white`}
        >
          {changeValue >= 0 ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {Math.abs(changeValue)}%
        </Badge>
      </div>
      <Progress value={progressValue} className="h-2" />
      <p className="text-xs text-muted-foreground mt-1">
        {t('vs')} ${previousValue} {t('lastMonth')}
      </p>
    </CardContent>
  </Card>
);
