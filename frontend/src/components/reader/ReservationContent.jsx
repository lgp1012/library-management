import {
  BookOpen,
  Clock,
  ListOrdered,
  MapPin,
  ShoppingBag,
  X,
  Zap,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import ReaderContext from "../../contexts/readerContext";
import readerService from "../../services/readerService";

function StatCard({
  label,
  sublabel,
  badge,
  number,
  unit,
  desc,
  icon,
  barSegments,
}) {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-extrabold tracking-widest uppercase text-slate-400">
            {label}
          </p>
          {sublabel && (
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
              {sublabel}
            </p>
          )}
          {badge && (
            <p className="text-[11px] font-bold text-red-600 mt-0.5">{badge}</p>
          )}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 shrink-0">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-black text-slate-900">{number}</span>
        <span className="text-sm font-bold text-slate-600">{unit}</span>
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p>

      {barSegments && (
        <div className="flex gap-1 pt-1">
          {barSegments.map((s) => (
            <div key={s} className={`h-2 flex-1 rounded-full ${s}`} />
          ))}
        </div>
      )}
    </div>
  );
}

const ReservationContent = () => {
  const { catalogBooks } = useContext(ReaderContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await readerService.listReservations();
      if (res.result) {
        setReservations(res.result);
      }
    } catch (err) {
      console.error("Failed to fetch reservations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (reservationId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đặt trước này không?"))
      return;
    setCancelingId(reservationId);
    try {
      await readerService.cancelReservation(reservationId);
      await fetchReservations();
    } catch (err) {
      console.error("Failed to cancel", err);
      alert(err.response?.data?.message || "Lỗi khi hủy đặt trước.");
    } finally {
      setCancelingId(null);
    }
  };

  // Filter lists
  const activeReservations = reservations.filter(
    (r) => r.status === "Chưa xử lý" || r.status === "Đang đợi xử lý",
  );

  const readyReservations = reservations.filter((r) => r.status === "Đã xử lý");

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Hàng chờ Đặt trước & Yêu cầu
        </h2>
        <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-2xl">
          Theo dõi tiến độ giữ chỗ ấn phẩm, quản lý thời hạn nhận tại quầy phục
          vụ và đề xuất bổ sung nguồn tài liệu nghiên cứu chuyên sâu.
        </p>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Sách đã sẵn sàng lấy"
          icon={<ShoppingBag className="h-5 w-5" />}
          number={
            readyReservations.length < 10
              ? `${readyReservations.length}`
              : readyReservations.length
          }
          unit="cuốn có sẵn"
          desc="Đang lưu giữ an toàn tại quầy thư viện"
        />
        <StatCard
          label="Đang xếp hàng chờ (HOLDS)"
          icon={<ListOrdered className="h-5 w-5" />}
          number={
            activeReservations.length < 10
              ? `${activeReservations.length}`
              : activeReservations.length
          }
          unit="cuốn đang chờ"
          desc="Thứ tự ưu tiên độc quyền của bạn"
        />
      </div>

      {/* Urgent Pickup */}
      {readyReservations.length > 0 && (
        <section className="rounded-xl border border-teal-500/30 bg-white overflow-hidden shadow-sm">
          <div className="bg-teal-600 px-4 py-2.5 flex items-center gap-2 text-white">
            <Zap className="h-4 w-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Hành động khẩn cấp
            </h3>
          </div>

          <div className="p-5">
            <h4 className="text-lg font-black text-slate-900 mb-4">
              Sách Đã Có Sẵn Tại Quầy — Hãy Đến Nhận
            </h4>

            <div className="space-y-4">
              {readyReservations.map((item) => {
                const bookInfo =
                  catalogBooks.find((b) => b.id === item.bookId) || {};

                return (
                  <div
                    key={item.reservationId}
                    className="flex flex-col lg:flex-row gap-5 items-start"
                  >
                    {/* Left: Book details card */}
                    <div className="flex-1 rounded-xl bg-slate-50 border border-slate-100 p-4 w-full">
                      <div className="flex gap-4">
                        <img
                          src={
                            bookInfo.coverImage ||
                            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80"
                          }
                          alt={item.bookName}
                          className="h-24 w-16 rounded-lg object-cover shadow-sm border border-slate-200"
                        />
                        <div className="flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                              {item.bookId}
                            </span>
                            <span className="rounded bg-sky-100 border border-sky-200 text-sky-800 px-2 py-0.5 font-mono text-[10px] font-bold">
                              {bookInfo.shelfLocation || "Chưa rõ vị trí"}
                            </span>
                          </div>
                          <h5 className="font-extrabold text-slate-900 leading-snug text-sm">
                            {item.bookName}
                          </h5>
                          <p className="text-xs text-slate-500">
                            Tác giả: {bookInfo.author || "Không rõ"} - NXB{" "}
                            {bookInfo.year || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="w-full lg:w-72 shrink-0 space-y-3">
                      <div className="flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 border border-teal-100">
                        <Clock className="h-4 w-4 text-teal-600" />
                        <span className="text-xs text-teal-800">
                          Hạn chót lấy sách:{" "}
                          <strong className="font-bold">
                            {item.expiryDate
                              ? new Date(item.expiryDate).toLocaleDateString(
                                  "vi-VN",
                                )
                              : "Hôm nay"}
                          </strong>
                        </span>
                      </div>

                      <button
                        onClick={() => handleCancel(item.reservationId)}
                        disabled={cancelingId === item.reservationId}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-200 hover:text-red-600 transition-colors"
                      >
                        {cancelingId === item.reservationId
                          ? "Đang xử lý..."
                          : "Hủy đặt trước nhường lượt"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-lg bg-amber-50 px-4 py-2 border border-amber-200/50 flex items-center gap-2 text-[11px] text-amber-800">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>
                Sau hạn chót lấy sách, quyền ưu tiên sẽ tự động chuyển giao cho
                bạn đọc kế tiếp trong hàng chờ.
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Queue List */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-sky-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              Hàng Chờ Ấn Phẩm ({activeReservations.length})
            </h3>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">Đang tải dữ liệu...</div>
        ) : activeReservations.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
            Bạn hiện không có sách nào đang xếp hàng chờ.
          </div>
        ) : (
          <div className="space-y-4">
            {activeReservations.map((item) => {
              const bookInfo =
                catalogBooks.find((b) => b.id === item.bookId) || {};
              const isUnprocessed = item.status === "Chưa xử lý";

              return (
                <div
                  key={item.reservationId}
                  className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-5">
                    {/* Book cover */}
                    <div className="lg:col-span-1 flex justify-center">
                      <img
                        src={
                          bookInfo.coverImage ||
                          "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&auto=format&fit=crop&q=80"
                        }
                        alt={item.bookName}
                        className="h-24 w-16 rounded-xl object-cover border border-slate-200 shadow-xs"
                      />
                    </div>

                    {/* Book info */}
                    <div className="lg:col-span-8 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                          {item.bookId}
                        </span>
                        <span className="flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                          <MapPin className="h-2.5 w-2.5" />{" "}
                          {bookInfo.shelfLocation || "Chưa rõ vị trí"}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                        {item.bookName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {bookInfo.author || "Không rõ"}
                      </p>
                    </div>

                    {/* Date registered */}
                    <div className="lg:col-span-3 text-right">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                        Ngày đặt
                      </p>
                      <p className="text-base font-extrabold text-slate-900">
                        {new Date(item.reservationDate).toLocaleDateString(
                          "vi-VN",
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar row */}
                  <div className="px-5 pb-2 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-teal-500" />
                        <span>
                          Trạng thái:{" "}
                          <strong className="text-slate-800">
                            {item.status}
                          </strong>
                        </span>
                      </div>
                      {item.status === "Đang đợi xử lý" ? (
                        <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-bold text-sky-800 border border-sky-200">
                          {item.estimatedAvailableDate
                            ? `Sắp có sách: ${new Date(item.estimatedAvailableDate).toLocaleDateString("vi-VN")}`
                            : "Đang đợi sách trả về"}
                        </span>
                      ) : isUnprocessed ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 border border-slate-200">
                          {item.estimatedAvailableDate
                            ? `Sắp có sách: ${new Date(item.estimatedAvailableDate).toLocaleDateString("vi-VN")}`
                            : "Chờ nhân viên xử lý"}
                        </span>
                      ) : (
                        <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-bold text-teal-800 border border-teal-200">
                          Đang chuẩn bị sách
                        </span>
                      )}
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${item.status === "Đang đợi xử lý" ? "bg-sky-400" : isUnprocessed ? "bg-amber-400" : "bg-teal-500"}`}
                        style={{
                          width:
                            item.status === "Đang đợi xử lý"
                              ? "65%"
                              : isUnprocessed
                                ? "50%"
                                : "80%",
                        }}
                      />
                    </div>
                  </div>

                  {/* Footer: cancel */}
                  <div className="flex items-center justify-end border-t border-slate-100 px-5 py-3 bg-slate-50/50 mt-3">
                    <button
                      onClick={() => handleCancel(item.reservationId)}
                      disabled={cancelingId === item.reservationId}
                      className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-red-600 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />{" "}
                      {cancelingId === item.reservationId
                        ? "Đang hủy..."
                        : "Hủy hàng chờ"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ReservationContent;
