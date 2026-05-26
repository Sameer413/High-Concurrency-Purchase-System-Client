'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Ban, CheckCircle } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active', orders: 12, joined: '2026-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'customer', status: 'active', orders: 8, joined: '2026-02-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'customer', status: 'blocked', orders: 3, joined: '2026-03-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'admin', status: 'active', orders: 0, joined: '2025-12-01' },
];

export function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [filter, setFilter] = useState('all');

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(u => u.status === filter);

  const handleToggleStatus = (id: number) => {
    setUsers(users.map(u => 
      u.id === id 
        ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' }
        : u
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex space-x-2">
          {['all', 'active', 'blocked'].map((status) => (
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.orders}</td>
                <td className="px-6 py-4">
                  <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {user.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleToggleStatus(user.id)}
                  >
                    {user.status === 'active' ? (
                      <Ban className="w-4 h-4 text-red-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
