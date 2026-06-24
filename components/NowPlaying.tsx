"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface nowPlayingData {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface nowPlayingProps {
  nowPlaying: nowPlayingData[];
}

export default function MovieRow({ nowPlaying }: nowPlayingProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
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
      
      rowRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const rowEl = rowRef.current;
    if (rowEl) {
      rowEl.addEventListener("scroll", updateArrows);
      updateArrows();
    }
    return () => rowEl?.removeEventListener("scroll", updateArrows);
  }, [nowPlaying]);

  if (!nowPlaying || nowPlaying.length === 0) return null;

  return (
    <div className="space-y-4 relative group max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-visible">
      
      {/* Row Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide transition-colors duration-200 hover:text-amber-500 cursor-pointer inline-block">
        In Theatres
      </h2>

      {/* Row Container wrapper */}
      <div className="relative overflow-visible">
        
        {/* Modern Floating Circular Left Chevron */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-2 top-[40%] -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-slate-950/80 border border-slate-800 hover:border-amber-500 text-white z-50 rounded-full transition-all duration-300 flex items-center justify-center backdrop-blur-md shadow-lg shadow-black/50 hover:scale-110 active:scale-95 opacity-100 md:opacity-0 md:group-hover:opacity-100"
            /* 📱 RESPONSIVENESS TRIGGER: Removed `hidden md:flex` so it renders on mobile. 
               `opacity-100 md:opacity-0 md:group-hover:opacity-100` ensures it's instantly visible on mobile touchscreens, 
               but remains hidden on desktop until mouse hover. */
            aria-label="Scroll Left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-200 hover:text-amber-400 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}

        {/* Modern Floating Circular Right Chevron */}
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

        {/* Horizontal Card Scroller */}
        <div
          ref={rowRef}
          className="flex space-x-4 overflow-x-scroll scrollbar-none scroll-smooth pb-12 pt-4 overflow-visible"
        >
          {nowPlaying.map((movie, index) => (
          <Link key={movie.id} href={`/movie/${movie.id}`} className="flex space-x-5">
            <div
              
              className="flex-none w-[135px] sm:w-[175px] lg:w-[200px] aspect-[2/3] relative group/card overflow-visible"
            >
              
              {/* Dynamic Hover Card Inner Layout Container */}
              <div 
                className={`absolute inset-0 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-lg
                  md:group-hover/card:scale-125 md:group-hover/card:-translate-y-4 md:group-hover/card:z-40 
                  transition-all duration-300 ease-out md:group-hover/card:shadow-2xl md:group-hover/card:shadow-black/80 md:group-hover/card:border-slate-700
                  ${index === 0 ? 'origin-left' : index === nowPlaying.length - 1 ? 'origin-right' : 'origin-center'}
                `}
              >
                {/* Movie Poster Image Asset */}
                <div className="relative aspect-[2/3] w-full bg-slate-800 overflow-hidden">
                  {movie.poster_path ? (
                    <Image
                      src={`${posterBaseUrl}${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 640px) 135px, (max-width: 1024px) 175px, 200px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500 p-2 text-center">
                      {movie.title}
                    </div>
                  )}

                  {/* Micro Rating Indicator */}
                  <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold text-amber-500 flex items-center space-x-0.5 shadow transition-opacity duration-200 group-hover/card:opacity-0 md:group-hover/card:opacity-0">
                    <span>★</span>
                    <span>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
                  </div>
                </div>

                {/* Netflix Style Hover Disclosure Slate Info Layer */}
                <div className="p-3 space-y-2 max-h-0 opacity-0 md:group-hover/card:max-h-[120px] md:group-hover/card:opacity-100 transition-all duration-300 ease-in bg-slate-900 border-t border-slate-800/60">
                  {/* Action Micro Row */}
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

                  {/* Meta Specifics */}
                  <div className="flex items-center space-x-2 text-[10px] font-bold">
                    <span className="text-emerald-400">{(movie.vote_average * 10).toFixed(0)}% Match</span>
                    <span className="text-gray-400">{movie.release_date ? movie.release_date.split("-")[0] : "N/A"}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xs font-bold text-white truncate">
                    {movie.title}
                  </h3>
                </div>

              </div>
            </div>
          </Link>
          ))}
        </div>

      </div>

      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}