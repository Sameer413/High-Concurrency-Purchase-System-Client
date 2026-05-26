'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" defaultValue="My E-Commerce Store" />
            </div>
            <div>
              <Label htmlFor="storeEmail">Store Email</Label>
              <Input id="storeEmail" type="email" defaultValue="store@example.com" />
            </div>
            <div>
              <Label htmlFor="storePhone">Store Phone</Label>
              <Input id="storePhone" defaultValue="+1 234 567 8900" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Settings</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="razorpayKey">Razorpay Key ID</Label>
              <Input id="razorpayKey" defaultValue="rzp_test_xxxxx" />
            </div>
            <div>
              <Label htmlFor="razorpaySecret">Razorpay Secret</Label>
              <Input id="razorpaySecret" type="password" defaultValue="••••••••" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Settings</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input id="smtpHost" defaultValue="smtp.gmail.com" />
            </div>
            <div>
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input id="smtpPort" defaultValue="587" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
