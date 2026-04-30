"use client";

import { useEffect, useState } from "react";
import { useTokenExpiration } from "@/features/auth/useTokenExpiration";
import { tokenRefreshManager } from "@/lib/tokenRefreshManager";
import { Button } from "@/components/ui/button";

export function TokenExpirationWarning() {
  const { isExpiringSoon, timeUntilExpiry } = useTokenExpiration();
  const [show, setShow] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setShow(isExpiringSoon);
  }, [isExpiringSoon]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await tokenRefreshManager.refreshToken();
    setIsRefreshing(false);
    setShow(false);
  };

  const handleDismiss = () => {
    setShow(false);
  };

  if (!show) {
    return null;
  }

  const minutes = Math.floor(timeUntilExpiry / 60000);
  const seconds = Math.floor((timeUntilExpiry % 60000) / 1000);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-600 dark:text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Session Expiring Soon
            </h3>
            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
              Your session will expire in {minutes}m {seconds}s. Would you like to extend it?
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                {isRefreshing ? "Refreshing..." : "Extend Session"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDismiss}
                className="border-yellow-300 dark:border-yellow-700"
              >
                Dismiss
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-yellow-600 dark:text-yellow-500 hover:text-yellow-800 dark:hover:text-yellow-300"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
