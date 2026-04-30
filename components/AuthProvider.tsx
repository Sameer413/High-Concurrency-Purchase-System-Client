"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hydrateAuth } from "@/features/auth/authSlice";
import { TokenExpirationWarning } from "./TokenExpirationWarning";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  // Hydrate auth state from localStorage on mount
  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return (
    <>
      {children}
      <TokenExpirationWarning />
    </>
  );
}
