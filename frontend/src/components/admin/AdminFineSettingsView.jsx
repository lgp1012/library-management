import {
  AlertCircle,
  Calculator,
  CheckCircle2,
  Coins,
  DollarSign,
  Info,
  Save,
  Sliders,
} from "lucide-react";
import { useState } from "react";

const AdminFineSettingsView = ({ fineSettings, setFineSettings }) => {
  // Local Form state initialized from props
  const [formData, setFormData] = useState({
    dailyFineRate: fineSettings.dailyFineRate || 5000,
    maxOverdueCap: fineSettings.maxOverdueCap || 250000,
    gracePeriodDays: fineSettings.gracePeriodDays || 2,
    lostMultiplier: fineSettings.lostMultiplier || 1.5,
    standardProcessingFee: fineSettings.standardProcessingFee || 120000,
    cashierWaiverLimit: fineSettings.cashierWaiverLimit || 100000,
    enableWaivers: fineSettings.enableWaivers ?? true,
    lastAdjusted: fineSettings.lastAdjusted || "2026-09-01",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Live Calculator State
  const [simulatedDays, setSimulatedDays] = useState(12);
  const [isDeclaredLost, setIsDeclaredLost] = useState(false);
  const [simulatedBookPrice, setSimulatedBookPrice] = useState(200000); // 200.000 VNĐ default sample book

  // Calculate fine real-time based on current form parameters + simulator state
  const effectiveDays = Math.max(0, simulatedDays - formData.gracePeriodDays);
  const rawFine = effectiveDays * formData.dailyFineRate;
  const cappedFine = Math.min(rawFine, formData.maxOverdueCap);

  const lostItemFine = isDeclaredLost
    ? simulatedBookPrice * formData.lostMultiplier + formData.standardProcessingFee
    : 0;

  const totalAssessedFine = cappedFine + lostItemFine;

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  const handleSavePolicy = (e) => {
    e.preventDefault();
    const updated = {
      ...formData,
      lastAdjusted: new Date().toISOString().split("T")[0],
    };
    setFineSettings(updated);
    setFormData(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Coins className="h-6 w-6 text-amber-600" />
          <span>Cấu hình Biểu phí & Phạt Quá hạn</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Chuẩn hóa mức phạt quá hạn theo ngày, hạn mức tích lũy tối đa, hệ số bồi thường sách mất và hạn mức miễn giảm phí tiếp tân.
        </p>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Overdue Rate Parameters Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-sky-600" />
              <span>THÔNG SỐ PHÍ PHẠT CHUẨN (OVERDUE RATE PARAMETERS)</span>
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">
              Đơn vị tiền tệ: VNĐ (₫)
            </span>
          </div>

          <form onSubmit={handleSavePolicy} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Daily Fine Rate */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mức phí phạt theo ngày (VNĐ / Ngày) *
                </label>
                <input
                  type="number"
                  step={500}
                  required
                  value={formData.dailyFineRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dailyFineRate: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-sky-500 focus:bg-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Áp dụng cho mỗi cuốn sách trễ hạn theo ngày lịch.
                </p>
              </div>

              {/* Maximum Overdue Cap */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hạn mức phạt tối đa (VNĐ) *
                </label>
                <input
                  type="number"
                  step={5000}
                  required
                  value={formData.maxOverdueCap}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxOverdueCap: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-sky-500 focus:bg-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Hạn mức trần tiền phạt tối đa cho 1 lượt mượn quá hạn.
                </p>
              </div>

              {/* Grace Period */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Thời gian ân hạn miễn phạt (Ngày) *
                </label>
                <input
                  type="number"
                  min={0}
                  max={14}
                  required
                  value={formData.gracePeriodDays}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gracePeriodDays: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-amber-600 outline-none focus:border-sky-500 focus:bg-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Miễn phí hoàn toàn nếu trả sách trong khung ân hạn này.
                </p>
              </div>

              {/* Lost Item Cost Multiplier */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hệ số bồi thường sách mất *
                </label>
                <input
                  type="number"
                  step={0.1}
                  min={1.0}
                  max={5.0}
                  required
                  value={formData.lostMultiplier}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lostMultiplier: parseFloat(e.target.value) || 1.0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-sky-500 focus:bg-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Ví dụ: 1.5x nghĩa là phạt 150% giá bìa sách mất.
                </p>
              </div>

              {/* Standard Processing Fee */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Phí xử lý hồ sơ chuẩn (VNĐ) *
                </label>
                <input
                  type="number"
                  step={5000}
                  required
                  value={formData.standardProcessingFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      standardProcessingFee: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-sky-500 focus:bg-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Bao gồm chi phí đóng lại bìa & dán nhãn lại mã RFID.
                </p>
              </div>

              {/* Cashier Waiver Limit */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hạn mức miễn giảm của tiếp tân (VNĐ) *
                </label>
                <input
                  type="number"
                  step={5000}
                  required
                  value={formData.cashierWaiverLimit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cashierWaiverLimit: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-sky-500 focus:bg-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Mức phí tối đa nhân viên quầy có quyền tự miễn giảm mà không cần Admin.
                </p>
              </div>
            </div>

            {/* Checkbox: Enable Front-Desk Waivers */}
            <div className="pt-2">
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableWaivers}
                  onChange={(e) =>
                    setFormData({ ...formData, enableWaivers: e.target.checked })
                  }
                  className="h-4 w-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                />
                <div>
                  <div className="font-bold text-slate-900">
                    Cho phép Nhân viên Quầy tự quyết định Miễn giảm Phí
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Cho phép thủ thư lưu thông xóa khoản phí tranh chấp nhỏ trong hạn mức quy định.
                  </div>
                </div>
              </label>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Điều chỉnh gần nhất: {formData.lastAdjusted}
              </span>
              <div className="flex items-center gap-3">
                {savedSuccess && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="h-4 w-4" /> Đã lưu thành công!
                  </span>
                )}
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Save className="h-4 w-4" />
                  <span>Lưu & Áp dụng chính sách phí phạt</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column (5 cols): Live Penalty Calculator */}
        <div className="lg:col-span-5 bg-sky-950 text-white rounded-3xl p-6 shadow-xl border border-sky-800 space-y-6">
          <div className="pb-4 border-b border-sky-900">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-amber-400" />
              <span>CÔNG CỤ GIẢ LẬP TÍNH PHÍ PHẠT (LIVE CALCULATOR)</span>
            </h2>
            <p className="text-xs text-sky-200/80 mt-1">
              Kiểm tra công thức tính phạt thực tế theo các tham số cấu hình của bạn.
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-4 text-xs">
            {/* Slider */}
            <div>
              <div className="flex items-center justify-between mb-2 font-bold">
                <span className="text-slate-300">Giả lập số ngày quá hạn:</span>
                <span className="text-amber-400 font-mono text-sm">
                  {simulatedDays} ngày trễ
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                value={simulatedDays}
                onChange={(e) => setSimulatedDays(parseInt(e.target.value))}
                className="w-full h-2 bg-sky-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-sky-400 mt-1 font-mono">
                <span>0 ngày</span>
                <span>30 ngày</span>
                <span>60 ngày</span>
              </div>
            </div>

            {/* Checkbox Lost Item */}
            <div className="pt-1">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-sky-900/60 border border-sky-800 cursor-pointer">
                <span className="font-bold text-sky-100">
                  Đánh dấu sách bị báo mất ("Declared Lost")
                </span>
                <input
                  type="checkbox"
                  checked={isDeclaredLost}
                  onChange={(e) => setIsDeclaredLost(e.target.checked)}
                  className="h-4 w-4 text-amber-400 rounded border-sky-700"
                />
              </label>
            </div>
          </div>

          {/* Formula Breakdown */}
          <div className="bg-sky-900/50 rounded-2xl p-4 border border-sky-800 space-y-2.5 text-xs">
            <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wider pb-2 border-b border-sky-800">
              DIỄN GIẢI CÔNG THỨC TÍNH PHẠT
            </div>

            <div className="flex justify-between">
              <span className="text-sky-200">Tổng số ngày trễ hạn:</span>
              <span className="font-mono font-bold text-white">{simulatedDays} ngày</span>
            </div>

            <div className="flex justify-between text-emerald-400">
              <span>Trừ số ngày ân hạn:</span>
              <span className="font-mono font-bold">-{formData.gracePeriodDays} ngày</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sky-200">Số ngày tính phí:</span>
              <span className="font-mono font-bold text-white">{effectiveDays} ngày</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sky-200">Đơn giá phạt / ngày:</span>
              <span className="font-mono font-bold text-white">
                {formatCurrency(formData.dailyFineRate)}
              </span>
            </div>

            <div className="flex justify-between text-sky-300">
              <span>Trần phạt tối đa:</span>
              <span className="font-mono font-bold">
                {formatCurrency(formData.maxOverdueCap)}
              </span>
            </div>

            {isDeclaredLost && (
              <div className="pt-2 border-t border-sky-800/80 flex justify-between text-amber-300">
                <span>Phí bồi thường sách mất ({formData.lostMultiplier}x):</span>
                <span className="font-mono font-bold">
                  {formatCurrency(lostItemFine)}
                </span>
              </div>
            )}
          </div>

          {/* Total Assessed Fine Result */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                TỔNG CHI PHÍ PHẠT TÍNH TOÁN
              </div>
              <div className="text-xs text-sky-200/80">Total Assessed Fine</div>
            </div>
            <div className="text-2xl font-extrabold text-amber-400 font-mono tracking-tight">
              {formatCurrency(totalAssessedFine)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFineSettingsView;
