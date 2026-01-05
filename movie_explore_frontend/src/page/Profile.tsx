import { useParams, useSearchParams, Link } from "react-router-dom";
import { MovieCard } from "../components/MovieCard";
import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import type { PersonWithMovies } from "../types";

export function PersonProfile() {
  const { personId } = useParams<{ personId: string }>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "actor";
  const [person, setPerson] = useState<PersonWithMovies | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActorOrDirector = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get(`/${type}/${personId}`);
        setPerson(response.data);
      } catch (err) {
        setError(`Failed to load ${type} details. Please try again.`);
        console.error(`Error fetching ${type}:`, err);
      } finally {
        setLoading(false);
      }
    };

    if (personId) {
      fetchActorOrDirector();
    }
  }, [personId, type]);

  if (loading) {
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-900">
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <Link to="/" className="text-amber-500 hover:text-amber-400">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  if (!person) {
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-white mb-4">Person not found</h2>
          <Link to="/" className="text-amber-500 hover:text-amber-400">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="shrink-0">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLEHWsiwRrJmEa6oSUhS07eOSORZCR3xj_0A&s"
              alt={`${person.first_name} ${person.last_name}`}
              className="w-48 h-64 rounded-lg object-cover shadow-lg"
            />
          </div>

          <div className="flex-1">
            <div className="inline-block mb-3">
              <span className="bg-amber-500/20 border border-amber-500/50 text-amber-500 px-3 py-1 rounded-full text-sm font-medium">
                {type === "director" ? "Director" : "Actor"}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {person.first_name} {person.last_name}
            </h1>
            <h3 className="text-xl md:text-xl font-bold text-amber-500 mb-4">
              {person.age}
            </h3>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 inline-block">
              <p className="text-slate-400 text-sm">Total Movies</p>
              <p className="text-3xl font-bold text-amber-500">{person.movies.length}</p>
            </div>
          </div>
        </div>

        {/* Filmography */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8">
            {type === "director" ? "Directed Films" : "Filmography"}
          </h2>

          {person.movies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No movies found for this {type}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {person.movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-medium transition-colors"
          >
            ← Back to Movies
          </Link>
        </div>
      </div>
    </main>
  );
}
