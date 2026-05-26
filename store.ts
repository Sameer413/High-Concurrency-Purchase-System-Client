import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authReducer from "@/features/auth/authSlice";
import productsReducer from "@/features/products/productsSlice";
import paymentReducer from "@/features/payment/paymentSlice";
import { authApi } from "@/features/auth/authApi";
import { productsApi } from "@/features/products/productsApi";
import { favoritesApi } from "./features/products/favoriteApi";
import { paymentApi } from "./features/payment/paymentApi";
import { orderAPI } from "./features/order/orderApi";
import { addressApi } from "./features/address/addressApi";
import { api } from "./lib/apiBase";

// Persist config for payment state
const paymentPersistConfig = {
  key: "payment",
  storage,
  whitelist: ["currentPayment", "paymentHistory"], // Only persist these fields
};

// Create persisted payment reducer
const persistedPaymentReducer = persistReducer(
  paymentPersistConfig,
  paymentReducer
);

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  payment: persistedPaymentReducer,
  [authApi.reducerPath]: authApi.reducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [favoritesApi.reducerPath]: favoritesApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  [orderAPI.reducerPath]: orderAPI.reducer,
  [addressApi.reducerPath]: addressApi.reducer,
  [api.reducerPath]: api.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(authApi.middleware)
      .concat(productsApi.middleware)
      .concat(favoritesApi.middleware)
      .concat(paymentApi.middleware)
      .concat(orderAPI.middleware)
      .concat(addressApi.middleware)
      .concat(api.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
