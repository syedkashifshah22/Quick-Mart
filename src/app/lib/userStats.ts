import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { db } from "./firebase";

export async function getTotalUsers() {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);
  return snapshot.size;
}

export async function getDailyUsers() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const timestamp = Timestamp.fromDate(today);

  const q = query(collection(db, "users"), where("createdAt", ">=", timestamp));
  const snapshot = await getDocs(q);
  return snapshot.size;
}
export async function getUsersForChart() {
  const snapshot = await getDocs(collection(db, "users"));
  const users = snapshot.docs.map((doc) => doc.data());

  const dateCounts: { [date: string]: number } = {};

  users.forEach((user) => {
    if (user.createdAt?.toDate) {
      const dateStr = user.createdAt.toDate().toISOString().split("T")[0];
      dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
    }
  });

  return Object.entries(dateCounts).map(([date, count]) => ({ date, count }));
}
