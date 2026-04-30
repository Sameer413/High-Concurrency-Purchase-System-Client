import { store } from "@/store";
import { refreshAccessToken, clearAuth, checkTokenExpiration } from "@/features/auth/authSlice";

class TokenRefreshManager {
  private refreshTimer: NodeJS.Timeout | null = null;
  private checkInterval: NodeJS.Timeout | null = null;
  private isRefreshing = false;

  /**
   * Start automatic token refresh
   * Checks token expiration every minute and refreshes when needed
   */
  start() {
    this.stop(); // Clear any existing timers

    // Check token expiration every minute
    this.checkInterval = setInterval(() => {
      this.checkAndRefreshToken();
    }, 60000); // Check every 1 minute

    // Initial check
    this.checkAndRefreshToken();
  }

  /**
   * Stop automatic token refresh
   */
  stop() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    this.isRefreshing = false;
  }

  /**
   * Check if token needs refresh and refresh if necessary
   */
  private async checkAndRefreshToken() {
    const state = store.getState();
    const { isAuthenticated, tokenExpiresAt, refreshToken } = state.auth;

    // Don't refresh if not authenticated or already refreshing
    if (!isAuthenticated || !refreshToken || this.isRefreshing) {
      return;
    }

    // Check if token expires in less than 5 minutes
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (tokenExpiresAt && now >= tokenExpiresAt - fiveMinutes) {
      await this.refreshToken();
    }
  }

  /**
   * Manually trigger token refresh
   */
  async refreshToken(): Promise<boolean> {
    if (this.isRefreshing) {
      return false;
    }

    this.isRefreshing = true;

    try {
      await store.dispatch(refreshAccessToken()).unwrap();
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
   * Schedule next refresh based on token expiration
   */
  private scheduleNextRefresh(expiresAt: number) {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;

    // Refresh 5 minutes before expiry
    const refreshTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000);

    this.refreshTimer = setTimeout(() => {
      this.refreshToken();
    }, refreshTime);
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const state = store.getState();
    const { tokenExpiresAt } = state.auth;

    if (!tokenExpiresAt) {
      return true;
    }

    return Date.now() >= tokenExpiresAt;
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  getTimeUntilExpiry(): number {
    const state = store.getState();
    const { tokenExpiresAt } = state.auth;

    if (!tokenExpiresAt) {
      return 0;
    }

    return Math.max(0, tokenExpiresAt - Date.now());
  }
}

// Export singleton instance
export const tokenRefreshManager = new TokenRefreshManager();

// Auto-start on module load if authenticated
if (typeof window !== "undefined") {
  const savedAuth = localStorage.getItem("auth");
  if (savedAuth) {
    try {
      const parsed = JSON.parse(savedAuth);
      if (parsed.accessToken && parsed.refreshToken) {
        tokenRefreshManager.start();
      }
    } catch (e) {
      console.error("Failed to parse auth from localStorage");
    }
  }
}
