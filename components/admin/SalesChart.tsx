'use client';

export function SalesChart() {
  const data = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
    { month: 'Jun', sales: 5500 },
  ];

  const maxSales = Math.max(...data.map(d => d.sales));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.month} className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600 w-12">{item.month}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
              <div
                className="bg-blue-600 h-8 rounded-full flex items-center justify-end pr-3"
                style={{ width: `${(item.sales / maxSales) * 100}%` }}
              >
                <span className="text-xs font-medium text-white">${item.sales}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
