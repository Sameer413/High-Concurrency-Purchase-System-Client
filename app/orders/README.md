# Order Detail Page

## Overview
Comprehensive order detail page that displays complete order information including timeline, items, shipping details, and payment information.

## Route
`/orders/[id]` - Dynamic route for individual order details

## Features

### 1. Order Timeline
- Visual timeline showing order progress
- 5 stages: Order Placed → Processing → Shipped → Out for Delivery → Delivered
- Each stage shows:
  - Status name
  - Date and time
  - Description
  - Tracking number (for shipped status)
- Color-coded completion indicators (green for completed, gray for pending)

### 2. Order Items
- Product image
- Product name
- Variant details (color, size)
- Quantity
- Price per item

### 3. Order Summary
- Subtotal
- Shipping cost
- Tax
- Total amount

### 4. Shipping Address
- Full recipient details
- Complete address
- Phone number
- Icon-based visual design

### 5. Payment Information
- Payment method used
- Card details (last 4 digits)

### 6. Actions
- Download Invoice button
- Contact Support button
- Back to Orders navigation

## Status Badge Colors
- **Delivered**: Green
- **Shipped/Out for Delivery**: Blue
- **Processing**: Yellow
- **Cancelled**: Red
- **Default**: Gray

## Mock Data
Currently uses hardcoded mock data. Replace with real API calls:

```typescript
// TODO: Replace with actual API call
const { data: order } = useGetOrderByIdQuery(orderId);
```

## Navigation
- Clicking on an order card in the profile page navigates to `/orders/[id]`
- Back button returns to previous page

## Components Used
- Header & Footer (common layout)
- Card components for sections
- Badge for status display
- Button for actions
- Icons from lucide-react

## Future Enhancements
- [ ] Real API integration
- [ ] Download invoice functionality
- [ ] Track package button with carrier integration
- [ ] Order cancellation/return flow
- [ ] Print order details
- [ ] Share order status
- [ ] Estimated delivery date calculation
- [ ] Real-time tracking updates
