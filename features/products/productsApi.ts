import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/baseQuery";
import { Product } from "@/types/types";

type GetProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product", "ProductAvailability", "Cart"],

  endpoints: (builder) => ({
    getProducts: builder.query<
      ApiResponse<Product[]>,
      GetProductsParams | void
    >({
      query: (params) => ({
        url: "/products",
        params: {
          page: params?.page,
          limit: params?.limit,
          search: params?.search,
        },
      }),
      providesTags: ["Product"],
    }),

    // Get single product details (for product page)
    getProductById: builder.query<ApiResponse<Product>, string>({
      query: (id) => ({
        url: `/products/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // Get real-time stock availability for a product (for "Buy Now" button)
    getProductAvailability: builder.query<
      ApiResponse<{ availableStock: number; canBuy: boolean }>,
      string
    >({
      query: (id) => ({
        url: `/products/${id}/availability`,
      }),
      providesTags: (result, error, id) => [
        { type: "ProductAvailability", id },
      ],
    }),

    // Stock reservation for 15 minutes when user clicks "Buy Now"
    buyNow: builder.mutation<
      ApiResponse<{
        success: boolean;
        reservationId: string;
      }>,
      { productId: string; quantity: number }
    >({
      query: ({ productId, quantity }) => ({
        url: `/products/${productId}/buy`,
        method: "POST",
        body: { quantity },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "ProductAvailability", id: productId },
        { type: "Product", id: productId },
      ],
      onQueryStarted: async ({ productId }, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch {
          // Even if the mutation fails, invalidate the cache
          dispatch(
            productsApi.util.invalidateTags([
              { type: "ProductAvailability", id: productId },
              { type: "Product", id: productId },
            ]),
          );
        }
      },
    }),

    // Add to cart
    addToCart: builder.mutation<
      ApiResponse<{ success: boolean; message: string }>,
      {
        productId: string;
        quantity: number;
        selectedSize?: string;
        selectedColor?: string;
      }
    >({
      query: ({ productId, quantity, selectedSize, selectedColor }) => ({
        url: `/cart/items`,
        method: "POST",
        body: {
          productId,
          quantity,
          selectedSize,
          selectedColor,
        },
      }),
      invalidatesTags: ["Cart"],
    }),

    // Get cart from API
    getCart: builder.query<
      ApiResponse<{
        items: Array<{
          id: string;
          product: Product;
          quantity: number;

          selectedSize: string;
          selectedColor: string;
        }>;
        summary: {
          itemCount: number;
          subtotal: number;
          shipping: number;
          tax: number;
          grandTotal: number;
        };
      }>,
      void
    >({
      query: () => ({
        url: "/cart",
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),

    // Remove from cart
    removeFromCart: builder.mutation<
      ApiResponse<{ success: boolean; message: string }>,
      string
    >({
      query: (itemId) => ({
        url: `/cart/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // Update cart item quantity
    updateCartQuantity: builder.mutation<
      ApiResponse<{ success: boolean; message: string }>,
      { itemId: string; quantity: number }
    >({
      query: ({ itemId, quantity }) => ({
        url: `/cart/items/${itemId}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductAvailabilityQuery,
  useBuyNowMutation,
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartQuantityMutation,
} = productsApi;
