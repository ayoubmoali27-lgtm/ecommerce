"use client";

import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  Smartphone,
  Tablet,
  Watch,
  Headphones,
  Laptop,Tv,Gamepad2,
  Plug,
  Zap,
  Cable,
} from "lucide-react";

const categories = [
  { id: 1, name: "Laptop & PC", icon: Laptop, slug: "laptops" },
  { id: 2, name: "Smartphones", icon: Smartphone, slug: "smartphones" },
  { id: 3, name: "Tablets", icon: Tablet, slug: "tablets" },
  { id: 4, name: "Smartwatches", icon: Watch, slug: "watches" },
  { id: 5, name: "Headphones", icon: Headphones, slug: "headphones" },
  { id: 6, name: "Televisions", icon: Tv, slug: "televisions" },
  { id: 7, name: "Games & Videos", icon: Gamepad2, slug: "games" },
];

const Category = () => {
  const [category, setCategory]=useState([])
  useEffect(() => {
    async function fetchcategory() {
      try {
        
        const res = await axios.get("http://localhost:3000/api/products");
        console.log("RESPONSE category :", res.data);
        setCategory(res.data.products);
      } catch (error) {
        console.log(error);
      }
    }

    fetchcategory(); // ← call it, outside the function
  }, []);
  return (
    <div className="mt-12 max-w-7xl mx-auto px-8">
      <h1 className="text-4xl font-bold text-slate-800 mb-6">Categories</h1>

      <div className="flex flex-wrap justify-center gap-8 py-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
             <Link
              href={`/products?category=${category.slug}`}
              key={category.id}
              className="flex flex-col items-center gap-4 cursor-pointer transition hover:-translate-y-1"
            >
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200">
                <Icon className="h-12 w-12 text-slate-700" />
              </div>
              <h3 className="text-lg font-medium text-slate-800">
                {category.name}
              </h3>
            </Link>
          );
        })}
      </div>

      <hr className="border-t border-gray-300 my-10" />
    </div>
  );
};

export default Category;