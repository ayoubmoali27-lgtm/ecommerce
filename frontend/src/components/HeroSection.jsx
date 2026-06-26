import HeroSlider from "./HeroSlider";
import SideCards from "./sidecards";

export default function HeroSection() {
  return (
   <section className="px-4 md:px-30 py-6 mt-8">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:mx-36">

    <div className="md:col-span-2 rounded-lg h-[500px]">
      <HeroSlider />
    </div>

    <div className="md:col-span-1 flex flex-col gap-12">
      <SideCards />
    </div>

  </div>
</section>
  );
}