"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPopularMovieshome, getPopularTV } from "@/services/tmdb";

interface nowPlayingData {
  id: string;
  title?: string;      // Optional because TV shows use name
  name?: string;       // Added for TV shows
  poster_path: string | null;
  release_date?: string; // Optional because TV shows use first_air_date
  first_air_date?: string; // Added for TV shows
  vote_average: number;
  media_type?: string; 
}

export default function MovieRow() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const [nowPlaying, setNowPlaying] = useState<nowPlayingData[]>([]);
  const [activeType, setActiveType] = useState<"movie" | "tv">("movie");
  const [isLoading, setIsLoading] = useState(true);

  const posterBaseUrl = "https://image.tmdb.org/t/p/w500"; 

  const updateArrows = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    async function loadRowData() {
      setIsLoading(true);
      try {
        const data = activeType === "movie" 
          ? await getPopularMovieshome() 
          : await getPopularTV();
        
        const items = data?.results || data; 
        setNowPlaying(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error("Failed to fetch row data:", error);
        setNowPlaying([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadRowData();
  }, [activeType]);

  useEffect(() => {
    const rowEl = rowRef.current;
    if (rowEl) {
      rowEl.addEventListener("scroll", updateArrows);
      updateArrows();
    }
    return () => rowEl?.removeEventListener("scroll", updateArrows);
  }, [nowPlaying]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 h-48 flex items-center justify-center text-neutral-500 animate-pulse">
        Loading catalog items...
      </div>
    );
  }

  if (!nowPlaying || nowPlaying.length === 0) return null;

  return (
    <div className="space-y-4 relative group max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-visible">
      
      {/* Header Container */}
      <div className="flex items-center space-x-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide transition-colors duration-200 hover:text-amber-500 cursor-pointer inline-block">
          Popular
        </h2>

        {/* Toggle Switch */}
        <div className="relative flex items-center bg-slate-950/60 border border-slate-800 rounded-full p-1 h-9 w-40 select-none backdrop-blur-sm shadow-inner">
          <div 
            className={`absolute top-[3px] bottom-[3px] left-[3px] w-[76px] rounded-full bg-slate-900 border border-slate-700/50 shadow transition-all duration-300 ease-out ${
              activeType === "tv" ? "translate-x-[78px]" : "translate-x-0"
            }`}
          />
          
          <button
            onClick={() => setActiveType("movie")}
            className={`relative z-10 flex-1 text-center text-xs font-bold tracking-wide rounded-full py-1 transition-colors duration-200 ${
              activeType === "movie" ? "text-emerald-400 font-extrabold" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Movies
          </button>

          <button
            onClick={() => setActiveType("tv")}
            className={`relative z-10 flex-1 text-center text-xs font-bold tracking-wide rounded-full py-1 transition-colors duration-200 ${
              activeType === "tv" ? "text-emerald-400 font-extrabold" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            TV
          </button>
        </div>
      </div>

      {/* Row Container wrapper */}
      <div className="relative overflow-visible">
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-2 top-[40%] -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-slate-950/80 border border-slate-800 hover:border-amber-500 text-white z-50 rounded-full transition-all duration-300 flex items-center justify-center backdrop-blur-md shadow-lg shadow-black/50 hover:scale-110 active:scale-95 opacity-100 md:opacity-0 md:group-hover:opacity-100"
            aria-label="Scroll Left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-200 hover:text-amber-400 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-2 top-[40%] -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-slate-950/80 border border-slate-800 hover:border-amber-500 text-white z-50 rounded-full transition-all duration-300 flex items-center justify-center backdrop-blur-md shadow-lg shadow-black/50 hover:scale-110 active:scale-95 opacity-100 md:opacity-0 md:group-hover:opacity-100"
            aria-label="Scroll Right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-200 hover:text-amber-400 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}

        <div
          ref={rowRef}
          className="flex space-x-4 overflow-x-scroll scrollbar-none scroll-smooth pb-12 pt-4 overflow-visible"
        >
          {nowPlaying.map((item, index) => {
            // DYNAMIC FALLBACK VARIABLES FOR MOVIE VS TV 
            const displayTitle = item.title || item.name || "Untitled";
            const rawDate = item.release_date || item.first_air_date;
            const displayYear = rawDate ? rawDate.split("-")[0] : "N/A";

            return (
              <Link key={item.id} href={`/movie/${item.id}`} className="flex flex-col space-y-2 group/item">
                <div className="flex-none w-[135px] sm:w-[175px] lg:w-[200px] aspect-[2/3] relative group/card overflow-visible">
                  <div 
                    className={`absolute inset-0 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-lg
                      md:group-hover/card:z-40 md:group-hover/card:border-white
                      transition-all duration-300 ease-out md:group-hover/card:shadow-2xl md:group-hover/card:shadow-black/80
                      ${index === 0 ? 'origin-left' : index === nowPlaying.length - 1 ? 'origin-right' : 'origin-center'}
                    `}
                  >
                    <div className="relative aspect-[2/3] w-full bg-slate-800 overflow-hidden">
                      {item.poster_path ? (
                        <Image
                          src={`${posterBaseUrl}${item.poster_path}`}
                          alt={displayTitle}
                          fill
                          sizes="(max-width: 640px) 135px, (max-width: 1024px) 175px, 200px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500 p-2 text-center">
                          {displayTitle}
                        </div>
                      )}

                      <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold text-amber-500 flex items-center space-x-0.5 shadow transition-opacity duration-200 group-hover/card:opacity-0 md:group-hover/card:opacity-0">
                        <span>★</span>
                        <span>{item.vote_average ? item.vote_average.toFixed(1) : "N/A"}</span>
                      </div>
                    </div>

                    {/* Hover Card Content */}
                    <div className="p-3 space-y-2 max-h-0 opacity-0 md:group-hover/card:max-h-[120px] md:group-hover/card:opacity-100 transition-all duration-300 ease-in bg-slate-900 border-t border-slate-800/60">
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <button className="bg-white text-black p-1.5 rounded-full hover:bg-gray-200 transition shadow">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3"><path d="M8 5v14l11-7z"/></svg>
                          </button>
                          <button className="border border-slate-500 text-white p-1.5 rounded-full hover:border-white transition">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                          </button>
                        </div>
                        <span className="text-[10px] bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-gray-300 font-medium">HD</span>
                      </div>

                      <div className="flex items-center space-x-2 text-[10px] font-bold">
                        <span className="text-emerald-400">{(item.vote_average * 10).toFixed(0)}% Match</span>
                        <span className="text-gray-400">{displayYear}</span>
                      </div>

                      <h3 className="text-xs font-bold text-white truncate">{displayTitle}</h3>
                    </div>
                  </div>
                </div>

                {/* Static Card Labels */}
                <div className="px-1 pt-1 w-[135px] sm:w-[175px] lg:w-[200px] transition-opacity duration-200 group-hover/card:opacity-0">
                  <h3 className="text-sm font-bold text-neutral-100 truncate group-hover/item:text-amber-500 transition-colors">
                    {displayTitle}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs text-neutral-500 font-medium mt-0.5">
                    <span className="capitalize">{item.media_type || (activeType === "movie" ? "Movie" : "TV Show")}</span>
                    <span>•</span>
                    <span>{displayYear}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}