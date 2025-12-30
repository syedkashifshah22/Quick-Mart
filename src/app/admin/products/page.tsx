"use client";

import { useEffect, useState } from "react";
import {
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "@/app/lib/products";
import AddProductForm from "./components/add-product";
import Image from "next/image";

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Products</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingProduct(null);
          }}
          className="inline-flex items-center justify-center px-6 py-2 overflow-hidden font-semibold text-black transition duration-300 ease-out rounded-xl shadow-md  bg-gray-200 hover:bg-gray-300 cursor-pointer"
        >
          {showForm ? "Hide Form" : " Add Product"}
        </button>
      </div>

      {/* Show Add Form */}
      {showForm && !editingProduct && (
        <AddProductForm
          onProductAdded={() => {
            fetchProducts();
            setShowForm(false);
          }}
        />
      )}

      {/* Show Edit Form */}
      {editingProduct && (
        <div className="border p-4 mb-6 rounded bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">Edit Product</h2>
          <input
            className="border px-2 py-1 w-full mb-2"
            value={editingProduct.title}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, title: e.target.value })
            }
            placeholder="Title"
          />
          <input
            className="border px-2 py-1 w-full mb-2"
            value={editingProduct.description}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                description: e.target.value,
              })
            }
            placeholder="Description"
          />
          <input
            type="number"
            className="border px-2 py-1 w-full mb-2"
            value={editingProduct.price}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                price: Number(e.target.value),
              })
            }
            placeholder="Price"
          />
          <input
            type="file"
            accept="image/*"
            className="w-full mb-2"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-gray-200 hover:bg-gray-300 font-semibold text-gray-800 cursor-pointer px-4 py-2 rounded"
            >
              Update
            </button>
            <button
              onClick={() => {
                setEditingProduct(null);
                setImageFile(null);
              }}
              className="bg-gray-200 hover:bg-gray-300 font-semibold text-gray-800 cursor-pointer px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded shadow-xl p-4 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
          >
            <Image
              src={product.imageURL}
              alt={product.title}
              width={500}
              height={200}
              className="w-full h-[350px]"
              priority
            />
            <h2 className="text-xl font-semibold mt-2">{product.title}</h2>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="font-bold text-lg mt-1">${product.price}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setEditingProduct(product)}
                className="bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 font-semibold px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 font-semibold px-3 py-1 rounded"
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
