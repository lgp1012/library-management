import { BookmarkPlus, CheckCircle, Info, Ban } from "lucide-react";
import { useState } from "react";
import readerService from "../../services/readerService";

const CatalogBookCard = ({ book }) => {
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [priorityRequest, setPriorityRequest] = useState(false);
  const [availCheck, setAvailCheck] = useState(null); // { auditId, count1, count2 }
  const [checkingAvail, setCheckingAvail] = useState(false);

  const isAvailable = book.stockStatus === "available";

  const handleAction = async () => {
    setLoading(true);
    try {
      await readerService.reserveBook(book.id, priorityRequest, priorityRequest ? 6000 : 0);
      setRequested(true);
      setShowConfirm(false);
    } catch (error) {
      console.error("Failed to reserve book", error);
      alert(error.response?.data?.message || "Không thể thực hiện yêu cầu lúc này.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAvailability = async () => {
    setCheckingAvail(true);
    try {
      if (!availCheck) {
        const res = await readerService.startAvailableAudit(book.id);
        setAvailCheck({ auditId: res.result.auditId, count1: res.result.count, count2: null });
      } else {
        const res = await readerService.recountAvailableAudit(availCheck.auditId);
        setAvailCheck((prev) => ({ ...prev, count2: res.result.count }));
      }
    } catch (error) {
      console.error("Failed to check availability", error);
    } finally {
      setCheckingAvail(false);
    }
  };

  return (
    <>
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
                {book.shelfLocation || (book.shelf && book.zone ? `Kệ ${book.shelf} - Khu ${book.zone}` : "Chưa rõ")}
              </span>
            </div>
          </div>

          {/* Book Details */}
          <h4 className="line-clamp-1 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {book.title}
          </h4>

          <p className="mt-1.5 line-clamp-2 text-xs text-slate-500 leading-relaxed min-h-[2.5rem]">
            {book.description || "Không có mô tả cho sách này."}
          </p>

          <p className="mt-1.5 text-xs font-semibold text-slate-700">
            Tác giả: <span className="font-medium text-slate-600">{book.author}</span>
          </p>

          <p className="mt-0.5 text-xs font-semibold text-slate-700">
            Năm XB: <span className="font-medium text-slate-600">{book.year || book.publishYear || "Chưa rõ"}</span>
          </p>


          {/* Meta Info Row */}
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
            <button className="flex items-center gap-1 text-slate-600 font-medium hover:text-blue-600 transition-colors">
              <Info className="h-3.5 w-3.5" />
              <span>Tóm tắt & Review</span>
            </button>
            <span className="font-mono text-slate-400">ISBN: {book.isbn}</span>
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
              <span>Đã xếp hàng đặt trước</span>
            </button>
          ) : isAvailable ? (
            <button
              disabled
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2.5 text-[11px] font-semibold text-slate-500 border border-slate-200 cursor-not-allowed"
            >
              <Ban className="h-4 w-4" />
              <span>Ra quầy để đăng kí mượn sách</span>
            </button>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-100 px-4 py-2.5 text-xs font-semibold text-blue-950 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-200'}`}
            >
              <BookmarkPlus className="h-4 w-4" />
              <span>{loading ? "Đang xử lý..." : "Đặt trước"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-slate-900">Xác nhận đặt trước</h3>
            <p className="mb-4 text-sm text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xếp hàng đặt trước sách <strong>{book.title}</strong>? Hệ thống sẽ chuyển yêu cầu cho nhân viên thư viện xử lý.
            </p>

            <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-600">
                  Tình trạng bản sao đang có sẵn
                </span>
                <button
                  onClick={handleCheckAvailability}
                  disabled={checkingAvail || (availCheck && availCheck.count2 !== null)}
                  className="text-xs font-semibold text-sky-700 hover:underline disabled:opacity-50 disabled:no-underline"
                >
                  {checkingAvail
                    ? "Đang kiểm tra..."
                    : !availCheck
                      ? "Kiểm tra"
                      : availCheck.count2 === null
                        ? "Kiểm tra lại"
                        : "Đã kiểm tra"}
                </button>
              </div>
              {availCheck && (
                <div className="mt-1.5 text-xs text-slate-500">
                  Lần 1: <span className="font-bold text-slate-800">{availCheck.count1} bản</span>
                  {availCheck.count2 !== null && (
                    <>
                      {" · "}Lần 2:{" "}
                      <span className={`font-bold ${availCheck.count2 !== availCheck.count1 ? "text-rose-600" : "text-slate-800"}`}>
                        {availCheck.count2} bản
                      </span>
                      {availCheck.count2 !== availCheck.count1 && (
                        <span className="ml-1 font-semibold text-rose-600">⚠ Vừa có thay đổi</span>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <label className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-slate-200 transition">
              <input
                type="checkbox"
                checked={priorityRequest}
                onChange={(e) => setPriorityRequest(e.target.checked)}
                className="accent-sky-600"
              />
              Xử lý ưu tiên (đặt trước ngay, không xếp hàng chờ)
            </label>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setAvailCheck(null);
                }}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                disabled={loading}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleAction}
                disabled={loading}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {loading ? "Đang gửi..." : "Xác nhận đặt trước"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CatalogBookCard;
