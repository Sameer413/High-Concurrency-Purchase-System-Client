"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  Package,
  MapPin,
  ChevronDown
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/hooks";
import { useGetCartQuery } from "@/features/products/productsApi";
import { useGetFavoritesQuery } from "@/features/products/favoriteApi";
import { cn } from "@/lib/utils";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/products" },
    { name: "New Arrival", href: "/products?new=true" },
  ];

  const categories = [
    { name: "MEN", href: "/products?category=men" },
    { name: "WOMEN", href: "/products?category=women" },
    { name: "KIDS", href: "/products?category=kids" },
  ];

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-background/80 backdrop-blur-lg border-border/50 py-1 shadow-sm" 
          : "bg-background border-transparent py-2"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-accent/50">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="flex flex-col h-full bg-background">
                <div className="p-6 border-b">
                  <span className="text-xl font-bold tracking-tighter italic">ELEGANT VOGUE</span>
                </div>
                <nav className="flex-1 overflow-y-auto py-6 px-6 space-y-6">
                  <div className="space-y-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Navigation</p>
                    <div className="grid gap-4">
                      {navLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className={cn(
                            "text-lg font-medium transition-colors hover:text-primary",
                            pathname === link.href ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Categories</p>
                    <div className="grid gap-4">
                      {categories.map((cat) => (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>
                <div className="p-6 border-t bg-slate-50/50">
                  {isAuthenticated ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user?.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold truncate max-w-[140px]">{user?.email}</span>
                          <button onClick={logout} className="text-xs text-red-500 font-medium text-left">Sign out</button>
                        </div>
                      </div>
                      <Link href="/profile">
                        <Button variant="outline" size="sm" className="h-8">Profile</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/auth/login" className="w-full">
                        <Button variant="outline" className="w-full">Sign in</Button>
                      </Link>
                      <Link href="/auth/register" className="w-full">
                        <Button className="w-full">Join Now</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="group flex items-center gap-1 transition-transform duration-300 hover:scale-[1.02]">
            <span className="text-xl md:text-2xl font-black tracking-tighter italic">
              ELEGANT VOGUE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all hover:text-primary group",
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute bottom-1 left-4 right-4 h-0.5 bg-primary transition-all duration-300 transform origin-left",
                  pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                )} />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex hover:bg-accent/50 rounded-full"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              <span className="sr-only">Search</span>
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden border-2 border-transparent hover:border-border transition-all">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
                      <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                        {user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 mt-1 p-2">
                  <DropdownMenuLabel className="font-normal p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">My Account</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2">
                    <Link href="/profile">
                      <User className="h-4 w-4" />
                      <span>Profile Details</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2">
                    <Link href="/profile?tab=orders">
                      <Package className="h-4 w-4" />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2">
                    <Link href="/profile?tab=addresses">
                      <MapPin className="h-4 w-4" />
                      <span>Saved Addresses</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2">
                    <Link href="/settings">
                      <Settings className="h-4 w-4" />
                      <span>Account Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem 
                    onClick={logout} 
                    className="cursor-pointer gap-2 py-2 text-red-500 focus:text-red-500 focus:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/50">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Sign in</span>
                </Button>
              </Link>
            )}

            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-accent/50">
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold animate-in zoom-in-50 duration-300">
                    {favoritesCount}
                  </span>
                )}
                <span className="sr-only">Favorites</span>
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-accent/50">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold animate-in zoom-in-50 duration-300">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Category Bar */}
        <div className="hidden md:flex items-center justify-center gap-12 py-2 border-t border-border/30">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="text-[10px] font-black tracking-[0.2em] text-muted-foreground hover:text-slate-900 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Search Bar Overlay */}
        {isSearchOpen && (
          <div className="py-4 border-t border-border/50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for items, brands, or collections..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all shadow-inner"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

