import { api } from '@/lib/apiBase';

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // =========================================
    // DASHBOARD
    // =========================================
    getDashboardStats: builder.query<any, void>({
      query: () => '/admin/dashboard/stats',
    }),
    getSalesChart: builder.query<any, string | undefined>({
      query: (period) => ({
        url: '/admin/dashboard/sales-chart',
        params: { period },
      }),
    }),
    getTopProducts: builder.query<any, number | undefined>({
      query: (limit) => ({
        url: '/admin/dashboard/top-products',
        params: { limit },
      }),
    }),

    // =========================================
    // PRODUCTS
    // =========================================
    getAdminProducts: builder.query<any, {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      status?: string;
    }>({
      query: (params) => ({
        url: '/admin/products',
        params,
      }),
      providesTags: ['AdminProducts'],
    }),
    getAdminProduct: builder.query<any, string>({
      query: (id) => `/admin/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'AdminProducts', id }],
    }),
    createProduct: builder.mutation<any, any>({
      query: (data) => ({
        url: '/admin/products',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AdminProducts'],
    }),
    updateProduct: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/products/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'AdminProducts',
        { type: 'AdminProducts', id },
      ],
    }),
    deleteProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminProducts'],
    }),

    // =========================================
    // PRODUCT IMAGE UPLOAD (Signed URL)
    // =========================================
    generateProductUploadUrl: builder.mutation<
      {
        uploadUrl: string;
        key: string;
        finalUrl: string;
        expiresIn: number;
      },
      { fileName: string; contentType: string }
    >({
      query: (data) => ({
        url: '/admin/products/upload-url',
        method: 'POST',
        body: data,
      }),
    }),

    // =========================================
    // ORDERS
    // =========================================
    getAdminOrders: builder.query<any, {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    }>({
      query: (params) => ({
        url: '/admin/orders',
        params,
      }),
      providesTags: ['AdminOrders'],
    }),
    getAdminOrder: builder.query<any, string>({
      query: (id) => `/admin/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'AdminOrders', id }],
    }),
    updateOrderStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        'AdminOrders',
        { type: 'AdminOrders', id },
      ],
    }),

    // =========================================
    // USERS
    // =========================================
    getAdminUsers: builder.query<any, {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    }>({
      query: (params) => ({
        url: '/admin/users',
        params,
      }),
      providesTags: ['AdminUsers'],
    }),
    getAdminUser: builder.query<any, string>({
      query: (id) => `/admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'AdminUsers', id }],
    }),
    updateUserStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        'AdminUsers',
        { type: 'AdminUsers', id },
      ],
    }),
    updateUserRole: builder.mutation<any, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: (result, error, { id }) => [
        'AdminUsers',
        { type: 'AdminUsers', id },
      ],
    }),

    // =========================================
    // REFUNDS
    // =========================================
    getAdminRefunds: builder.query<any, {
      page?: number;
      limit?: number;
      status?: string;
    }>({
      query: (params) => ({
        url: '/admin/refunds',
        params,
      }),
      providesTags: ['AdminRefunds'],
    }),
    getAdminRefund: builder.query<any, string>({
      query: (id) => `/admin/refunds/${id}`,
      providesTags: (result, error, id) => [{ type: 'AdminRefunds', id }],
    }),
    approveRefund: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/refunds/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        'AdminRefunds',
        { type: 'AdminRefunds', id },
      ],
    }),
    rejectRefund: builder.mutation<any, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/refunds/${id}/reject`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        'AdminRefunds',
        { type: 'AdminRefunds', id },
      ],
    }),
    processRefund: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/refunds/${id}/process`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        'AdminRefunds',
        { type: 'AdminRefunds', id },
      ],
    }),
  }),
});

export const {
  // Dashboard
  useGetDashboardStatsQuery,
  useGetSalesChartQuery,
  useGetTopProductsQuery,
  
  // Products
  useGetAdminProductsQuery,
  useGetAdminProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGenerateProductUploadUrlMutation,
  
  // Orders
  useGetAdminOrdersQuery,
  useGetAdminOrderQuery,
  useUpdateOrderStatusMutation,
  
  // Users
  useGetAdminUsersQuery,
  useGetAdminUserQuery,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  
  // Refunds
  useGetAdminRefundsQuery,
  useGetAdminRefundQuery,
  useApproveRefundMutation,
  useRejectRefundMutation,
  useProcessRefundMutation,
} = adminApi;
