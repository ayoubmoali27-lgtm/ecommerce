"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";

import Image from "next/image";

import { slides } from "@/data/Slider";

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 3000,
      }}
      loop
      className="rounded-3xl overflow-hidden"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id} className="rounded-3xl overflow-hidden">
          <div className="relative h-[500px] " style={{ background: slide.bg }}>
            {/* Image — fills the whole slide, sits behind */}
            <Image
              src={slide.image}
              fill
              alt={slide.title}
              priority
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-contain object-right"
            />

            {/* Text — sits on top of the image */}
            <div
              className={`relative z-10 h-full flex items-center px-6 md:px-12 ${slide.text}`}
            >
              <div className="max-w-xs md:max-w-xl">
                <p className="uppercase text-xs  md:text-sm font-bold mb-2">
                  {slide.subtitle}
                </p>
                <h1 className="text-3xl md:text-6xl font-bold mb-2 w-90">
                  {slide.title}
                </h1>
                <p className="text-sm md:text-base mb-6 opacity-80 ">
                  {slide.description}
                </p>
                <Link href={`/products/${slide.slug}`}>
                  <button className="bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 ease-out text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-sm md:text-base shadow-lg hover:shadow-blue-500/30 hover:shadow-xl">
                    Shop Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
