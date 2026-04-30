"use client";

import Link from "next/link";
import { ShoppingBag, Heart, Search, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/features/auth/hooks";
import { useGetCartQuery } from "@/features/products/productsApi";
import { useGetFavoritesQuery } from "@/features/products/favoriteApi";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  // Fetch cart data from API
  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const cartCount = cartData?.data?.summary?.itemCount || 0;

  // Fetch favorites data from API
  const { data: favoritesData } = useGetFavoritesQuery(
    { page: 1, limit: 100, sort: "newest" },
    {
      skip: !isAuthenticated,
    }
  );
  const favoritesCount = favoritesData?.data?.meta?.total || 0;

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-75">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/"
                  className="text-lg font-medium hover:text-muted-foreground transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="text-lg font-medium hover:text-muted-foreground transition-colors"
                >
                  Collections
                </Link>
                <Link
                  href="/products?new=true"
                  className="text-lg font-medium hover:text-muted-foreground transition-colors"
                >
                  New
                </Link>
                <div className="border-t border-border my-4" />
                <div className="flex flex-col gap-2">
                  <Link
                    href="/products?category=men"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    MEN
                  </Link>
                  <Link
                    href="/products?category=women"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    WOMEN
                  </Link>
                  <Link
                    href="/products?category=kids"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    KIDS
                  </Link>
                </div>
                <div className="border-t border-border my-4" />
                <div className="flex flex-col gap-2">
                  {isAuthenticated ? (
                    <>
                      <span className="text-sm text-muted-foreground px-2">
                        Signed in as {user?.email}
                      </span>
                      <Button variant="outline" size="sm" onClick={logout}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="text-sm font-medium hover:text-foreground px-2 py-1 rounded hover:bg-muted transition-colors"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/auth/register"
                        className="text-sm font-medium hover:text-foreground px-2 py-1 rounded hover:bg-muted transition-colors"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight">
            ELEGANT VOGUE
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium hover:text-muted-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-sm font-medium hover:text-muted-foreground transition-colors"
            >
              Collections
            </Link>
            <Link
              href="/products?new=true"
              className="text-sm font-medium hover:text-muted-foreground transition-colors"
            >
              New
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              <span className="sr-only">Search</span>
            </Button>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:block text-sm text-muted-foreground">
                  {user?.email}
                </span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Sign in</span>
                </Button>
              </Link>
            )}
            <Link href="/favorites">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
              >
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-foreground text-background text-xs flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
                <span className="sr-only">Favorites</span>
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-foreground text-background text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Category Bar */}
        <div className="hidden md:flex items-center justify-center gap-8 py-2 border-t border-border">
          <Link
            href="/products?category=men"
            className="text-xs font-medium tracking-wider hover:text-muted-foreground transition-colors"
          >
            MEN
          </Link>
          <Link
            href="/products?category=women"
            className="text-xs font-medium tracking-wider hover:text-muted-foreground transition-colors"
          >
            WOMEN
          </Link>
          <Link
            href="/products?category=kids"
            className="text-xs font-medium tracking-wider hover:text-muted-foreground transition-colors"
          >
            KIDS
          </Link>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
