import { useState } from "react";
import BorrowedBookCard from "./BorrowedBookCard";
import { BookOpen, History, Clock } from "lucide-react";

const PersonalBorrowsSection = ({ books, onRenew, onReturn }) => {
  const [activeTab, setActiveTab] = useState("borrowed");

  return (
    <section className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold tracking-wider text-teal-700 uppercase">
            KHÔNG GIAN CÁ NHÂN
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Hồ sơ Mượn Trả & Đặt trước
          </h3>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100/80 p-1 border border-slate-200/60 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("borrowed")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "borrowed"
                ? "bg-white text-blue-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Sách đang mượn ({books.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "history"
                ? "bg-white text-blue-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>Lịch sử mượn trả</span>
          </button>

          <button
            onClick={() => setActiveTab("reserved")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "reserved"
                ? "bg-white text-blue-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Hàng chờ đặt trước (2)</span>
          </button>
        </div>
      </div>

      {/* Grid Content */}
      {activeTab === "borrowed" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <BorrowedBookCard
              key={book.id}
              book={book}
              onRenew={onRenew}
              onReturn={onReturn}
            />
          ))}
        </div>
      )}

      {activeTab === "history" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          <History className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <p className="text-sm font-medium">Hiển thị lịch sử 12 cuốn sách đã mượn & trả thành công trong năm 2024.</p>
        </div>
      )}

      {activeTab === "reserved" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          <Clock className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <p className="text-sm font-medium">Bạn có 2 cuốn sách đang xếp hàng chờ mượn (Machine Learning Yearning - Vị trí #1).</p>
        </div>
      )}
    </section>
  );
};

export default PersonalBorrowsSection;
