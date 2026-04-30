import { store } from "@/store";
import { refreshAccessToken, clearAuth } from "@/features/auth/authSlice";
import { API_FULL_URL } from "./config";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

export const apiClient = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const state = store.getState();
  const accessToken = state.auth.accessToken;

  // Construct full URL
  const fullUrl = url.startsWith("http") ? url : `${API_FULL_URL}${url}`;

  // Add authorization header if token exists
  const headers = new Headers(options.headers);
  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(fullUrl, config);

    // If unauthorized and we have a refresh token, try to refresh
    if (response.status === 401) {
      const refreshToken = store.getState().auth.refreshToken;

      if (!refreshToken) {
        store.dispatch(clearAuth());
        throw new Error("No refresh token available");
      }

      if (isRefreshing) {
        // Wait for the refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Retry the original request with new token
            const newToken = store.getState().auth.accessToken;
            headers.set("Authorization", `Bearer ${newToken}`);
            return fetch(fullUrl, { ...config, headers });
          })
          .catch((err) => {
            throw err;
          });
      }

      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const result = await store.dispatch(refreshAccessToken()).unwrap();

        processQueue(null);
        isRefreshing = false;

        // Retry the original request with new token
        headers.set("Authorization", `Bearer ${result.accessToken}`);
        return fetch(fullUrl, { ...config, headers });
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;
        store.dispatch(clearAuth());
        throw refreshError;
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export const apiGet = async (url: string, options?: RequestInit) => {
  return apiClient(url, { ...options, method: "GET" });
};

export const apiPost = async (url: string, data?: any, options?: RequestInit) => {
  return apiClient(url, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
};

export const apiPut = async (url: string, data?: any, options?: RequestInit) => {
  return apiClient(url, {
    ...options,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
};

export const apiDelete = async (url: string, options?: RequestInit) => {
  return apiClient(url, { ...options, method: "DELETE" });
};
