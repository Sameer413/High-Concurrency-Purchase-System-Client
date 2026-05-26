'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const mockRefunds = [
  { 
    id: 'REF-001', 
    orderId: 'ORD-045', 
    customer: 'John Doe',
    amount: 125.00,
    reason: 'Product damaged',
    status: 'pending',
    date: '2026-05-24'
  },
  { 
    id: 'REF-002', 
    orderId: 'ORD-038', 
    customer: 'Jane Smith',
    amount: 89.50,
    reason: 'Wrong size',
    status: 'approved',
    date: '2026-05-23'
  },
  { 
    id: 'REF-003', 
    orderId: 'ORD-032', 
    customer: 'Bob Johnson',
    amount: 210.00,
    reason: 'Changed mind',
    status: 'rejected',
    date: '2026-05-22'
  },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  processed: 'bg-blue-100 text-blue-800',
};

export function RefundManagement() {
  const [refunds, setRefunds] = useState(mockRefunds);
  const [filter, setFilter] = useState('all');

  const filteredRefunds = filter === 'all' 
    ? refunds 
    : refunds.filter(r => r.status === filter);

  const handleApprove = (id: string) => {
    setRefunds(refunds.map(r => 
      r.id === id ? { ...r, status: 'approved' } : r
    ));
  };

  const handleReject = (id: string) => {
    setRefunds(refunds.map(r => 
      r.id === id ? { ...r, status: 'rejected' } : r
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex space-x-2">
          {['all', 'pending', 'approved', 'rejected', 'processed'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Refund ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRefunds.map((refund) => (
              <tr key={refund.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{refund.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{refund.orderId}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{refund.customer}</td>
                <td className="px-6 py-4 text-sm text-gray-900">${refund.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{refund.reason}</td>
                <td className="px-6 py-4">
                  <Badge className={statusColors[refund.status as keyof typeof statusColors]}>
                    {refund.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{refund.date}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  {refund.status === 'pending' && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleApprove(refund.id)}
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleReject(refund.id)}
                      >
                        <XCircle className="w-4 h-4 text-red-600" />
                      </Button>
                    </>
                  )}
                  {refund.status === 'approved' && (
                    <Button variant="outline" size="sm">
                      Process Refund
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
