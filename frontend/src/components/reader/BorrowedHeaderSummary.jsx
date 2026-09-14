import { BookOpen, CreditCard, ShieldCheck } from "lucide-react";

const BorrowedHeaderSummary = ({ profile }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl">
      {/* Background decorative elements */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Info Column */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Sách đang mượn & Gia hạn
          </h2>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1 text-xs font-semibold text-sky-200 backdrop-blur-md border border-white/10">
              <span className="opacity-75">THẺ THÀNH VIÊN:</span>
              <span className="font-mono text-white tracking-wide">
                {profile?.cardNumber || "SV-2024-8841"}
              </span>
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300 border border-emerald-500/30">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {profile?.status || "Đang hoạt động"}
            </span>
          </div>
        </div>

        {/* Right Stat Cards: 2 Cards (Hạn mức mượn & Tổng dư nợ phạt) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto shrink-0 sm:min-w-[340px]">
          {/* Stat 1: Hạn mức mượn */}
          <div className="flex flex-col justify-between rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all">
            <div className="flex items-center justify-between text-xs text-sky-200 font-medium">
              <span>Hạn mức mượn</span>
              <BookOpen className="h-4 w-4 text-sky-300 opacity-80" />
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">
                {profile?.currentBorrows ?? 3}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                / {profile?.maxBorrows ?? 5} cuốn
              </span>
            </div>
            <div className="mt-2 text-[11px] text-sky-200/90 font-medium">
              Khả dụng: <span className="font-bold text-white">2 suất tiêu chuẩn</span>
            </div>
          </div>

          {/* Stat 2: Tổng dư nợ phạt */}
          <div className="flex flex-col justify-between rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all">
            <div className="flex items-center justify-between text-xs text-sky-200 font-medium">
              <span>Tổng dư nợ phạt</span>
              <CreditCard className="h-4 w-4 text-sky-300 opacity-80" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white">
                {profile?.unpaidFine || "0 VNĐ"}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-300 font-medium">
              <ShieldCheck className="h-3 w-3" />
              <span>{profile?.accountStatus || "Tài khoản chuẩn mực"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowedHeaderSummary;
