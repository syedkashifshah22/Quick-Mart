"use client";

import { useEffect, useState } from "react";
import {
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "@/app/lib/products";
import AddProductForm from "./components/add-product";
import Image from "next/image";
import { FiImage } from "react-icons/fi";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageURL: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    await deleteProduct(id);
    fetchProducts();
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;

    const { id, title, description, price } = editingProduct;

    await updateProduct(id, {
      title,
      description,
      price,
      imageFile: imageFile ?? undefined,
    });

    setEditingProduct(null);
    setImageFile(null);
    fetchProducts();
  };

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Products</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingProduct(null);
          }}
          className="px-6 py-2 font-semibold rounded-xl shadow-md bg-gray-200 hover:bg-gray-300"
        >
          {showForm ? "Hide Form" : "Add Product"}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && !editingProduct && (
        <AddProductForm
          onProductAdded={() => {
            fetchProducts();
            setShowForm(false);
          }}
        />
      )}

      {/* ================= EDIT MODAL ================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

            {/* Title */}
            <div className="mb-3">
              <label className="block text-sm mb-1">Product Title</label>
              <input
                className="border px-3 py-2 w-full rounded"
                value={editingProduct.title}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    title: e.target.value,
                  })
                }
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="block text-sm mb-1">Description</label>
              <textarea
                className="border px-3 py-2 w-full rounded"
                rows={3}
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    description: e.target.value,
                  })
                }
              />
            </div>

            {/* Price */}
            <div className="mb-3">
              <label className="block text-sm mb-1">Price</label>
              <input
                type="number"
                className="border px-3 py-2 w-full rounded"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: Number(e.target.value),
                  })
                }
              />
            </div>

            {/* Image */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Update Image</label>

              <label className="flex items-center gap-2 cursor-pointer border rounded px-4 py-2 hover:bg-gray-100">
                <FiImage className="text-gray-600 text-lg" />

                <span className="text-sm text-gray-600">Choose image</span>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setImageFile(null);
                }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded bg-black text-white font-semibold hover:bg-gray-800 cursor-pointer"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= END MODAL ================= */}

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded shadow-xl p-4 transition-transform hover:scale-105 cursor-pointer"
          >
            <Image
              src={product.imageURL}
              alt={product.title}
              width={500}
              height={350}
              className="w-full h-[350px] object-cover rounded"
            />

            <h2 className="text-xl font-semibold mt-2">{product.title}</h2>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="font-bold text-lg mt-1">${product.price}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setEditingProduct(product)}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded font-semibold cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded font-semibold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
