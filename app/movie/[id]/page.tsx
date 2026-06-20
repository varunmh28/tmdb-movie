// app/movie/[id]/page.tsx

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getDiscoverMovies } from "@/services/tmdb";

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params;

 // 1. Fetch the complete discovered data object
 const discoverData = await getDiscoverMovies();

 // 2. Extract the array from the .results property, default to an empty array fallback
 const discoverList = discoverData?.results || [];

 // 3. Match the number from the URL against your array objects
 const movieDiscover = discoverList.find((movie: MovieDetails) => movie.id === Number(id));

  // 3. Fallback state safety handler if matching item isn't located
  if (!movieDiscover) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p>Movie asset not found in discovery bank.</p>
      </div>
    );
  }

  const backdropUrl = movieDiscover.backdrop_path ? `https://image.tmdb.org/t/p/original${movieDiscover.backdrop_path}` : null;
  const posterUrl = movieDiscover.poster_path ? `https://image.tmdb.org/t/p/w500${movieDiscover.poster_path}` : null;
  const releaseYear = movieDiscover.release_date ? movieDiscover.release_date.split("-")[0] : "N/A";

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
          {/* Smooth dark vignette blend */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-neutral-950/20" />
        </div>
      )}

      {/* Main Content Layout Frame */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        
        {/* Back Navigation Button */}
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 text-sm text-neutral-400 hover:text-white transitionmb-8 group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back</span>
        </Link>

        {/* Structural Two Column Detail Presenter */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mt-[25vh] items-start">
          
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
          <div className="space-y-6 max-w-3xl self-end md:pb-4">
            
            {/* 3. TITLE */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              {movieDiscover.title}
            </h1>

            {/* Meta Stats Row (4. DATE OF RELEASE & 5. RATING) */}
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

            {/* 6. OVERVIEW */}
            <div className="space-y-2 pt-2">
              <p className="text-neutral-300 text-sm sm:text-base lg:text-lg leading-relaxed font-normal max-w-2xl">
                {movieDiscover.overview || "No overview documentation has been provided for this film asset dynamic row container."}
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}