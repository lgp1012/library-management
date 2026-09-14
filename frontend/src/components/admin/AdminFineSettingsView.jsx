import { Calculator, CheckCircle2, Coins, Save, Sliders } from "lucide-react";
import { useEffect, useState } from "react";

import { useAdmin } from "../../hooks/useAdmin";
import adminService from "../../services/adminService";

const FINE_TYPES = [
  {
    id: "OVERDUE",
    name: "Phạt trễ hạn trả sách (Overdue)",
    badge: "Tính theo ngày",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    rateLabel: "Mức phí phạt theo ngày (VNĐ / Ngày) *",
    rateSubtext: "Áp dụng nhân với tổng số ngày trễ hạn của mỗi cuốn sách.",
    defaultRate: 0,
    defaultDesc:
      "Quy định mức phạt trễ hạn tính lũy tiến theo số ngày mượn quá hạn.",
    formulaName: "Số ngày quá hạn × Đơn giá/ngày",
  },
  {
    id: "DAMAGED",
    name: "Phạt làm hư hỏng tài liệu (Damaged)",
    badge: "Theo mức độ",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
    rateLabel: "Mức phạt tổn hại tài liệu cơ sở (VNĐ) *",
    rateSubtext:
      "Áp dụng theo từng mức độ hư hỏng (rách trang, ố bẩn, viết vẽ).",
    defaultRate: 0,
    defaultDesc:
      "Quy định bồi hoàn tổn thất đối với tài liệu bị hư hại trong quá trình mượn.",
    formulaName: "Mức phạt cơ sở × Hệ số tổn hại tài liệu",
  },
  {
    id: "LOST",
    name: "Phạt làm mất sách (Lost Book)",
    badge: "Bồi thường + Phí",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
    rateLabel: "Phí dịch vụ & lưu thông mất sách (VNĐ) *",
    rateSubtext:
      "Phí thủ tục hành chính, mua lại và lập hồ sơ mã sách thay thế.",
    defaultRate: 0,
    defaultDesc:
      "Quy định bồi thường sách mất (Giá bìa sách × Hệ số bồi hoàn + Phí dịch vụ xử lý).",
    formulaName: "Giá bìa sách × 1.5 + Phí dịch vụ xử lý",
  },
  {
    id: "OTHER",
    name: "Vi phạm nội quy & kỷ luật khác (Other)",
    badge: "Hành chính",
    badgeClass: "bg-sky-100 text-sky-800 border-sky-200",
    rateLabel: "Mức phạt vi phạm (VNĐ / Lần) *",
    rateSubtext:
      "Áp dụng xử phạt hành chính đối với các vi phạm nội quy thư viện.",
    defaultRate: 0,
    defaultDesc:
      "Xử lý các hành vi vi phạm nội quy, làm ồn, mang sách trái phép khỏi phòng đọc.",
    formulaName: "Số lần vi phạm × Đơn giá phạt vi phạm",
  },
];

const AdminFineSettingsView = () => {
  const { fineSettings, setFineSettings } = useAdmin();
  const config = fineSettings?.[0];

  // Form State
  const [formData, setFormData] = useState({
    fineType: config?.fineType || "OVERDUE",
    fineRatePerDay: config?.fineRatePerDay || 5000,
    descriptionFine: config?.descriptionFine || "",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if config arrives from backend
  useEffect(() => {
    if (config) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        fineType: config.fineType || "OVERDUE",
        fineRatePerDay: config.fineRatePerDay || 5000,
        descriptionFine: config.descriptionFine || "",
      });
    }
  }, [config]);

  // Current selected fine type info
  const selectedTypeInfo =
    FINE_TYPES.find((t) => t.id === formData.fineType) || FINE_TYPES[0];

  // Simulator controls
  const [simulatedDays, setSimulatedDays] = useState(10);
  const [damageSeverity, setDamageSeverity] = useState(50); // 20% | 50% | 100%
  const [bookPrice, setBookPrice] = useState(150000); // 150.000 VNĐ
  const [violationCount, setViolationCount] = useState(2);

  // Type-specific calculator logic
  const calculateTotalFine = () => {
    if (formData.fineType === "OVERDUE") {
      return simulatedDays * formData.fineRatePerDay;
    }
    if (formData.fineType === "DAMAGED") {
      return (formData.fineRatePerDay * damageSeverity) / 100;
    }
    if (formData.fineType === "LOST") {
      return bookPrice * 1.5 + formData.fineRatePerDay;
    }
    return violationCount * formData.fineRatePerDay;
  };

  const totalAssessedFine = calculateTotalFine();

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val || 0);
  };

  const handleTypeChange = (newType) => {
    const matched = FINE_TYPES.find((t) => t.id === newType);
    setFormData((prev) => ({
      ...prev,
      fineType: newType,
      fineRatePerDay: matched ? matched.defaultRate : prev.fineRatePerDay,
      descriptionFine:
        !prev.descriptionFine ||
        FINE_TYPES.some((t) => t.defaultDesc === prev.descriptionFine)
          ? matched?.defaultDesc || prev.descriptionFine
          : prev.descriptionFine,
    }));
  };

  const handleSavePolicy = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fineType: formData.fineType,
        fineRatePerDay: formData.fineRatePerDay,
        descriptionFine: formData.descriptionFine,
      };
      const res = await adminService.updateFineConfig(payload);
      setFineSettings([res.result]);
      setFormData({
        fineType: res.result.fineType,
        fineRatePerDay: res.result.fineRatePerDay,
        descriptionFine: res.result.descriptionFine,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error) {
      alert(
        "Lỗi cập nhật cấu hình: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Coins className="h-6 w-6 text-amber-600" />
          <span>Cấu hình Biểu phí & Chính sách Phạt</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Thiết lập loại hình vi phạm, mức phạt quy chuẩn và kiểm tra công thức
          tính toán phạt thực tế cho từng trường hợp.
        </p>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Parameters Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-sky-600" />
              <span>THÔNG SỐ CẤU HÌNH PHÍ PHẠT</span>
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">
              Đơn vị: VNĐ (₫)
            </span>
          </div>

          <form onSubmit={handleSavePolicy} className="space-y-5 text-xs">
            {/* Fine Type Selector */}
            <div>
              <label className="font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Loại vi phạm / Hình thức phạt (Fine Type) *</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${selectedTypeInfo.badgeClass}`}
                >
                  {selectedTypeInfo.badge}
                </span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FINE_TYPES.map((type) => {
                  const isSelected = formData.fineType === type.id;
                  return (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => handleTypeChange(type.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-sky-600 bg-sky-50/70 text-sky-950 shadow-xs ring-1 ring-sky-500"
                          : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs">
                          {type.name}
                        </span>
                        <div
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "border-sky-600 bg-sky-600"
                              : "border-slate-300"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">
                        {type.formulaName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Dynamic Rate Input based on selected fineType */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {selectedTypeInfo.rateLabel}
                </label>
                <input
                  type="number"
                  step="1"
                  min={0}
                  required
                  value={formData.fineRatePerDay}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fineRatePerDay: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-sky-500 focus:bg-white text-slate-900"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  {selectedTypeInfo.rateSubtext}
                </p>
              </div>

              {/* Description Fine */}
              <div>
                <label
                  htmlFor="descriptionFine"
                  className="block font-bold text-slate-700 mb-1"
                >
                  Ghi chú quy chế xử phạt
                </label>
                <input
                  id="descriptionFine"
                  type="text"
                  value={formData.descriptionFine}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      descriptionFine: e.target.value,
                    })
                  }
                  placeholder="Mô tả chính sách phạt..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-sky-500 focus:bg-white text-slate-900"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Hiển thị trên thông báo và phiếu thu phạt của độc giả.
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Lần cuối:{" "}
                {config?.updatedAt
                  ? new Date(config.updatedAt).toLocaleString("vi-VN")
                  : "Chưa cập nhật"}
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
                  <span>Lưu & Áp dụng chính sách</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column (5 cols): Type-Specific Penalty Calculator */}
        <div className="lg:col-span-5 bg-sky-950 text-white rounded-3xl p-6 shadow-xl border border-sky-800 space-y-5">
          <div className="pb-3 border-b border-sky-900 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-amber-400" />
                <span>GIẢ LẬP CÔNG THỨC PHẠT</span>
              </h2>
              <p className="text-xs text-sky-200/80 mt-0.5">
                Kiểu phạt:{" "}
                <span className="font-bold text-amber-300">
                  {selectedTypeInfo.name}
                </span>
              </p>
            </div>
          </div>

          {/* Type-Specific Interactive Controls */}
          <div className="space-y-4 text-xs">
            {formData.fineType === "OVERDUE" && (
              <div>
                <div className="flex items-center justify-between mb-2 font-bold">
                  <span className="text-slate-300">
                    Giả lập số ngày trễ hạn:
                  </span>
                  <span className="text-amber-400 font-mono text-sm">
                    {simulatedDays} ngày
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={60}
                  value={simulatedDays}
                  onChange={(e) =>
                    setSimulatedDays(Number.parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-sky-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-sky-400 mt-1 font-mono">
                  <span>1 ngày</span>
                  <span>30 ngày</span>
                  <span>60 ngày</span>
                </div>
              </div>
            )}

            {formData.fineType === "DAMAGED" && (
              <div>
                <div className="flex items-center justify-between mb-2 font-bold">
                  <span className="text-slate-300">
                    Mức độ hư hại tài liệu:
                  </span>
                  <span className="text-rose-300 font-mono text-sm font-bold">
                    {(() => {
                      if (damageSeverity === 20) {
                        return "Nhẹ (20%)";
                      } else if (damageSeverity === 50) {
                        return "Trung bình (50%)";
                      } else {
                        return "Nặng / Hỏng hoàn toàn (100%)";
                      }
                    })()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[20, 50, 100].map((rate) => (
                    <button
                      type="button"
                      key={rate}
                      onClick={() => setDamageSeverity(rate)}
                      className={`py-2 rounded-xl font-bold border text-xs transition-all ${
                        damageSeverity === rate
                          ? "bg-rose-500/20 border-rose-400 text-rose-300"
                          : "bg-sky-900/40 border-sky-800 text-slate-300 hover:bg-sky-900"
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
            )}

            {formData.fineType === "LOST" && (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1 font-bold">
                    <span className="text-slate-300">Giá bìa sách gốc:</span>
                    <span className="text-purple-300 font-mono text-sm font-bold">
                      {formatCurrency(bookPrice)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={500000}
                    step={10000}
                    value={bookPrice}
                    onChange={(e) =>
                      setBookPrice(Number.parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-sky-900 rounded-lg appearance-none cursor-pointer accent-purple-400"
                  />
                  <div className="flex justify-between text-[10px] text-sky-400 mt-1 font-mono">
                    <span>50.000đ</span>
                    <span>250.000đ</span>
                    <span>500.000đ</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 bg-sky-900/40 p-2.5 rounded-xl border border-sky-800">
                  Phí đền bù = Giá sách × 1.5 (hệ số đền) + Phí dịch vụ xử lý (
                  {formatCurrency(formData.fineRatePerDay)}).
                </div>
              </div>
            )}

            {formData.fineType === "OTHER" && (
              <div>
                <div className="flex items-center justify-between mb-2 font-bold">
                  <span className="text-slate-300">
                    Số lần vi phạm ghi nhận:
                  </span>
                  <span className="text-sky-300 font-mono text-sm">
                    {violationCount} lần
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={violationCount}
                  onChange={(e) =>
                    setViolationCount(Number.parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-sky-900 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
                <div className="flex justify-between text-[10px] text-sky-400 mt-1 font-mono">
                  <span>1 lần</span>
                  <span>5 lần</span>
                  <span>10 lần</span>
                </div>
              </div>
            )}
          </div>

          {/* Formula Breakdown */}
          <div className="bg-sky-900/50 rounded-2xl p-4 border border-sky-800 space-y-2 text-xs">
            <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wider pb-1.5 border-b border-sky-800">
              CHI TIẾT DIỄN GIẢI
            </div>

            {formData.fineType === "OVERDUE" && (
              <>
                <div className="flex justify-between">
                  <span className="text-sky-200">Số ngày trễ:</span>
                  <span className="font-mono font-bold text-white">
                    {simulatedDays} ngày
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-200">Đơn giá phạt / ngày:</span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(formData.fineRatePerDay)}
                  </span>
                </div>
              </>
            )}

            {formData.fineType === "DAMAGED" && (
              <>
                <div className="flex justify-between">
                  <span className="text-sky-200">Mức phạt cơ sở:</span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(formData.fineRatePerDay)}
                  </span>
                </div>
                <div className="flex justify-between text-rose-300">
                  <span>Hệ số tỷ lệ hư hại:</span>
                  <span className="font-mono font-bold">{damageSeverity}%</span>
                </div>
              </>
            )}

            {formData.fineType === "LOST" && (
              <>
                <div className="flex justify-between">
                  <span className="text-sky-200">Giá bìa sách:</span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(bookPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-purple-300">
                  <span>Tiền bồi thường sách (150%):</span>
                  <span className="font-mono font-bold">
                    {formatCurrency(bookPrice * 1.5)}
                  </span>
                </div>
                <div className="flex justify-between text-sky-200">
                  <span>Phí dịch vụ xử lý:</span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(formData.fineRatePerDay)}
                  </span>
                </div>
              </>
            )}

            {formData.fineType === "OTHER" && (
              <>
                <div className="flex justify-between">
                  <span className="text-sky-200">Số lần vi phạm:</span>
                  <span className="font-mono font-bold text-white">
                    {violationCount} lần
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-200">Mức phạt mỗi lần:</span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(formData.fineRatePerDay)}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Total Assessed Fine Result */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                TỔNG TIỀN PHẠT TÍNH TOÁN
              </div>
              <div className="text-xs text-sky-200/80 font-mono">
                {selectedTypeInfo.formulaName}
              </div>
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
