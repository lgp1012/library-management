import { useState } from "react";
import { Star, Info, CheckCircle, BookmarkPlus } from "lucide-react";

const CatalogBookCard = ({ book, onBorrow, onReserve }) => {
  const [requested, setRequested] = useState(false);

  const isAvailable = book.stockStatus === "available";

  const handleAction = () => {
    setRequested(true);
    if (isAvailable && onBorrow) {
      onBorrow(book.id);
    } else if (!isAvailable && onReserve) {
      onReserve(book.id);
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:shadow-md transition-all group">
      <div>
        {/* Image Container with Badges */}
        <div className="relative mb-3 flex items-center justify-center overflow-hidden rounded-xl bg-slate-100 aspect-[3/4]">
          {/* Top Stock Badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold shadow-xs ${
                isAvailable
                  ? "bg-emerald-500 text-white"
                  : "bg-amber-800 text-white"
              }`}
            >
              {book.stockTag}
            </span>
          </div>

          {/* Book Cover */}
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Shelf Location Overlay */}
          <div className="absolute bottom-2.5 right-2.5 z-10">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-900/80 px-2 py-1 text-[10px] font-mono text-white backdrop-blur-md border border-white/20">
              {book.shelfLocation}
            </span>
          </div>
        </div>

        {/* Rating & Review */}
        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mb-1.5">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{book.rating}</span>
          <span className="text-slate-400 font-normal">
            ({book.reviewCount} nhận xét)
          </span>
        </div>

        {/* Book Details */}
        <h4 className="line-clamp-1 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {book.title}
        </h4>

        <p className="mt-0.5 text-xs font-semibold text-slate-600">
          {book.author}
        </p>

        <p className="mt-1.5 line-clamp-2 text-xs text-slate-500 leading-relaxed">
          {book.description}
        </p>

        {/* Meta Info Row */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
          <button className="flex items-center gap-1 text-slate-600 font-medium hover:text-blue-600 transition-colors">
            <Info className="h-3.5 w-3.5" />
            <span>Tóm tắt & Review</span>
          </button>
          <span className="font-mono text-slate-400">
            ISBN: {book.isbn}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4">
        {requested ? (
          <button
            disabled
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700 border border-emerald-200 cursor-default"
          >
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>{isAvailable ? "Đã gửi yêu cầu mượn" : "Đã xếp hàng đặt trước"}</span>
          </button>
        ) : isAvailable ? (
          <button
            onClick={handleAction}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-950 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-900 transition-colors"
          >
            <BookmarkPlus className="h-4 w-4" />
            <span>Đăng ký mượn ngay</span>
          </button>
        ) : (
          <button
            onClick={handleAction}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-100 px-4 py-2.5 text-xs font-semibold text-blue-950 hover:bg-blue-200 transition-colors"
          >
            <BookmarkPlus className="h-4 w-4" />
            <span>Đặt trước (Hàng chờ: {book.queueCount || 1})</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CatalogBookCard;
