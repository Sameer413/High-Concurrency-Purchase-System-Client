import { store } from "@/store";
import { setTokens, clearAuth, checkTokenExpiration } from "@/features/auth/authSlice";
import { API_FULL_URL } from "@/lib/config";

class TokenRefreshManager {
  private checkInterval: NodeJS.Timeout | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;
  private isRefreshing = false;

  /**
   * Start automatic token refresh.
   * Checks token expiration every minute and proactively refreshes
   * 5 minutes before the access token expires (via httpOnly cookie).
   */
  start() {
    this.stop(); // clear any existing timers

    // Periodic expiration check every 60 seconds
    this.checkInterval = setInterval(() => {
      this.checkAndRefreshToken();
    }, 60_000);

    // Initial check
    this.checkAndRefreshToken();
  }

  /**
   * Stop automatic token refresh.
   */
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    this.isRefreshing = false;
  }

  /**
   * If the access token expires within 5 minutes, proactively refresh.
   */
  private async checkAndRefreshToken() {
    const { isAuthenticated, tokenExpiresAt } = store.getState().auth;

    if (!isAuthenticated || this.isRefreshing) return;

    store.dispatch(checkTokenExpiration());

    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (tokenExpiresAt && now >= tokenExpiresAt - fiveMinutes) {
      await this.refreshToken();
    }
  }

  /**
   * Perform a cookie-based token refresh.
   * The browser sends the httpOnly `refresh_token` cookie automatically.
   * On success, stores the new access token in Redux.
   * On failure, clears auth and stops the manager.
   */
  async refreshToken(): Promise<boolean> {
    if (this.isRefreshing) return false;

    this.isRefreshing = true;

    try {
      const res = await fetch(`${API_FULL_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include", // sends the httpOnly refresh_token cookie
      });

      if (!res.ok) {
        throw new Error(`Refresh failed: ${res.status}`);
      }

      const data: { accessToken: string; expiresIn: number; tokenType: string } =
        await res.json();

      store.dispatch(
        setTokens({
          accessToken: data.accessToken,
          expiresIn: data.expiresIn,
        })
      );

      // Schedule next refresh
      const { tokenExpiresAt } = store.getState().auth;
      if (tokenExpiresAt) {
        this.scheduleNextRefresh(tokenExpiresAt);
      }

      this.isRefreshing = false;
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.isRefreshing = false;
      this.stop();
      store.dispatch(clearAuth());
      return false;
    }
  }

  /**
   * Schedule a one-shot refresh 5 minutes before token expiry.
   */
  private scheduleNextRefresh(expiresAt: number) {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);

    const refreshIn = Math.max(0, expiresAt - Date.now() - 5 * 60 * 1000);

    this.refreshTimer = setTimeout(() => {
      this.refreshToken();
    }, refreshIn);
  }

  /** Returns true if the current access token is expired. */
  isTokenExpired(): boolean {
    const { tokenExpiresAt } = store.getState().auth;
    if (!tokenExpiresAt) return true;
    return Date.now() >= tokenExpiresAt;
  }

  /** Returns ms until the access token expires (0 if already expired). */
  getTimeUntilExpiry(): number {
    const { tokenExpiresAt } = store.getState().auth;
    if (!tokenExpiresAt) return 0;
    return Math.max(0, tokenExpiresAt - Date.now());
  }
}

// Singleton
export const tokenRefreshManager = new TokenRefreshManager();

// Auto-start if the Redux store already has an authenticated session
// (e.g. page reload where AuthProvider has already hydrated state)
if (typeof window !== "undefined") {
  // Defer to after the store has been populated by AuthProvider
  setTimeout(() => {
    const { isAuthenticated } = store.getState().auth;
    if (isAuthenticated) {
      tokenRefreshManager.start();
    }
  }, 0);
}
