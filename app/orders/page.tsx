"use client";

export default function OrdersPage() {
  const orders = [
    { id: "#1001", customer: "Maria Clara", status: "Pending", total: "₱1,200" },
    { id: "#1002", customer: "Jose Rizal", status: "Completed", total: "₱2,500" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-yellow-600 mb-6">Orders</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-yellow-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-yellow-100 text-yellow-800">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Total</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr
                key={i}
                className="border-b hover:bg-yellow-50 transition"
              >
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3">{order.total}</td>
                <td className="p-3 text-center space-x-2">
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    View
                  </button>
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
