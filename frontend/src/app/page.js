import BestSellers from "@/components/BestSeller";
import PromoBanners from "@/components/CardsPro";
import Category from "@/components/Category";
import Feedbacks from "@/components/FeedBack";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import NewArrivals from "@/components/NewArrivals";


export default function Home() {
  return (
    <main className="mx-8 justify-center">
      
      
        <HeroSection />
        <Category/>
        <NewArrivals/>
        <PromoBanners/>
        <BestSellers/>
        <Feedbacks/>
        
      
    </main>
  );
}
