// app/tv/[id]/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllTV, getTVCredits, getTVRecommendations } from "@/services/tmdb";

interface CreatorItem {
  id: number;
  name: string;
  profile_path: string | null;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface RecommendationItem {
  id: number;
  name: string; // TMDB TV endpoint returns 'name'
  poster_path: string | null;
  first_air_date?: string; // TMDB TV endpoint returns 'first_air_date'
  vote_average: number;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TVDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch all TV datasets concurrently on the server
  const [tvDiscover, creditsData, recommendationsData] = await Promise.all([
    getAllTV(id),
    getTVCredits(id),
    getTVRecommendations(id),
  ]);

  if (!tvDiscover || !tvDiscover.name) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p>TV asset not found.</p>
      </div>
    );
  }

  const backdropUrl = tvDiscover.backdrop_path ? `https://image.tmdb.org/t/p/original${tvDiscover.backdrop_path}` : null;
  const posterUrl = tvDiscover.poster_path ? `https://image.tmdb.org/t/p/w500${tvDiscover.poster_path}` : null;
  const releaseYear = tvDiscover.first_air_date ? tvDiscover.first_air_date.split("-")[0] : "N/A";
  
  const cast: CastMember[] = creditsData.cast || [];
  const recommendations: RecommendationItem[] = recommendationsData?.results || recommendationsData || [];

  // TMDB TV returns episode_run_time as an array of runtimes
  const runtime = tvDiscover.episode_run_time && tvDiscover.episode_run_time.length > 0 
    ? tvDiscover.episode_run_time[0] 
    : "N/A";
    
  const releaseFullDate = tvDiscover.first_air_date || "N/A";

  // TMDB TV uses created_by instead of crew/Director
  const creators = tvDiscover.created_by
    ? tvDiscover.created_by.map((c: CreatorItem) => c.name).join(", ") || "Unknown Creator"
    : "Unknown Creator";

  const totalSeasons = tvDiscover.number_of_seasons || "N/A";
  const totalEpisodes = tvDiscover.number_of_episodes || "N/A";

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-x-hidden font-sans">
      
      {/* 1. BACKDROP PATH IMAGE IN BACKGROUND */}
      {backdropUrl && (
        <div className="absolute inset-0 h-[70vh] w-full select-none z-0">
          <Image
            src={backdropUrl}
            alt=""
            fill
            className="object-cover opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-neutral-950/20" />
        </div>
      )}

      {/* Main Content Layout Frame */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        
        {/* Back Navigation Button */}
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 text-sm text-neutral-400 hover:text-white transition mb-8 group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back</span>
        </Link>

        {/* Structural Two Column Detail Presenter */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mt-[20vh] items-start">
          
          {/* 2. TV POSTER */}
          {posterUrl && (
            <div className="w-[180px] sm:w-[260px] md:w-[280px] lg:w-[300px] flex-none rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-neutral-800/50">
              <Image
                src={posterUrl}
                alt={tvDiscover.name}
                width={300}
                height={450}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          )}

          {/* Core Content Info Block */}
          <div className="space-y-6 flex-1 w-full">
            
            {/* 3. TITLE */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              {tvDiscover.name}
            </h1>

            {/* Meta Stats Row */}
            <div className="flex items-center space-x-4 text-sm font-semibold text-neutral-300">
              <span className="text-neutral-100 bg-neutral-800 border border-neutral-700/60 px-2.5 py-0.5 rounded shadow-sm">
                {releaseYear}
              </span>
              {tvDiscover.vote_average > 0 && (
                <div className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded text-amber-500">
                  <span className="text-xs">★</span>
                  <span>{tvDiscover.vote_average.toFixed(1)} / 10</span>
                </div>
              )}
            </div>

            {/* Two-Column Area containing Overview text next to the Metadata info box */}
            <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
              
              {/* Left Column: Overview Block */}
              <div className="flex-1 space-y-2">
                <h2 className="text-lg font-bold text-neutral-200">Overview</h2>
                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-normal">
                  {tvDiscover.overview || "No overview documentation has been provided for this series."}
                </p>
              </div>

              {/* Right Column: Metadata Box Sidebar widget */}
              <div className="w-full lg:w-72 bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-3 shadow-lg backdrop-blur-sm flex-none">
                <div>
                  <span className="text-xs text-neutral-500 block uppercase tracking-wider font-semibold">Status</span>
                  <span className="text-sm text-neutral-200 font-medium">
                    {tvDiscover.status}
                  </span>
                </div>
                <div className="border-t border-neutral-800/60 pt-2">
                  <span className="text-xs text-neutral-500 block uppercase tracking-wider font-semibold">First Air Date</span>
                  <span className="text-sm text-neutral-200 font-medium">{releaseFullDate}</span>
                </div>
                <div className="border-t border-neutral-800/60 pt-2">
                  <span className="text-xs text-neutral-500 block uppercase tracking-wider font-semibold">Creator</span>
                  <span className="text-sm text-neutral-200 font-medium">{creators}</span>
                </div>
                <div className="border-t border-neutral-800/60 pt-2">
                  <span className="text-xs text-neutral-500 block uppercase tracking-wider font-semibold">Seasons & Episodes</span>
                  <span className="text-sm text-amber-500 font-medium flex items-center space-x-2">
                    <span>{totalSeasons} Seasons</span>
                    <span className="text-neutral-700">•</span>
                    <span>{totalEpisodes} Episodes</span>
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 3. FULL WIDTH CAST ROWS SECTION */}
        {cast.length > 0 && (
          <div className="pt-10 mt-12 border-t border-neutral-900 w-full overflow-hidden">
            <h2 className="text-xl font-bold text-white mb-6 tracking-wide">Cast</h2>
            
            <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8
              [&::-webkit-scrollbar]:h-1.5 
              [&::-webkit-scrollbar-track]:bg-neutral-900/40 
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-white 
              [&::-webkit-scrollbar-thumb]:rounded-full 
              hover:[&::-webkit-scrollbar-thumb]:bg-neutral-200 
              transition-colors"
            >
              {cast.slice(0, 25).map((actor) => (
                <div key={actor.id} className="flex flex-col items-center text-center space-y-2 w-32 flex-none group">
                  
                  <div className="w-32 h-32 rounded-full overflow-hidden relative border border-neutral-800 shadow-md bg-neutral-900 group-hover:border-neutral-700 transition duration-200 flex items-center justify-center">
                    {actor.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        fill
                        className="object-cover object-top scale-100 group-hover:scale-105 transition duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-600 bg-neutral-900">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5 px-1">
                    <p className="text-sm font-medium text-neutral-200 line-clamp-1 group-hover:text-white transition">
                      {actor.name}
                    </p>
                    <p className="text-xs text-neutral-500 line-clamp-1 font-normal">
                      {actor.character}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. RECOMMENDATIONS GRID SECTION */}
        {recommendations.length > 0 && (
          <div className="pt-10 mt-12 border-t border-neutral-900 w-full">
            <h2 className="text-xl font-bold text-white mb-6 tracking-wide">More Like This</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {recommendations.slice(0, 12).map((item) => {
                const recYear = item.first_air_date ? item.first_air_date.split("-")[0] : "N/A";
                
                return (
                  <Link 
                    key={item.id} 
                    href={`/tv/${item.id}`} // Corrected standard TV show profile routing
                    className="flex flex-col space-y-2 group bg-neutral-900/40 p-2 rounded-xl border border-neutral-900 hover:border-neutral-800 transition duration-200"
                  >
                    <div className="aspect-[2/3] w-full relative bg-neutral-900 rounded-lg overflow-hidden shadow-inner border border-neutral-800/40">
                      {item.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
                          className="object-cover group-hover:scale-[1.02] transition duration-300 ease-out"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-500 p-2 text-center">
                          {item.name}
                        </div>
                      )}
                      
                      {item.vote_average > 0 && (
                        <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-500 flex items-center space-x-0.5 shadow">
                          <span>★</span>
                          <span>{item.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <div className="px-1 min-w-0">
                      <h3 className="text-sm font-bold text-neutral-200 truncate group-hover:text-amber-500 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5 font-medium">{recYear}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}