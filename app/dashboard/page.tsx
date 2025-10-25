// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
// import fetchUtil from "../lib/fetch.util";

export default function DashboardPage() {
  const [users, setUsers] = useState<any[]>([]);

  // useEffect(() => {
  //   async function loadUsers() {
  //     const data = await fetchUtil("/api/users");
  //     setUsers(data);
  //   }
  //   loadUsers();
  // }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-yellow-600 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow p-6">
          <h2 className="text-sm font-semibold text-yellow-700">Total Users</h2>
          <p className="text-3xl font-bold text-yellow-900 mt-2">
            {users.length}
          </p>
          <span className="text-xs text-yellow-600">Active this month</span>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow p-6">
          <h2 className="text-sm font-semibold text-yellow-700">
            Total Products
          </h2>
          <p className="text-3xl font-bold text-yellow-900 mt-2">123</p>
          <span className="text-xs text-yellow-600">Updated recently</span>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow p-6">
          <h2 className="text-sm font-semibold text-yellow-700">
            Total Orders
          </h2>
          <p className="text-3xl font-bold text-yellow-900 mt-2">456</p>
          <span className="text-xs text-yellow-600">Tracked automatically</span>
        </div>
      </div>

      {/* Users List Section */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-yellow-700 mb-4">
          Recent Activity
        </h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow p-5">
          {/* <ul className="divide-y divide-yellow-200">
            {users.map((user) => (
              <li
                key={user._id}
                className="p-4 hover:bg-yellow-100 transition-colors"
              >
                <span className="font-medium text-yellow-900">{user.fullName}</span>
              </li>
            ))}
          </ul> */}
          <p className="text-2xl">Under development...</p>
        </div>
      </div>
    </div>
  );
}
