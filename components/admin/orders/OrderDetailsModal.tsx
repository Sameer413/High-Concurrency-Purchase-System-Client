'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface OrderDetailsModalProps {
  order: any;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Order Details - {order.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="text-sm font-medium text-gray-900">{order.customer}</p>
              <p className="text-sm text-gray-500">{order.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="text-sm font-medium text-gray-900">{order.date}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Status</p>
            <Badge>{order.status}</Badge>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Order Items</p>
            <div className="border rounded-lg divide-y">
              <div className="p-4 flex justify-between">
                <span className="text-sm text-gray-600">Classic T-Shirt x 2</span>
                <span className="text-sm font-medium">$59.98</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-sm text-gray-600">Denim Jeans x 1</span>
                <span className="text-sm font-medium">$79.99</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-sm font-medium">${order.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Shipping</span>
              <span className="text-sm font-medium">$10.00</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${(order.amount + 10).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button>Update Status</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
