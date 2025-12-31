"use client";

import { useEffect, useState } from "react";
import { getTotalUsers, getDailyUsers, getLatestUsers, type User } from "@/app/lib/userStats";
import Image from "next/image";

export default function UserStats() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [dailyUsers, setDailyUsers] = useState<number | null>(null);
  const [latestUsers, setLatestUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    async function fetchData() {
      try {
        const total = await getTotalUsers();
        const daily = await getDailyUsers();
        const latest = await getLatestUsers(5);

        setTotalUsers(total);
        setDailyUsers(daily);
        setLatestUsers(latest);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center h-48 w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📊 User Statistics</h2>

      {/* Total & Daily Users in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex justify-between items-center">
          <span className="text-gray-500">👥 Total Users</span>
          <span className="text-2xl font-semibold text-gray-800">{totalUsers ?? 0}</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex justify-between items-center">
          <span className="text-gray-500">🆕 New Users Today</span>
          <span className="text-2xl font-semibold text-gray-800">{dailyUsers ?? 0}</span>
        </div>
      </div>

      {/* Latest Users */}
      <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
        <p className="text-gray-500 mb-2 font-semibold">📝 Latest Users</p>
        {latestUsers.length === 0 ? (
          <p className="text-gray-400">No users found.</p>
        ) : (
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {latestUsers.map((user) => (
              <li key={user.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 transition">
                <Image
                  src={user.photoURL || "/assets/userIcon.jpg"}
                  alt={user.fullName}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{user.fullName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
