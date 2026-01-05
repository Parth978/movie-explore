import { Link } from "react-router-dom";
import type { Movie } from "../types";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link to={`/movie/${movie.id}`}>
      <div className="group bg-slate-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer h-full">
        <div className="relative overflow-hidden bg-slate-800 aspect-2/3">
          <img
            src={movie.image_url ?? "https://play-lh.googleusercontent.com/slZYN_wnlAZ4BmyTZZakwfwAGm8JE5btL7u7AifhqCtUuxhtVVxQ1mcgpGOYC7MsAaU"}
            alt={movie.title}
            className="w-full h-full object-contain group-hover:brightness-110 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4">
          <h3 className="font-bold text-white text-base line-clamp-2 group-hover:text-amber-500 transition-colors">
            {movie.title}
          </h3>
          <p className="text-sm text-slate-400 mt-1">{movie.release_year}</p>

          <div className="flex items-center gap-1 mt-2">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="text-sm font-semibold text-amber-500">{(movie.rating)/10}</span>
          </div>
          {movie.genres && <div className="flex flex-wrap gap-1 mt-3">
            {movie.genres.slice(0, 2).map((genre) => (
              <span key={genre.id} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                {genre.type}
              </span>
            ))}
          </div>}
        </div>
      </div>
    </Link>
  );
}