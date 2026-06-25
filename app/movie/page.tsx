"use client";

import { useState, useEffect, useRef } from "react";
import Card from "@/components/Card";
import { getPopularMovies } from "@/services/tmdb";

interface MovieItem {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  // media_type?: string;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Ref element positioned at the absolute bottom to watch for scroll triggers safely
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Fetch items from TMDB whenever the active page changes
  useEffect(() => {
    async function fetchMovies() {
      // FIX 1: Guard against duplicate requests if already loading
      if (loading) return;
      
      setLoading(true);
      try {
        // FIX 2: You MUST pass the stateful 'page' variable to your helper service function
        const data = await getPopularMovies(page);
        
        if (data.results && data.results.length > 0) {
          setMovies((prev) => {
            // FIX 3: Filter out any duplicates to prevent duplicate key component crashes
            const existingIds = new Set(prev.map((m) => m.id));
            const uniqueNew = data.results.filter((m: MovieItem) => !existingIds.has(m.id));
            return [...prev, ...uniqueNew];
          });
          
          // Check if we hit total max pages ceiling 
          if (page >= data.total_pages) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Failed fetching paginated movies:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [page]);

  // Set up the Intersection Observer to auto-increment the page count
  useEffect(() => {
    // FIX 4: Explicitly break out if we are currently loading to avoid firing multiple page increments
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { 
        rootMargin: "200px", // Starts loading next page 200px before user hits absolute bottom
        threshold: 0.1 
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold tracking-wide text-white mb-8">
          Discover Movies
        </h1>

        {/* REUSABLE FLUID CARD GRID SECTION */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
          {movies.map((movie, index) => (
            <Card
              key={`${movie.id}-${index}`}
              id={movie.id}
              title={movie.title}
              posterUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              rating={movie.vote_average}
              mediaType="movie"
            />
          ))}
        </div>

        {/* LOADING INDICATORS STATUS PANEL */}
        <div className="w-full flex justify-center py-12 mt-4">
          {loading && (
            <div className="flex items-center space-x-2 text-sm text-neutral-400">
              <div className="w-5 h-5 border-2 border-t-amber-500 border-slate-700 rounded-full animate-spin"></div>
              <span>Loading more movies...</span>
            </div>
          )}
          {!hasMore && !loading && (
            <p className="text-sm text-neutral-500 font-medium">
              You've reached the end of the line! 🎉
            </p>
          )}
        </div>

        {/* FIX 5: Separate, clean invisible observer anchor div below status elements */}
        <div ref={loadMoreRef} className="h-2 w-full invisible" aria-hidden="true" />
      </main>
    </div>
  );
}