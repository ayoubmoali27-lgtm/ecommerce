"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Heart, Minus, Plus, Router } from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(`http://localhost:3000/api/products/${slug}`);
        setProduct(res.data.product);
        
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (!product) return <p className="text-center py-20">Product not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-8 mt-12 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Left — image */}
        <div className="bg-gray-50 rounded-2xl h-[450px] flex items-center justify-center p-8">
          <img
            src={product.image?.[0] || "/placeholder.png"}
            alt={product.name}
            className="object-contain max-h-full w-auto"
          />
        </div>

        {/* Right — details */}
        <div className="flex flex-col">

          {/* Category */}
          {product.category_id?.name && (
            <span className="text-sm text-blue-600 font-medium mb-2">
              {product.category_id.name}
            </span>
          )}

          {/* Name */}
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <p className="text-3xl font-semibold text-slate-900 mb-6">
            ${(product.price / 100).toFixed(2)}
          </p>

          {/* Description */}
          <p className="text-slate-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Stock status */}
          <p className="mb-6 text-sm">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
          </p>

          {/* Quantity selector */}
          <div className="flex items-center gap-4 mb-8">
            <span className="font-medium text-slate-700">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-full">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 hover:bg-gray-100 rounded-l-full"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2 hover:bg-gray-100 rounded-r-full"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition flex-1">
              Add to Cart
            </button>
            <button className="border border-gray-300 rounded-full p-3 hover:bg-gray-100 transition">
              <Heart size={20} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}