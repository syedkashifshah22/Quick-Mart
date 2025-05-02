import React, { useState, useEffect, useRef } from 'react';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import Link from 'next/link';
import userNavbarItems from "@/utils/userNavbarItem.json";

export default function Dropdown() {
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null);
  const [activeItems, setActiveItems] = useState<{ [key: number]: number | null }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenCategoryIndex(null);
        setActiveItems({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative flex flex-col md:flex-row items-start">
      {userNavbarItems.map((category, categoryIndex) => (
        <div
          key={categoryIndex}
          className="relative flex flex-col md:flex-row items-start"
          onMouseEnter={() => setOpenCategoryIndex(categoryIndex)}
          onMouseLeave={() => setOpenCategoryIndex(null)}
        >
          {category.titleItems && category.titleItems.length > 0 ? (
            <div className="px-4 py-2 rounded-md  cursor-pointer">
              {category.title}
            </div>
          ) : (
            <Link
              href={category.url}
              className="px-4 py-2 rounded-md"
            >
              {category.title}
            </Link>
          )}

          {openCategoryIndex === categoryIndex && category.titleItems && category.titleItems.length > 0 && (
            <div className="absolute top-10 left-0 w-40 bg-white border rounded-md z-50">
              <div className="py-1">
                <div className="pl-4">
                  {category.titleItems?.map((titleItem, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="relative py-1"
                      onMouseEnter={() =>
                        setActiveItems((prev) => ({ ...prev, [categoryIndex]: itemIndex }))
                      }
                      onMouseLeave={() =>
                        setActiveItems((prev) => ({ ...prev, [categoryIndex]: null }))
                      }
                    >
                      <div className="flex items-center justify-between w-full text-left px-4 py-2 text-gray-600 font-semibold cursor-pointer">
                        {titleItem.titleItem}
                        {activeItems[categoryIndex] === itemIndex ? (
                          <FiChevronDown className="text-gray-500" />
                        ) : (
                          <FiChevronRight className="text-gray-500" />
                        )}
                      </div>

                      {activeItems[categoryIndex] === itemIndex && (
                        <div className="absolute left-full top-0 w-34 bg-white border rounded-md flex flex-col ">
                          {titleItem.items.map((item, iIndex) => (
                            <Link
                              key={iIndex}
                              href={item.url}
                              className="text-gray-500 px-4 py-1 cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
