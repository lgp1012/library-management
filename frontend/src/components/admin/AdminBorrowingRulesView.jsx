import {
  BookOpen,
  Calendar,
  Clock,
  Edit,
  Plus,
  RefreshCw,
  Shield,
  ShieldCheck,
  Sliders,
  X,
} from "lucide-react";
import { useState } from "react";

const AdminBorrowingRulesView = ({ borrowingRules, setBorrowingRules }) => {
  const [selectedRule, setSelectedRule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for editing
  const [formData, setFormData] = useState({
    name: "",
    tierCode: "",
    description: "",
    maxBooks: 6,
    loanPeriodDays: 14,
    renewals: 2,
    gracePeriodDays: 2,
    holdShelfDays: 3,
  });

  const handleOpenEdit = (rule) => {
    setSelectedRule(rule);
    setFormData({
      name: rule.name,
      tierCode: rule.tierCode,
      description: rule.description,
      maxBooks: rule.maxBooks,
      loanPeriodDays: rule.loanPeriodDays,
      renewals: rule.renewals,
      gracePeriodDays: rule.gracePeriodDays,
      holdShelfDays: rule.holdShelfDays,
    });
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedRule(null);
    setFormData({
      name: "",
      tierCode: "CUSTOM_TIER",
      description: "",
      maxBooks: 5,
      loanPeriodDays: 14,
      renewals: 2,
      gracePeriodDays: 2,
      holdShelfDays: 3,
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (selectedRule) {
      // Update
      setBorrowingRules((prev) =>
        prev.map((r) =>
          r.id === selectedRule.id
            ? {
                ...r,
                ...formData,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : r
        )
      );
    } else {
      // Create
      const newRule = {
        id: `rule-${Date.now()}`,
        ...formData,
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setBorrowingRules((prev) => [...prev, newRule]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-sky-600" />
            <span>Cấu hình Quy định & Chính sách Mượn trả</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập chính sách lưu thông sách theo từng hạng độc giả: hạn mức mượn, thời gian mượn, quy định gia hạn và khoảng thời gian ân hạn.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm quy định nhóm mới</span>
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {borrowingRules?.map((rule) => (
          <div
            key={rule.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
          >
            {/* Top Row: Category Badge & Edit Icon */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                  {rule.tierCode}
                </span>
                <button
                  onClick={() => handleOpenEdit(rule)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                  title="Chỉnh sửa quy định"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-900">{rule.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed min-h-[36px]">
                {rule.description}
              </p>
            </div>

            {/* Metrics 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Tối đa mượn
                </div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {rule.maxBooks} cuốn
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Thời hạn mượn
                </div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {rule.loanPeriodDays} ngày
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Gia hạn mượn
                </div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {rule.renewals} lần
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Thời gian ân hạn
                </div>
                <div className="text-sm font-extrabold text-amber-600 mt-0.5">
                  {rule.gracePeriodDays} ngày miễn phí
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Giữ chỗ kệ: {rule.holdShelfDays} ngày</span>
              <span>Cập nhật: {rule.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="h-5 w-5 text-sky-600" />
                <span>
                  {selectedRule
                    ? `Cấu hình quy định: ${selectedRule.name}`
                    : "Tạo quy định mượn trả mới"}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tên nhóm độc giả *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sinh viên Đại học..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mô tả đối tượng
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả nhóm độc giả áp dụng..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Số sách mượn tối đa (cuốn)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={formData.maxBooks}
                    onChange={(e) =>
                      setFormData({ ...formData, maxBooks: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Thời gian mượn (ngày)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={formData.loanPeriodDays}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        loanPeriodDays: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Số lần gia hạn tối đa
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={formData.renewals}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        renewals: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Thời gian ân hạn (ngày)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={formData.gracePeriodDays}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gracePeriodDays: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 font-bold text-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Thời gian giữ chỗ trên kệ (ngày)
                </label>
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={formData.holdShelfDays}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      holdShelfDays: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 font-bold"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md"
                >
                  Lưu quy định
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBorrowingRulesView;
