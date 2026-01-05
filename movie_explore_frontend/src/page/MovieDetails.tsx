import { useParams, Link } from "react-router-dom";
import { Calendar, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import type { Movie, Review } from "../types";


export function MovieDetail() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [movieResponse, reviewsResponse] = await Promise.all([
          apiClient.get(`/movies/${movieId}`),
          apiClient.get(`/reviews/?movieId=${movieId}`),
        ]);

        setMovie(movieResponse.data);
        setReviews(reviewsResponse.data);
      } catch (err) {
        setError("Failed to load movie details. Please try again.");
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchData();
    }
  }, [movieId]);

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

  if (!movie) {
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-white mb-4">Movie not found</h2>
          <Link to="/" className="text-amber-500 hover:text-amber-400">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-900">
      {/* Hero Section with Poster */}
      <div className="relative h-96 md:h-125 overflow-hidden">
        <img
          src="https://play-lh.googleusercontent.com/slZYN_wnlAZ4BmyTZZakwfwAGm8JE5btL7u7AifhqCtUuxhtVVxQ1mcgpGOYC7MsAaU"
          alt={movie.title}
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/0 via-slate-950/50 to-slate-950" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-12">
        {/* Movie Header */}
        <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-lg p-8 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{movie.title}</h1>

          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              <span className="text-slate-200">{movie.release_year}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genres.map((genre) => (
              <span key={genre.id} className="bg-amber-500/20 border border-amber-500/50 text-amber-500 px-3 py-1 rounded-full text-sm font-medium">
                {genre.type}
              </span>
            ))}
          </div>

          <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">{movie.description}</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Director</h2>
          <Link to={`/person/${movie.director.id}?type=directors`}>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-amber-500/50 transition-all hover:bg-slate-800 cursor-pointer">
              <div className="flex gap-6">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHBp3gsQdFjO_r7zsVr0d-gs8n86rXGbmp3w&s"
                  alt={`${movie.director.first_name} ${movie.director.last_name}`}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 hover:text-amber-500 transition-colors">
                    {movie.director.first_name} {movie.director.last_name}
                  </h3>
                  <h3 className="text-xl font-bold text-white mb-2 hover:text-amber-500 transition-colors">
                    {movie.director.age}
                  </h3>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {movie.actors.map((actor) => (
              <Link key={actor.id} to={`/person/${actor.id}?type=actors`}>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-amber-500/50 transition-all hover:bg-slate-800">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjs7Zlv1i5ej0RO74HkYdLoeqSwybxe393-g&s"
                    alt={`${actor.first_name} ${actor.last_name}`}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-white hover:text-amber-500 transition-colors line-clamp-1">
                      {actor.first_name} {actor.last_name}
                    </h3>
                    <h3 className="font-bold text-white hover:text-amber-500 transition-colors line-clamp-1">
                      {actor.age}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {reviews.length > 0 && <div>
          <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviews.map((review) => (
                <div key={review.id} className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-amber-500/50 transition-all hover:bg-slate-800 p-4">
                  <h3 className="font-bold text-white hover:text-amber-500 transition-colors line-clamp-1 mb-1">
                      {review.reviewer_name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                    <span className="text-slate-200 font-semibold">{review.rating}/5</span>
                  </div>
                  <div>
                    <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">{review.comment}</p>
                    <p className="text-slate-300 text-xs font-bold max-w-3xl mt-5">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
            ))}
          </div>
        </div>}

        {/* Back Link */}
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
