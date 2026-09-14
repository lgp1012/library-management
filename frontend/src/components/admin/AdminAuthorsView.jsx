import {
  BookOpen,
  Edit,
  Globe,
  Plus,
  Search,
  UserCheck,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useAdmin } from "../../hooks/useAdmin";
import adminService from "../../services/adminService";

const AdminAuthorsView = () => {
  const { authors, setAuthors } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
  });

  const filteredAuthors = useMemo(() => {
    return authors?.filter((author) => {
      if (!searchTerm.trim()) return true;
      const query = searchTerm.toLowerCase();
      return author.authorName?.toLowerCase().includes(query);
    });
  }, [authors, searchTerm]);

  const handleOpenCreate = () => {
    setEditingAuthor(null);
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (author) => {
    setEditingAuthor(author);
    setFormData({ name: author.authorName });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tác giả này?")) {
      try {
        await adminService.deleteAuthor(id);
        setAuthors((prev) => prev.filter((a) => a.authorId !== id));
      } catch (error) {
        alert("Lỗi khi xóa tác giả: " + (error.response?.data?.message || error.message));
      }
    }
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      if (editingAuthor) {
        const res = await adminService.updateAuthor(editingAuthor.authorId, { authorName: formData.name });
        setAuthors((prev) => prev.map((a) => a.authorId === editingAuthor.authorId ? res.result : a));
      } else {
        const res = await adminService.createAuthor({ authorName: formData.name });
        setAuthors((prev) => [...prev, res.result]);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Lỗi lưu tác giả: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-sky-600" />
            <span>Danh mục Tác giả & Hồ sơ Biên mục (Author Registry)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Danh mục tác giả chính thức, hồ sơ tiểu sử, thể loại sáng tác và thống kê đầu sách lưu trữ trong hệ thống thư viện.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm tác giả mới</span>
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
            placeholder="Tìm kiếm tác giả theo tên, quốc tịch, thể loại sáng tác, từ khóa tiểu sử..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Authors Cards Grid (3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuthors?.map((author) => (
          <div
            key={author.authorId}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {author.authorName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                    <span>ID: {author.authorId}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(author)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                    title="Chỉnh sửa hồ sơ"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(author.authorId)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Xóa tác giả"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
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
                <UserCheck className="h-5 w-5 text-sky-600" />
                <span>
                  {editingAuthor ? "Chỉnh sửa hồ sơ tác giả" : "Thêm tác giả mới"}
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
                <label className="block font-bold text-slate-700 mb-1">Tên tác giả *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên tác giả..."
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
                  Lưu thông tin tác giả
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuthorsView;
