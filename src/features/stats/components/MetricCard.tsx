import { JSX } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const MetricCard = ({
  icon,
  title,
  value,
  bgClass,
}: {
  icon: JSX.Element;
  title: string;
  value: string | number;
  bgClass: string;
}) => (
  <Card className={bgClass}>
    <CardContent className="p-1 py-3">
      <div className="flex flex-col items-center text-center">
        {icon}
        <div className="text-xs text-muted-foreground">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </CardContent>
  </Card>
);
