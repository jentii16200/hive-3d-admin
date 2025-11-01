"use client";

import useGetOrders from "@/hooks/useGetOrders";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const limit = 10;
  const router = useRouter();

  const { data, pagination, isLoading } = useGetOrders(
    page,
    limit,
    refreshKey,
    search
  );

  const refreshOrders = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    const refreshFlag = sessionStorage.getItem("refreshOrders");
    if (refreshFlag === "true") {
      sessionStorage.removeItem("refreshOrders");
      refreshOrders();
    }
  }, []);

  const handleSearch = () => {
    setPage(1); // ✅ Reset to first page when searching
    refreshOrders();
  };

  const handleCancel = async (orderId: string) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/cancel`
      );
      if (res.status === 200) {
        toast.success("Order cancelled successfully!");
        refreshOrders();
      }
    } catch (err: any) {
      console.error("Cancel failed:", err);
      toast.error("Failed to cancel order.");
    }
  };

  const getStatusDisplay = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      to_ship: { label: "To Ship", color: "bg-yellow-100 text-yellow-700" },
      to_received: { label: "To Receive", color: "bg-blue-100 text-blue-700" },
      completed: { label: "Completed", color: "bg-green-100 text-green-700" },
      cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
      pending: { label: "Pending", color: "bg-gray-100 text-gray-700" },
    };

    const found = map[status] || map["pending"];
    return (
      <span className={`px-2 py-1 text-xs rounded ${found.color}`}>
        {found.label}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-yellow-600 mb-6">Orders</h1>

      {/* 🔍 Search Bar */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by Order ID or Customer Name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border border-yellow-300 rounded-lg px-4 py-2 w-full max-w-md focus:ring-2 focus:ring-yellow-500 outline-none"
        />
        <button
          onClick={handleSearch}
          className="ml-3 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          Search
        </button>
      </div>

      {isLoading ? (
        <p className="text-center mt-10 text-gray-600">Loading orders...</p>
      ) : (
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
                  <tr
                    key={i}
                    className="border-b hover:bg-yellow-50 transition"
                  >
                    <td className="p-3">{order._id}</td>
                    <td className="p-3">{order?.userId?.fullName ?? ""}</td>
                    <td className="p-3">{getStatusDisplay(order.status)}</td>
                    <td className="p-3">
                      ₱{order.totalAmount?.toLocaleString?.() ?? "0"}
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => router.push(`/orders/${order._id}`)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                      >
                        View
                      </button>
                      {order.status !== "completed" &&
                        order.status !== "cancelled" && (
                          <button
                            onClick={() => handleCancel(order._id)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                          >
                            Cancel
                          </button>
                        )}
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
      )}

      {/* Pagination */}
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
      <Toaster />
    </div>
  );
}
