import { Smartphone, Dumbbell, Watch } from "lucide-react";
import Link from "next/link";
export default function PromoBanners() {
  return (
    <div className="max-w-7xl mx-auto px-8 mt-12 flex flex-col gap-6">

      {/* Top wide banner */}
      <div className="bg-gray-100 rounded-2xl flex items-center justify-between px-12 py-10">
        <div className="max-w-md">
          <p className="text-slate-700 mb-2">Apple iPhone 14 Plus</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">UP TO 30% OFF</h2>
          <p className="text-slate-600 mb-6">
            iPhone 14 has the same superspeedy chip thats in iPhone 13 Pro, A15 Bionic, with a 5-core GPU.
          </p>
          <Link href={`products/iphon-14-plus`}>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition">
            Buy Now
          </button>
          </Link>
        </div>
        <Smartphone size={140} className="text-slate-400" />
      </div>

      {/* Bottom two banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left — teal */}
        <div className="bg-teal-50 rounded-2xl flex items-center justify-between px-10 py-10">
          <Dumbbell size={110} className="text-slate-500" />
          <div className="text-right max-w-xs">
            <p className="text-slate-700 mb-1">Foldable Motorised Treadmill</p>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">Workout At Home</h3>
            <p className="text-teal-600 font-semibold mb-4">Flat 20% off</p>
            <Link href={`products/treadmill`}>
            <button className="bg-teal-500 text-white px-6 py-3 rounded-full font-medium hover:bg-teal-600 transition">
              Grab Now
            </button>
            </Link>
          </div>
        </div>

        {/* Right — peach */}
        <div className="bg-orange-50 rounded-2xl flex items-center justify-between px-10 py-10">
          <div className="max-w-xs">
            <p className="text-slate-700 mb-1">Apple Watch Ultra</p>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">Up to 40% off</h3>
            <p className="text-slate-600 mb-4">The aerospace-grade titanium case strikes the perfect balance.</p>
            <Link href={`/products/apple-watch-ultra`}>
            <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition">
              Buy Now
            </button>
            </Link>
          </div>
          <Watch size={110} className="text-slate-500" />
        </div>

      </div>
    </div>
  );
}