import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { tokenRefreshManager } from "@/lib/tokenRefreshManager";

interface TokenExpirationState {
  isExpiringSoon: boolean;
  timeUntilExpiry: number;
  isExpired: boolean;
}

export const useTokenExpiration = (): TokenExpirationState => {
  const { tokenExpiresAt, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [state, setState] = useState<TokenExpirationState>({
    isExpiringSoon: false,
    timeUntilExpiry: 0,
    isExpired: false,
  });

  useEffect(() => {
    if (!isAuthenticated || !tokenExpiresAt) {
      setState({
        isExpiringSoon: false,
        timeUntilExpiry: 0,
        isExpired: false,
      });
      return;
    }

    const updateState = () => {
      const now = Date.now();
      const timeUntilExpiry = Math.max(0, tokenExpiresAt - now);
      const fiveMinutes = 5 * 60 * 1000;

      setState({
        isExpiringSoon: timeUntilExpiry > 0 && timeUntilExpiry <= fiveMinutes,
        timeUntilExpiry,
        isExpired: timeUntilExpiry === 0,
      });
    };

    // Initial update
    updateState();

    // Update every 30 seconds
    const interval = setInterval(updateState, 30000);

    return () => clearInterval(interval);
  }, [tokenExpiresAt, isAuthenticated]);

  return state;
};

export const useAutoRefresh = (enabled: boolean = true) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (enabled && isAuthenticated) {
      tokenRefreshManager.start();
      return () => {
        if (!enabled) {
          tokenRefreshManager.stop();
        }
      };
    }
  }, [enabled, isAuthenticated]);
};
