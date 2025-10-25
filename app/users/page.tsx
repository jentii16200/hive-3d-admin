"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../lib/state/store";
import { User, setUser, removeUser } from "../../lib/state/slices/userAction";

export default function UsersPage() {
  const users = useSelector((state: RootState) => state.user.value);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data: User[] = await response.json();
        if (data.length > 0) {
          dispatch(setUser(data));
        }
      } catch (err) {
        console.error("❌ Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, [dispatch]);

  return (
    <div className=" mx-auto p-6">
      <h1 className="text-2xl font-bold text-yellow-600 mb-6">Users</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-yellow-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-yellow-100 text-yellow-800">
              <th className="p-3">Avatar</th>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Created At</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-yellow-50 transition"
              >
                <td className="p-5">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-12 h-12 rounded-full border border-gray-200 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      ?
                    </div>
                  )}
                </td>
                <td className="p-3 text-xs text-gray-500">{user.id}</td>
                <td className="p-3 font-semibold">{user.fullName}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      user.role === "user"
                        ? "bg-yellow-200 text-yellow-900 font-semibold"
                        : "bg-green-200 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-3 text-sm text-gray-600">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </td>
                <td className="p-3 text-center space-x-2">
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => dispatch(removeUser(user.id))}
                  >
                    Delete
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
