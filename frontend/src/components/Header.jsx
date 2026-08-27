import { CircleHelp, LibraryBig, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const Header = ({ authAction }) => {
  return (
    <header className="w-full bg-sky-950 text-white">
      <div className="mx-auto flex h-14 max-w-350 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <LibraryBig className="h-5 w-5" />
          <h1 className="text-sm font-semibold tracking-wide sm:text-base">
            PPNNT Library
          </h1>
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
