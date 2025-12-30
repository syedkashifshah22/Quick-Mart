import React, { useState, useEffect, useRef } from 'react';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import Link from 'next/link';
import userNavbarItems from '@/utils/userNavbarItem.json';

interface TitleItem {
  titleItem: string;
  items?: Array<{ title: string; url: string; subItem?: Array<{ title: string; url: string }> }>;
}

interface Category {
  NavbarTitle: string;
  url?: string;
  titleItems?: TitleItem[];
}

export default function Dropdown() {
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null);
  const [activeTitleItem, setActiveTitleItem] = useState<{ [key: number]: number | null }>({});
  const [activeItem, setActiveItem] = useState<{ [key: string]: number | null }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenCategoryIndex(null);
        setActiveTitleItem({});
        setActiveItem({});
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative flex flex-col md:flex-row items-start space-y-4 md:space-y-0">
      {userNavbarItems.map((category: Category, categoryIndex: number) => (
        <div
          key={categoryIndex}
          className="relative"
          onMouseEnter={() => setOpenCategoryIndex(categoryIndex)}
          onMouseLeave={() => {
            if (!activeTitleItem[categoryIndex]) {
              setOpenCategoryIndex(null);
            }
          }}
        >
          {category.titleItems ? (
            <div className="px-4 rounded-md cursor-pointer flex items-center justify-between text-white hover:text-gray-300">
              {category.NavbarTitle}
              {openCategoryIndex === categoryIndex ? (
                <FiChevronDown className="ml-2" />
              ) : (
                <FiChevronRight className="ml-2" />
              )}
            </div>
          ) : (
            <Link href={category.url || '#'} className="px-4 py-2 rounded-md text-white hover:text-gray-300">
              {category.NavbarTitle}
            </Link>
          )}

          {openCategoryIndex === categoryIndex && category.titleItems && (
            <div className="absolute top-6 left-0 w-56 bg-white text-gray-800 rounded-md z-50 shadow-lg">
              {category.titleItems.map((titleItem, titleIndex) => (
                <div
                  key={titleIndex}
                  className="relative group"
                  onMouseEnter={() =>
                    setActiveTitleItem((prev) => ({ ...prev, [categoryIndex]: titleIndex }))
                  }
                  onMouseLeave={() =>
                    setActiveTitleItem((prev) => ({ ...prev, [categoryIndex]: null }))
                  }
                >
                  <div className="flex items-center justify-between w-full text-left px-4 py-2 text-gray-700 font-semibold cursor-pointer">
                    {titleItem.titleItem}
                    {titleItem.items && titleItem.items.length > 0 && (
                      <span className="ml-2">
                        {activeTitleItem[categoryIndex] === titleIndex ? (
                          <FiChevronDown className="text-gray-500" />
                        ) : (
                          <FiChevronRight className="text-gray-500" />
                        )}
                      </span>
                    )}
                  </div>

                  {/* 3rd Level */}
                  {activeTitleItem[categoryIndex] === titleIndex &&
                    titleItem.items &&
                    titleItem.items.length > 0 && (
                      <div className="absolute top-0 left-54 w-56 bg-white text-gray-800 rounded-md z-50 shadow-lg">
                        {titleItem.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="relative group"
                            onMouseEnter={() =>
                              setActiveItem((prev) => ({
                                ...prev,
                                [`${categoryIndex}-${titleIndex}`]: itemIndex,
                              }))
                            }
                            onMouseLeave={() =>
                              setActiveItem((prev) => ({
                                ...prev,
                                [`${categoryIndex}-${titleIndex}`]: null,
                              }))
                            }
                          >
                            {item.subItem && item.subItem.length > 0 ? (
                              <div className="flex items-center justify-between w-full text-left px-4 py-2 text-gray-600 font-semibold cursor-pointer">
                                {item.title}
                                <span className="ml-2">
                                  {activeItem[`${categoryIndex}-${titleIndex}`] === itemIndex ? (
                                    <FiChevronDown className="text-gray-500" />
                                  ) : (
                                    <FiChevronRight className="text-gray-500" />
                                  )}
                                </span>
                              </div>
                            ) : (
                              <Link
                                href={item.url}
                                className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                              >
                                {item.title}
                              </Link>
                            )}

                            {/* 4th Level */}
                            {activeItem[`${categoryIndex}-${titleIndex}`] === itemIndex &&
                              item.subItem &&
                              item.subItem.length > 0 && (
                                <div className="absolute top-0 left-54 w-48 bg-white rounded-md z-50 shadow-lg">
                                  {item.subItem.map((sub, subIndex) => (
                                    <Link
                                      key={subIndex}
                                      href={sub.url}
                                      className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                                    >
                                      {sub.title}
                                    </Link>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
