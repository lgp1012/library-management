import { useState } from "react";
import CatalogBookCard from "./CatalogBookCard";
import { BookMarked, Download, GraduationCap } from "lucide-react";

const BookCatalogSection = ({ catalogBooks, onBorrowBook, onReserveBook }) => {
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("all");

  const filteredBooks = catalogBooks.filter((book) => {
    if (selectedCategoryTab === "ebook") return book.isEbook;
    if (selectedCategoryTab === "thesis") return book.isThesis;
    return true;
  });

  return (
    <section className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold tracking-wider text-teal-700 uppercase">
            TUYỂN TẬP CHỌN LỌC
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Sách Giáo Trình & Chuyên Khảo Mới Nhất
          </h3>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100/80 p-1 border border-slate-200/60 self-start sm:self-auto">
          <button
            onClick={() => setSelectedCategoryTab("all")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedCategoryTab === "all"
                ? "bg-white text-blue-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookMarked className="h-3.5 w-3.5" />
            <span>Tất cả tài liệu</span>
          </button>

          <button
            onClick={() => setSelectedCategoryTab("ebook")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedCategoryTab === "ebook"
                ? "bg-white text-blue-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Ebook tải về</span>
          </button>

          <button
            onClick={() => setSelectedCategoryTab("thesis")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedCategoryTab === "thesis"
                ? "bg-white text-blue-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Luận án tiến sĩ</span>
          </button>
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredBooks.map((book) => (
            <CatalogBookCard
              key={book.id}
              book={book}
              onBorrow={onBorrowBook}
              onReserve={onReserveBook}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          <p className="text-sm font-medium">Không tìm thấy tài liệu phù hợp trong danh mục này.</p>
        </div>
      )}
    </section>
  );
};

export default BookCatalogSection;
