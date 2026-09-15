import CatalogBookCard from "./CatalogBookCard";

const BookCatalogSection = ({ books = [], onBorrowBook, onReserveBook }) => {
  return (
    <section className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold tracking-wider text-teal-700 uppercase">
            TUYỂN TẬP CHỌN LỌC
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Tài Liệu Thư Viện
          </h3>
        </div>
      </div>

      {/* Catalog Grid */}
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {books.map((book) => (
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
          <p className="text-sm font-medium">
            Không tìm thấy tài liệu phù hợp trong danh mục này.
          </p>
        </div>
      )}
    </section>
  );
};

export default BookCatalogSection;
