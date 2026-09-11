import { Search, RotateCcw, SlidersHorizontal, ChevronDown } from "lucide-react";
import { FILTER_OPTIONS } from "../../constants/readerMockData";

const SearchFilterBar = ({
  searchTerm,
  setSearchTerm,
  selectedMajor,
  setSelectedMajor,
  selectedAuthor,
  setSelectedAuthor,
  selectedYear,
  setSelectedYear,
  availableOnly,
  setAvailableOnly,
  onResetFilters,
  resultCount = 48,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Search Input Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tra cứu tên sách, tác giả, chuyên ngành, từ khóa hoặc mã ISBN (Marc21)..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-20 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <kbd className="hidden md:inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-slate-500 shadow-2xs">
              ⌘ + K
            </kbd>
          </div>
        </div>

        <button className="w-full sm:w-auto shrink-0 rounded-xl bg-blue-950 px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-900 transition-colors flex items-center justify-center gap-2">
          <Search className="h-4 w-4" />
          <span>Tìm kiếm</span>
        </button>
      </div>

      {/* Bottom Filter Controls Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Bộ lọc:
          </span>

          {/* Major Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 pr-8 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              {FILTER_OPTIONS.majors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Author Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 pr-8 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              {FILTER_OPTIONS.authors.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Publication Year Dropdown */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 pr-8 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              {FILTER_OPTIONS.publishYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Available Only Toggle / Dropdown */}
          <div className="relative">
            <select
              value={availableOnly ? "available" : "all"}
              onChange={(e) => setAvailableOnly(e.target.value === "available")}
              className="appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 pr-8 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="available">Chỉ xem sách sẵn có</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Right Info & Reset Button */}
        <div className="flex items-center justify-between md:justify-end gap-4 text-xs">
          <span className="text-slate-500 font-medium">
            Tìm thấy <strong className="font-bold text-slate-800">{resultCount}</strong> tài liệu
          </span>

          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
