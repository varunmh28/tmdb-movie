// app/movie/[id]/page.tsx

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllMovies, getMovieCredits} from "@/services/tmdb";

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch both datasets concurrently on the server
  const [movieDiscover, creditsData] = await Promise.all([
    getAllMovies(id),
    getMovieCredits(id),
  ]);

  if (!movieDiscover || !movieDiscover.title) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p>Movie asset not found.</p>
      </div>
    );
  }

  const backdropUrl = movieDiscover.backdrop_path ? `https://image.tmdb.org/t/p/original${movieDiscover.backdrop_path}` : null;
  const posterUrl = movieDiscover.poster_path ? `https://image.tmdb.org/t/p/w500${movieDiscover.poster_path}` : null;
  const releaseYear = movieDiscover.release_date ? movieDiscover.release_date.split("-")[0] : "N/A";
  
  // Grab up to 30 actors to make full use of the new wide bottom layout
  const cast: CastMember[] = creditsData.cast || [];

  // Placeholder variables ready for future integration
  const runtime = "Placeholder (e.g., 120 min)";
  const releaseFullDate = movieDiscover.release_date || "Placeholder Date";
  const director = creditsData.crew
  ? creditsData.crew
      .filter((member: { job: string }) => member.job === "Director")
      .map((d: { name: string }) => d.name)
      .join(", ") || "Unknown Director"
  : "Unknown Director";
  const streamingOn = "Placeholder Platform";

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
          
          {/* 2. MOVIE POSTER */}
          {posterUrl && (
            <div className="w-[180px] sm:w-[260px] md:w-[280px] lg:w-[300px] flex-none rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-neutral-800/50">
              <Image
                src={posterUrl}
                alt={movieDiscover.title}
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
              {movieDiscover.title}
            </h1>

            {/* Meta Stats Row */}
            <div className="flex items-center space-x-4 text-sm font-semibold text-neutral-300">
              <span className="text-neutral-100 bg-neutral-800 border border-neutral-700/60 px-2.5 py-0.5 rounded shadow-sm">
                {releaseYear}
              </span>
              {movieDiscover.vote_average > 0 && (
                <div className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded text-amber-500">
                  <span className="text-xs">★</span>
                  <span>{movieDiscover.vote_average.toFixed(1)} / 10</span>
                </div>
              )}
            </div>

            {/* Two-Column Area containing Overview text next to the Metadata info box */}
            <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
              
              {/* Left Column: Overview Block */}
              <div className="flex-1 space-y-2">
                <h2 className="text-lg font-bold text-neutral-200">Overview</h2>
                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-normal">
                  {movieDiscover.overview || "No overview documentation has been provided for this film asset."}
                </p>
              </div>

              {/* Right Column: Metadata Box Sidebar widget */}
              <div className="w-full lg:w-72 bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-3 shadow-lg backdrop-blur-sm flex-none">
                <div>
                  <span className="text-xs text-neutral-500 block uppercase tracking-wider font-semibold">Runtime</span>
                  <span className="text-sm text-neutral-200 font-medium">{runtime}</span>
                </div>
                <div className="border-t border-neutral-800/60 pt-2">
                  <span className="text-xs text-neutral-500 block uppercase tracking-wider font-semibold">Release Date</span>
                  <span className="text-sm text-neutral-200 font-medium">{releaseFullDate}</span>
                </div>
                <div className="border-t border-neutral-800/60 pt-2">
                  <span className="text-xs text-neutral-500 block uppercase tracking-wider font-semibold">Director</span>
                  <span className="text-sm text-neutral-200 font-medium">{director}</span>
                </div>
                <div className="border-t border-neutral-800/60 pt-2">
                  <span className="text-xs text-neutral-500 block uppercase tracking-wider font-semibold">Streaming On</span>
                  <span className="text-sm text-amber-500 font-medium">{streamingOn}</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 3. FULL WIDTH CAST ROWS SECTION (Now entirely below the top structure layout block) */}
        {cast.length > 0 && (
          <div className="pt-10 mt-12 border-t border-neutral-900 w-full overflow-hidden">
            <h2 className="text-xl font-bold text-white mb-6 tracking-wide">Cast</h2>
            
            {/* Extended Horizontal Scrollable Container Rail */}
            <div className="flex space-x-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:h-1.5 
  [&::-webkit-scrollbar-track]:bg-neutral-900/40 
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-white 
  [&::-webkit-scrollbar-thumb]:rounded-full 
  hover:[&::-webkit-scrollbar-thumb]:bg-neutral-200 
  transition-colors">
              {cast.slice(0, 25).map((actor) => (
                <div key={actor.id} className="flex flex-col items-center text-center space-y-2 w-28 flex-none group">
                  
                  {/* Round Profile Image Wrapper */}
                  <div className="w-30 h-30 rounded-full overflow-hidden relative border border-neutral-800 shadow-md bg-neutral-900 group-hover:border-neutral-700 transition duration-200">
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

                  {/* Name Layout Labels */}
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

      </div>
    </div>
  );
}