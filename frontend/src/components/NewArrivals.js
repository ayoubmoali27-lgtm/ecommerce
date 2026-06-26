"use client";

import axios from "axios";
import { Eye, Heart } from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NewArrivals() {
  const [product, setProduct] = useState([]);
  const [addingToCart, setAddingToCart] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get("http://localhost:3000/api/products");
        console.log("RESPONSE:", res.data);
        setProduct(res.data.products);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProducts();
  }, []);

  async function handleAddToCart(productId, productName) {
    setAddingToCart(productId);
    setCartMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartMessage("Please log in first");
        setAddingToCart(null);
        return;
      }
      console.log("Adding to cart:", { product_id: productId, quantity: 1 });

      const res = await axios.post(
        "http://localhost:3000/api/cart",
        { product_id: productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Added to cart:", res.data);
      setCartMessage(`✓ ${productName} added to cart!`);
      setTimeout(() => setCartMessage(""), 3000);
    } catch (error) {
      console.log("Cart error:", error.response?.data?.error || error.message);
      setCartMessage(error.response?.data?.error || "Failed to add to cart");
      setTimeout(() => setCartMessage(""), 3000);
    } finally {
      setAddingToCart(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-8 mt-12">
      {/* Cart notification — ADD THIS */}
      {cartMessage && (
        <div className={`mb-6 p-4 rounded-lg text-center ${
          cartMessage.includes("✓")
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-700"
        }`}>
          {cartMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Products</h1>
        <Link href="/products">
          <button className="border border-gray-300 rounded-full px-6 py-2 text-sm hover:bg-gray-100 transition">
            View All
          </button>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {product.map((product, index) => {
          return (
            
            <div key={product._id || index}>
              {/* Image area with hover buttons */}
             
              <div className="group relative bg-gray-100 rounded-2xl h-64 flex items-center justify-center overflow-hidden">
                 <Link href={`/products/${product.slug}`}  >
                <img
                  src={product.image?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="object-contain max-h-[180px] w-auto"
                />
                </Link>

                {/* Hover buttons */}
                <div className="absolute bottom-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition ">
                  <button className="bg-white rounded-full p-2 shadow hover:bg-gray-50">
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleAddToCart(product._id, product.name)}
                    disabled={addingToCart === product._id}
                    className="bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                  >
                    {addingToCart === product._id ? "Adding..." : "Add to cart"}
                  </button>
                  <button className="bg-white rounded-full p-2 shadow hover:bg-gray-50">
                    <Heart size={18} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <h3 className="mt-3 font-medium text-slate-800 truncate">
                {product.name}
              </h3>
              <p className="mt-1 font-semibold text-slate-900">
                ${(product.price / 100).toFixed(2)}
              </p>
            </div>
            
          );
        })}
      </div>
      
    </div>
  );
}