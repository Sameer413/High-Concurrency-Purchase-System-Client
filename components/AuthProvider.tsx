"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { setTokens, clearAuth } from "@/features/auth/authSlice";
import { API_FULL_URL } from "@/lib/config";
import { TokenExpirationWarning } from "./TokenExpirationWarning";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    /**
     * On every page load/reload:
     * 1. Hit POST /auth/refresh — the browser automatically sends the
     *    httpOnly `refresh_token` cookie with `credentials: "include"`.
     * 2. If the server accepts it, it rotates both tokens, sets fresh cookies,
     *    and returns the new accessToken in the JSON body.
     * 3. We store the accessToken in Redux → isAuthenticated becomes true →
     *    useGetCurrentUserQuery fires and populates the user.
     * 4. If the refresh fails (cookie missing, expired, or revoked),
     *    we clear any stale auth state.
     */
    const rehydrateFromCookie = async () => {
      try {
        const res = await fetch(`${API_FULL_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include", // send the httpOnly cookie
        });

        if (!res.ok) {
          // No valid refresh token cookie → clear any stale state
          dispatch(clearAuth());
          return;
        }

        const data: { accessToken: string; expiresIn: number; tokenType: string } =
          await res.json();

        dispatch(
          setTokens({
            accessToken: data.accessToken,
            refreshToken: "from-cookie", // actual token lives in the httpOnly cookie
            expiresIn: data.expiresIn,
          })
        );
      } catch {
        // Network error or server down — don't treat as logged out,
        // just leave state as-is (unauthenticated)
        dispatch(clearAuth());
      }
    };

    rehydrateFromCookie();
  }, [dispatch]);

  return (
    <>
      {children}
      <TokenExpirationWarning />
    </>
  );
}
