import HeroCarousel from "@/components/HeroCarousel";
import { getTrendingAllWeek } from "@/services/tmdb";


export default async function trendingAllWeek() {
  try {
    const trending = await getTrendingAllWeek();
    return <HeroCarousel trending={trending.results} />;
  } catch (error) {
    // Log the error to your server console so you can fix your token
    console.error("Failed to load hero banner:", error);
    
    // Return nothing so the user just sees the rest of the website smoothly
    return null; 
  }
  


}