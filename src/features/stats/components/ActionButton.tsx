import { JSX } from 'react';
import { Button } from '@/components/ui/button';

export const ActionButton = ({
  icon,
  label,
  colorClass,
  onClick,
}: {
  icon: JSX.Element;
  label: string;
  colorClass: string;
  onClick: () => void;
}) => (
  <Button
    variant="outline"
    className={`flex flex-col h-auto py-3 gap-1 ${colorClass}`}
    onClick={onClick}
  >
    {icon}
    <span className="text-xs">{label}</span>
  </Button>
);
