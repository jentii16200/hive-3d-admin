// app/edit-order/page.jsx (or wherever your page is)

'use client'; // Required for interactivity (dropdown toggle)

import React, { useState } from 'react';

const Page = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('To Ship');

  const statuses = ['Peding', 'To Ship', 'To Receive', 'Completed', 'Cancelled'];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Back Button */}
        <button className="mb-6 p-2 bg-gray-200 rounded-full hover:bg-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Order Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Order ID */}
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="font-semibold text-lg">Order ID</h3>
            <span className="text-gray-600">e5dc5fb52bc958</span>
          </div>

          {/* Products */}
          <div className="flex gap-4 mb-6">
            {/* Product 1 */}
            <div className="flex items-start gap-3">
              <div className="w-20 h-20 bg-gray-400 rounded flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-4-4m-4 4l4-4m4 4l4-4" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Busy Bees</h4>
                <p className="text-sm text-gray-500">Cream | XL</p>
                <p className="text-sm text-gray-500">x1</p>
                <p className="font-bold">₱600</p>
              </div>
            </div>

            {/* Product 2 */}
            <div className="flex items-start gap-3">
              <div className="w-20 h-20 bg-gray-400 rounded flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-4-4m-4 4l4-4m4 4l4-4" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Fly</h4>
                <p className="text-sm text-gray-500">Black | XL</p>
                <p className="text-sm text-gray-500">x1</p>
                <p className="font-bold">₱700</p>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="border-t pt-4 mb-6">
            <h3 className="font-semibold mb-2">Delivery Information</h3>
            <p className="text-gray-800">Jhann Christ J. Joaquin | 09458526271</p>
            <p className="text-gray-800">211 Flamengco Street Panghulo, Obando, Bulacan 3021</p>
          </div>

          {/* Status Dropdown */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Status</h3>
            <div className="relative inline-block w-full max-w-xs">
              <button
                onClick={toggleDropdown}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span>{selectedStatus}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {statuses.map((status) => (
                    <li
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {status}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-md transition-colors">
          Save
        </button>
      </div>
    </div>
  );
};

export default Page;