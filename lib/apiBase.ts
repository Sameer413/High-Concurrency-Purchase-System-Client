import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

/**
 * Base RTK Query API with tag types for cache invalidation
 * All feature APIs should use api.injectEndpoints() to add their endpoints
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'AdminProducts',
    'AdminOrders',
    'AdminUsers',
    'AdminRefunds',
    'AdminDashboard',
  ],
  endpoints: () => ({}),
});
