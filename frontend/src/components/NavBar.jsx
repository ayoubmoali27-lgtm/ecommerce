"use client";
import { useState, useEffect } from "react";
import { Search, Heart, ShoppingCart, User, X, Menu,ChevronDown  } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavBar() {
  const pathname = usePathname();

   const [isOpen, setIsOpen] = useState(false);
   const [user, setUser] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  const [open, setOpen] = useState(false);
 
 useEffect(() => {
  // Get user from localStorage
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  // Listen for login event
  const handleLogin = () => {
    const updatedUser = localStorage.getItem("user");
    if (updatedUser) {
      setUser(JSON.parse(updatedUser));
    }
  };

  // Listen for logout event
  const handleLogout = () => {
    setUser(null);
  };

  window.addEventListener("userLoggedIn", handleLogin);
  window.addEventListener("userLoggedOut", handleLogout);
  
  return () => {
    window.removeEventListener("userLoggedIn", handleLogin);
    window.removeEventListener("userLoggedOut", handleLogout);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
const isAdmin = user?.role === "admin";

 



  return (
    <nav className=" px-8 py-4 bg-white sticky top-0 z-50 shadow-md ">
      <div className="flex items-center justify-between">
        <Link 
  href="/" 
  className="text-2xl font-bold inline-block transition-all duration-300 hover:rotate-[-2deg] hover:scale-110 hover:text-blue-600"
>
  NextCom
</Link>
        <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-md px-4 py-2 w-1/3 transition-all duration-300 focus-within:bg-white focus-within:shadow-md focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:w-1/2">
          <Search
            size={18}
            className="text-gray-400 transition-all duration-300 focus-within:text-blue-600 focus-within:scale-110"
          />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none w-full text-sm placeholder:text-gray-400 transition-all duration-300 focus:placeholder:text-gray-300"
          />
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm">
               <Link
            href="/"
            className={`group relative py-1 transition-colors duration-300 ${pathname === "/" ? "font-semibold text-slate-900" : "text-gray-500 hover:text-slate-900"}`}
          >
            Home
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out ${pathname === "/" ? "w-full" : "w-0 group-hover:w-full"}`}
            ></span>
          </Link>
          <Link
            href="/products"
            className={`group relative py-1 transition-colors duration-300 ${pathname === "/products" ? "font-semibold text-slate-900" : "text-gray-500 hover:text-slate-900"}`}
          >
            Shop
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out ${pathname === "/products" ? "w-full" : "w-0 group-hover:w-full"}`}
            ></span>
          </Link>
          <Link
            href="/contacts"
            className={`group relative py-1 transition-colors duration-300 ${pathname === "/contacts" ? "font-semibold text-slate-900" : "text-gray-500 hover:text-slate-900"}`}
          >
            Contact Us
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out ${pathname === "/contacts" ? "w-full" : "w-0 group-hover:w-full"}`}
            ></span>
          </Link>
          <a
            href="#about"
            className="group relative text-gray-500 py-1 transition-colors duration-300 hover:text-slate-900 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            About
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full"></span>
          </a>

           {isAdmin && (
              <div className="relative">
                <button
                  onClick={() => setIsAdminOpen(!isAdminOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium transition"
                >
                  Admin
                  <ChevronDown size={18} className={`transition ${isAdminOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {isAdminOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <Link
                      href="/orders"
                      onClick={() => setIsAdminOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 first:rounded-t-lg"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/users"
                      onClick={() => setIsAdminOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 last:rounded-b-lg border-t border-gray-200"
                    >
                      Users
                    </Link>
                  </div>
                )}
              </div>
            )}
        </div>
        <div className="hidden md:flex items-center gap-5">
          <button
            className="group relative flex items-center justify-center p-2 rounded-full transition-all duration-300 ease-out hover:bg-slate-100 hover:scale-110 active:scale-95"
            aria-label="Wishlist"
          >
            <Heart
              size={20}
              className="text-slate-600 transition-all duration-300 ease-out group-hover:text-blue-600 group-hover:rotate-12"
            />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:opacity-100 text-xs font-medium text-slate-600 whitespace-nowrap pointer-events-none">
              Wishlist
            </span>
          </button>
          <Link
            href="/cart"
            className="group relative flex items-center justify-center p-2 rounded-full transition-all duration-300 ease-out hover:bg-slate-100 hover:scale-110 active:scale-95"
          >
            <ShoppingCart
              size={20}
              className="text-slate-600 transition-all duration-300 ease-out group-hover:text-blue-600 group-hover:rotate-12"
            />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:opacity-100 text-xs font-medium text-slate-600 whitespace-nowrap pointer-events-none">
              Cart
            </span>
          </Link>
          <Link
            href="/account"
            className="group relative flex items-center justify-center p-2 rounded-full transition-all duration-300 ease-out hover:bg-slate-100 hover:scale-110 active:scale-95"
          >
            <User
              size={20}
              className="text-slate-600 transition-all duration-300 ease-out group-hover:text-blue-600 group-hover:rotate-12"
            />

            {/* Optional tooltip */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:opacity-100 text-xs font-medium text-slate-600 whitespace-nowrap pointer-events-none">
              Account
            </span>
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* responsiive */}
      {open && (
        <div className="flex flex-col gap-4 mt-4 md:hidden items-center">
          <div className="flex items-center gap-2 bg-gray-100 rounded-md px-4 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
          <Link href="/" className="font-semibold">
            Home
          </Link>
          <Link href="/products" className="text-gray-500">
            Shop
          </Link>
          <Link href="/contacts" className="text-gray-500">
            Contact Us
          </Link>
          <a  className="text-gray-500"  onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" });
                setOpen(false)
            }}>
            About
          </a>
          <div className="flex items-center gap-5 pt-2">
            <Heart size={20} />
            <Link href="/cart">
              <ShoppingCart size={20} />
            </Link>
            <Link
              href="/account"
              className="group relative flex items-center justify-center p-2 rounded-full transition-all duration-300 ease-out hover:bg-slate-100 hover:scale-110 active:scale-95"
            >
              <User
                size={20}
                className="text-slate-600 transition-all duration-300 ease-out group-hover:text-blue-600 group-hover:rotate-12"
              />

              {/* Optional tooltip */}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:opacity-100 text-xs font-medium text-slate-600 whitespace-nowrap pointer-events-none">
                Account
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
