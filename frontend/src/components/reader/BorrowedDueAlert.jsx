import { Bell, RefreshCw } from "lucide-react";

const BorrowedDueAlert = ({ nearestDueBook }) => {
  if (!nearestDueBook) {
    return null; // Don't show anything if there's no near due book
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-red-50/50 p-1">
      {/* Red accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:pl-5">
        <div className="flex items-start gap-4">
          <div className="mt-1 shrink-0 rounded-full bg-red-100 p-2 shadow-sm border border-red-200">
            <Bell className="h-5 w-5 text-red-600 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-red-950 uppercase tracking-wide">
                Cảnh báo hạn trả sắp đến:
              </h4>
              <span className="rounded bg-red-200 px-1.5 py-0.5 text-[10px] font-black text-red-800">
                CÒN {nearestDueBook.diffDays} NGÀY
              </span>
            </div>
            <p className="text-xs text-red-800/80 font-medium leading-relaxed max-w-2xl">
              Sách <strong className="font-bold text-red-900">"{nearestDueBook.title}"</strong> sẽ đến hạn trả 
              vào <strong className="font-bold text-red-900">{nearestDueBook.dueDate}</strong>. 
              Hãy gia hạn trực tuyến để tránh phát sinh phí phạt 5.000đ/ngày.
            </p>
          </div>
        </div>

        {nearestDueBook.canRenew && (
          <button 
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-500/30"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Gia hạn ngay lập tức</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BorrowedDueAlert;
