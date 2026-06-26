// data/slides.js
import watch from "@/assests/watch.png";
import iphone from "@/assests/phone.png";
import ipad from "@/assests/ipad.png";
import camera from "@/assests/camera.png";
import sam from "@/assests/samsung.png";



export const slides = [
  {
    id: 1,
    title: "Apple Watch Ultra",
    subtitle: "PREMIUM DESIGN",
    description:
      "Advanced imaging performance with a 200MP AI camera with enhanced image quality.",
    image: watch,
    bg: "#9e9591",
     text: "text-gray-900",
     slug:"apple-watch-ultra"
  },
  {
    id: 2,
    title: "iPhone 16 Pro Max",
    subtitle: "NEW ARRIVAL",
    description:
      "Powerful performance with the latest A19 chip.",
    image: iphone,
    bg: "#dadada",
     text: "text-gray-900",
     slug:"iphone-16-pro-max"
  },
  {
    id: 3,
    title: "iPad Pro M4",
    subtitle: "ULTIMATE PERFORMANCE",
    description:
      "Ultra-thin design with the powerful M4 chip, stunning Ultra Retina XDR display, and all-day battery life.",
    image: ipad,
    bg: "#E8E8E8",
     text: "text-gray-900",
     slug :"macbook-air-m4"
  },
];


export const sideCards = [
  {
    id: 1,
    title: "Smart Security\nHome Camera",
    save: "$450",
    image: camera,
    bg: "#E3EEFB",          // light blue
    slug: "smart-camera",   // for the product link
  },
  {
    id: 2,
    title: "Galaxy S24\nUltra 5G",
    save: "$600",
    image: sam,
    bg: "#E8E6E1",          // beige
    slug: "samsung-galaxy-s24-ultra",
  },
];