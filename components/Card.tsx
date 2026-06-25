"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface CardProps {
  id: string | number;
  title: string;
  posterUrl: string;
  rating: number;
  mediaType?: string; // Made dynamic to accept 'movie' or 'tv'
}

export default function Card({ id, title, posterUrl, rating, mediaType = "movie" }: CardProps) {
  return (
    <Link href={`/${mediaType}/${id}`} className="flex flex-col space-y-2 group/item w-full">
      {/* Aspect Ratio Box Container */}
      <div className="w-full aspect-[2/3] relative group/card overflow-visible">
        
        {/* Dynamic Inner Layout Container (White Border on Hover) */}
        <div className="absolute inset-0 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-lg md:group-hover/card:z-40 md:group-hover/card:border-white transition-all duration-300 ease-out md:group-hover/card:shadow-2xl md:group-hover/card:shadow-black/80 origin-center">
          
          {/* Movie Poster Image Asset */}
          <div className="relative aspect-[2/3] w-full bg-slate-800 overflow-hidden">
            {posterUrl && !posterUrl.endsWith("null") ? (
              <Image
                src={posterUrl}
                alt={title}
                fill
                sizes="(max-width: 640px) 135px, (max-width: 1024px) 175px, 200px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500 p-2 text-center">
                {title}
              </div>
            )}

            {/* Micro Rating Indicator */}
            <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold text-amber-500 flex items-center space-x-0.5 shadow transition-opacity duration-200 group-hover/card:opacity-0">
              <span>★</span>
              <span>{rating ? rating.toFixed(1) : "N/A"}</span>
            </div>
          </div>

          {/* Netflix Style Hover Disclosure Info Layer */}
          <div className="p-3 space-y-2 max-h-0 opacity-0 md:group-hover/card:max-h-[120px] md:group-hover/card:opacity-100 transition-all duration-300 ease-in bg-slate-900 border-t border-slate-800/60">
            {/* Action Micro Row */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button className="bg-white text-black p-1.5 rounded-full hover:bg-gray-200 transition shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <button className="border border-slate-500 text-white p-1.5 rounded-full hover:border-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
              <span className="text-[10px] bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-gray-300 font-medium">HD</span>
            </div>

            {/* Meta Specifics */}
            <div className="flex items-center space-x-2 text-[10px] font-bold">
              <span className="text-emerald-400">{(rating * 10).toFixed(0)}% Match</span>
            </div>

            {/* Title */}
            <h3 className="text-xs font-bold text-white truncate">
              {title}
            </h3>
          </div>

        </div>
      </div>

      {/* STATIC CARD METADATA BLOCK */}
      <div className="px-1 pt-1 w-full transition-opacity duration-200 group-hover/card:opacity-0">
        <h3 className="text-sm font-bold text-neutral-100 truncate group-hover/item:text-amber-500 transition-colors">
          {title}
        </h3>
        <div className="flex items-center space-x-1.5 text-xs text-neutral-500 font-medium mt-0.5">
          <span className="capitalize">{mediaType === "tv" ? "TV Show" : "Movie"}</span>
        </div>
      </div>
    </Link>
  );
}