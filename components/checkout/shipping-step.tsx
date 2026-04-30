export default function ShippingStep() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Shipping Method</h2>

      <label className="flex justify-between border p-4 rounded-lg">
        <span>Standard</span>
        <span>$10</span>
      </label>

      <label className="flex justify-between border p-4 rounded-lg">
        <span>Express</span>
        <span>$25</span>
      </label>
    </div>
  );
}
