// components/admin/AdminStats.tsx
import { 
    UserGroupIcon, 
    CalendarIcon, 
    ChartBarIcon, 
    ClockIcon 
  } from "@heroicons/react/24/outline";
  
  interface AdminStatsProps {
    title: string;
    value: number;
    icon: "users" | "calendar" | "chart" | "today";
    trend: number;
    isUp: boolean;
  }
  
  export default function AdminStats({ title, value, icon, trend, isUp }: AdminStatsProps) {
    const renderIcon = () => {
      switch (icon) {
        case "users":
          return <UserGroupIcon className="h-6 w-6 text-gray-400" />;
        case "calendar":
          return <CalendarIcon className="h-6 w-6 text-gray-400" />;
        case "chart":
          return <ChartBarIcon className="h-6 w-6 text-gray-400" />;
        case "today":
          return <ClockIcon className="h-6 w-6 text-gray-400" />;
        default:
          return null;
      }
    };
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold mt-1">{value.toLocaleString()}</p>
          </div>
          <div>
            {renderIcon()}
          </div>
        </div>
        <div className="mt-4">
          <span className={`text-sm ${isUp ? "text-green-500" : "text-red-500"} font-medium`}>
            {isUp ? "+" : "-"}{trend}%
          </span>
          <span className="text-sm text-gray-500 ml-1">จากเดือนที่แล้ว</span>
        </div>
      </div>
    );
  }