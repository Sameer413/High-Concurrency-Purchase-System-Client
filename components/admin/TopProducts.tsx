'use client';

const products = [
  { id: 1, name: 'Classic T-Shirt', sales: 234, revenue: '$4,680' },
  { id: 2, name: 'Denim Jeans', sales: 189, revenue: '$7,560' },
  { id: 3, name: 'Leather Jacket', sales: 156, revenue: '$15,600' },
  { id: 4, name: 'Sneakers', sales: 145, revenue: '$8,700' },
  { id: 5, name: 'Hoodie', sales: 123, revenue: '$4,920' },
];

export function TopProducts() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
              <div>
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">{product.sales} sales</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-900">{product.revenue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
