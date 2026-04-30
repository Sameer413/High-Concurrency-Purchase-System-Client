# Buy Now Feature - Direct Checkout

## Overview

The checkout page now supports two modes:
1. **Cart Checkout** - Traditional checkout from shopping cart
2. **Buy Now** - Direct checkout for a single product (skip cart)

## How It Works

### Buy Now Flow

1. User selects product, size, color, and quantity on product page
2. Clicks "Buy Now" button
3. Redirected directly to checkout with product data in URL
4. Completes checkout for that single product
5. Cart remains untouched

### Cart Checkout Flow

1. User adds products to cart
2. Goes to cart page
3. Clicks "Proceed to Checkout"
4. Completes checkout for all cart items
5. Cart is cleared after successful order

## Implementation Details

### 1. Checkout Page (`client/app/checkout/page.tsx`)

**URL Parameters:**
- `buyNow=true` - Indicates this is a direct buy
- `product=<encoded-json>` - Product data for direct buy

**Logic:**
```typescript
const isBuyNow = searchParams.get("buyNow") === "true";

if (isBuyNow) {
  // Load product from URL params
  const productData = searchParams.get("product");
  setCart([JSON.parse(decodeURIComponent(productData))]);
} else {
  // Load cart from localStorage
  const savedCart = localStorage.getItem("cart");
  setCart(JSON.parse(savedCart));
}
```

**Order Completion:**
- Buy Now: Cart is NOT cleared (only the direct buy item is processed)
- Cart Checkout: Cart IS cleared from localStorage

### 2. BuyNowButton Component (`client/components/BuyNowButton.tsx`)

Reusable button component that:
- Accepts product, size, color, quantity
- Encodes product data into URL
- Navigates to checkout with `buyNow=true`

**Props:**
```typescript
interface BuyNowButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  selectedSize: string;
  selectedColor: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
}
```

### 3. ProductActions Component (`client/components/product-actions.tsx`)

Updated to include:
- Add to Cart button
- Buy Now button (using BuyNowButton)
- Wishlist button
- Validation (requires size and color selection)

**Props:**
```typescript
interface ProductActionsProps {
  product: { id, name, price, image };
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}
```

### 4. Product Detail Page (`client/app/products/[id]/page.tsx`)

Added:
- `handleAddToCart()` - Adds product to cart in localStorage
- `handleToggleFavorite()` - Toggles favorite status
- Passes all required props to ProductActions

## Usage Examples

### Example 1: Buy Now URL

```
/checkout?buyNow=true&product=%7B%22productId%22%3A%221%22%2C%22product%22%3A%7B%22id%22%3A%221%22%2C%22name%22%3A%22T-Shirt%22%2C%22price%22%3A99%2C%22image%22%3A%22%2Fproducts%2Ftshirt.jpg%22%7D%2C%22quantity%22%3A2%2C%22selectedSize%22%3A%22M%22%2C%22selectedColor%22%3A%22Black%22%7D
```

Decoded product data:
```json
{
  "productId": "1",
  "product": {
    "id": "1",
    "name": "T-Shirt",
    "price": 99,
    "image": "/products/tshirt.jpg"
  },
  "quantity": 2,
  "selectedSize": "M",
  "selectedColor": "Black"
}
```

### Example 2: Using BuyNowButton

```tsx
<BuyNowButton
  product={{
    id: "123",
    name: "Cool T-Shirt",
    price: 29.99,
    image: "/products/tshirt.jpg"
  }}
  selectedSize="L"
  selectedColor="Blue"
  quantity={1}
  disabled={false}
/>
```

## Benefits

✅ **Faster Checkout** - Skip cart for impulse purchases
✅ **Better UX** - One-click buying experience
✅ **Cart Preservation** - Cart items remain when using Buy Now
✅ **Flexible** - Supports both cart and direct checkout
✅ **Validation** - Requires size/color selection before checkout

## User Experience

### Buy Now Button States

1. **Disabled** - When size or color not selected
   - Button is grayed out
   - Shows error message: "Please select size and color"

2. **Enabled** - When size and color selected
   - Button is clickable
   - Navigates to checkout on click

### Checkout Page Behavior

1. **Buy Now Mode**
   - Shows single product in order summary
   - "Change" link goes back to product page
   - Cart is not affected after order

2. **Cart Mode**
   - Shows all cart items in order summary
   - "Change" link goes to product page
   - Cart is cleared after order

## Testing

To test Buy Now feature:

1. Go to any product page
2. Select size and color
3. Click "Buy Now" button
4. Verify you're on checkout page with correct product
5. Complete checkout
6. Verify cart is still intact (if you had items)

To test Cart Checkout:

1. Add multiple products to cart
2. Go to cart page
3. Click "Proceed to Checkout"
4. Complete checkout
5. Verify cart is cleared after order
