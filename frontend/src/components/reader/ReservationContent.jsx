import { useState } from "react";
import {
  ShoppingBag,
  ListOrdered,
  BarChart3,
  Zap,
  Clock,
  QrCode,
  CheckCircle2,
  X,
  MapPin,
  Bot,
  Bell,
  BookOpen,
  Lightbulb,
  LibraryBig,
  ShieldCheck,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUEUE_ITEMS = [
  {
    id: "q1",
    barcode: "QA-8P-G4",
    position: "Thứ 1 / 3",
    positionNum: 1,
    totalQueue: 3,
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&auto=format&fit=crop&q=80",
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    registeredDate: "18/11/2024",
    expectedDate: "24/11/2024",
    isNext: true,
    progressPct: 85,
    progressColor: "bg-teal-500",
    currentHolder: "Độc giả hiện tại đang mượn (đến hạn: 23/11)",
    processing: "Khử trùng & phân loại (1 ngày)",
    notificationLabel: "Đặt thông báo qua SMS & Zala",
    notificationEnabled: false,
  },
  {
    id: "q2",
    barcode: "EC-FZN-99",
    position: "Thứ 2 / 4",
    positionNum: 2,
    totalQueue: 4,
    cover: "https://images.unsplash.com/photo-1509021436468-d5103e3f74d3?w=300&auto=format&fit=crop&q=80",
    title: "Tâm Lý Học Về Tiền (The Psychology of Money)",
    author: "Morgan Housel",
    registeredDate: "15/11/2024",
    expectedDate: "28/11/2024",
    isNext: false,
    progressPct: 45,
    progressColor: "bg-amber-400",
    currentHolder: "Bạn đọc #1 đang giữ quyền hạn (hạn: 25/11)",
    processing: "Dự kiến lượt của bạn: 28/11",
    notificationLabel: "Đã kích hoạt cảnh báo qua Email & Zala",
    notificationEnabled: true,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, sublabel, badge, number, unit, desc, icon, barSegments }) {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-extrabold tracking-widest uppercase text-slate-400">
            {label}
          </p>
          {sublabel && (
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{sublabel}</p>
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
          {barSegments.map((s, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${s}`} />
          ))}
        </div>
      )}
    </div>
  );
}

function UrgentPickupCard() {
  const [confirmed, setConfirmed] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  if (cancelled) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center text-xs text-slate-500">
        Bạn đã hủy đặt trước. Lượt sách sẽ được chuyển sang người tiếp theo trong hàng chờ.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-teal-200/80 bg-white shadow-xs overflow-hidden">
      {/* Urgency header bar */}
      <div className="flex items-center gap-2 bg-teal-700 px-5 py-2.5">
        <Zap className="h-4 w-4 text-white" />
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-white">
          Hành động khẩn cấp
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-extrabold text-slate-900 mb-4">
          Sách Đã Có Sẵn Tại Quầy — Hãy Đến Nhận
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Book card */}
          <div className="lg:col-span-7 space-y-3">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 flex gap-4">
              {/* Cover with Sẵn badge */}
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80"
                  alt="Lập Trình Hệ Thống Với Rust"
                  className="h-28 w-20 rounded-xl object-cover border border-slate-200 shadow-xs"
                />
                <span className="absolute top-1 left-1 rounded-md bg-teal-600 px-1.5 py-0.5 text-[10px] font-black text-white">
                  Sẵn
                </span>
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded bg-slate-200 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-600">
                    MÃ: #HOLD-8021
                  </span>
                  <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700">
                    QA-RUST-...
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                  Lập Trình Hệ Thống Với Rust
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Tác giả: Steve Klabnik & Carol Nichols · NXB Tri Thức Số 2023
                </p>

                <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-600 font-medium">
                  <span className="flex items-center gap-1">
                    <LibraryBig className="h-3.5 w-3.5 text-slate-400" />
                    Quầy lưu Thông Tầng 1
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="flex items-center gap-1">
                    <Bot className="h-3.5 w-3.5 text-blue-500" />
                    Tủ thông minh: Kiosk-01 (Ngăn B-04)
                  </span>
                </div>
              </div>
            </div>

            {/* Warning footer */}
            <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-1.5 leading-relaxed">
              <Clock className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              Sau 17:00 ngày 22/11/2024, quyền ưu tiên sẽ tự động chuyển giao cho bạn đọc kế tiếp trong hàng chờ.
            </p>
          </div>

          {/* Right: Actions */}
          <div className="lg:col-span-5 flex flex-col gap-3 justify-start">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-3 py-1.5">
              <Clock className="h-4 w-4 text-teal-600" />
              <span>
                Còn <strong>28 giờ</strong>
                <span className="text-[11px] font-normal text-teal-600 ml-1">
                  (Hết hạn 17:00, 22/11/2024)
                </span>
              </span>
            </div>

            {confirmed ? (
              <div className="rounded-xl bg-emerald-600 px-5 py-3 text-center text-xs font-bold text-white flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Đã xác nhận — Hẹn gặp bạn tại Kiosk-01!
              </div>
            ) : (
              <>
                <button className="rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white hover:bg-blue-900 transition-colors flex items-center justify-center gap-2 shadow-xs">
                  <QrCode className="h-4 w-4" />
                  Mã QR Nhận Sách Tại Quầy
                </button>

                <button
                  onClick={() => setConfirmed(true)}
                  className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Xác nhận sẽ đến lấy
                </button>

                <button
                  onClick={() => setCancelled(true)}
                  className="text-center text-xs text-slate-400 hover:text-red-600 transition-colors font-medium py-1"
                >
                  Hủy đặt trước nhường lượt
                </button>
              </>
            )}

            <p className="text-[10px] text-slate-400 text-center font-medium">
              Chính sách mượn 2024 · Khoảo 4.2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QueueItemCard({ item: initial }) {
  const [item, setItem] = useState(initial);
  const [cancelled, setCancelled] = useState(false);

  if (cancelled) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs font-semibold text-slate-400 flex items-center justify-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-slate-300" />
        Đã hủy hàng chờ cho sách "{item.title}"
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all">
      {/* Main row */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Book cover */}
        <div className="lg:col-span-1 flex justify-center">
          <img
            src={item.cover}
            alt={item.title}
            className="h-24 w-16 rounded-xl object-cover border border-slate-200 shadow-xs"
          />
        </div>

        {/* Book info */}
        <div className="lg:col-span-8 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
              {item.barcode}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-800">
              <MapPin className="h-2.5 w-2.5" /> Vị trí: {item.position}
            </span>
          </div>

          <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{item.title}</h4>
          <p className="text-xs text-slate-500">{item.author}</p>
        </div>

        {/* Date registered */}
        <div className="lg:col-span-3 text-right">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Ngày đặt</p>
          <p className="text-base font-extrabold text-slate-900">{item.registeredDate}</p>
        </div>
      </div>

      {/* Progress bar row */}
      <div className="px-5 pb-2 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-teal-500" />
            <span>Dự kiến có sách: <strong className="text-slate-800">{item.expectedDate}</strong></span>
          </div>
          {item.isNext ? (
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-bold text-teal-800 border border-teal-200">
              Bạn là người tiếp theo
            </span>
          ) : (
            <span className="text-amber-700 font-semibold">Còn 1 bạn đọc phía trước</span>
          )}
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${item.progressColor}`}
            style={{ width: `${item.progressPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-medium text-slate-400">
          <span>{item.currentHolder}</span>
          <span>{item.processing}</span>
        </div>
      </div>

      {/* Footer: notification toggle + cancel */}
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 bg-slate-50/50">
        <label className="flex items-center gap-2 cursor-pointer">
          {/* Toggle switch */}
          <button
            type="button"
            onClick={() => setItem((prev) => ({ ...prev, notificationEnabled: !prev.notificationEnabled }))}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              item.notificationEnabled ? "bg-teal-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                item.notificationEnabled ? "left-4" : "left-0.5"
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
            <Bell className="h-3.5 w-3.5 text-slate-400" />
            {item.notificationLabel}
          </div>
        </label>

        <button
          onClick={() => setCancelled(true)}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-red-600 transition-colors"
        >
          <X className="h-3.5 w-3.5" /> Hủy hàng chờ
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const ReservationContent = () => {
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
          Theo dõi tiến độ giữ chỗ ấn phẩm, quản lý thời hạn nhận tại quầy tự phục vụ và đề xuất bổ sung nguồn tài liệu nghiên cứu chuyên sâu.
        </p>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Sách đã sẵn sàng lấy"
          sublabel="Hạn chót: 17:00 ngày nay"
          icon={<ShoppingBag className="h-5 w-5" />}
          number="01"
          unit="cuốn có sẵn"
          desc="Đang lưu giữ an toàn tại: Tủ nhận tự động Kiosk-01, Tầng 1."
        />
        <StatCard
          label="Đang xếp hàng chờ (HOLDS)"
          sublabel="Thứ tự ưu tiên độc quyền"
          icon={<ListOrdered className="h-5 w-5" />}
          number="02"
          unit="cuốn đang chờ trả"
          desc="Dự kiến cần gần nhất giải phóng vào ngày 24/11/2024."
        />
        <StatCard
          label="Hạn ngạch đặt trước"
          badge="Đã đạt ngưỡng tối đa"
          icon={<BarChart3 className="h-5 w-5" />}
          number="3 / 3"
          unit="suất sử dụng"
          desc=""
          barSegments={["bg-teal-500", "bg-teal-500", "bg-teal-500"]}
        />
      </div>

      {/* Urgent Pickup */}
      <UrgentPickupCard />

      {/* Queue List */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-sky-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              Hàng Chờ Ấn Phẩm ({QUEUE_ITEMS.length})
            </h3>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
            Thuật toán FIFO Thư viện
          </span>
        </div>

        <div className="space-y-4">
          {QUEUE_ITEMS.map((item) => (
            <QueueItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* System tip */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-3 text-xs text-slate-700">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100">
          <Lightbulb className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <span className="font-bold text-slate-900">Lời khuyên hệ thống</span>
          <p className="mt-0.5 text-slate-500 leading-relaxed font-normal">
            Bạn có thể đọc trước bản E-book tóm tắt hoặc ấn bản điện tử trực tiếp trên cổng học liệu số trong lúc xếp hàng chờ bản in vật lý.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReservationContent;
