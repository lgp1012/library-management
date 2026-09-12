import { useState } from "react";
import { RefreshCw, Globe, Lock, Clock, CheckCircle2 } from "lucide-react";

const BorrowedListSection = () => {
  const [items, setItems] = useState([
    {
      id: "b1",
      barcode: "BC-DS-2024-0092",
      statusTag: "Sắp hết hạn (Còn 2 ngày)",
      statusType: "danger",
      location: "Kho sách KHTN • Tầng 2 • Kệ B4",
      title: "Cấu trúc Dữ liệu & Giải thuật",
      author: "GS. Đinh Mạnh Tường, PGS. Trần Hữu Nam (NXB Đại học Quốc gia)",
      borrowDate: "11/11/2024",
      dueDate: "25/11/2024 (17:00)",
      renewCount: 0,
      maxRenew: 2,
      coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&auto=format&fit=crop&q=80",
      canRenew: true,
      buttonText: "Gia hạn thêm 14 ngày",
    },
    {
      id: "b2",
      barcode: "BC-AI-2023-1184",
      statusTag: "Đang lưu thông (Còn 10 ngày)",
      statusType: "success",
      location: "Kho Tham khảo Quốc tế • Tầng 3 • Kệ A1",
      title: "Artificial Intelligence: A Modern Approach (4th Ed)",
      author: "Stuart Russell, Peter Norvig (Pearson Academic)",
      borrowDate: "19/11/2024",
      dueDate: "03/12/2024",
      renewCount: 1,
      maxRenew: 2,
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
      canRenew: true,
      buttonText: "Gia hạn lần cuối (+14 ngày)",
      subtext: "Chỉ còn 1 suất gia hạn duy nhất",
    },
    {
      id: "b3",
      barcode: "BC-CA-2024-4812",
      statusTag: "Đang lưu thông",
      statusType: "neutral",
      location: "Kho Chuyên ngành CNTT • Tầng 2 • Kệ C2",
      title: "Clean Architecture: A Craftsman's Guide to Software Structure",
      author: 'Robert C. Martin ("Uncle Bob") (Prentice Hall)',
      borrowDate: "20/11/2024",
      dueDate: "04/12/2024",
      renewCount: 0,
      maxRenew: 2,
      coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80",
      canRenew: false,
      lockReason: "Đang có 01 độc giả khác đặt trước tựa sách này trong hàng chờ học thuật.",
      buttonText: "Khóa tính năng gia hạn",
      subtext: "Vui lòng hoàn trả đúng thời hạn",
    },
  ]);

  const [renewedMap, setRenewedMap] = useState({});
  const [returnedMap, setReturnedMap] = useState({});

  const handleRenewItem = (id) => {
    setRenewedMap((prev) => ({ ...prev, [id]: true }));
  };

  const handleReturnItem = (id) => {
    setReturnedMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Danh sách tài liệu đang lưu thông ({items.filter((i) => !returnedMap[i.id]).length})
          </h3>
          <p className="text-xs text-slate-500">
            Xem chi tiết chu kỳ mượn, thông tin mã vạch và trạng thái đủ điều kiện gia hạn trực tiếp
          </p>
        </div>

        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 self-start sm:self-auto">
          <Clock className="h-3.5 w-3.5" />
          <span>Cập nhật máy chủ: 10:45 AM</span>
        </div>
      </div>

      {/* Items Cards List */}
      <div className="space-y-4">
        {items.map((book) => {
          if (returnedMap[book.id]) {
            return (
              <div
                key={book.id}
                className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Đã ghi nhận yêu cầu hoàn trả cho sách "{book.title}" qua trạm Kiosk.</span>
              </div>
            );
          }

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
                          {book.id === "b2" ? "HẠN TRẢ HIỆN TẠI" : "HẠN TRẢ QUY ĐỊNH"}
                        </span>
                        <span
                          className={`font-bold ${
                            book.statusType === "danger"
                              ? "text-red-600"
                              : book.id === "b2"
                              ? "text-blue-700"
                              : "text-slate-800"
                          }`}
                        >
                          {isItemRenewed ? "09/12/2024 (17:00)" : book.dueDate}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold uppercase text-slate-400">
                          ĐÃ GIA HẠN
                        </span>
                        <span className="font-bold text-slate-800">
                          {isItemRenewed
                            ? `${book.renewCount + 1} / ${book.maxRenew} lần`
                            : `${book.renewCount} / ${book.maxRenew} lần`}
                        </span>
                      </div>
                    </div>

                    {/* Lock reason warning if present */}
                    {book.lockReason && (
                      <div className="rounded-lg bg-amber-50 p-2.5 border border-amber-200/80 text-[11px] text-amber-900 font-medium flex items-center gap-2">
                        <Lock className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                        <span>
                          <strong className="font-bold">Không thể gia hạn:</strong> {book.lockReason}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center gap-2">
                  {book.canRenew ? (
                    <>
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

                      {book.id === "b1" && (
                        <button
                          onClick={() => handleReturnItem(book.id)}
                          className="w-full lg:w-auto flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-2.5 text-xs font-bold text-blue-950 hover:bg-blue-100 transition-colors"
                        >
                          <Globe className="h-3.5 w-3.5 text-blue-700" />
                          <span>Trả qua Kiosk 24/7</span>
                        </button>
                      )}

                      {book.subtext && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          {book.subtext}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        disabled
                        className="w-full lg:w-auto flex items-center justify-center gap-2 rounded-xl bg-slate-200 px-5 py-2.5 text-xs font-bold text-slate-500 cursor-not-allowed border border-slate-300/60"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        <span>{book.buttonText}</span>
                      </button>

                      <span className="text-[11px] text-slate-400 font-medium">
                        {book.subtext}
                      </span>
                    </>
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
