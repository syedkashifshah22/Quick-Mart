"use client";
import React, { useState } from "react";
import productData from "@/utils/productItems.json";
import Cards from "@/components/UI/cards";

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

export default function ProductsHome() {
  const categories = Object.keys(productData);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setActiveSubCategory(null);
    setCurrentPage(1);
  };

  let filteredProducts: CategoryData[] = [];

  if (activeCategory === "All") {
    filteredProducts = categories.map(
      (cat) => productData[cat as ProductCategory] as CategoryData
    );
  } else {
    const categoryData =
      productData[activeCategory as ProductCategory] as CategoryData;
    if (activeSubCategory) {
      filteredProducts = [
        {
          ...categoryData,
          data: categoryData.data.filter(
            (item) => item.subtitle === activeSubCategory
          ),
        },
      ];
    } else {
      filteredProducts = [categoryData];
    }
  }

  const allCards = filteredProducts.flatMap((category) =>
    category.data.flatMap((item) =>
      item.subTitles.map((detail) => ({
        categoryTitle: category.title,
        subtitle: item.subtitle,
        detail,
      }))
    )
  );

  const totalPages = Math.ceil(allCards.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageCards = allCards.slice(startIndex, startIndex + itemsPerPage);

  const cardsForUI: CategoryData[] = [
    {
      title: activeCategory,
      data: [
        {
          subtitle: activeSubCategory || "All",
          subTitles: currentPageCards.map((c) => c.detail),
        },
      ],
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="py-8">
      <h1 className="text-5xl md:text-7xl text-center py-14">Products Categories</h1>

      <div className="flex justify-center flex-wrap gap-6 mb-6">
        <button
          onClick={() => handleCategoryClick("All")}
          className={`px-4 py-2 rounded ${
            activeCategory === "All"
              ? "bg-gray-900 text-white"
              : "bg-gray-200 text-gray-700"
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
              onClick={() => {
                setActiveSubCategory(item.subtitle);
                setCurrentPage(1);
              }}
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

      <Cards products={cardsForUI} />

      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 sm:gap-4 mt-6">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded ${
                currentPage === page
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-700"
              } cursor-pointer`}
            >
              {page}
            </button>
          )
        )}
      </div>
    </div>
  );
}
