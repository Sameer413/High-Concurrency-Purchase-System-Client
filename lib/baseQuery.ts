import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { setTokens, clearAuth } from "@/features/auth/authSlice";
import { RootState } from "@/store";
import { Mutex } from "async-mutex";
import { API_FULL_URL } from "./config";

// Create a mutex to prevent multiple refresh attempts
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: API_FULL_URL,
  credentials: "include", // Important: send cookies with requests
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait until the mutex is available without locking it
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Check if we're already refreshing
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        // Try to refresh the token using the cookie
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const data = refreshResult.data as {
            accessToken: string;
            expiresIn: number;
          };

          // Store the new access token
          api.dispatch(
            setTokens({
              accessToken: data.accessToken,
              refreshToken: "from-cookie",
              expiresIn: data.expiresIn,
            })
          );

          // Retry the original query with new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh failed, clear auth
          api.dispatch(clearAuth());
        }
      } catch (error) {
        console.error("Token refresh error:", error);
        api.dispatch(clearAuth());
      } finally {
        release();
      }
    } else {
      // Wait for the mutex to be available, then retry
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
