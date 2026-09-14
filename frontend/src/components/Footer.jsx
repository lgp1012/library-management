import { LibraryBig } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-sky-950 text-white py-5 mt-12 text-xs border-t border-sky-900">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Left Branding & Standards */}
        <div className="flex items-center gap-3">
          <LibraryBig className="h-5 w-5 text-sky-400" />
          <span className="font-bold text-white tracking-wide">
            PPNNT Library
          </span>
          <span className="text-sky-700">|</span>
          <span className="text-sky-200/90">© 2026 PPNNT Library</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
