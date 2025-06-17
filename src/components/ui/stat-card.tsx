
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, icon: Icon, iconColor = "text-blue-600", trend }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {trend && (
              <p className={`text-xs mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 ml-4">
            <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
