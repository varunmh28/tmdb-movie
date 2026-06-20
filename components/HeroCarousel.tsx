"use client";

import React from "react";
// Swiper React components & required modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
 import "swiper/css/navigation"; // Handled by Tailwind layer context usually, or imported directly
import "swiper/css/pagination";

// Dummy TMDB Data structure for testing
const mockTrending = [
  {
    id: 1,
    title: "Dune: Part Two",
    backdrop_path: "https://image.tmdb.org/t/p/original/xOMo8wZ8PTe2K8wY6gXm6Z689I0.jpg", // Replace with TMDB paths later
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
    release_date: "2024",
    vote_average: 8.3,
  },
  {
    id: 2,
    title: "Oppenheimer",
    backdrop_path: "https://image.tmdb.org/t/p/original/fm6m0XZYfrO12v6Rgg96EDasv2K.jpg",
    overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    release_date: "2023",
    vote_average: 8.1,
  },
];

export default function HeroCarousel() {
  return (
    <div className="w-full bg-slate-950">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="h-[55vh] sm:h-[70vh] lg:h-[85vh] w-full" 
        /* 📱 RESPONSIVENESS TRIGGER: Adjusts the overall height of the hero banner based on device size.
           - Mobile: 55% of viewport height (h-[55vh])
           - Tablet (sm): 70% of viewport height (sm:h-[70vh])
           - Desktop (lg): 85% of viewport height (lg:h-[85vh]) */
      >
        {mockTrending.map((movie) => (
          <SwiperSlide key={movie.id} className="relative w-full h-full">
            
            {/* Slide Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${movie.backdrop_path})` }}
            />

            {/* Cinematic Overlay Gradients */}
            {/* Left fade for text legibility, Bottom fade to blend seamlessly into your page content */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

            {/* Slide Content Container */}
            <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20 lg:pb-24 z-10">
              <div className="max-w-2xl space-y-4">
                
                {/* Meta Badge (Rating & Year) */}
                <div className="flex items-center space-x-3 text-xs sm:text-sm font-medium">
                  {/* 📱 RESPONSIVENESS TRIGGER: text-xs on mobile scales up to text-sm on tablets/desktops */}
                  <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-bold">
                    ★ {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-gray-300">{movie.release_date}</span>
                </div>

                {/* Movie Title */}
                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                  {/* 📱 RESPONSIVENESS TRIGGER: Dramatic text scaling 
                     - Mobile: 2xl | Tablet: 4xl | Desktop: 6xl */}
                  {movie.title}
                </h1>

                {/* Movie Overview (Hidden on small mobile screens to prevent layout clutter) */}
                <p className="hidden sm:line-clamp-3 text-sm lg:text-base text-gray-300 max-w-xl">
                  {/* 📱 RESPONSIVENESS TRIGGER: 
                     - `hidden`: Hidden on small mobile screens because the backdrop image space is restricted.
                     - `sm:line-clamp-3`: Visible starting at tablet size, capping text at 3 lines cleanly. */}
                  {movie.overview}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4 pt-2">
                  <button className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded transition duration-200 text-sm sm:text-base">
                    {/* 📱 RESPONSIVENESS TRIGGER: `flex-1 sm:flex-none` 
                       - On mobile, buttons stretch to fill width making them easier to tap.
                       - On tablets/desktops, they collapse back to normal layout boundaries. */}
                    Play Trailer
                  </button>
                  <button className="flex-1 sm:flex-none bg-slate-800/80 hover:bg-slate-700 text-white font-semibold px-6 py-2.5 rounded border border-slate-700 transition duration-200 text-sm sm:text-base backdrop-blur-sm">
                    More Info
                  </button>
                </div>

              </div>
            </div>

          </SwiperSlide>
        ))}
      </Swiper>

      {/* Global Swiper Pagination Override styling */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: #94a3b8 !important; /* slate-400 */
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          background: #f59e0b !important; /* amber-500 */
          opacity: 1;
          width: 24px !important; /* Stretches the active dot for a sleek look */
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