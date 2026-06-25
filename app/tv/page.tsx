"use client";

import { useState, useEffect, useRef } from "react";
import Card from "@/components/Card";
import { getPopularTVPage } from "@/services/tmdb";

interface TVItem {
  id: number;
  name: string; // FIX 1: TV items use 'name' instead of 'title'
  poster_path: string | null;
  vote_average: number;
}

export default function TVPage() {
  const [tvShows, setTvShows] = useState<TVItem[]>([]); // Cleaned up variable naming
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchTVShows() {
      if (loading) return;
      
      setLoading(true);
      try {
        const data = await getPopularTVPage(page);
        
        if (data.results && data.results.length > 0) {
          setTvShows((prev) => {
            const existingIds = new Set(prev.map((show) => show.id));
            const uniqueNew = data.results.filter((show: TVItem) => !existingIds.has(show.id));
            return [...prev, ...uniqueNew];
          });
          
          if (page >= data.total_pages) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Failed fetching paginated TV Shows:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTVShows();
  }, [page]);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { 
        rootMargin: "200px", 
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
          Discover TV
        </h1>

        {/* REUSABLE FLUID CARD GRID SECTION */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
          {tvShows.map((show, index) => (
            <Card
              key={`${show.id}-${index}`}
              id={show.id}
              title={show.name} // FIX 2: Swapped to .name so titles load correctly
              posterUrl={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              rating={show.vote_average}
              mediaType="tv" // FIX 3: Changed from "movie" to "tv" so card subtext calculates right
            />
          ))}
        </div>

        {/* LOADING INDICATORS STATUS PANEL */}
        <div className="w-full flex justify-center py-12 mt-4">
          {loading && (
            <div className="flex items-center space-x-2 text-sm text-neutral-400">
              <div className="w-5 h-5 border-2 border-t-amber-500 border-slate-700 rounded-full animate-spin"></div>
              <span>Loading more shows...</span>
            </div>
          )}
          {!hasMore && !loading && (
            <p className="text-sm text-neutral-500 font-medium">
              You've reached the end of the line! 🎉
            </p>
          )}
        </div>

        <div ref={loadMoreRef} className="h-2 w-full invisible" aria-hidden="true" />
      </main>
    </div>
  );
}