import { ReservationTimer } from "./reservation-timer";

import { memo } from "react";

function OrderSummary({
  cart,
  cartTotal,
  shipping,
  total,
  isBuyNow,
  timeRemaining,
  reservationExpired,
}: any) {
  return (
    <div className="space-y-4">
      {/* Reservation Timer */}
      {isBuyNow && timeRemaining !== null && (
        <ReservationTimer timeRemaining={timeRemaining} />
      )}

      {/* Order Summary */}
      <div className="bg-secondary p-6 rounded-xl sticky top-24">
        <h2 className="font-semibold mb-4">Order Summary</h2>

        {reservationExpired && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">
              Your reservation has expired. Please return to the product page
              and try again.
            </p>
          </div>
        )}

        {cart.map((item: any) => {
          // Handle both reservation format and cart format
          const productName = item.productName || item.product?.name || "Unknown Product";
          const unitPrice = item.unitPrice || item.product?.price || 0;
          const quantity = item.quantity || 1;
          const totalPrice = item.totalPrice || (unitPrice * quantity);

          return (
            <div key={item.productId} className="flex justify-between mb-2">
              <span>
                {productName} x {quantity}
              </span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          );
        })}

        <hr className="my-4" />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Memoize to prevent re-renders when only timeRemaining changes
export default memo(OrderSummary, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.cart === nextProps.cart &&
    prevProps.cartTotal === nextProps.cartTotal &&
    prevProps.shipping === nextProps.shipping &&
    prevProps.total === nextProps.total &&
    prevProps.reservationExpired === nextProps.reservationExpired &&
    // Allow timeRemaining to update without full re-render
    Math.floor((prevProps.timeRemaining || 0) / 1000) === Math.floor((nextProps.timeRemaining || 0) / 1000)
  );
});
