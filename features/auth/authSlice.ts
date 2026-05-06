import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_FULL_URL } from "@/lib/config";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  tokenExpiresAt: number | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  tokenExpiresAt: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_FULL_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Login failed");
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password, name }: { email: string; password: string; name?: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_FULL_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Registration failed");
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

// NOTE: Token refresh is handled by AuthProvider via cookie-based POST /auth/refresh.
// The httpOnly refresh_token cookie is sent automatically — never stored in JS state.

export const logout = createAsyncThunk("auth/logout", async (_, { dispatch, getState }) => {
  try {
    const state = getState() as { auth: AuthState };
    const accessToken = state.auth.accessToken;

    await fetch(`${API_FULL_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", // send cookie so server can clear it
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {},
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    dispatch(clearAuth());
  }
});

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const accessToken = state.auth.accessToken;

      const response = await fetch(`${API_FULL_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue("Failed to fetch user");
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);

// We no longer persist auth to localStorage.
// On reload, AuthProvider calls /auth/refresh using the httpOnly cookie.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _saveAuthToStorage = (_state: AuthState) => { /* intentionally empty */ };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // hydrateAuth removed — rehydration now happens in AuthProvider via /auth/refresh cookie
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = false;
      state.tokenExpiresAt = null;
    },
    setTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken?: string; // kept for API compat but ignored (lives in httpOnly cookie)
        expiresIn?: number;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;

      // Calculate expiration time (default 15 minutes if not provided)
      const expiresIn = action.payload.expiresIn || 900; // 15 minutes in seconds
      state.tokenExpiresAt = Date.now() + expiresIn * 1000;
    },
    checkTokenExpiration: (state) => {
      if (state.tokenExpiresAt && Date.now() >= state.tokenExpiresAt - 60000) {
        // Token expires in less than 1 minute, trigger refresh
        state.error = "Token expired";
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (
          state,
          action: PayloadAction<{
            user: User;
            accessToken: string;
            refreshToken: string;
            expiresIn?: number;
          }>
        ) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.isAuthenticated = true;

          // Calculate expiration time
          const expiresIn = action.payload.expiresIn || 900; // 15 minutes default
          state.tokenExpiresAt = Date.now() + expiresIn * 1000;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (
          state,
          action: PayloadAction<{
            user: User;
            accessToken: string;
            expiresIn?: number;
          }>
        ) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.isAuthenticated = true;

          // Calculate expiration time
          const expiresIn = action.payload.expiresIn || 900; // 15 minutes default
          state.tokenExpiresAt = Date.now() + expiresIn * 1000;
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Refresh token is handled by AuthProvider directly — no reducers needed here.

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.tokenExpiresAt = null;
    });

    // Fetch current user (legacy thunk — prefer useGetCurrentUserQuery from authApi)
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearAuth, setTokens, checkTokenExpiration } = authSlice.actions;
export default authSlice.reducer;
