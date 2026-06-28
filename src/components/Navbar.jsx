import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Sun, Moon, Clapperboard, LogOut } from "lucide-react";
import { isAuthenticated, logoutUser } from "../services/authService";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/watchlist", label: "Watchlist" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const { theme, toggleTheme } = useTheme();

  function handleLogout() {
    logoutUser();
    setOpen(false);
    navigate("/login");
  }

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link to="/" className="focus-ring flex items-center gap-2">
          <span className="bg-flame flex h-8 w-8 items-center justify-center rounded-lg">
            <Clapperboard size={18} className="text-white" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-ink">
            CINE<span className="text-flame">LIST</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `focus-ring rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-stub text-ink" : "text-ink2 hover:text-ink"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="focus-ring rounded-full p-2 text-ink2 hover:bg-stub hover:text-ink"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {loggedIn ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `focus-ring rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-stub text-ink" : "text-ink2 hover:text-ink"
                  }`
                }
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="focus-ring flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-stub"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="focus-ring rounded-full px-4 py-2 text-sm font-medium text-ink2 hover:text-ink"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-flame focus-ring rounded-full px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="focus-ring flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className={`h-0.5 w-6 bg-ink transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-ink transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-line px-5 py-3 md:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="focus-ring rounded-lg px-3 py-2.5 text-sm font-medium text-ink2 hover:bg-stub hover:text-ink"
            >
              {link.label}
            </NavLink>
          ))}

          <button
            onClick={toggleTheme}
            className="focus-ring flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink2 hover:bg-stub hover:text-ink"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>

          {loggedIn ? (
            <>
              <NavLink
                to="/profile"
                onClick={() => setOpen(false)}
                className="focus-ring rounded-lg px-3 py-2.5 text-sm font-medium text-ink2 hover:bg-stub hover:text-ink"
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="focus-ring mt-1 rounded-lg border border-line px-3 py-2.5 text-left text-sm font-semibold text-ink"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="focus-ring rounded-lg px-3 py-2.5 text-sm font-medium text-ink2 hover:bg-stub hover:text-ink"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="bg-flame focus-ring mt-1 rounded-lg px-3 py-2.5 text-center text-sm font-semibold text-white"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
