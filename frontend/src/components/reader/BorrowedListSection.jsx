import { useState } from "react";
import { RefreshCw, Lock, CheckCircle2, Clock } from "lucide-react";
import readerService from "../../services/readerService";

const BorrowedListSection = ({ items = [], isLoading, onRenewed }) => {
  const [renewedMap, setRenewedMap] = useState({});

  const handleRenewItem = async (detailId) => {
    try {
      await readerService.renewBorrowing(detailId);
      setRenewedMap((prev) => ({ ...prev, [detailId]: true }));
      if (onRenewed) onRenewed();
    } catch (error) {
      console.error("Failed to renew borrowing:", error);
      alert("Không thể gia hạn. Vui lòng kiểm tra lại điều kiện gia hạn.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24 text-slate-500">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span className="font-medium text-sm">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-24 text-slate-500 bg-white rounded-2xl border border-slate-200">
        <Clock className="h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-800">Không có sách đang mượn</h3>
        <p className="text-sm mt-1">Bạn chưa mượn cuốn sách nào hoặc đã trả hết sách.</p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Danh sách tài liệu đang lưu thông ({items.length})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Xem chi tiết chu kỳ mượn, thông tin mã vạch và trạng thái đủ điều kiện gia hạn trực tiếp
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-medium bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
          <Clock className="h-3.5 w-3.5" />
          <span>Cập nhật máy chủ: {new Date().toLocaleTimeString('vi-VN')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((book) => {
          const isItemRenewed = renewedMap[book.id];

          return (
            <div
              key={book.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              {/* Header Badges & Barcode line */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {book.barcode}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      book.statusType === "danger"
                        ? "bg-rose-100 text-rose-800 border border-rose-200"
                        : book.statusType === "success"
                        ? "bg-teal-100 text-teal-800 border border-teal-200"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {isItemRenewed ? "Đã gia hạn thành công" : book.statusTag}
                  </span>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {book.location}
                  </span>
                </div>
              </div>

              {/* Main Content: Cover + Info + Action Buttons */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                {/* Left Book info */}
                <div className="lg:col-span-8 flex gap-4">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-32 w-24 shrink-0 rounded-xl object-cover shadow-xs border border-slate-200/70"
                  />

                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                        {book.title}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {book.author}
                      </p>
                    </div>

                    {/* Details Box */}
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs grid grid-cols-3 gap-2">
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-slate-400">
                          NGÀY MƯỢN
                        </span>
                        <span className="font-bold text-slate-800">
                          {book.borrowDate}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold uppercase text-slate-400">
                          HẠN TRẢ
                        </span>
                        <span
                          className={`font-bold ${
                            book.statusType === "danger"
                              ? "text-red-600"
                              : "text-slate-800"
                          }`}
                        >
                          {isItemRenewed ? "Đã gia hạn thêm" : book.dueDate}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold uppercase text-slate-400">
                          GIA HẠN
                        </span>
                        <span className="font-bold text-slate-800">
                          {isItemRenewed ? "Thành công" : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center gap-2">
                  {book.canRenew ? (
                    <button
                      onClick={() => handleRenewItem(book.id)}
                      disabled={isItemRenewed}
                      className={`w-full lg:w-auto flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-xs transition-colors ${
                        isItemRenewed
                          ? "bg-emerald-600 text-white cursor-default"
                          : "bg-blue-950 text-white hover:bg-blue-900"
                      }`}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>
                        {isItemRenewed ? "Đã gia hạn thành công" : book.buttonText}
                      </span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full lg:w-auto flex items-center justify-center gap-2 rounded-xl bg-slate-200 px-5 py-2.5 text-xs font-bold text-slate-500 cursor-not-allowed border border-slate-300/60"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>{book.buttonText}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BorrowedListSection;
