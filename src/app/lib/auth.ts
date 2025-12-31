import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  type User,
} from "firebase/auth";

import { auth, db } from "./firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

/* ===============================
   IMAGE UPLOAD (ImgBB)
================================ */
export async function uploadImageToImgBB(
  imageFile: File
): Promise<string | null> {
  const apiKey = "5ab70665048c0a56fbbe38521e3e4b5a";

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data?.data?.url || null;
  } catch (error) {
    console.error("ImgBB Upload Error:", error);
    return null;
  }
}

/* ===============================
   REGISTER USER
================================ */
export async function registerUser(
  fullName: string,
  email: string,
  password: string,
  image: File
): Promise<string> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    const imageURL = await uploadImageToImgBB(image);
    if (!imageURL) throw new Error("Image upload failed");

    await updateProfile(user, {
      displayName: fullName,
      photoURL: imageURL,
    });

    // ✅ Default role is always "user", admin role should be manually set in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName,
      email,
      role: "user",
      imageURL,
      createdAt: serverTimestamp(),
    });

    return "Account created successfully";
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return error.message;
    }
    return "Signup failed";
  }
}

/* ===============================
   LOGIN USER
================================ */
export async function loginUser(
  email: string,
  password: string
): Promise<string> {
  try {
    await signOut(auth); // force logout

    await signInWithEmailAndPassword(auth, email, password);

    return "Login successful";
  } catch (error: unknown) {
    if (error instanceof Error) return error.message;
    return "Login failed";
  }
}

/* ===============================
   LOGOUT USER
================================ */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
    console.log("✅ Logged out successfully");
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

/* ===============================
   CURRENT USER
================================ */
export function getCurrentUser() {
  return auth.currentUser;
}

/* ===============================
   GET AUTH USER WITH ROLE (Firestore)
================================ */
export async function getAuthUser(user: User): Promise<null | {
  email: string;
  fullName: string;
  uid: string;
  role: "admin" | "user";
  imageURL?: string;
}> {
  if (!user) return null;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  const role: "admin" | "user" =
    snap.exists() && snap.data().role === "admin" ? "admin" : "user";

  return {
    uid: user.uid,
    role,
    email: user.email || "",
    fullName: user.displayName || "",
    imageURL: user.photoURL || "",
  };
}
