"use client";

import { useEffect } from "react";
import { useAuth } from "@/features/auth/hooks";
import { usePathname, useRouter } from "next/navigation";

export function CheckAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, refetchCurrentUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Only check auth on client side
    if (typeof window === "undefined") return;

    // If user is authenticated, fetch current user data
    if (isAuthenticated) {
      refetchCurrentUser();
    }

    // If user is not authenticated and tries to access protected routes, redirect to login
    const protectedRoutes = ["/cart", "/checkout", "/favorites", "/profile"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!isAuthenticated && isProtectedRoute) {
      // Save the current path to redirect after login
      const redirectUrl = pathname;
      router.push(`/auth?redirect=${encodeURIComponent(redirectUrl)}`);
    }
  }, [isAuthenticated, pathname, router, refetchCurrentUser]);

  return <>{children}</>;
}
