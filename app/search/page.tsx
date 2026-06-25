"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/Card";
import { getSearchMulti } from "@/services/tmdb";

interface SearchItem {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      router.replace("/search");
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setLoading(true);

    debounceTimer.current = setTimeout(async () => {
      try {
        router.replace(`/search?q=${encodeURIComponent(query)}`);
        
        const data = await getSearchMulti(query);
        if (data.results) {
          const filtered = data.results.filter(
            (item: SearchItem) => item.media_type === "movie" || item.media_type === "tv"
          );
          setResults(filtered);
        }
      } catch (err) {
        console.error("Search execution failed:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, router]);

  return (
    <div style={{ paddingTop: '20px', paddingLeft: '40px', minHeight: '100vh', backgroundColor: '#020617', color: 'white' }}>
      <div style={{ marginBottom: '40px' }}>
        <input 
          type="text" 
          placeholder="What do you want to watch?" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '600px',
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '18px',
            outline: 'none'
          }}
        />
      </div>

      {/* Results Section Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* Dynamic Context Header */}
        {query.trim() && !loading && results.length > 0 && (
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-900">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
              Search Results
            </h2>
            <p className="text-sm text-zinc-400">
              Found {results.length} matches for <span className="text-indigo-400 font-medium">"{query}"</span>
            </p>
          </div>
        )}

        {/* Media Grid with responsive gaps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10 auto-rows-max">
          {results.map((item) => (
            <div key={item.id} className="transition-transform duration-300 hover:-translate-y-1.5">
              <Card
                id={item.id}
                title={item.media_type === "movie" ? (item.title || "") : (item.name || "")}
                posterUrl={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                rating={item.vote_average}
                mediaType={item.media_type}
              />
            </div>
          ))}
        </div>

        {/* Empty States View */}
        {query.trim() && !loading && results.length === 0 && (
          <div className="text-center py-24 max-w-sm mx-auto flex flex-col items-center">
            <div className="p-4 bg-zinc-900/50 rounded-full border border-zinc-800 mb-4 text-zinc-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="font-semibold text-zinc-300 text-base mb-1">No matches found</p>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We couldn't find anything matching your term. Check your spelling or try searching for another title.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}