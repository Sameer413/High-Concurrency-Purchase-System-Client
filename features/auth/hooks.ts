import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { clearError, clearAuth, setTokens } from "./authSlice";
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshAccessTokenMutation,
  useGetCurrentUserQuery,
} from "./authApi";

// Selectors
export const useAuthSelector = () => {
  return useSelector((state: RootState) => state.auth);
};

export const useIsAuthenticated = () => {
  return useSelector((state: RootState) => state.auth.isAuthenticated);
};

export const useUser = () => {
  return useSelector((state: RootState) => state.auth.user);
};

export const useAccessToken = () => {
  return useSelector((state: RootState) => state.auth.accessToken);
};

// Actions
export const useAuthActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    clearError: () => dispatch(clearError()),
    clearAuth: () => dispatch(clearAuth()),
    setTokens: (accessToken: string, expiresIn: number) =>
      dispatch(setTokens({ accessToken, refreshToken: "from-cookie", expiresIn })),
  };
};

// Combined auth hook
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const accessToken = useAccessToken();
  const { clearError: clearErrorAction, clearAuth: clearAuthAction } = useAuthActions();

  const [loginApi, loginResult] = useLoginMutation();
  const [registerApi, registerResult] = useRegisterMutation();
  const [logoutApi, logoutResult] = useLogoutMutation();
  const [refreshApi, refreshResult] = useRefreshAccessTokenMutation();

  const {
    data: currentUserData,
    refetch: refetchCurrentUser,
    isLoading: isLoadingUser,
  } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Helper to extract error message
  const getErrorMessage = (error: any): string | undefined => {
    if (error && 'data' in error) {
      return error.data?.message;
    }
    return undefined;
  };

  const handleLogin = async (email: string, password: string) => {
    clearErrorAction();
    try {
      await loginApi({ email, password }).unwrap();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || error.message || "Login failed",
      };
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    clearErrorAction();
    try {
      await registerApi({ email, password, firstName, lastName }).unwrap();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || error.message || "Registration failed",
      };
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleRefreshToken = async () => {
    try {
      await refreshApi().unwrap();
      return { success: true };
    } catch (error: any) {
      // Don't clear auth on refresh failure - the user might still be logged in
      console.error("Token refresh failed:", error);
      return {
        success: false,
        error: error.data?.message || error.message || "Token refresh failed",
      };
    }
  };

  return {
    isAuthenticated,
    user: currentUserData?.data || user,
    accessToken,
    isLoading:
      loginResult.isLoading ||
      registerResult.isLoading ||
      logoutResult.isLoading ||
      refreshResult.isLoading ||
      isLoadingUser,
    error:
      getErrorMessage(loginResult.error) ||
      getErrorMessage(registerResult.error) ||
      getErrorMessage(refreshResult.error),
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshToken: handleRefreshToken,
    refetchCurrentUser,
  };
};
