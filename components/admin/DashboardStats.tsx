'use client';

import { DollarSign, ShoppingCart, Users, Package, Loader2 } from 'lucide-react';
import { useGetDashboardStatsQuery } from '@/features/admin/adminApi';

export function DashboardStats() {
  const { data, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Failed to load dashboard stats</p>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${data?.totalRevenue?.toFixed(2) || '0.00'}`,
      change: '+20.1%',
      icon: DollarSign,
      color: 'bg-blue-500',
    },
    {
      label: 'Orders',
      value: data?.totalOrders || '0',
      change: '+12.5%',
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      label: 'Customers',
      value: data?.totalCustomers || '0',
      change: '+8.2%',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      label: 'Products',
      value: data?.totalProducts || '0',
      change: '+3.1%',
      icon: Package,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
