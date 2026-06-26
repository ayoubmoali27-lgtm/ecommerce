"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Star, ChevronLeft, ChevronRight, User } from "lucide-react";

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  async function fetchReviews() {
    try {
      console.log("FETCHING REVIEWS...");

      const res = await axios.get("http://localhost:3000/api/reviews");

      // console.log("RESPONSE:", res.data);

      setFeedbacks(res.data.reviews);
    } catch (err) {
      console.log("ERROR:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchReviews();
}, []);

  if (loading) return <p className="text-center py-10">Loading feedbacks...</p>;

  return (
    <div className="max-w-7xl mx-auto px-8 mt-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">User Feedbacks</h1>
        <div className="flex gap-2">
          <button className="border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition">
            <ChevronLeft size={20} />
          </button>
          <button className="border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {feedbacks.map((fb) => (
          <div key={fb._id} className="border border-gray-200 rounded-2xl p-6">

            {/* Stars based on the review's rating */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < fb.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>

            <p className="text-slate-600 mb-6">{fb.comment}</p>

            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={24} className="text-slate-500" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">{fb.author_name}</h4>
                <p className="text-sm text-slate-500">Customer</p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}