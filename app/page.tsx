import TrendingAllWeek from "@/server/trendingAllWeek";
import HeroCarousel from "@/components/HeroCarousel";
import Image from "next/image";
import NowPlaying from "@/components/NowPlaying";
import { getNowPlaying } from "@/services/tmdb";

export default async function Home() {
  const nowPlaying = await getNowPlaying()
  return (
    <main className="min-h-screen bg-black">

    <div>
        {/* Hero Carousel */}
        <TrendingAllWeek />
          <div className="">
        <NowPlaying nowPlaying={nowPlaying.results} />
          </div>
    </div>
    
    </main>
  );
}
