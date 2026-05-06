import { baseQueryWithReauth } from "@/lib/baseQuery";
import { OrderFormData } from "@/schemas/order.schema";
import { createApi } from "@reduxjs/toolkit/query/react";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const orderAPI = createApi({
  reducerPath: "orderAPI",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    initiateOrder: builder.mutation<ApiResponse<any>, OrderFormData>({
      query: (data) => ({
        url: "/orders/initiate",
        method: "POST",
        body: {
          ...data,
        },
      }),
    }),
  }),
});

export const { useInitiateOrderMutation } = orderAPI;
