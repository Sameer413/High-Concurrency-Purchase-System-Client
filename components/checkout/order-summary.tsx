export default function OrderSummary({
  cart,
  cartTotal,
  shipping,
  total,
}: any) {
  return (
    <div className="bg-secondary p-6 rounded-xl sticky top-24">
      <h2 className="font-semibold mb-4">Order Summary</h2>

      {cart.map((item: any) => (
        <div key={item.productId} className="flex justify-between mb-2">
          <span>
            {item.product.name} x {item.quantity}
          </span>

          <span>${item.product.price * item.quantity}</span>
        </div>
      ))}

      <hr className="my-4" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${cartTotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping}</span>
        </div>

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>
    </div>
  );
}
