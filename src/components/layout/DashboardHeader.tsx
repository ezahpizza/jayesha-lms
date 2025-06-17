
import { memo } from 'react';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  onMenuToggle?: () => void;
}

export const DashboardHeader = memo(function DashboardHeader({ 
  title, 
  subtitle, 
  onMenuToggle 
}: DashboardHeaderProps) {
  return (
    <div className="border-b border-white mt-4 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 min-w-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-coral truncate">{title}</h1>
            <p className="text-sm sm:text-base text-rosaWhite mt-1 truncate">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
});
