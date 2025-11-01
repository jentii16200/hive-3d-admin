"use client";

import useGetOrders from "@/hooks/useGetOrders";
import { useState } from "react";

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const limit = 10; // items per page

  const { data, pagination, isLoading } = useGetOrders(page, limit);

  if (isLoading) return <p className="text-center mt-10">Loading orders...</p>;

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
            {Array.isArray(data) && data.length > 0 ? (
              data.map((order, i) => (
                <tr key={i} className="border-b hover:bg-yellow-50 transition">
                  <td className="p-3">{order._id}</td>
                  <td className="p-3">{order?.userId?.fullName ?? ""}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        order.status.toLowerCase() === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status === "completed" ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td className="p-3">{order.totalAmount}</td>
                  <td className="p-3 text-center space-x-2">
                    <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                      View
                    </button>
                    <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {pagination && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-4 py-2 rounded ${
              page === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
          >
            Previous
          </button>

          <p className="text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </p>

          <button
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-4 py-2 rounded ${
              page === pagination.totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
