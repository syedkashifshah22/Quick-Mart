"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const images = [
  { src: "/assets/Banner/banner1.jpg", animation: { y: -200 } },
  { src: "/assets/Banner/banner2.jpg", animation: { y: 200 } },
  { src: "/assets/Banner/banner3.jpeg", animation: { x: -200 } },
  { src: "/assets/Banner/banner4.jpg", animation: { x: 200 } },
  { src: "/assets/Banner/banner5.jpg", animation: { scale: 0, rotate: 360 } },
  {
    src: "/assets/Banner/banner6.jpeg",
    animation: { scale: [0.5, 1.2, 1], rotate: [0, 45, -45, 0] },
  },
  { src: "/assets/Banner/banner7.jpeg", animation: { y: -200  } },
  { src: "/assets/Banner/banner8.jpeg", animation: { y: 200 } },
];

export default function HeroUser() {
  const [showSlider, setShowSlider] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSlider(true), 12000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-8xl mx-auto">
      {!showSlider ? (
        <div className="relative w-full h-[600px] overflow-hidden flex items-center justify-center">
          <div className="relative w-full h-full">
            {images.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, ...img.animation }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: index * 1.5 }} 
                className="absolute inset-0"
              >
                <Image
                  src={img.src}
                  alt={`Banner ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000 }}
          loop
          slidesPerView={1}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[600px]">
                <Image
                  src={img.src}
                  alt={`Slide ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
