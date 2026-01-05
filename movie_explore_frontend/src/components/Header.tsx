import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-linear-to-r from-slate-950 to-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-bold text-amber-300">Movie Plex</h1>
          </Link>
        </div>
      </div>
    </header>
  );
}
export default Header