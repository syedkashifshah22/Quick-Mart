"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ProductDetail {
  heading: string;
  description: string;
  imageUrl: string;
  price?: number;
}

interface ProductItem {
  subtitle: string;
  subTitles: ProductDetail[];
}

interface CategoryData {
  title: string;
  data: ProductItem[];
}

interface CardsProps {
  products: CategoryData[];
}

export default function Cards({ products }: CardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 pt-4">
      {products.flatMap((item, i) =>
        item.data.flatMap((subItem, j) =>
          subItem.subTitles.map((product, idx) => (
            <ProductCard
              key={`${i}-${j}-${idx}`}
              product={product}
            />
          ))
        )
      )}
    </div>
  );
}

function ProductCard({ product }: { product: ProductDetail }) {
  const [rating, setRating] = useState<number>(0);

  const productKey = `rating-${product.heading}`;

  useEffect(() => {
    const storedRating = localStorage.getItem(productKey);
    if (storedRating) {
      setRating(Number(storedRating));
    }
  }, [productKey]);

  const handleRating = (newRating: number) => {
    setRating(newRating);
    localStorage.setItem(productKey, newRating.toString());
  };

  const percentage = (rating / 5) * 100;

  return (
    <div className="rounded-lg overflow-hidden shadow-md transition-all duration-300 ease-in-out hover:scale-105">
      <div className="relative overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.heading}
          width={500}
          height={200}
          className="w-full h-[350px] transition-transform duration-300 ease-in-out hover:scale-120"
          priority
        />
      </div>
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold">{product.heading}</h2>
        <p className="text-gray-600">{product.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-black font-bold">{product.price}</p>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                filled={i < rating}
                onClick={() => handleRating(i + 1)}
              />
            ))}
            {rating > 0 && (
              <span className="text-sm text-black font-bold ml-2">
                {percentage}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Star({
  filled,
  onClick,
}: {
  filled: boolean;
  onClick: () => void;
}) {
  return (
    <svg
      onClick={onClick}
      className={`w-5 h-5 cursor-pointer ${filled ? "text-yellow-400" : "text-gray-300"}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.172L12 18.896l-7.336 3.863 1.402-8.172L.132 9.21l8.2-1.192z" />
    </svg>
  );
}
