
import TrendingAllWeek from "@/server/trendingAllWeek";
import HeroCarousel from "@/components/HeroCarousel";
import Image from "next/image";
import NowPlaying from "@/components/NowPlaying";
import { getNowPlaying, getPopularMovieshome } from "@/services/tmdb";
import PopularRow from "@/components/popular";
import TopRatedRow from "@/components/top-rated";


export default async function Home() {
  const nowPlaying = await getNowPlaying()

  return (
    <main className="min-h-screen bg-black">

    <div>
        {/* Hero Carousel */}
        <TrendingAllWeek />
          <div className="">
        <NowPlaying nowPlaying={nowPlaying.results} />


        {/* Popular Movies and TV  */}
          <PopularRow />


        {/* Top Rated Movies and TV */}
        <TopRatedRow />



        
          </div>
    </div>
    
    </main>
  );
}
