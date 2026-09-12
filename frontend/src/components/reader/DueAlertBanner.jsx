import { useState } from "react";
import { Bell } from "lucide-react";

const DueAlertBanner = ({ alertData, onRenewSuccess }) => {
  const [dismissed, setDismissed] = useState(false);
  const [renewed, setRenewed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-200/90 bg-amber-50/90 p-4 sm:p-5 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-700 text-white shadow-xs">
            <Bell className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900">
                Cảnh báo hoàn trả sách định kỳ
              </h3>
              <span className="rounded bg-amber-200/70 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
                Hôm nay
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {renewed ? (
                <span className="font-semibold text-emerald-700">
                  ✓ Bạn đã gia hạn thành công thêm +7 ngày cho sách "{alertData?.bookTitle || "Nhập môn Cấu trúc Dữ liệu & Giải thuật"}".
                </span>
              ) : (
                <>
                  Sách <strong className="font-semibold text-slate-900">"{alertData?.bookTitle || "Nhập môn Cấu trúc Dữ liệu & Giải thuật"}"</strong> cần trả trước {alertData?.deadlineTime || "17:00 ngày 25/11/2024"} để tránh phí phạt trễ hạn ({alertData?.finePerDay || "5.000 đ/ngày"}).
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {!renewed ? (
            <>
              <button
                onClick={() => setDismissed(true)}
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Bỏ qua
              </button>
              <button
                onClick={() => {
                  setRenewed(true);
                  if (onRenewSuccess) onRenewSuccess();
                }}
                className="rounded-lg bg-blue-950 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-900 transition-colors"
              >
                Gia hạn ngay (+7 ngày)
              </button>
            </>
          ) : (
            <button
              onClick={() => setDismissed(true)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              Đã hiểu
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DueAlertBanner;
