"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function OrderConfirmation() {
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in first");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:3000/api/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Order:", res.data);
        setOrder(res.data.order);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.error || "Failed to load order");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) return <p className="text-center py-20">Loading order...</p>;

  if (error)
    return <p className="text-center py-20 text-red-500">{error}</p>;

  if (!order)
    return <p className="text-center py-20">Order not found</p>;

  return (
    <div className="max-w-3xl mx-auto px-8 mt-12 mb-20">
      {/* Success message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          ✓ Order Placed Successfully!
        </h1>
        <p className="text-green-600">
          Thank you for your purchase. Your order is being processed.
        </p>
      </div>

      {/* Order details */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
        <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b">
          <div>
            <p className="text-sm text-slate-600 mb-1">Order ID</p>
            <p className="text-lg font-semibold text-slate-900">
              {order.id}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Order Date</p>
            <p className="text-lg font-semibold text-slate-900">
              {new Date(order.created).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b">
          <div>
            <p className="text-sm text-slate-600 mb-1">Status</p>
            <p className="text-lg font-semibold text-blue-600 uppercase">
              {order.status}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Total Amount</p>
            <p className="text-lg font-semibold text-slate-900">
              DA{(order.total / 100).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Order Items
          </h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-slate-800">
                    {item.product_name}
                  </p>
                  <p className="text-sm text-slate-600">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-slate-900">
                  DA{((item.price * item.quantity) / 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Link href="/products" className="flex-1">
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Continue Shopping
          </button>
        </Link>
        <Link href="/" className="flex-1">
          <button className="w-full border border-gray-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}