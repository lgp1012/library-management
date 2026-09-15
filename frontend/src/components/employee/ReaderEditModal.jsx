import { useState } from "react";
import { X, Save, User, Phone, Loader2 } from "lucide-react";
import employeeService from "../../services/employeeService";
import { toast } from "react-toastify";

const ReaderEditModal = ({ reader, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    readerName: reader.readerName || "",
    phoneNumber: reader.phoneNumber || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.readerName.trim()) {
      toast.error("Họ và tên không được để trống");
      return;
    }

    setIsSubmitting(true);
    try {
      await employeeService.updateReader(reader.readerId, {
        readerName: formData.readerName,
        phoneNumber: formData.phoneNumber,
        active: reader.active,
        membershipExpiry: reader.membershipExpiry,
      });
      toast.success("Cập nhật thông tin thành công!");
      onRefresh();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi cập nhật thông tin");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">Cập nhật thông tin</h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Mã độc giả
            </label>
            <input
              type="text"
              value={reader.readerId}
              disabled
              className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="readerName"
                value={formData.readerName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Số điện thoại
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReaderEditModal;
