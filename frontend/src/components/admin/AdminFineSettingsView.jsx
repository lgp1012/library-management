import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  Coins,
  Edit2,
  Plus,
  Save,
  Search,
  Sliders,
  Trash2,
} from "lucide-react";
import { useState } from "react";

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
    defaultRate: 5000,
    defaultDesc:
      "Quy định mức phạt trễ hạn tính lũy tiến theo số ngày mượn quá hạn.",
    formulaName: "Số ngày quá hạn × Đơn giá/ngày",
    unit: "₫ / ngày",
  },
  {
    id: "DAMAGED",
    name: "Phạt làm hư hỏng tài liệu (Damaged)",
    badge: "Theo mức độ",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
    rateLabel: "Mức phạt tổn hại tài liệu cơ sở (VNĐ) *",
    rateSubtext:
      "Áp dụng theo từng mức độ hư hỏng (rách trang, ố bẩn, viết vẽ).",
    defaultRate: 50000,
    defaultDesc:
      "Quy định bồi hoàn tổn thất đối với tài liệu bị hư hại trong quá trình mượn.",
    formulaName: "Mức phạt cơ sở × Hệ số tổn hại tài liệu",
    unit: "₫ cơ sở",
  },
  {
    id: "LOST",
    name: "Phạt làm mất sách (Lost Book)",
    badge: "Bồi thường + Phí",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
    rateLabel: "Phí dịch vụ & lưu thông mất sách (VNĐ) *",
    rateSubtext:
      "Phí thủ tục hành chính, mua lại và lập hồ sơ mã sách thay thế.",
    defaultRate: 30000,
    defaultDesc:
      "Quy định bồi thường sách mất (Giá bìa sách × 1.5 + Phí dịch vụ xử lý).",
    formulaName: "Giá bìa sách × 1.5 + Phí dịch vụ xử lý",
    unit: "₫ phí xử lý",
  },
  {
    id: "OTHER",
    name: "Vi phạm nội quy & kỷ luật khác (Other)",
    badge: "Hành chính",
    badgeClass: "bg-sky-100 text-sky-800 border-sky-200",
    rateLabel: "Mức phạt vi phạm (VNĐ / Lần) *",
    rateSubtext:
      "Áp dụng xử phạt hành chính đối với các vi phạm nội quy thư viện.",
    defaultRate: 20000,
    defaultDesc:
      "Xử lý các hành vi vi phạm nội quy, làm ồn, mang sách trái phép khỏi phòng đọc.",
    formulaName: "Số lần vi phạm × Đơn giá phạt vi phạm",
    unit: "₫ / lần",
  },
];

const getTypeInfo = (typeId) => {
  return (
    FINE_TYPES.find((t) => t.id === typeId) || {
      id: typeId,
      name: `Hình thức phạt (${typeId})`,
      badge: "Tùy chỉnh",
      badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
      rateLabel: "Mức phí phạt quy định (VNĐ) *",
      rateSubtext: "Áp dụng theo quy chế xử phạt của thư viện.",
      defaultRate: 5000,
      defaultDesc: "Chính sách quy định mức phạt áp dụng.",
      formulaName: "Công thức phạt theo quy định",
      unit: "₫",
    }
  );
};

const formatCurrency = (val) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val || 0);
};

const AdminFineSettingsView = () => {
  const { fineSettings, setFineSettings, refreshData } = useAdmin();

  // Mode & Form States
  const hasExistingConfigs = Array.isArray(fineSettings) && fineSettings.length > 0;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Set of already configured fine types (uppercase for comparison)
  const configuredTypes = new Set(
    (fineSettings || []).map((c) => (c.fineType || "").toUpperCase()),
  );
  const availableTypes = FINE_TYPES.filter(
    (t) => !configuredTypes.has(t.id.toUpperCase()),
  );
  const allTypesConfigured = availableTypes.length === 0;

  // Form Data
  const [formData, setFormData] = useState({
    fineType: "OVERDUE",
    fineRatePerDay: 5000,
    descriptionFine: FINE_TYPES[0].defaultDesc,
  });

  // Simulator controls
  const [simulatedDays, setSimulatedDays] = useState(10);
  const [damageSeverity, setDamageSeverity] = useState(50); // 20% | 50% | 100%
  const [bookPrice, setBookPrice] = useState(150000); // 150.000 VNĐ
  const [violationCount, setViolationCount] = useState(2);

  // When no configs exist, always show the form
  const showForm = !hasExistingConfigs || isFormOpen;

  const selectedTypeInfo = getTypeInfo(formData.fineType);

  // Open create form: automatically select first unconfigured fine type
  const handleOpenCreate = () => {
    if (allTypesConfigured) {
      alert("Tất cả các loại phí phạt đã được cấu hình trong hệ thống.");
      return;
    }
    const firstAvailable = availableTypes[0] || FINE_TYPES[0];
    setEditingConfig(null);
    setFormData({
      fineType: firstAvailable.id,
      fineRatePerDay: firstAvailable.defaultRate,
      descriptionFine: firstAvailable.defaultDesc,
    });
    setIsFormOpen(true);
  };

  // Open edit form
  const handleOpenEdit = (cfg) => {
    setEditingConfig(cfg);
    setFormData({
      fineType: cfg.fineType || "OVERDUE",
      fineRatePerDay: Number(cfg.fineRatePerDay) || 5000,
      descriptionFine: cfg.descriptionFine || "",
    });
    setIsFormOpen(true);
  };

  // Cancel / Back to list
  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingConfig(null);
  };

  // Type Change
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

  // Save / Update Handler
  const handleSavePolicy = async (e) => {
    e.preventDefault();
    if (!formData.fineRatePerDay || formData.fineRatePerDay <= 0) {
      alert("Mức phí phạt phải lớn hơn 0");
      return;
    }

    setIsSubmitting(true);
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
          prev.map((item) =>
            item.configId === editingConfig.configId ? res.result : item,
          ),
        );
      } else {
        const res = await adminService.createFineConfig(payload);
        setFineSettings((prev) => {
          const list = Array.isArray(prev) ? prev : [];
          const exists = list.some((item) => item.configId === res.result.configId);
          if (exists) {
            return list.map((item) =>
              item.configId === res.result.configId ? res.result : item,
            );
          }
          return [res.result, ...list];
        });
      }

      if (refreshData) {
        await refreshData();
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
      setIsFormOpen(false);
      setEditingConfig(null);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message === "FINE_CONFIG_TYPE_EXISTED" ||
        error.response?.data?.code === 1718
          ? "Loại phí phạt này đã tồn tại trong hệ thống. Mỗi loại chỉ được cấu hình duy nhất 1 lần."
          : error.response?.data?.message || error.message;
      alert("Lỗi khi lưu cấu hình: " + errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handler
  const handleDelete = async (configId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa cấu hình phí phạt này không?")) {
      return;
    }
    try {
      await adminService.deleteFineConfig(configId);
      setFineSettings((prev) =>
        prev.filter((item) => item.configId !== configId),
      );
      if (refreshData) {
        await refreshData();
      }
    } catch (error) {
      alert(
        "Không thể xóa cấu hình: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  // Calculator logic
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

  // Filter existing configurations
  const filteredConfigs = (fineSettings || []).filter((item) => {
    const text = `${item.fineType || ""} ${item.descriptionFine || ""} ${
      item.configId || ""
    }`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Coins className="h-6 w-6 text-amber-600" />
            <span>Cấu hình Biểu phí & Chính sách Phạt</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập loại hình vi phạm, mức phạt quy chuẩn và quản lý danh mục biểu
            phí phạt của thư viện.
          </p>
        </div>

        {/* Action Button in Header */}
        {!showForm ? (
          <button
            onClick={handleOpenCreate}
            disabled={allTypesConfigured}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all ${
              allTypesConfigured
                ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                : "bg-sky-600 hover:bg-sky-700 text-white"
            }`}
            title={
              allTypesConfigured
                ? "Tất cả các loại phí phạt đã được thiết lập (4/4)"
                : "Tạo cấu hình phí phạt mới"
            }
          >
            <Plus className="h-4 w-4" />
            <span>
              {allTypesConfigured
                ? "Đã cấu hình đủ 4/4 loại phạt"
                : "Tạo cấu hình phí phạt"}
            </span>
          </button>
        ) : hasExistingConfigs ? (
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-slate-500" />
            <span>Quay về danh sách</span>
          </button>
        ) : null}
      </div>

      {/* View 1: List of Configurations (when configs exist and form not open) */}
      {!showForm && (
        <div className="space-y-5">
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo mã cấu hình, loại phạt, mô tả..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>
            <div className="text-xs font-semibold text-slate-500">
              Tổng cộng:{" "}
              <span className="font-extrabold text-slate-900">
                {filteredConfigs.length}
              </span>{" "}
              cấu hình phí phạt
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredConfigs.map((cfg) => {
              const typeMeta = getTypeInfo(cfg.fineType);
              return (
                <div
                  key={cfg.configId}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header: ID + Badge + Actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">
                          {cfg.configId}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${typeMeta.badgeClass}`}
                        >
                          {typeMeta.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(cfg)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          title="Chỉnh sửa cấu hình"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cfg.configId)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa cấu hình"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Fine Type Title */}
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                        {typeMeta.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        {typeMeta.formulaName}
                      </p>
                    </div>

                    {/* Rate Display */}
                    <div className="bg-slate-50/80 border border-slate-100 p-3.5 rounded-2xl flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-600">
                        Đơn giá áp dụng:
                      </span>
                      <span className="text-base font-extrabold text-amber-600 font-mono">
                        {formatCurrency(cfg.fineRatePerDay)}{" "}
                        <span className="text-[10px] font-normal text-slate-400">
                          {typeMeta.unit}
                        </span>
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {cfg.descriptionFine || typeMeta.defaultDesc}
                    </p>
                  </div>

                  {/* Footer info */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      Cập nhật:{" "}
                      {cfg.updatedAt
                        ? new Date(cfg.updatedAt).toLocaleDateString("vi-VN")
                        : "Hôm nay"}
                    </span>
                    <span className="font-medium text-slate-500">
                      Người tạo: {cfg.configByUserId || "Admin"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredConfigs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80">
              <Coins className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">
                Không tìm thấy cấu hình phí phạt phù hợp
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Thử thay đổi từ khóa tìm kiếm hoặc nhấn nút tạo cấu hình mới.
              </p>
            </div>
          )}
        </div>
      )}

      {/* View 2: Form & Simulator (when configs === 0 OR form is open) */}
      {showForm && (
        <div className="space-y-4">
          {!hasExistingConfigs && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
                <Coins className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-amber-900">
                  Hệ thống chưa có cấu hình phí phạt nào!
                </p>
                <p className="text-amber-700 mt-0.5">
                  Vui lòng tạo ít nhất 1 cấu hình phí phạt ban đầu để thiết lập chính
                  sách mượn trả và xử lý vi phạm trong thư viện.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (7 cols): Parameters Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-sky-600" />
                  <span>
                    {editingConfig
                      ? `CẬP NHẬT CẤU HÌNH (${editingConfig.configId})`
                      : "THÔNG SỐ CẤU HÌNH PHÍ PHẠT"}
                  </span>
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
                      // When creating, any type in configuredTypes is disabled.
                      // When editing, any type in configuredTypes EXCEPT the current config's type is disabled.
                      const isAlreadyConfigured = editingConfig
                        ? type.id.toUpperCase() !== (editingConfig.fineType || "").toUpperCase() &&
                          configuredTypes.has(type.id.toUpperCase())
                        : configuredTypes.has(type.id.toUpperCase());

                      return (
                        <button
                          type="button"
                          key={type.id}
                          disabled={isAlreadyConfigured}
                          onClick={() => !isAlreadyConfigured && handleTypeChange(type.id)}
                          className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                            isAlreadyConfigured
                              ? "border-dashed border-slate-200 bg-slate-100/70 opacity-60 cursor-not-allowed text-slate-400"
                              : isSelected
                                ? "border-sky-600 bg-sky-50/70 text-sky-950 shadow-xs ring-1 ring-sky-500 cursor-pointer"
                                : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700 cursor-pointer"
                          }`}
                          title={
                            isAlreadyConfigured
                              ? "Loại phạt này đã có cấu hình trong hệ thống (chỉ được chỉnh sửa hoặc xóa cấu hình cũ)"
                              : type.name
                          }
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs">
                              {type.name}
                            </span>
                            {isAlreadyConfigured ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                                Đã cấu hình
                              </span>
                            ) : (
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
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 mt-1">
                            {type.formulaName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {!editingConfig && allTypesConfigured && (
                    <p className="text-[11px] text-amber-600 mt-2 font-medium">
                      * Tất cả 4 loại hình phạt đã được cấu hình trong hệ thống. Bạn có thể quay lại danh sách để chỉnh sửa hoặc xóa cấu hình tương ứng.
                    </p>
                  )}
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
                      min={1}
                      required
                      value={formData.fineRatePerDay}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fineRatePerDay: Math.max(
                            0,
                            Number.parseInt(e.target.value) || 0,
                          ),
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

                {/* Form Actions */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                  <div className="text-[11px] text-slate-400">
                    {editingConfig?.updatedAt ? (
                      <span>
                        Lần cuối:{" "}
                        {new Date(editingConfig.updatedAt).toLocaleString("vi-VN")}
                      </span>
                    ) : (
                      <span>Cấu hình mới</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                    {/* BACK / CANCEL BUTTON: Only rendered if existing configs exist! */}
                    {hasExistingConfigs && (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-colors"
                      >
                        Hủy bỏ
                      </button>
                    )}

                    {savedSuccess && (
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
                        <CheckCircle2 className="h-4 w-4" /> Đã lưu!
                      </span>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all"
                    >
                      <Save className="h-4 w-4" />
                      <span>
                        {isSubmitting
                          ? "Đang lưu..."
                          : editingConfig
                            ? "Cập nhật cấu hình"
                            : "Lưu & Áp dụng chính sách"}
                      </span>
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
                      <span className="font-mono font-bold">
                        {damageSeverity}%
                      </span>
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
      )}
    </div>
  );
};

export default AdminFineSettingsView;
