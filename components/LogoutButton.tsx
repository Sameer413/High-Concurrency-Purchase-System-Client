"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks";

export function LogoutButton() {
  const { logout, isLoading } = useAuth();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={logout}
      disabled={isLoading}
    >
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
