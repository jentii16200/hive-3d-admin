"use client";

import useGetSpecificOrders from "@/hooks/useGetSpecificOrder";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] ?? "" : params?.id ?? "";
  const { data, isLoading, updateStatus } = useGetSpecificOrders(id);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading order...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Order not found.
      </div>
    );
  }

  const handleGoBack = () => router.push("/orders");

  const statuses = [
    { label: "To Ship", value: "to_ship" },
    { label: "To Received", value: "to_received" },
    { label: "Completed", value: "completed" },
  ];

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleStatusChange = (statusValue: string) => {
    setSelectedStatus(statusValue);
    setIsDropdownOpen(false);
  };

  // ✅ Handle null or undefined safely
  const currentStatus = data?.status ?? "";
  const selectedLabel =
    statuses.find((s) => s.value === selectedStatus)?.label ||
    statuses.find((s) => s.value === currentStatus)?.label ||
    "";

  const handleSave = async () => {
    const statusToUpdate = selectedStatus || currentStatus;
    const success = await updateStatus(statusToUpdate ?? "");
    if (success) {
      toast.success("Order status updated!");
      sessionStorage.setItem("refreshOrders", "true"); // 👈
      handleGoBack();
    } else {
      toast.error("Failed to update status.");
    }
  };

  const items = data?.items ?? [];
  const shipping = data?.shippingAddress ?? {};
  const totalAmount = data?.totalAmount ?? 0;

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="mb-6 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
        >
          ←
        </button>

        {/* Order Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="font-semibold text-lg">Order ID</h3>
            <span className="text-gray-600">{id || "N/A"}</span>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {items.map((item: any, index: number) => (
              <div
                key={item?._id || index}
                className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    🛍️
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {item?.productId?.designName || "Unnamed Product"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {item?.color ?? ""} {item?.size ? `| ${item.size}` : ""}
                    </p>
                    <p className="text-sm text-gray-500">
                      x{item?.quantity ?? 0}
                    </p>
                    <p className="font-bold mt-1">
                      ₱{item?.price?.toLocaleString?.() ?? "0"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Info */}
          <div className="border-t pt-4 mb-6">
            <h3 className="font-semibold mb-2">Delivery Information</h3>
            <p className="text-gray-800">
              {shipping?.fullName ?? ""}{" "}
              {shipping?.phone ? `| ${shipping.phone}` : ""}
            </p>
            <p className="text-gray-800">
              {[
                shipping?.street,
                shipping?.city,
                shipping?.province,
                shipping?.region,
                shipping?.zip,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>

          {/* Status Dropdown */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Status</h3>
            <div className="relative inline-block w-full max-w-xs">
              <button
                onClick={toggleDropdown}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white flex justify-between items-center"
              >
                <span>{selectedLabel || "Select status"}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {statuses.map((status) => (
                    <li
                      key={status.value}
                      onClick={() => handleStatusChange(status.value)}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {status.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold">
            Total: ₱{totalAmount?.toLocaleString?.() ?? "0"}
          </div>
          <button
            onClick={handleSave}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-md transition-colors"
          >
            Save
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Page;
