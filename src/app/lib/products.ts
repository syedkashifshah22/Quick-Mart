import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export async function uploadImageToStorage(file: File): Promise<string> {
  const storage = getStorage();
  const fileRef = ref(storage, `product-images/${Date.now()}-${file.name}`);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return url;
}

export async function addProduct(data: {
  title: string;
  description: string;
  price: number;
  imageFile: File;
}) {
  const imageURL = await uploadImageToStorage(data.imageFile);

  await addDoc(collection(db, "products"), {
    title: data.title,
    description: data.description,
    price: data.price,
    imageURL,
    createdAt: Timestamp.now(),
  });
}

export async function getAllProducts() {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      price: data.price,
      imageURL: data.imageURL || data.imageUrl || "",
      ratings: data.ratings || [],
      category: data.category || "",
      subcategory: data.subcategory || "",
    };
  });
}

export async function updateProduct(
  id: string,
  data: {
    title: string;
    description: string;
    price: number;
    imageFile?: File;
  }
) {
  const productRef = doc(db, "products", id);

  const updateData: {
    title: string;
    description: string;
    price: number;
    imageURL?: string;
  } = {
    title: data.title,
    description: data.description,
    price: data.price,
  };

  if (data.imageFile) {
    const imageURL = await uploadImageToStorage(data.imageFile);
    updateData.imageURL = imageURL;
  }

  await updateDoc(productRef, updateData);
}


export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, "products", id));
}
