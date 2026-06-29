import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser, getUserProfile } from "../services/authService";
import { getWatchlistStats } from "../services/watchlistService";
import { Film, Star, LogOut, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ moviesWatched: 0, averageRating: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfileAndStats() {
      try {
        const [profileData, statsData] = await Promise.all([
          getUserProfile(),
          getWatchlistStats()
        ]);
        setProfile(profileData);
        setStats(statsData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfileAndStats();
  }, []);

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-paper">
        <Loader2 className="h-8 w-8 animate-spin text-flame" />
      </div>
    );
  }

  const userInitials = profile?.name
    ? profile.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "U";

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="font-display text-4xl font-extrabold text-ink mb-8">My Profile</h1>
      
      <div className="rounded-3xl border border-line bg-stub/60 p-8 backdrop-blur shadow-xl relative overflow-hidden">
        {/* Background gradient blur */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-flame/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* User details header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-line">
          <div className="w-20 h-20 bg-gradient-to-tr from-flame to-pink-500 rounded-full flex items-center justify-center shadow-lg text-white font-bold text-2xl">
            {userInitials}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-ink">{profile?.name || "User"}</h2>
            <p className="text-sm text-ink2 mt-1">{profile?.email || "No email provided"}</p>
          </div>
        </div>

        {/* Watchlist statistics */}
        <div className="grid grid-cols-2 gap-6 py-8">
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-stub/80 border border-line/50 shadow-inner">
            <Film className="text-flame h-8 w-8 mb-2" />
            <dt className="text-xs font-semibold uppercase tracking-wider text-ink2 text-center">Movies watched</dt>
            <dd className="text-3xl font-extrabold text-ink mt-2">
              {stats.moviesWatched}
            </dd>
          </div>

          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-stub/80 border border-line/50 shadow-inner">
            <Star className="text-yellow-500 h-8 w-8 mb-2" />
            <dt className="text-xs font-semibold uppercase tracking-wider text-ink2 text-center">Average rating</dt>
            <dd className="text-3xl font-extrabold text-ink mt-2">
              {stats.averageRating > 0 ? `${stats.averageRating} ★` : "—"}
            </dd>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleLogout}
            className="bg-red-600/90 text-white rounded-full px-6 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-red-700 transition focus-ring"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
