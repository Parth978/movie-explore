import { useState, useMemo, useEffect, useCallback } from "react";
import { MovieCard } from "../components/MovieCard";
import { SearchBar } from "../components/SearchBar";
import { FilterBar } from "../components/FilterBar";
import { apiClient } from "../api/client";
import type { Movie, Genre } from "../types";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<"title" | "genre" | "actor" | "director" | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const response = await apiClient.get("/genres/");
        setGenres(response.data);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };
    loadGenres();
  }, []);


  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();

    if (debouncedSearchQuery) {
      if(filterType === "title"){
        params.append("title", debouncedSearchQuery);
      }
      if(filterType === "actor"){
        params.append("actor", debouncedSearchQuery);
      }
      if(filterType === "director"){
        params.append("director", debouncedSearchQuery);
      }
    }

    if (filterType === "genre" && selectedGenres.length > 0) {
      selectedGenres.forEach((genre) => params.append("genre", genre));
    }

    return params.toString();
  }, [debouncedSearchQuery, selectedGenres, filterType]);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryString = buildQueryParams();
        const url = queryString ? `/movies/?${queryString}` : "/movies/";
        const response = await apiClient.get(url);

        setMovies(response.data);
      } catch (err) {
        setError("Failed to load movies. Please try again.");
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [buildQueryParams]);

  const allGenres = useMemo(() => {
    return genres.map((g) => g.type).sort();
  }, [genres]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  if (error && movies.length === 0) {
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Discover Your Next Favorite Film
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Browse thousands of movies, explore detailed cast information, and discover filmmakers and actors you love.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Filter Section */}
        <div className="mb-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Filters</h3>
          <FilterBar
            genres={allGenres}
            selectedGenres={selectedGenres}
            onGenreChange={handleGenreChange}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
          />
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
          </div>
        )}

        {/* Movies Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {!loading && movies.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">
              {debouncedSearchQuery || selectedGenres.length > 0
                ? "No movies match your search or filters"
                : "No movies available"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
