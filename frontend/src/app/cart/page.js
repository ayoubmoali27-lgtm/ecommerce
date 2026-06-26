"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// app/cart/page.js
export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorRemove, setErrorRemove] = useState("");
  const [quantity, setQuantity] = useState({});
  const [placing, setPlacing] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderError, setOrderError] = useState(false);
 const router = useRouter();
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in first");
          return;
        }

        const res = await axios.get("http://localhost:3000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartData = res.data.cart;

        setItems(cartData.items);
        console.log("Cart items:", cartData); // ✅ log the data you just set
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) =>
        prev.filter((item) => item.product_id._id !== productId),
      );
    } catch (err) {
      setErrorRemove(err.response?.data?.message || "Failed to remove item");
      setTimeout(() => setErrorRemove(null), 5000);
    }
  };

  function increment(productId) {
    setQuantity((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1, // only update this product
    }));
  }

  function decrement(productId) {
    setQuantity((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1), // min 1
    }));
  }

  const price = items.map(
    (item) => item.product_id.price * (quantity[item.product_id._id] || 1),
  );
  const total = price.reduce((sum, pri) => sum + pri, 0);

  async function handlePlaceOrder() {
    setPlacing(true);
    setOrderError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in first");
        setPlacing(false);
        return;
      }
      console.log("Placing order...");

      const res = await axios.post(
        "http://localhost:3000/api/orders",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("Full response:", res.data);
console.log("Order object:", res.data.order);

      setOrderCreated(true);

      // Redirect to order confirmation after 2 seconds
      setTimeout(() => {
        router.push(`/order/${res.data.order.id}`);
      }, 2000);
    } catch (err) {
      console.log("Order error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Your Cart</h1>
          <span className="text-sm text-gray-500">{items.length} item(s)</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {/* Cart Item 1 */}
              {error && (
                <h3 className="text-base font-bold text-gray-700">{error}</h3>
              )}
              {loading && (
                <h3 className="text-base font-bold text-gray-700">
                  Loading...
                </h3>
              )}
              {orderCreated && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                      <p className="text-green-700 font-medium">
                        ✓ Order placed successfully! Redirecting...
                      </p>
                    </div>
                  )}
              {items.map((item, index) => (
                <div
                  key={item.product_id._id || index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
                >
                  

                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-24 h-24 bg-gray-200 rounded-md flex-shrink-0">
                      <img
                        src={item.product_id.image}
                        alt={item.product_id.slug}
                        className="w-full sm:w-24 h-24 object-contain rounded-md flex-shrink-0"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-base font-semibold text-gray-900">
                          {item.product_id.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.product_id.description}
                        </p>
                        {item.product_id.stock > 0 ? (
                          <p className="text-sm text-green-500">In stock</p>
                        ) : (
                          <p className="text-sm text-red-500">Out of stock</p>
                        )}
                      </div>

                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
                        <div className="hidden sm:block font-semibold text-gray-900 text-lg">
                          <p className="text-sm text-gray-500">
                            ${(item.product_id.price / 100).toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={() => decrement(item.product_id._id)}
                          >
                            −
                          </button>
                          <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                            {quantity[item.product_id._id] || 1}
                          </span>
                          <button
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={() => increment(item.product_id._id)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.product_id._id)}
                          disabled={!!errorRemove}
                          className="text-sm text-red-600 hover:text-red-800 underline transition-all duration-200 hover:-translate-y-0.5"
                        >
                          {errorRemove ? `${errorRemove} ` : "Remove"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* ------------------------------------------------ */}
            </div>

            <div className="mt-6">
              <Link href={"/products"}>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                  ← Continue Shopping
                </button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex flex-col items-end text-gray-600">
                  <span>Subtotal {items.length} item(1)</span>
                  {price.map((pri, index) => (
                    <span key={index}>{pri} DA</span>
                  ))}
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>

                {/* Promo Code Input */}
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
                      Apply
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-base font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${(total / 100).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Including VAT</p>
                </div>
              </div>

              <button
                disabled={placing}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                onClick={handlePlaceOrder}
              >
                {placing ? "Placing order..." : "Place order"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
