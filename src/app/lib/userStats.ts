import { collection, getDocs, query, orderBy, limit, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

// ✅ Strongly typed User
export type User = {
  id: string;
  fullName: string;
  email: string;
  photoURL?: string;        // optional avatar URL
  imageURL?: string; 
  createdAt?: Timestamp | Date; // Firebase Timestamp or Date
};

// ✅ Total users
export async function getTotalUsers(): Promise<number> {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);
  return snapshot.size;
}

// ✅ New users today
export async function getDailyUsers(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const snapshot = await getDocs(collection(db, "users"));
  let count = 0;

  snapshot.docs.forEach((doc) => {
    const data = doc.data() as Omit<User, "id">;

    const createdAtDate: Date =
      data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt || new Date(0);

    // ✅ Check only today's users
    if (createdAtDate.toDateString() === new Date().toDateString()) {
      count++;
    }
  });

  return count;
}

// ✅ Latest N users (default 5)
export async function getLatestUsers(limitCount = 5): Promise<User[]> {
  const usersRef = collection(db, "users");

  // Firestore query: order by createdAt descending + limit
  const q = query(usersRef, orderBy("createdAt", "desc"), limit(limitCount));
  const snapshot = await getDocs(q);

  const users: User[] = snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<User, "id">;

    const createdAtDate: Date =
      data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt || new Date(0);

    return {
      id: doc.id,
      fullName: data.fullName || "No Name",
      email: data.email || "No Email",
      photoURL: data.photoURL || data.imageURL || "/assets/userIcon.jpg",
      createdAt: createdAtDate,
    };
  });

  return users;
}
