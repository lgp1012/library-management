import { CircleHelp, LibraryBig, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const Header = ({ authAction }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-sky-950 text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <LibraryBig className="h-6 w-6 text-sky-400" />
            <h1 className="text-base font-extrabold tracking-wide sm:text-lg text-white">
              PPNNT Library
            </h1>
          </div>
        </div>

        {authAction === "signin" ? (
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm text-slate-100/90 transition hover:text-white"
          >
            <CircleHelp className="h-4 w-4" />
            Trợ giúp
          </button>
        ) : (
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 text-sm text-slate-100/90 transition hover:text-white"
          >
            <LogIn className="h-4 w-4" />
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
