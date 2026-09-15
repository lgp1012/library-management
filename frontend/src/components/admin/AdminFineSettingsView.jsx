import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  Coins,
  Edit,
  Plus,
  Save,
  Sliders,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import adminService from "../../services/adminService";
import formatCurrency from "../../utils/formatCurrency";

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
  const [viewMode, setViewMode] = useState("LIST"); // 'LIST' or 'FORM'
  const [editingConfig, setEditingConfig] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fineType: "OVERDUE",
    fineRatePerDay: 5000,
    descriptionFine: "",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Simulator controls
  const [simulatedDays, setSimulatedDays] = useState(10);
  const [damageSeverity, setDamageSeverity] = useState(50); // 20% | 50% | 100%
  const [bookPrice, setBookPrice] = useState(150000); // 150.000 VNĐ
  const [violationCount, setViolationCount] = useState(2);

  // Auto-switch to form if NO settings exist
  useEffect(() => {
    if (fineSettings?.length === 0) {
      // Do nothing, let user click create
    }
  }, [fineSettings]);

  const existingTypes = fineSettings ? fineSettings.map((f) => f.fineType) : [];

  const handleCreateNew = () => {
    // Find the first available type that is not configured
    const availableType = FINE_TYPES.find(
      (t) => !existingTypes.includes(t.id),
    )?.id;

    if (!availableType) {
      alert("Đã cấu hình đủ tất cả các loại phạt, không thể tạo thêm!");
      return;
    }

    const matched = FINE_TYPES.find((t) => t.id === availableType);

    setEditingConfig(null);
    setFormData({
      fineType: availableType,
      fineRatePerDay: matched ? matched.defaultRate : 5000,
      descriptionFine: matched ? matched.defaultDesc : "",
    });
    setViewMode("FORM");
  };

  const handleEdit = (config) => {
    setEditingConfig(config);
    setFormData({
      fineType: config.fineType,
      fineRatePerDay: config.fineRatePerDay,
      descriptionFine: config.descriptionFine || "",
    });
    setViewMode("FORM");
  };

  const handleDelete = async (configId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cấu hình này?")) {
      try {
        await adminService.deleteFineConfig(configId);
        setFineSettings((prev) => prev.filter((f) => f.configId !== configId));
      } catch (error) {
        alert(
          "Lỗi khi xóa cấu hình: " +
            (error.response?.data?.message || error.message),
        );
      }
    }
  };

  const handleTypeChange = (newType) => {
    if (editingConfig) return; // Cannot change type when editing

    // Each type can only have 1 config
    if (existingTypes.includes(newType)) return;

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

      if (editingConfig) {
        const res = await adminService.updateFineConfigById(
          editingConfig.configId,
          payload,
        );
        setFineSettings((prev) =>
          prev.map((f) =>
            f.configId === editingConfig.configId ? res.result : f,
          ),
        );
      } else {
        const res = await adminService.createFineConfig(payload);
        setFineSettings((prev) => [...prev, res.result]);
      }

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setViewMode("LIST");
      }, 1500);
    } catch (error) {
      alert(
        "Lỗi cập nhật cấu hình: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const selectedTypeInfo =
    FINE_TYPES.find((t) => t.id === formData.fineType) || FINE_TYPES[0];

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

  const renderListMode = () => {
    if (!fineSettings || fineSettings.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Coins className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">
            Chưa có cấu hình phí phạt
          </h3>
          <p className="text-slate-500 mb-6 max-w-md text-center text-sm">
            Hệ thống hiện chưa có bất kỳ cấu hình phạt nào được thiết lập. Vui
            lòng tạo cấu hình mới để quản lý phí phạt.
          </p>

          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Tạo cấu hình mới
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {fineSettings.map((config) => {
          const typeInfo =
            FINE_TYPES.find((t) => t.id === config.fineType) || FINE_TYPES[0];
          return (
            <div
              key={config.configId}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${typeInfo.badgeClass}`}
                  >
                    {typeInfo.badge}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(config)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(config.configId)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">
                  {typeInfo.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 h-8">
                  {config.descriptionFine}
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">
                    Mức phí
                  </div>
                  <div className="font-mono font-bold text-slate-700 text-lg">
                    {formatCurrency(config.fineRatePerDay)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderFormMode = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Parameters Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode("LIST")}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Sliders className="h-4 w-4 text-sky-600" />
                <span>
                  {editingConfig ? "CẬP NHẬT CẤU HÌNH" : "TẠO CẤU HÌNH MỚI"}
                </span>
              </h2>
            </div>
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
                  const isUniqueDisabled =
                    !editingConfig && existingTypes.includes(type.id);
                  const isEditingDisabled =
                    editingConfig && editingConfig.fineType !== type.id;
                  const disabled = isUniqueDisabled || isEditingDisabled;

                  return (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => handleTypeChange(type.id)}
                      disabled={disabled}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-sky-600 bg-sky-50/70 text-sky-950 shadow-xs ring-1 ring-sky-500"
                          : disabled
                            ? "border-slate-100 bg-slate-50/50 text-slate-400 cursor-not-allowed opacity-60"
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
                      <span
                        className={`text-[10px] mt-1 ${disabled && !isSelected ? "text-slate-400" : "text-slate-500"}`}
                      >
                        {disabled && !isSelected
                          ? "(Đã cấu hình)"
                          : type.formulaName}
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
                  step="1000"
                  min={0}
                  required
                  value={formData.fineRatePerDay}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fineRatePerDay: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 font-mono font-bold text-slate-700 rounded-xl outline-none focus:border-sky-500 focus:bg-white transition-colors"
                />
                <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                  {selectedTypeInfo.rateSubtext}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mô tả / Ghi chú diễn giải
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionFine}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      descriptionFine: e.target.value,
                    })
                  }
                  placeholder="Nhập mô tả chi tiết cho loại phạt này..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white resize-none transition-colors"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              {savedSuccess ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 animate-in fade-in slide-in-from-bottom-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã lưu cấu hình!</span>
                </div>
              ) : (
                <div /> // Spacer
              )}
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>
                  {editingConfig ? "Cập nhật cấu hình" : "Lưu cấu hình mới"}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (5 cols): Simulator */}
        <div className="lg:col-span-5 bg-sky-950 rounded-3xl p-6 shadow-xs border border-sky-900 text-sky-50 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-sky-800">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-sky-100 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-sky-400" />
              <span>BỘ MÔ PHỎNG TÍNH TOÁN</span>
            </h2>
          </div>

          {/* Type Specific Inputs */}
          <div className="space-y-4">
            {formData.fineType === "OVERDUE" && (
              <div>
                <div className="flex items-center justify-between mb-2 font-bold">
                  <span className="text-slate-300">
                    Nhập thử số ngày trễ hạn:
                  </span>
                  <span className="text-amber-300 font-mono text-sm">
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
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1 font-bold">
                  <span className="text-slate-300">Chọn mức độ hư hỏng:</span>
                  <span className="text-rose-300 text-xs">
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
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Coins className="h-6 w-6 text-amber-600" />
            <span>Cấu hình Biểu phí & Chính sách Phạt</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập loại hình vi phạm, mức phạt quy chuẩn và kiểm tra công
            thức tính toán phạt thực tế cho từng trường hợp.
          </p>
        </div>

        {viewMode === "LIST" && fineSettings && fineSettings.length > 0 && (
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" />
            Tạo cấu hình mới
          </button>
        )}
      </div>

      {viewMode === "LIST" ? renderListMode() : renderFormMode()}
    </div>
  );
};

export default AdminFineSettingsView;
