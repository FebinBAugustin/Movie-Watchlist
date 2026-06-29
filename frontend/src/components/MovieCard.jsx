import { Star, Plus, Eye } from "lucide-react";

export default function MovieCard({
  imdbID,
  title,
  year,
  poster,
  genre,
  country,
  imdbRating,
  onAddToWatchlist,
  onViewDetails,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-stub shadow-lg hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between h-full">
      <div className="relative">
        <img
          src={
            poster !== "N/A"
              ? poster
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={title}
          className="h-72 w-full object-cover"
        />
        
        {/* IMDb Rating Overlay */}
        {imdbRating && imdbRating !== "N/A" && (
          <span className="absolute top-3 right-3 bg-black/80 px-2.5 py-1 rounded-full text-xs font-bold text-yellow-500 backdrop-blur-sm flex items-center gap-1 border border-yellow-500/20">
            <Star size={12} className="fill-yellow-500 text-yellow-500" />
            {imdbRating}
          </span>
        )}

        {/* Year Overlay */}
        <span className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm">
          {year}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-ink line-clamp-1" title={title}>
            {title}
          </h3>

          {/* Badges for Genre and Country */}
          <div className="mt-2 flex flex-wrap gap-1">
            {genre && genre !== "N/A" && (
              genre.split(", ").slice(0, 2).map((g) => (
                <span key={g} className="bg-gray-800 text-ink2 text-[10px] px-2 py-0.5 rounded border border-line">
                  {g}
                </span>
              ))
            )}
            {country && country !== "N/A" && (
              <span className="bg-flame/10 text-flame text-[10px] px-2 py-0.5 rounded border border-flame/20">
                {country.split(", ")[0]}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2 pt-2 border-t border-line/60">
          <button
            onClick={() =>
              onAddToWatchlist({
                imdbID,
                title,
                year,
                poster,
                genre,
              })
            }
            className="w-full rounded-lg bg-flame py-2 text-xs font-semibold text-white hover:opacity-90 transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus size={14} />
            Add to Watchlist
          </button>

          <button
            onClick={() => onViewDetails(imdbID)}
            className="w-full rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <Eye size={14} />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}