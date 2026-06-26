import { Inter } from "next/font/google";
import "./globals.css"
import { Description } from "@mui/icons-material";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const inter = Inter({subsets : ["latin"]})

export const metadata = {
  title : "Ecommerce",
  Description : "My ecommerce store"
}



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}