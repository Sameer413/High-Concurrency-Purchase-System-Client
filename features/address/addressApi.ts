import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_FULL_URL } from "@/lib/config";
import { RootState } from "@/store";

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CreateAddressDto extends Omit<Address, 'id' | 'isDefault'> {}
export interface UpdateAddressDto extends Partial<CreateAddressDto> {}

export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_FULL_URL}/addresses`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const accessToken = state.auth.accessToken;
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Address"],
  endpoints: (builder) => ({
    getAddresses: builder.query<{ success: boolean; data: Address[] }, void>({
      query: () => "",
      providesTags: ["Address"],
    }),
    createAddress: builder.mutation<{ success: boolean; data: Address }, CreateAddressDto>({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),
    updateAddress: builder.mutation<{ success: boolean; data: Address }, { id: string; data: UpdateAddressDto }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),
    deleteAddress: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
    setDefaultAddress: builder.mutation<{ success: boolean; data: Address }, string>({
      query: (id) => ({
        url: `/${id}/default`,
        method: "PATCH",
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = addressApi;
