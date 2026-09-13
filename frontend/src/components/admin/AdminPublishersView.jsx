import {
  Building2,
  CheckCircle2,
  Edit,
  FileCheck,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useAdmin } from "../../hooks/useAdmin";
import adminService from "../../services/adminService";

const AdminPublishersView = () => {
  const { publishers, setPublishers } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
  });

  const filteredPublishers = useMemo(() => {
    return publishers?.filter((pub) => {
      if (!searchTerm.trim()) return true;
      const query = searchTerm.toLowerCase();
      return pub.publisherName?.toLowerCase().includes(query) || pub.publisherId?.toLowerCase().includes(query);
    });
  }, [publishers, searchTerm]);

  const handleOpenCreate = () => {
    setEditingPublisher(null);
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pub) => {
    setEditingPublisher(pub);
    setFormData({ name: pub.publisherName });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhà xuất bản này?")) {
      try {
        await adminService.deletePublisher(id);
        setPublishers((prev) => prev.filter((p) => p.publisherId !== id));
      } catch (error) {
        alert("Lỗi khi xóa nhà xuất bản: " + (error.response?.data?.message || error.message));
      }
    }
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      if (editingPublisher) {
        const res = await adminService.updatePublisher(editingPublisher.publisherId, { publisherName: formData.name });
        setPublishers((prev) => prev.map((p) => p.publisherId === editingPublisher.publisherId ? res.result : p));
      } else {
        const res = await adminService.createPublisher({ publisherName: formData.name });
        setPublishers((prev) => [...prev, res.result]);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Lỗi lưu NXB: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-sky-600" />
            <span>Danh mục Nhà xuất bản & Hợp đồng Đối tác (Publisher Registry)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý thông tin liên hệ nhà cung cấp, hợp đồng cung ứng tài liệu và đối tác bản quyền xuất bản.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Đăng ký Nhà xuất bản mới</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm nhà xuất bản theo tên, mã NXB, quốc gia, người đại diện..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Publishers Grid (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPublishers?.map((pub) => (
          <div
            key={pub.publisherId}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 font-mono text-[10px] font-extrabold border border-indigo-200">
                  ID: {pub.publisherId}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(pub)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                    title="Chỉnh sửa thông tin"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pub.publisherId)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Xóa nhà xuất bản"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Press Name */}
              <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                {pub.publisherName}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-sky-600" />
                <span>
                  {editingPublisher ? "Chỉnh sửa Nhà xuất bản" : "Đăng ký Nhà xuất bản mới"}
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
                <label className="block font-bold text-slate-700 mb-1">Tên Nhà xuất bản *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Oxford University Press..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white"
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
                  Lưu nhà xuất bản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPublishersView;
