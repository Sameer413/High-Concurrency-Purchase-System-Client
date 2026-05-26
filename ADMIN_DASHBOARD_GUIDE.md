# Admin Dashboard - Complete Guide

## 📁 Structure Overview

```
client/
├── app/admin/
│   ├── layout.tsx              # Admin layout with sidebar
│   ├── page.tsx                # Dashboard home
│   ├── products/page.tsx       # Product management
│   ├── orders/page.tsx         # Order management
│   ├── users/page.tsx          # User management
│   └── refunds/page.tsx        # Refund management
│
└── components/admin/
    ├── AdminSidebar.tsx        # Navigation sidebar
    ├── AdminHeader.tsx         # Top header with search
    ├── DashboardStats.tsx      # Stats cards
    ├── SalesChart.tsx          # Sales visualization
    ├── TopProducts.tsx         # Top selling products
    ├── RecentOrders.tsx        # Recent orders table
    │
    ├── products/
    │   ├── ProductList.tsx     # Product table
    │   └── ProductForm.tsx     # Add/Edit product form
    │
    ├── orders/
    │   ├── OrderManagement.tsx # Order table with filters
    │   └── OrderDetailsModal.tsx # Order details popup
    │
    ├── users/
    │   └── UserManagement.tsx  # User table with actions
    │
    └── refunds/
        └── RefundManagement.tsx # Refund approval system
```

## 🎨 Features

### 1. Dashboard (`/admin`)
- **Stats Cards**: Revenue, Orders, Customers, Products
- **Sales Chart**: Monthly sales visualization
- **Top Products**: Best selling items
- **Recent Orders**: Latest order activity

### 2. Product Management (`/admin/products`)
- **Product List**: View all products with pagination
- **Add Product**: Create new products
- **Edit Product**: Update existing products
- **Delete Product**: Remove products
- **Stock Management**: Track inventory levels
- **Status Toggle**: Active/Inactive products

### 3. Order Management (`/admin/orders`)
- **Order List**: All orders with filters
- **Status Filters**: Pending, Processing, Completed, Cancelled
- **Order Details**: View full order information
- **Update Status**: Change order status
- **Export Orders**: Download order data

### 4. User Management (`/admin/users`)
- **User List**: All registered users
- **Role Management**: Admin/Customer roles
- **Block/Unblock**: Control user access
- **User Stats**: Order count, join date
- **Status Filters**: Active, Blocked

### 5. Refund Management (`/admin/refunds`)
- **Refund Requests**: All refund requests
- **Approve/Reject**: Process refund requests
- **Status Tracking**: Pending, Approved, Rejected, Processed
- **Refund Reasons**: View customer reasons
- **Process Refunds**: Execute approved refunds

## 🚀 Getting Started

### Access the Admin Dashboard

```
http://localhost:5173/admin
```

### Navigation

The sidebar provides quick access to all admin sections:
- Dashboard (Home)
- Products
- Orders
- Users
- Refunds
- Settings

## 💡 Component Architecture

### Modular Design

Each component is self-contained and reusable:

```tsx
// Example: Using ProductList component
import { ProductList } from '@/components/admin/products/ProductList';

<ProductList onEdit={handleEdit} />
```

### Props Pattern

Components accept minimal props for flexibility:

```tsx
// ProductForm accepts optional product for editing
<ProductForm 
  product={editingProduct} 
  onClose={handleClose}
/>

// OrderDetailsModal shows order details
<OrderDetailsModal
  order={selectedOrder}
  onClose={() => setSelectedOrder(null)}
/>
```

## 📊 Mock Data

All components use mock data for demonstration:

```tsx
const mockProducts = [
  { id: 1, name: 'Classic T-Shirt', price: 29.99, stock: 150 },
  // ... more products
];
```

### Replace with Real API

To connect to your backend:

```tsx
// Before (mock data)
const [products, setProducts] = useState(mockProducts);

// After (real API)
const { data: products } = useGetProductsQuery();
```

## 🎯 Key Features

### 1. Responsive Design
- Mobile-friendly layout
- Collapsible sidebar
- Responsive tables

### 2. Interactive Tables
- Sortable columns
- Filterable data
- Pagination ready
- Row actions (Edit, Delete, View)

### 3. Status Management
- Color-coded badges
- Quick status updates
- Filter by status

### 4. Forms
- Validation ready
- Error handling
- Success feedback

### 5. Modals
- Order details
- Confirmation dialogs
- Form overlays

## 🔧 Customization

### Colors

Update status colors in components:

```tsx
const statusColors = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  // Add more...
};
```

### Sidebar Menu

Add new menu items in `AdminSidebar.tsx`:

```tsx
const menuItems = [
  // ... existing items
  { icon: NewIcon, label: 'New Section', href: '/admin/new' },
];
```

### Stats Cards

Customize dashboard stats in `DashboardStats.tsx`:

```tsx
const stats = [
  // ... existing stats
  {
    label: 'New Metric',
    value: '999',
    change: '+5%',
    icon: YourIcon,
    color: 'bg-pink-500',
  },
];
```

## 🔌 API Integration

### Example: Connect Products to Backend

```tsx
// 1. Create API slice (if using RTK Query)
import { api } from '@/lib/api';

const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => '/admin/products',
    }),
    createProduct: builder.mutation({
      query: (product) => ({
        url: '/admin/products',
        method: 'POST',
        body: product,
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/admin/products/${id}`,
        method: 'PUT',
        body: product,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// 2. Use in component
import { useGetProductsQuery, useDeleteProductMutation } from './productsApi';

export function ProductList({ onEdit }: ProductListProps) {
  const { data: products, isLoading } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id: number) => {
    if (confirm('Delete this product?')) {
      await deleteProduct(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    // ... render products
  );
}
```

## 🔐 Authentication

Add authentication to admin routes:

```tsx
// app/admin/layout.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!user || user.role !== 'admin') return null;

  return (
    // ... admin layout
  );
}
```

## 📱 Responsive Breakpoints

```tsx
// Tailwind breakpoints used:
sm: 640px   // Small devices
md: 768px   // Medium devices
lg: 1024px  // Large devices
xl: 1280px  // Extra large devices
```

## 🎨 UI Components Used

- `Button` - Actions and navigation
- `Badge` - Status indicators
- `Input` - Form fields
- `Label` - Form labels
- `Card` - Content containers

## 🚦 Next Steps

1. **Connect to Backend API**
   - Replace mock data with real API calls
   - Add loading states
   - Handle errors

2. **Add Authentication**
   - Protect admin routes
   - Check user roles
   - Add logout functionality

3. **Enhance Features**
   - Add pagination
   - Implement search
   - Add sorting
   - Export functionality

4. **Add More Sections**
   - Analytics
   - Reports
   - Settings
   - Notifications

5. **Improve UX**
   - Add loading skeletons
   - Toast notifications
   - Confirmation modals
   - Keyboard shortcuts

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

**Created**: May 24, 2026  
**Version**: 1.0.0  
**Status**: ✅ Complete
