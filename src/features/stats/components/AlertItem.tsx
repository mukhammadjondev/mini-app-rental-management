import { JSX } from 'react';

export interface Alert {
  id: number;
  type: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  icon: JSX.Element;
}

export const AlertItem = ({ alert }: { alert: Alert }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      case 'medium':
        return 'text-orange-500 bg-orange-100 dark:bg-orange-900/30';
      case 'low':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <div
      className={`flex items-start space-x-2 p-2 rounded-md ${getSeverityColor(
        alert.severity
      )}`}
    >
      <div className="p-1 rounded-full bg-white/80 dark:bg-black/20">
        {alert.icon}
      </div>
      <div className="text-sm">{alert.message}</div>
    </div>
  );
};
