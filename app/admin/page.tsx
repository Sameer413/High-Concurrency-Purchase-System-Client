'use client';

import { DashboardStats } from '@/components/admin/DashboardStats';
import { RecentOrders } from '@/components/admin/RecentOrders';
import { SalesChart } from '@/components/admin/SalesChart';
import { TopProducts } from '@/components/admin/TopProducts';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <SalesChart />
          <TopProducts />
        </div>
        
        <div className="mt-6">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
