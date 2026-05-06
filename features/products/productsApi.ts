import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/baseQuery";
import { Product } from "@/types/types";

type GetProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string; // Comma-separated: "Black,White,Blue"
  newOnly?: boolean;
  inStockOnly?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'newest' | 'rating';
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
          category: params?.category,
          minPrice: params?.minPrice,
          maxPrice: params?.maxPrice,
          colors: params?.colors,
          newOnly: params?.newOnly,
          inStockOnly: params?.inStockOnly,
          sortBy: params?.sortBy,
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

    // Stock reservation with buyV2 - creates time-limited reservation
    buyNow: builder.mutation<
      ApiResponse<{
        success: boolean;
        reservationId: string;
        expireAt: Date;
      }>,
      {
        items: Array<{
          productId: string;
          quantity: number;
          unitPrice: number;
          totalPrice: number;
          currency: "INR";
          productName: string;
          productImage?: string;
          variantId?: string;
          selectedSize?: string;
          selectedColor?: string;
        }>;
      }
    >({
      query: ({ items }) => ({
        url: `/products/buy`,
        method: "POST",
        body: { items },
      }),
      invalidatesTags: (result, error, { items }) => {
        // Invalidate cache for all products in the reservation
        const tags: any[] = [];
        items.forEach((item) => {
          tags.push(
            { type: "ProductAvailability", id: item.productId },
            { type: "Product", id: item.productId }
          );
        });
        return tags;
      },
      onQueryStarted: async ({ items }, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch {
          // Even if the mutation fails, invalidate the cache
          const tags: any[] = [];
          items.forEach((item) => {
            tags.push(
              { type: "ProductAvailability", id: item.productId },
              { type: "Product", id: item.productId }
            );
          });
          dispatch(productsApi.util.invalidateTags(tags));
        }
      },
    }),
    // buyNow: builder.mutation<
    //   ApiResponse<{
    //     success: boolean;
    //     reservationId: string;
    //   }>,
    //   { productId: string; quantity: number }
    // >({
    //   query: ({ productId, quantity }) => ({
    //     url: `/products/${productId}/buy`,
    //     method: "POST",
    //     body: { quantity },
    //   }),
    //   invalidatesTags: (result, error, { productId }) => [
    //     { type: "ProductAvailability", id: productId },
    //     { type: "Product", id: productId },
    //   ],
    //   onQueryStarted: async ({ productId }, { dispatch, queryFulfilled }) => {
    //     try {
    //       await queryFulfilled;
    //     } catch {
    //       // Even if the mutation fails, invalidate the cache
    //       dispatch(
    //         productsApi.util.invalidateTags([
    //           { type: "ProductAvailability", id: productId },
    //           { type: "Product", id: productId },
    //         ]),
    //       );
    //     }
    //   },
    // }),

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

    // Get reservation details by ID
    getReservation: builder.query<
      ApiResponse<{
        reservationId: string;
        userId: string;
        items: Array<{
          productId: string;
          productName: string;
          quantity: number;
          unitPrice: number;
          totalPrice: number;
        }>;
        totalAmount: number;
        currency: string;
        createdAt: number;
        expireAt: number;
        version: number;
      }>,
      string
    >({
      query: (reservationId) => ({
        url: `/products/reservations/${reservationId}`,
        method: "GET",
      }),
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
  useGetReservationQuery,
} = productsApi;
