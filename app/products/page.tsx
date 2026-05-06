"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, ChevronDown, X, Search, Loader2 } from "lucide-react";
// import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { ProductCard } from "@/components/common/product-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useGetProductsQuery } from "@/features/products/productsApi";
import { categories } from "@/lib/products";

type SortOption = "default" | "price-asc" | "price-desc" | "name" | "newest" | "rating";

export default function ProductsPage() {
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category");
  const newOnly = searchParams.get("new") === "true";
  const search = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(
    categoryParam || "All",
  );

  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showNewOnly, setShowNewOnly] = useState(newOnly);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState(search); // Local search input
  const [debouncedSearch, setDebouncedSearch] = useState(search); // Debounced search for API
  const [isSearching, setIsSearching] = useState(false); // Search loading state

  const [page, setPage] = useState(1);
  const limit = 20;

  // Debounce search input
  useEffect(() => {
    if (searchInput !== debouncedSearch) {
      setIsSearching(true);
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setIsSearching(false);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchInput, debouncedSearch]);

  // Build API query parameters
  const apiParams = useMemo(() => {
    const params: any = {
      page,
      limit,
      inStockOnly: true, // Always show only in-stock items
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (sortBy && sortBy !== "default") {
      params.sortBy = sortBy;
    }

    if (selectedCategory !== "All") {
      params.category = selectedCategory;
    }

    if (showNewOnly) {
      params.newOnly = true;
    }

    if (priceRange[0] > 0 || priceRange[1] < 5000) {
      params.minPrice = priceRange[0];
      params.maxPrice = priceRange[1];
    }

    if (selectedColors.length > 0) {
      params.colors = selectedColors.join(",");
    }

    return params;
  }, [
    page,
    debouncedSearch,
    selectedCategory,
    sortBy,
    priceRange,
    showNewOnly,
    selectedColors,
  ]);

  // API CALL with filters
  const { data, isLoading, isError, error } = useGetProductsQuery(apiParams);

  const products = (data?.data || []).map((p) => ({
    ...p,
    originalPrice: p.originalPrice ?? null,
  }));

  // No need for client-side filtering anymore - API handles it
  const filteredProducts = products;

  // Log for debugging
  useEffect(() => {
    console.log('API Params:', apiParams);
    console.log('Products count:', products.length);
  }, [apiParams, products.length]);

  // favorites load
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch {
        console.error("favorites parse error");
      }
    }
  }, []);

  // collect all colors from current products
  const allColors = useMemo(() => {
    const colors = new Set<string>();

    products.forEach((p: any) => {
      p.colors?.forEach((c: string) => colors.add(c));
    });

    return Array.from(colors);
  }, [products]);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];

      localStorage.setItem("favorites", JSON.stringify(updated));

      return updated;
    });
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSortBy("default");
    setPriceRange([0, 5000]);
    setShowNewOnly(false);
    setSelectedColors([]);
    setSearchInput("");
  };

  const hasActiveFilters =
    selectedCategory !== "All" ||
    showNewOnly ||
    priceRange[0] > 0 ||
    priceRange[1] < 5000 ||
    selectedColors.length > 0 ||
    searchInput.trim() !== "";

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6">
            Home / Products
          </nav>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 shrink-0">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto space-y-8 pr-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                  {isSearching ? (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                  ) : searchInput ? (
                    <button
                      onClick={() => setSearchInput("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          onClick={() => setSelectedCategory(category)}
                          className={`text-sm transition-colors ${
                            selectedCategory === category
                              ? "font-medium text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Best Sellers */}
                <div>
                  <h3 className="font-semibold mb-4">Best Sellers</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      <button
                        onClick={() => setSelectedCategory("T-Shirts")}
                        className="hover:text-foreground transition-colors"
                      >
                        T-Shirts
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setSelectedCategory("Jeans")}
                        className="hover:text-foreground transition-colors"
                      >
                        Jeans
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setSelectedCategory("Jackets")}
                        className="hover:text-foreground transition-colors"
                      >
                        Jackets
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setSelectedCategory("Suits")}
                        className="hover:text-foreground transition-colors"
                      >
                        Coats
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="font-semibold mb-4">Availability</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox defaultChecked />
                      <span>In Stock ({filteredProducts.filter(p => p.isAvailable).length})</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Checkbox />
                      <span>Out of Stock ({filteredProducts.filter(p => !p.isAvailable).length})</span>
                    </label>
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h3 className="font-semibold mb-4">Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {allColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColors.includes(color)
                            ? "border-foreground scale-110"
                            : "border-border"
                        }`}
                        style={{
                          backgroundColor:
                            color === "Black"
                              ? "#000"
                              : color === "White"
                                ? "#fff"
                                : color === "Navy"
                                  ? "#1a365d"
                                  : color === "Gray"
                                    ? "#6b7280"
                                    : color === "Beige"
                                      ? "#d4c5b9"
                                      : color === "Olive"
                                        ? "#556b2f"
                                        : color === "Blue"
                                          ? "#3b82f6"
                                          : color === "Red"
                                            ? "#dc2626"
                                            : color === "Khaki"
                                              ? "#c3b091"
                                              : color === "Light Blue"
                                                ? "#93c5fd"
                                                : color === "Charcoal"
                                                  ? "#374151"
                                                  : "#ccc",
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-4">Price Range</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={(value) =>
                      setPriceRange(value as [number, number])
                    }
                    max={500}
                    step={10}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={showNewOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowNewOnly(!showNewOnly)}
                    >
                      New
                    </Button>
                  </div>
                </div>

                {/* Ratings */}
                <div>
                  <h3 className="font-semibold mb-4">Ratings</h3>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-foreground">
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                      (50)
                    </span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 gap-4">
                <div>
                  <h1 className="text-2xl font-bold">Products</h1>
                  {!isLoading && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Mobile Filters */}
                  <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                      <Button variant="outline" size="sm" className="gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                        {hasActiveFilters && (
                          <span className="ml-1 text-xs bg-foreground text-background rounded-full px-1.5">
                            +
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-75 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 space-y-8">
                        {/* Mobile Search */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search products..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                          />
                          {isSearching ? (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                          ) : searchInput ? (
                            <button
                              onClick={() => setSearchInput("")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          ) : null}
                        </div>

                        {/* Mobile Categories */}
                        <div>
                          <h3 className="font-semibold mb-4">Categories</h3>
                          <ul className="space-y-2">
                            {categories.map((category) => (
                              <li key={category}>
                                <button
                                  onClick={() => setSelectedCategory(category)}
                                  className={`text-sm transition-colors ${
                                    selectedCategory === category
                                      ? "font-medium text-foreground"
                                      : "text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {category}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Mobile Price Range */}
                        <div>
                          <h3 className="font-semibold mb-4">Price Range</h3>
                          <Slider
                            value={priceRange}
                            onValueChange={(value) =>
                              setPriceRange(value as [number, number])
                            }
                            max={500}
                            step={10}
                            className="mb-2"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                          </div>
                        </div>

                        {/* Mobile Colors */}
                        <div>
                          <h3 className="font-semibold mb-4">Colors</h3>
                          <div className="flex flex-wrap gap-2">
                            {allColors.map((color) => (
                              <button
                                key={color}
                                onClick={() => toggleColor(color)}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${
                                  selectedColors.includes(color)
                                    ? "border-foreground scale-110"
                                    : "border-border"
                                }`}
                                style={{
                                  backgroundColor:
                                    color === "Black"
                                      ? "#000"
                                      : color === "White"
                                        ? "#fff"
                                        : color === "Navy"
                                          ? "#1a365d"
                                          : color === "Gray"
                                            ? "#6b7280"
                                            : color === "Beige"
                                              ? "#d4c5b9"
                                              : color === "Olive"
                                                ? "#556b2f"
                                                : color === "Blue"
                                                  ? "#3b82f6"
                                                  : color === "Red"
                                                    ? "#dc2626"
                                                    : color === "Khaki"
                                                      ? "#c3b091"
                                                      : color === "Light Blue"
                                                        ? "#93c5fd"
                                                        : color === "Charcoal"
                                                          ? "#374151"
                                                          : "#ccc",
                                }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Mobile Tags */}
                        <div>
                          <h3 className="font-semibold mb-4">Tags</h3>
                          <Button
                            variant={showNewOnly ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowNewOnly(!showNewOnly)}
                          >
                            New
                          </Button>
                        </div>

                        {hasActiveFilters && (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={clearFilters}
                          >
                            Clear All Filters
                          </Button>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Sort Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        Sort
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSortBy("default")}>
                        Default
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("price-asc")}>
                        Price: Low to High
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("price-desc")}>
                        Price: High to Low
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("name")}>
                        Name: A-Z
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("newest")}>
                        Newest First
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("rating")}>
                        Highest Rated
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {searchInput && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-1"
                      onClick={() => setSearchInput("")}
                    >
                      Search: "{searchInput}"
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  {selectedCategory !== "All" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-1"
                      onClick={() => setSelectedCategory("All")}
                    >
                      {selectedCategory}
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  {showNewOnly && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-1"
                      onClick={() => setShowNewOnly(false)}
                    >
                      New Only
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  {selectedColors.map((color) => (
                    <Button
                      key={color}
                      variant="secondary"
                      size="sm"
                      className="gap-1"
                      onClick={() => toggleColor(color)}
                    >
                      {color}
                      <X className="h-3 w-3" />
                    </Button>
                  ))}
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                </div>
              )}

              {/* Products Grid */}
              {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-secondary rounded-lg h-64 mb-4"></div>
                      <div className="bg-secondary rounded h-4 mb-2"></div>
                      <div className="bg-secondary rounded h-4 w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <div className="text-center py-16">
                  <p className="text-red-500 mb-4">
                    Error loading products. Please try again.
                  </p>
                  <Button onClick={() => window.location.reload()}>
                    Reload Page
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isFavorite={favorites.includes(product.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-16">
                      <p className="text-muted-foreground">
                        No products found matching your filters.
                      </p>
                      <Button variant="link" onClick={clearFilters}>
                        Clear filters
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
