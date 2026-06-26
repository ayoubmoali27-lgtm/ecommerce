"use client";

import { Eye, Heart, Smartphone, Headphones, Watch, Laptop, Camera, Speaker } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
// const products = [
//   { id: 1, name: "Sony WH-1000XM5 Headphones", price: 399, oldPrice: 450, icon: Headphones },
//   { id: 2, name: "Samsung Galaxy S24 Ultra", price: 1199, oldPrice: 1300, icon: Smartphone },
//   { id: 3, name: "Apple Watch Series 9", price: 429, oldPrice: 500, icon: Watch },
//   { id: 4, name: "Dell XPS 15 Laptop", price: 1499, oldPrice: 1650, icon: Laptop },
//   { id: 5, name: "Canon EOS R6 Camera", price: 2499, oldPrice: 2700, icon: Camera },
//   { id: 6, name: "JBL Flip 6 Speaker", price: 129, oldPrice: 150, icon: Speaker },
//   { id: 7, name: "Google Pixel 9 Pro", price: 999, oldPrice: 1100, icon: Smartphone },
//   { id: 8, name: "Bose QuietComfort Earbuds", price: 279, oldPrice: 330, icon: Headphones },
// ];

export default function BestSellers() {

    const [product, setProduct] = useState([])
    useEffect(() => {
    async function fetchProducts() {
      try {                                          // ← try INSIDE the function
        const res = await axios.get("http://localhost:3000/api/products");
        console.log("RESPONSE best seller:", res.data);
        setProduct(res.data.products);
      } catch (error) {
        console.log(error);
      }
    }
  
    fetchProducts();                                 // ← call it, outside the function
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-8 mt-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Best Sellers</h1>
        <button className="border border-gray-300 rounded-full px-6 py-2 text-sm hover:bg-gray-100 transition">
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {product.map((product,index) => {
          
          return (
            <Link href={`/products/${product.slug}`} key={product.id || product._id || `product-${index}`} className="bg-white rounded-2xl p-4 block">
            <div >
              <div className="group relative bg-gray-100 rounded-2xl h-64 flex items-center justify-center overflow-hidden">
                <img
                    src={product.image?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="object-contain max-h-[180px] w-auto"
                  />
                <div className="absolute bottom-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button className="bg-white rounded-full p-2 shadow hover:bg-gray-50">
                    <Eye size={18} />
                  </button>
                  <button className="bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-blue-700">
                    Add to cart
                  </button>
                  <button className="bg-white rounded-full p-2 shadow hover:bg-gray-50">
                    <Heart size={18} />
                  </button>
                </div>
              </div>
              <h3 className="mt-3 font-medium text-slate-800 truncate">{product.name}</h3>
              <p className="mt-1">
                <span className="font-semibold text-slate-900">${product.price}</span>
                <span className="line-through text-gray-400 ml-2">${product.oldPrice}</span>
              </p>
            </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}