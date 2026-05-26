'use client';

import { UserManagement } from '@/components/admin/users/UserManagement';

export default function AdminUsersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>
      <UserManagement />
    </div>
  );
}
