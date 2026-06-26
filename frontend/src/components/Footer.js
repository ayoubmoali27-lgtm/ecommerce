import Link from "next/link";
import {
  FaFacebook,
  FaXTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa6";
import { MapPin, Phone, Mail, Globe, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer  id="about" className="max-w-7xl mx-auto px-8 mt-20 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Help & Support */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            Help & Support
          </h3>

          <div className="flex items-start gap-3 mb-4 text-slate-600">
            <MapPin size={20} className="text-blue-600 mt-1 shrink-0" />
            <p>685 Market Street, Las Vegas, LA 95820, United States.</p>
          </div>

          <div className="flex items-center gap-3 mb-4 text-slate-600">
            <Phone size={20} className="text-blue-600 shrink-0" />
            <p>(+099) 532-786-9843</p>
          </div>

          <div className="flex items-center gap-3 mb-6 text-slate-600">
            <Mail size={20} className="text-blue-600 shrink-0" />
            <p>support@example.com</p>
          </div>

          <div className="flex gap-4">
            <FaFacebook
              size={20}
              className="cursor-pointer hover:text-blue-600"
            />
            <FaXTwitter
              size={20}
              className="cursor-pointer hover:text-blue-600"
            />
            <FaInstagram
              size={20}
              className="cursor-pointer hover:text-blue-600"
            />
            <FaLinkedin
              size={20}
              className="cursor-pointer hover:text-blue-600"
            />
          </div>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-6">Account</h3>
          <ul className="flex flex-col gap-4 text-slate-600">
            <li>
              <Link href="/account" className="hover:text-blue-600">
                Login / Register
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-blue-600">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-blue-600">
                Wishlist
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-blue-600">
                Shop
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Link */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Link</h3>
          <ul className="flex flex-col gap-4 text-slate-600">
            <li>
              <Link href="/" className="hover:text-blue-600">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-blue-600">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-blue-600">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-blue-600">
                FAQ s
              </Link>
            </li>
            <li>
              <Link href="/contacts" className="hover:text-blue-600">
                Contacts
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
