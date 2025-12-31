"use client";

import { useEffect, useState } from "react";
import { getAllProducts } from "@/app/lib/products";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { FaStar } from "react-icons/fa";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageURL: string;
  category?: string;
  subcategory?: string;
  ratings?: number[];
}

// ✅ ADD THIS: Category display mapping
const categoryDisplayMap: Record<string, string> = {
  Electronics: "Electronics",
  Dress: "Dress",
  Watch: "Watch",
  Shoes: "Shoes",
  Bags: "Bags",
  Jewellery: "Jewellery",
  Ice_Cream: "Ice Cream", // This will show as "Ice Cream"
  Food: "Food",
};

// Helper function to get display name
const getCategoryDisplayName = (category: string): string => {
  return categoryDisplayMap[category] || category;
};

function StarRating({
  ratings = [],
  productId,
}: {
  ratings?: number[];
  productId: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [showPercent, setShowPercent] = useState(false);

  const average =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

  const finalValue = selected ?? average;
  const percentage = Math.round((finalValue / 5) * 100);

  const handleClick = async (rating: number) => {
    setSelected(rating);
    setShowPercent(true);
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, {
        ratings: arrayUnion(rating),
      });
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar
          key={i}
          onClick={() => handleClick(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          className={`cursor-pointer transition ${
            (hovered ?? selected ?? average) >= i
              ? "text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      {showPercent && (
        <span className="text-sm text-gray-600 ml-1">({percentage}%)</span>
      )}
    </div>
  );
}

export default function ProductsHome() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubcategory, setActiveSubcategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      const products = await getAllProducts();
      setAllProducts(products);
      setFiltered(products);
    };
    fetchData();
  }, []);

  const uniqueCategories = Array.from(
    new Set(
      allProducts
        .map((p) => p.category)
        .filter((cat): cat is string => typeof cat === "string")
    )
  );

  const subcategories =
    activeCategory !== "All"
      ? Array.from(
          new Set(
            allProducts
              .filter((p) => p.category === activeCategory)
              .map((p) => p.subcategory)
              .filter((sub): sub is string => typeof sub === "string")
          )
        )
      : [];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setActiveSubcategory("All");
    setCurrentPage(1);
    filterProducts(category, "All");
  };

  const handleSubcategoryClick = (subcategory: string) => {
    setActiveSubcategory(subcategory);
    setCurrentPage(1);
    filterProducts(activeCategory, subcategory);
  };

  const filterProducts = (category: string, subcategory: string) => {
    let products = allProducts;
    if (category !== "All") {
      products = products.filter((p) => p.category === category);
    }
    if (subcategory !== "All") {
      products = products.filter((p) => p.subcategory === subcategory);
    }
    setFiltered(products);
  };

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="py-8">
      <h1 className="text-5xl md:text-7xl text-center py-14">Our Products</h1>

      {/* ✅ FIXED: Category buttons with display names */}
      <div className="flex justify-center flex-wrap gap-4 mb-4">
        {["All", ...uniqueCategories].map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 rounded font-semibold cursor-pointer ${
              activeCategory === category
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {category === "All" ? "All" : getCategoryDisplayName(category)}
          </button>
        ))}
      </div>

      {activeCategory !== "All" && subcategories.length > 0 && (
        <div className="flex justify-center flex-wrap gap-4 mb-6">
          {subcategories.map((subcategory) => (
            <button
              key={subcategory}
              onClick={() => handleSubcategoryClick(subcategory)}
              className={`px-4 py-2 rounded font-semibold cursor-pointer ${
                activeSubcategory === subcategory
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-80"
              }`}
            >
              {subcategory}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-4">
        {currentItems.map((product) => (
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
            <p className="text-gray-600">{product.description}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-lg font-bold">Rs. {product.price}</p>
              <StarRating ratings={product.ratings} productId={product.id} />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}