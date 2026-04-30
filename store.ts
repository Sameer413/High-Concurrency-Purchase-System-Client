import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import productsReducer from "@/features/products/productsSlice";
import { authApi } from "@/features/auth/authApi";
import { productsApi } from "@/features/products/productsApi";
import { favoritesApi } from "./features/products/favoriteApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(productsApi.middleware)
      .concat(favoritesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
