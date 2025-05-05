"use client";
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

interface CardsProps {
  products: CategoryData[];
}

export default function Cards({ products }: CardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 pt-4">
      {products.flatMap((item, i) =>
        item.data.flatMap((subItem, j) =>
          subItem.subTitles.map((product, idx) => (
            <div
              key={`${i}-${j}-${idx}`}
              className="rounded-lg overflow-hidden shadow-md transition-all duration-300 ease-in-out hover:scale-105"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.heading}
                  width={500}
                  height={200}
                  className="w-full h-auto md:h-[350px] transition-transform duration-300 ease-in-out hover:scale-120"
                  priority // Adds image priority loading for faster load
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold">{product.heading}</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
}
