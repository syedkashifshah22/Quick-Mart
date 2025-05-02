"use client";
import React, { useState } from "react";
import productData from "@/utils/productItems.json";
import Image from "next/image";

interface ProductDetail {
  heading: string;
  description: string;
  imageUrl: string;
}

interface ProductItem {
  subtitle: string;
  subTitles: ProductDetail[];
}

interface CategoryData {
  title: string;
  data: ProductItem[];
}

type ProductCategory = keyof typeof productData;

export default function Cards() {
  const categories = Object.keys(productData);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(
    null
  );

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setActiveSubCategory(null);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-center flex-wrap gap-6 mb-6">
        <button
          onClick={() => handleCategoryClick("All")}
          className={`px-4 py-2 rounded ${
            activeCategory === "All"
              ? "bg-gray-900 text-white"
              : "bg-gray-900 text-white"
          } cursor-pointer`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 rounded ${
              activeCategory === category
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-700"
            } cursor-pointer`}
          >
            {category}
          </button>
        ))}
      </div>

      {activeCategory !== "All" && (
        <div className="flex justify-center flex-wrap gap-6 mb-6">
          {(
            productData[activeCategory as ProductCategory] as CategoryData
          ).data.map((item) => (
            <button
              key={item.subtitle}
              onClick={() => setActiveSubCategory(item.subtitle)}
              className={`px-4 py-2 rounded ${
                activeSubCategory === item.subtitle
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-700"
              } cursor-pointer`}
            >
              {item.subtitle}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pt-22">
        {(activeCategory === "All"
          ? Object.keys(productData)
          : [activeCategory]
        ).flatMap((category) => {
          const categoryData = productData[
            category as ProductCategory
          ] as CategoryData;

          return categoryData.data.flatMap((item) => {
            if (activeSubCategory && item.subtitle !== activeSubCategory) {
              return [];
            }

            return item.subTitles.map((product, idx) => (
              <div
                key={`${category}-${item.subtitle}-${idx}`}
                className="rounded-lg overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.heading}
                    width={500}
                    height={200}
                    className="w-full h-[350px] transition-transform duration-300 ease-in-out hover:scale-120"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{product.heading}</h2>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              </div>
            ));
          });
        })}
      </div>
    </div>
  );
}
