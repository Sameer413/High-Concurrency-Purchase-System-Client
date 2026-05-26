"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks";
import { useUpdateProfileMutation, useUpdatePasswordMutation } from "@/features/auth/authApi";
import {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from "@/features/address/addressApi";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ProfileSidebar,
  ProfileTab,
  OrdersTab,
  AddressesTab,
} from "@/components/profile";

// Mock Data for Orders (will be replaced with real API)
const MOCK_ORDERS = [
  {
    id: "ORD-7721",
    date: "May 04, 2026",
    status: "Delivered",
    total: "$249.00",
    items: [
      { 
        name: "Premium Leather Jacket", 
        quantity: 1, 
        image: "https://images.unsplash.com/photo-1551028150-64b9f398f678?w=200&h=200&fit=crop" 
      },
    ],
  },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [updateProfile] = useUpdateProfileMutation();
  const [updatePassword] = useUpdatePasswordMutation();
  const { data: addressData, isLoading: isLoadingAddresses } = useGetAddressesQuery();
  const [createAddress] = useCreateAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefault] = useSetDefaultAddressMutation();

  // Get active tab from URL params, default to "profile"
  const activeTab = searchParams.get("tab") || "profile";

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleUpdateProfile = async (data: any) => {
    await updateProfile(data).unwrap();
  };

  const handleUpdatePassword = async (data: any) => {
    await updatePassword(data).unwrap();
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteAddress(id).unwrap();
        toast.success("Address deleted");
      } catch (error) {
        toast.error("Failed to delete address");
      }
    }
  };

  const handleUpdateAddress = async (id: string, data: any) => {
    await updateAddress({ id, data }).unwrap();
  };

  const handleCreateAddress = async (data: any) => {
    await createAddress(data).unwrap();
  };

  const handleSetDefault = async (id: string) => {
    await setDefault(id);
  };

  const displayUser = {
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : "Alexander Pierce",
    email: user?.email || "alexander.pierce@example.com",
    phone: (user as any)?.phone || "+1 (555) 000-0000",
    joinDate: "Member since May 2024",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'Alexander'}`,
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              <ProfileSidebar
                displayUser={displayUser}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onLogout={logout}
              />

              <div className="flex-1 space-y-6">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="bg-transparent border-b border-slate-200 rounded-none w-full justify-start h-12 p-0 gap-8">
                    <TabsTrigger 
                      value="profile" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12"
                    >
                      Profile
                    </TabsTrigger>
                    <TabsTrigger 
                      value="orders" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12"
                    >
                      Orders
                    </TabsTrigger>
                    <TabsTrigger 
                      value="addresses" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12"
                    >
                      Addresses
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="pt-6">
                    <ProfileTab
                      user={user}
                      displayUser={displayUser}
                      onUpdateProfile={handleUpdateProfile}
                      onUpdatePassword={handleUpdatePassword}
                    />
                  </TabsContent>

                  <TabsContent value="orders" className="pt-6">
                    <OrdersTab orders={MOCK_ORDERS} />
                  </TabsContent>

                  <TabsContent value="addresses" className="pt-6">
                    <AddressesTab
                      addresses={addressData?.data || []}
                      isLoading={isLoadingAddresses}
                      onUpdateAddress={handleUpdateAddress}
                      onDeleteAddress={handleDeleteAddress}
                      onSetDefault={handleSetDefault}
                      onCreateAddress={handleCreateAddress}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
