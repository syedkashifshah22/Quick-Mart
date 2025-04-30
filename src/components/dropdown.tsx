import React, { useState } from 'react';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import userNavbarItems from "@/utils/userNavbarItem.json";

export default function Dropdown() {
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null);
  const [activeItems, setActiveItems] = useState<{ [key: number]: number | null }>({});

  const handleCategoryClick = (categoryIndex: number) => {
    setOpenCategoryIndex(prevIndex => (prevIndex === categoryIndex ? null : categoryIndex));
  };

  const handleTitleItemClick = (categoryIndex: number, itemIndex: number) => {
    setActiveItems(prevState => ({
      ...prevState,
      [categoryIndex]: prevState[categoryIndex] === itemIndex ? null : itemIndex
    }));
  };

  return (
    <div className="relative flex flex-col md:flex-row items-start">
      {userNavbarItems.map((category, categoryIndex) => (
        <div key={categoryIndex} className="relative flex flex-col md:flex-row items-start">
          {category.title && (
            <button
              onClick={() => handleCategoryClick(categoryIndex)}
              className="px-4 py-2 rounded-md"
            >
              {category.title}
            </button>
          )}

          {openCategoryIndex === categoryIndex && category.titleItems && category.titleItems.length > 0 && (
            <div className="absolute top-12 left-0 w-50 bg-white border rounded-md z-50">
              <div className="py-1">
                <div className="pl-4">
                  {category.titleItems?.map((titleItem, itemIndex) => (
                    <div key={itemIndex} className="relative py-1">
                      <button
                        onClick={() => handleTitleItemClick(categoryIndex, itemIndex)}
                        className="flex items-center justify-between w-full text-left px-4 py-2 text-gray-600 font-semibold"
                      >
                        {titleItem.titleItem}
                        {activeItems[categoryIndex] === itemIndex ? (
                          <FiChevronDown className="text-gray-500" />
                        ) : (
                          <FiChevronRight className="text-gray-500" />
                        )}
                      </button>

                      {activeItems[categoryIndex] === itemIndex && (
                        <div className="absolute left-full top-4 ml-2 w-34 bg-white border rounded-md flex flex-col ">
                          {titleItem.items.map((item, iIndex) => (
                            <a
                              key={iIndex}
                              href={item.url}
                              className="text-gray-500 px-4 py-1 cursor-pointer hover:bg-gray-200"
                            >
                              {item.title}
                            </a>
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
};
