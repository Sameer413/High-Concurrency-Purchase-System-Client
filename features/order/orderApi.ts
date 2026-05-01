import { baseQueryWithReauth } from "@/lib/baseQuery";
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
    initiateOrder: builder.mutation<ApiResponse<any>, {}>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useInitiateOrderMutation } = orderAPI;
