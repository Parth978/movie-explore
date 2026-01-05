import { X } from "lucide-react";

interface FilterBarProps {
  genres: string[];
  selectedGenres: string[];
  onGenreChange: (genre: string) => void;
  filterType: "title" | "genre" | "actor" | "director" | null;
  onFilterTypeChange: (type: "title" | "genre" | "actor" | "director") => void;
}

export function FilterBar({
  genres,
  selectedGenres,
  onGenreChange,
  filterType,
  onFilterTypeChange,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(["title", "genre", "actor", "director"] as const).map((type) => (
          <button
            type="button"
            key={type}
            onClick={() => onFilterTypeChange(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterType === type
                ? "bg-amber-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {filterType === "genre" && (
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              type="button"
              key={genre}
              onClick={() => onGenreChange(genre)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedGenres.includes(genre)
                  ? "bg-amber-500 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      {/* Selected Genres Tags */}
      {selectedGenres.length > 0 && filterType === "genre" && (
        <div className="flex flex-wrap gap-2">
          {selectedGenres.map((genre) => (
            <div
              key={genre}
              className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/50 text-amber-500 px-3 py-1 rounded-full text-sm"
            >
              {genre}
              <button
                type="button"
                onClick={() => onGenreChange(genre)}
                className="hover:text-amber-600"
                aria-label={`Remove ${genre} filter`}
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
