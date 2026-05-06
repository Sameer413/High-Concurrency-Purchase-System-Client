import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_FULL_URL } from "@/lib/config";
import { setTokens, clearAuth } from "./authSlice";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}



interface UserResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
  };
}

// Auth API doesn't use baseQueryWithReauth to avoid circular refresh
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_FULL_URL}/auth`,
    credentials: "include", // Important: send cookies with requests
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth: { accessToken: string | null } };
      const accessToken = state.auth.accessToken;
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Extract refresh token from cookie (server sets it)
          // Store access token in Redux
          dispatch(
            setTokens({
              accessToken: data.accessToken,
              refreshToken: "from-cookie", // Placeholder since it's in httpOnly cookie
              expiresIn: data.expiresIn,
            })
          );
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),
    register: builder.mutation<UserResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearAuth());
        } catch (error) {
          // Clear auth even if logout fails
          dispatch(clearAuth());
        }
      },
    }),
    getCurrentUser: builder.query<UserResponse, void>({
      query: () => "/me",
      // Keep cached data for 5 minutes
      keepUnusedDataFor: 300,
    }),
  }),
  refetchOnMountOrArgChange: 30,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} = authApi;
