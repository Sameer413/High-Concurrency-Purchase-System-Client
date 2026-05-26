'use client';

import { Badge } from '@/components/ui/badge';

const orders = [
  { id: 'ORD-001', customer: 'John Doe', amount: '$125.00', status: 'completed', date: '2026-05-24' },
  { id: 'ORD-002', customer: 'Jane Smith', amount: '$89.50', status: 'pending', date: '2026-05-24' },
  { id: 'ORD-003', customer: 'Bob Johnson', amount: '$210.00', status: 'processing', date: '2026-05-23' },
  { id: 'ORD-004', customer: 'Alice Brown', amount: '$156.75', status: 'completed', date: '2026-05-23' },
  { id: 'ORD-005', customer: 'Charlie Wilson', amount: '$95.00', status: 'cancelled', date: '2026-05-22' },
];

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function RecentOrders() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.amount}</td>
                <td className="px-6 py-4">
                  <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                    {order.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
