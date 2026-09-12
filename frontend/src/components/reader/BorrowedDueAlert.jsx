import { useState } from "react";
import { Bell, RefreshCw, CheckCircle2 } from "lucide-react";

const BorrowedDueAlert = ({ onRenewSuccess }) => {
  const [renewed, setRenewed] = useState(false);

  return (
    <div className="rounded-xl border border-rose-200/90 bg-rose-50/90 p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Icon & Info */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-700 text-white shadow-2xs">
            <Bell className="h-4 w-4" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-red-950">
                Cảnh báo hạn trả sắp đến:
              </h3>
              <span className="rounded-md bg-red-200/80 px-2 py-0.5 text-[11px] font-extrabold text-red-900 border border-red-300">
                CÒN 2 NGÀY
              </span>
            </div>

            <p className="text-xs text-rose-900 leading-relaxed font-normal">
              {renewed ? (
                <span className="font-bold text-teal-800 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  Đã gia hạn trực tuyến thành công +14 ngày cho sách "Cấu trúc Dữ liệu & Giải thuật". Hạn trả mới: 09/12/2024 (17:00).
                </span>
              ) : (
                <>
                  Sách <strong className="font-bold text-slate-900">"Cấu trúc Dữ liệu & Giải thuật"</strong> sẽ đến hạn trả vào <strong className="font-bold text-red-950">17:00 ngày 25/11/2024</strong>. Hãy gia hạn trực tuyến để tránh phát sinh phí phạt 5.000đ/ngày.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right Action Button */}
        <div className="shrink-0 self-end sm:self-center">
          {!renewed ? (
            <button
              onClick={() => {
                setRenewed(true);
                if (onRenewSuccess) onRenewSuccess("b1");
              }}
              className="rounded-xl bg-red-700 px-4 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-red-800 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Gia hạn ngay lập tức</span>
            </button>
          ) : (
            <span className="text-xs font-bold text-teal-800 bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200">
              Đã gia hạn
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowedDueAlert;
