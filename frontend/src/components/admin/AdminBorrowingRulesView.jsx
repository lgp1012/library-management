import { Edit, ShieldCheck, Sliders, X } from "lucide-react";
import { useState } from "react";

import { useAdmin } from "../../hooks/useAdmin";
import adminService from "../../services/adminService";

const AdminBorrowingRulesView = () => {
  const { borrowingRules, setBorrowingRules } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // We only have one global config
  const config = borrowingRules?.[0];

  // Form State for editing
  const [formData, setFormData] = useState({
    maxBooksPerReader: 0,
    maxBorrowDays: 0,
  });

  const handleOpenEdit = () => {
    setFormData({
      maxBooksPerReader: config?.maxBooksPerReader || 0,
      maxBorrowDays: config?.maxBorrowDays || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        maxBooksPerReader: formData.maxBooksPerReader,
        maxBorrowDays: formData.maxBorrowDays,
      };
      const res = await adminService.updateBorrowingConfig(payload);
      setBorrowingRules([res.result]);
      setIsModalOpen(false);
    } catch (error) {
      alert(
        "Lỗi cập nhật cấu hình: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-sky-600" />
            <span>Cấu hình quy định chính sách mượn trả</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập chính sách lưu thông sách theo từng hạng độc giả: hạn mức
            mượn, thời gian mượn, quy định gia hạn và khoảng thời gian ân hạn.
          </p>
        </div>
      </div>

      {/* Single Config View */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">
            Thông số hiện tại
          </h3>
          <button
            onClick={handleOpenEdit}
            className="px-3 py-1.5 rounded-lg text-sky-600 bg-sky-50 font-bold hover:bg-sky-100 transition-colors flex items-center gap-1.5 text-xs"
          >
            <Edit className="h-4 w-4" />
            {config ? "Chỉnh sửa" : "Tạo cấu hình"}
          </button>
        </div>

        {config ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Tối đa sách mượn
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {config.maxBooksPerReader}{" "}
                <span className="text-sm font-semibold text-slate-500">
                  cuốn/độc giả
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Thời hạn mượn mặc định
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {config.maxBorrowDays}{" "}
                <span className="text-sm font-semibold text-slate-500">
                  ngày
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
            <div className="text-slate-400 mb-2 font-medium">
              Hệ thống chưa có cấu hình quy định mượn trả nào.
            </div>
            <p className="text-xs text-slate-400">
              Vui lòng nhấn "Tạo cấu hình" để thiết lập.
            </p>
          </div>
        )}
      </div>

      {/* Edit Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="h-5 w-5 text-sky-600" />
                <span>Cấu hình quy định mượn trả</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitForm}
              className="mt-4 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Số sách mượn tối đa / độc giả
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={formData.maxBooksPerReader}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxBooksPerReader: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Thời gian mượn mặc định (ngày)
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={formData.maxBorrowDays}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxBorrowDays: parseInt(e.target.value) || 1,
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
                  Lưu cấu hình
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
