import {
  AlertTriangle,
  CheckCircle2,
  Edit,
  Filter,
  Layers,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useAdmin } from "../../hooks/useAdmin";
import adminService from "../../services/adminService";

const AdminShelvesView = () => {
  const { shelves, setShelves } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShelf, setEditingShelf] = useState(null);

  const [formData, setFormData] = useState({
    location: "",
  });

  const filteredShelves = useMemo(() => {
    return shelves?.filter((sh) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        return sh.shelfLocation?.toLowerCase().includes(query) || sh.shelfId?.toLowerCase().includes(query);
      }
      return true;
    });
  }, [shelves, searchTerm]);

  const handleOpenCreate = () => {
    setEditingShelf(null);
    setFormData({ location: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sh) => {
    setEditingShelf(sh);
    setFormData({ location: sh.shelfLocation });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa kệ này?")) {
      try {
        await adminService.deleteShelf(id);
        setShelves((prev) => prev.filter((s) => s.shelfId !== id));
      } catch (error) {
        alert("Lỗi khi xóa kệ: " + (error.response?.data?.message || error.message));
      }
    }
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (editingShelf) {
        const res = await adminService.updateShelf(editingShelf.shelfId, { shelfLocation: formData.location });
        setShelves((prev) => prev.map((s) => s.shelfId === editingShelf.shelfId ? res.result : s));
      } else {
        const res = await adminService.createShelf({ shelfLocation: formData.location });
        setShelves((prev) => [...prev, res.result]);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Lỗi khi lưu kệ: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="h-6 w-6 text-sky-600" />
            <span>Quản lý Vị trí & Tải trọng Kệ sách (Physical Shelves Allocation)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Giám sát không gian lưu trữ, mật độ theo khu vực, ánh xạ phân loại sách và lập kế hoạch mở rộng kệ sách vật lý.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm vị trí kệ mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã kệ, khu vực..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Shelves Grid (3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShelves?.map((sh) => (
          <div
            key={sh.shelfId}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">
                    ID: {sh.shelfId}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(sh)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                    title="Chỉnh sửa kệ"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(sh.shelfId)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Xóa kệ"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 p-3 rounded-2xl bg-sky-50/70 border border-sky-100">
                <div className="text-[10px] font-extrabold uppercase text-sky-800 tracking-wider">
                  VỊ TRÍ KỆ (LOCATION)
                </div>
                <div className="text-sm font-bold text-sky-950 mt-1">
                  {sh.shelfLocation}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-5 w-5 text-sky-600" />
                <span>
                  {editingShelf ? "Chỉnh sửa vị trí kệ" : "Thêm vị trí kệ sách mới"}
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
                <label className="block font-bold text-slate-700 mb-1">Khu vực vị trí chi tiết *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Khu Bắc · Khoa học Máy tính..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500"
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
                  Lưu vị trí kệ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShelvesView;
