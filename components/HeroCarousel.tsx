"use client";

import React from "react";
// Swiper React components & required modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";

// Define TypeScript layout for TMDB properties
interface trendingAllData {
  id: string;
  title?: string;
  name?: string;       // FIXED: TMDB uses 'name' for TV items
  media_type?: string; 
  backdrop_path: string;
  overview: string;
  release_date?: string;
  first_air_date?: string; // FIXED: TMDB uses 'first_air_date' for TV items
  vote_average: number;
}

interface trendingAllProps {
  trending: trendingAllData[];
}


export default function HeroCarousel({ trending }: trendingAllProps) {

  if (!trending || trending.length === 0) {
    return (
      <div className="w-full h-[55vh] sm:h-[70vh] lg:h-[85vh] bg-slate-950 flex items-center justify-center text-slate-500">
        No trending content available.
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-950">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="h-[55vh] sm:h-[70vh] lg:h-[85vh] w-full" 
      >
        {trending.map((data) => {
          // FIXED: Appends TMDB CDN path so background images don't 404
          const backdropUrl = data.backdrop_path 
            ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
            : "";

          // FIXED: Handles dates safely for both movies and TV shows to extract just the year
          const rawDate = data.release_date || data.first_air_date || "";
          const releaseYear = rawDate ? rawDate.split("-")[0] : "N/A";

          return (
            <SwiperSlide key={data.id} className="relative w-full h-full">
              
              {/* Slide Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${backdropUrl})` }}
              />

              {/* Cinematic Overlay Gradients */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

              {/* Slide Content Container */}
              <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20 lg:pb-24 z-10">
                <div className="max-w-2xl space-y-4">
                  
                  {/* Meta Badge (Rating & Year) */}
                  <div className="flex items-center space-x-3 text-xs sm:text-sm font-medium">
                    <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-bold">
                      ★ {data.vote_average ? data.vote_average.toFixed(1) : "0.0"}
                    </span>
                    {/* <span className="text-gray-300">{releaseYear}</span> */}
                    <span className="text-gray-300">{data.media_type?.toUpperCase()}</span>
                  </div>

                  {/* Movie/TV Title */}
                  <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                    {/* FIXED: Falls back gracefully if property is 'name' instead of 'title' */}
                    {data.title || data.name}
                  </h1>

                  {/* Movie Overview */}
                  <p className="hidden sm:line-clamp-3 text-sm lg:text-base text-gray-300 max-w-xl">
                    {data.overview}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4 pt-2">
                    <button className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded transition duration-200 text-sm sm:text-base">
                    ▶ Play Now 
                    </button>
                    <button className="flex-1 sm:flex-none bg-slate-800/80 hover:bg-slate-700 text-white font-semibold px-6 py-2.5 rounded border border-slate-700 transition duration-200 text-sm sm:text-base backdrop-blur-sm">
                     <Link href= {`/${data.media_type}/${data.id}`}> More Info </Link>
                    </button>
                  </div>

                </div>
              </div>

            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Global Swiper Pagination Override styling */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: #94a3b8 !important;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          background: #f59e0b !important;
          opacity: 1;
          width: 24px !important;
          border-radius: 4px !important;
          transition: all 0.3s ease;
        }
        .swiper-pagination {
          bottom: 15px !important;
        }
      `}</style>
    </div>
  );
}