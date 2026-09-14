import { useState } from "react";
import { Clock, MapPin, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";

const BorrowedBookCard = ({ book, onRenew, onReturn }) => {
  const [renewedDays, setRenewedDays] = useState(0);

  const getTagStyle = () => {
    switch (book.tagType) {
      case "danger":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "success":
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  const handleRenew = () => {
    setRenewedDays(book.renewDays || 14);
    if (onRenew) onRenew(book.id);
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:shadow-md transition-shadow">
      <div>
        {/* Header Badge */}
        <div className="mb-3 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getTagStyle()}`}
          >
            <Clock className="h-3 w-3" />
            {renewedDays > 0 ? `Đã gia hạn (+${renewedDays} ngày)` : book.tagText}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {book.barcode}
          </span>
        </div>

        {/* Content Row: Cover + Info */}
        <div className="flex gap-3.5">
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-28 w-20 shrink-0 rounded-lg object-cover shadow-xs border border-slate-100"
          />

          <div className="flex flex-col justify-between flex-1 min-w-0">
            <div>
              <h4 className="line-clamp-2 text-sm font-bold text-slate-900 leading-snug">
                {book.title}
              </h4>
              <p className="mt-1 text-xs text-slate-500 font-medium truncate">
                Tác giả: <span className="text-slate-700">{book.author}</span>
              </p>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                Mã vạch: {book.barcode}
              </p>
            </div>

            {/* Dates / Fine Info Sub-box */}
            <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-[11px] space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Ngày mượn:</span>
                <span className="font-medium text-slate-700">{book.borrowDate}</span>
              </div>
              {book.isOverdue ? (
                <>
                  <div className="flex justify-between text-red-600 font-semibold">
                    <span>Phạt tích lũy:</span>
                    <span>{book.accumulatedFine}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Hạn ban đầu:</span>
                    <span className="font-medium text-slate-700">{book.dueDate}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-600">
                  <span>Hạn hoàn trả:</span>
                  <span className={`font-bold ${book.tagType === "warning" ? "text-red-600" : "text-slate-900"}`}>
                    {book.dueDate}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-4 flex items-center gap-2 pt-2">
        {book.isOverdue ? (
          <button
            onClick={() => onReturn && onReturn(book.id)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-red-700 px-3 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-red-800 transition-colors"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Hoàn trả ngay tại trạm</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleRenew}
              disabled={renewedDays > 0}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold shadow-xs transition-colors ${
                renewedDays > 0
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : book.tagType === "warning"
                  ? "bg-blue-950 text-white hover:bg-blue-900"
                  : "bg-blue-100 text-blue-950 hover:bg-blue-200"
              }`}
            >
              {renewedDays > 0 ? (
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              <span>
                {renewedDays > 0
                  ? "Đã gia hạn"
                  : book.renewDays
                  ? `Gia hạn (+${book.renewDays} ngày)`
                  : "Gia hạn mượn"}
              </span>
            </button>
            <button
              title="Vị trí kệ sách"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <MapPin className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BorrowedBookCard;
