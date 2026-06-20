import TrendingAllWeek from "@/server/trendingAllWeek";
import HeroCarousel from "@/components/HeroCarousel";
import Image from "next/image";

export default function Home() {
  return (
    <div>
        {/* Hero Carousel */}
      <TrendingAllWeek />
    </div>
    
  );
}
