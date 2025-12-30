"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { toast } from "react-toastify";
import { uploadImageToImgBB } from "@/app/lib/auth";

// Backend-safe category keys
const subcategories = {
  Electronics: ["Computer", "Laptop"],
  Dress: ["Men", "Women", "Children"],
  Watch: ["Men", "Women", "Children"],
  Shoes: ["Men", "Women", "Children"],
  Bags: ["Men", "Women", "Children"],
  Jewellery: ["Men", "Women", "Children"],
  Ice_Cream: [
    "Flavors",
    "Cones",
    "Sundaes",
    "Cups",
    "Sticks",
    "Brick Pack",
    "Family Packs",
  ],
  Food: ["Fast Food", "Desi Food", "Chinese", "BBQ"],
};

const categoryDisplayMap: Record<keyof typeof subcategories, string> = {
  Electronics: "Electronics",
  Dress: "Dress",
  Watch: "Watch",
  Shoes: "Shoes",
  Bags: "Bags",
  Jewellery: "Jewellery",
  Ice_Cream: "Ice Cream",
  Food: "Food",
};

type Category = keyof typeof subcategories;

const categories: Category[] = Object.keys(subcategories) as Category[];

type Props = {
  onProductAdded: () => void;
};

export default function AddProductForm({ onProductAdded }: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "" as Category | "",
    subcategory: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "category") {
      setForm((prev) => ({
        ...prev,
        category: value as Category,
        subcategory: "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select an image file.");
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadImageToImgBB(imageFile);
      setUploading(false);

      if (!imageUrl) {
        toast.error("Image upload failed.");
        return;
      }

      await addDoc(collection(db, "products"), {
        title: form.title,
        description: form.description,
        price: parseInt(form.price.replace(/[^0-9]/g, "")),
        category: form.category,
        subcategory: form.subcategory,
        imageUrl,
        createdAt: serverTimestamp(),
        ratings: [],
      });

      toast.success("Product added successfully");

      setForm({
        title: "",
        description: "",
        price: "",
        category: "",
        subcategory: "",
      });
      setImageFile(null);
      onProductAdded();
    } catch (error: unknown) {
      setUploading(false);
      if (error instanceof Error) {
        console.error("Error saving product:", error);
        toast.error("Failed to add product: " + error.message);
      } else {
        console.error("Unknown error saving product:", error);
        toast.error("Failed to add product: Unknown error");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-xl mx-auto p-4 bg-white rounded shadow"
    >
      <h2 className="text-xl font-bold">Add New Product</h2>

      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Product Title"
        required
        className="w-full border p-2 rounded"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Product Description"
        required
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Price (e.g. 1500)"
        required
        className="w-full border p-2 rounded"
      />

      {/* Category Dropdown */}
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      >
        <option value="" disabled>
          Select Category
        </option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {categoryDisplayMap[cat]}
          </option>
        ))}
      </select>

      {/* Subcategory Dropdown */}
      {form.category && (
        <select
          name="subcategory"
          value={form.subcategory}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="" disabled>
            Select Subcategory
          </option>
          {subcategories[form.category].map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="w-full"
        required
      />

      <button
        type="submit"
        disabled={uploading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {uploading ? "Uploading..." : "Add Product"}
      </button>
    </form>
  );
}
