"use client";

import { useEffect, useState } from "react";
import { getTotalUsers, getDailyUsers } from "@/app/lib/userStats";

export default function UserStats() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [dailyUsers, setDailyUsers] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const total = await getTotalUsers();
      const daily = await getDailyUsers();
      setTotalUsers(total);
      setDailyUsers(daily);
    }

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">📊 User Statistics</h2>
      <p className="text-lg">
        👥 Total Users: <strong>{totalUsers ?? "Loading..."}</strong>
      </p>
      <p className="text-lg">
        🆕 New Users Today: <strong>{dailyUsers ?? "Loading..."}</strong>
      </p>
    </div>
  );
}
