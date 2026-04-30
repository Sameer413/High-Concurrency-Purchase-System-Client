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
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  tokenExpiresAt: number | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
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

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.refreshToken;

      if (!refreshToken) {
        return rejectWithValue("No refresh token available");
      }

      const response = await fetch(`${API_FULL_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to refresh token");
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to refresh token");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, { dispatch, getState }) => {
  try {
    const state = getState() as { auth: AuthState };
    const accessToken = state.auth.accessToken;

    if (accessToken) {
      await fetch(`${API_FULL_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("auth");
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

const saveAuthToStorage = (state: AuthState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "auth",
      JSON.stringify({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenExpiresAt: state.tokenExpiresAt,
      })
    );
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth: (state) => {
      // Load auth state from localStorage (client-side only)
      if (typeof window !== "undefined") {
        const savedAuth = localStorage.getItem("auth");
        if (savedAuth) {
          try {
            const parsed = JSON.parse(savedAuth);
            state.user = parsed.user || null;
            state.accessToken = parsed.accessToken || null;
            state.refreshToken = parsed.refreshToken || null;
            state.tokenExpiresAt = parsed.tokenExpiresAt || null;
            state.isAuthenticated = !!parsed.accessToken;
          } catch (e) {
            console.error("Failed to parse auth from localStorage");
          }
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = false;
      state.tokenExpiresAt = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth");
      }
    },
    setTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        expiresIn?: number;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      // Calculate expiration time (default 15 minutes if not provided)
      const expiresIn = action.payload.expiresIn || 900; // 15 minutes in seconds
      state.tokenExpiresAt = Date.now() + expiresIn * 1000;

      saveAuthToStorage(state);
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
          state.refreshToken = action.payload.refreshToken;
          state.isAuthenticated = true;

          // Calculate expiration time
          const expiresIn = action.payload.expiresIn || 900; // 15 minutes default
          state.tokenExpiresAt = Date.now() + expiresIn * 1000;

          saveAuthToStorage(state);
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
            refreshToken: string;
            expiresIn?: number;
          }>
        ) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.isAuthenticated = true;

          // Calculate expiration time
          const expiresIn = action.payload.expiresIn || 900; // 15 minutes default
          state.tokenExpiresAt = Date.now() + expiresIn * 1000;

          saveAuthToStorage(state);
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Refresh token
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.error = null;
      })
      .addCase(
        refreshAccessToken.fulfilled,
        (
          state,
          action: PayloadAction<{
            accessToken: string;
            refreshToken: string;
            expiresIn?: number;
          }>
        ) => {
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.isAuthenticated = true;

          // Calculate expiration time
          const expiresIn = action.payload.expiresIn || 900; // 15 minutes default
          state.tokenExpiresAt = Date.now() + expiresIn * 1000;

          saveAuthToStorage(state);
        }
      )
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.error = action.payload as string;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.tokenExpiresAt = null;
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth");
        }
      });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.tokenExpiresAt = null;
    });

    // Fetch current user
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

export const { hydrateAuth, clearError, clearAuth, setTokens, checkTokenExpiration } = authSlice.actions;
export default authSlice.reducer;
