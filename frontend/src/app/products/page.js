"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { LayoutGrid, List, Eye, Heart } from "lucide-react";

const categories = [
  { name: "Laptops & PC", slug: "laptops", count: 2 },
  { name: "Watches", slug: "watches", count: 2 },
  { name: "Smartphones", slug: "smartphones", count: 2 },
  { name: "Headphones", slug: "headphones", count: 1 },
  { name: "Tablets", slug: "tablets", count: 1 },
];

function ShopContent() {
  const [addingToCart, setAddingToCart] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const searchParams = useSearchParams();
  const categoryFromURL = searchParams.get("category");
  const [product, setProduct] = useState([]);
  const [sortOption, setSortOption] = useState("latest");
  const [originalProducts, setOriginalProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromURL || null,
  );

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get("http://localhost:3000/api/products");
        console.log("RESPONSE product:", res.data);
        setProduct(res.data.products);
        setOriginalProducts(res.data.products);
      } catch (error) {
        console.log(error);
      }
    }

    fetchProducts();
  }, []);

  const filtredProducts = selectedCategory
    ? product.filter((p) => p.category_id?.slug === selectedCategory)
    : product;
  console.log("Category from URL:", categoryFromURL);

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
        { headers: { Authorization: `Bearer ${token}` } },
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

  function handleOption(e) {
    const value = e.target.value;
    setSortOption(value);
    let sorted = [...originalProducts];

    if (value === "low-to-high") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (value === "high-to-low") {
      sorted.sort((a, b) => b.price - a.price);
    }
    setProduct(sorted);
  }

  return (
    <div className="max-w-7xl mx-auto px-8 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar — 1 of 4 columns */}
        <aside className="md:col-span-1 flex flex-col gap-6">
          {/* Filters header */}
          <div className="bg-gray-50 rounded-2xl p-5 flex items-center justify-between">
            <span className="font-semibold text-slate-800">Filters:</span>
            <button
              className="text-blue-600 text-sm hover:underline"
              onClick={() => setSelectedCategory(null)}
            >
              Clean All
            </button>
          </div>

          {/* Category */}
          <div className="bg-gray-50 rounded-2xl p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Category</h3>
            <div className="flex flex-col gap-3">
              {categories.map((cat) => (
                <label
                  key={cat.name}
                  className="flex items-center justify-between cursor-pointer text-slate-600"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategory === cat.slug}
                      readOnly
                      className="accent-blue-600"
                      onChange={() => {
                        setSelectedCategory(
                          selectedCategory === cat.slug ? null : cat.slug,
                        );
                      }}
                    />
                    {cat.name}
                  </span>
                  <span className="text-sm text-slate-400">{cat.count}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main area — 3 of 4 columns */}
        <main className="md:col-span-3">
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex items-center justify-between">
            {/* Left — sort dropdown + count */}
            <div className="flex items-center gap-4">
              <select
                onChange={handleOption}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-slate-600 outline-none cursor-pointer"
              >
                <option>Latest Products</option>
                <option>low-to-high</option>
                <option>high-to-low</option>
              </select>
              <p className="text-slate-600 text-sm">
                Showing {product.length} of {product.length} Products
              </p>
            </div>

            {/* Right — view toggle */}
          </div>

          {cartMessage && (
            <div
              className={`mb-6 p-4 rounded-lg text-center ${
                cartMessage.includes("✓")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {cartMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtredProducts.map((p) => (
              <div key={p._id} className="bg-white rounded-2xl p-4 block">
                {/* Image area with hover buttons */}
                <div className="group relative bg-gray-50 rounded-xl h-56 flex items-center justify-center overflow-hidden">
                  <Link href={`/products/${p.slug}`}>
                    <img
                      src={p.image?.[0] || "/placeholder.png"}
                      alt={p.name}
                      className="object-contain max-h-[180px] w-auto"
                    />
                  </Link>

                  <div className="absolute bottom-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button className="bg-white rounded-full p-2 shadow hover:bg-gray-50">
                      <Eye size={18} />
                    </button>
                    <button
                      disabled={addingToCart === p._id}
                      className="bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-blue-700"
                      onClick={() => handleAddToCart(p._id, p.name)}
                    >
                      {addingToCart === p._id ? "Adding..." : "Add to cart"}
                    </button>
                    <button className="bg-white rounded-full p-2 shadow hover:bg-gray-50">
                      <Heart size={18} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <h3 className="mt-3 font-medium text-slate-800 truncate">
                  {p.name}
                </h3>
                <p className="mt-1 font-semibold text-slate-900">
                  ${(p.price / 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<p className="text-center py-20">Loading...</p>}>
      <ShopContent />
    </Suspense>
  );
}