import { baseQueryWithReauth } from "@/lib/baseQuery";
import { FavoriteItem } from "@/types/types";
import { createApi } from "@reduxjs/toolkit/query/react";

type GetFavoritesParams = {
  page?: number;
  limit?: number;
  sort:
    | "newest"
    | "oldest"
    | "price_asc"
    | "price_desc"
    | "name_asc"
    | "name_desc";
};

export const favoritesApi = createApi({
  reducerPath: "favoritesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Favorite"],
  endpoints: (builder) => ({
    getFavorites: builder.query<
      {
        success: boolean;
        message: string;
        data: {
          items: FavoriteItem[];
          meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
          };
        };
      },
      GetFavoritesParams
    >({
      query: ({ page = 1, limit = 12, sort = "newest" }) => ({
        url: `/favorites?page=${page}&limit=${limit}&sort=${sort}`,
        method: "GET",
      }),
      providesTags: ["Favorite"],
    }),

    toggleFavorite: builder.mutation<
      { success: boolean; message: string },
      { productId: string }
    >({
      query: ({ productId }) => ({
        url: `/favorites/toggle/${productId}`,
        method: "POST",
      }),
      invalidatesTags: ["Favorite"],
    }),

    isFavorite: builder.query<
      { success: boolean; message: string; data: { isFavorite: boolean } },
      string
    >({
      query: (productId) => ({
        url: `/favorites/is-favorite/${productId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useToggleFavoriteMutation,
  useIsFavoriteQuery,
} = favoritesApi;
