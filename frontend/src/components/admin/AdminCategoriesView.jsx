import { Edit2, FolderTree, Plus, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import adminService from "../../services/adminService";

const AdminCategoriesView = () => {
  const { categories, setCategories } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catName, setCatName] = useState("");

  const filtered = categories?.filter((c) =>
    (c.name || c.categoryName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const handleOpenModal = (cat = null) => {
    setEditingCat(cat);
    setCatName(cat ? (cat.name || cat.categoryName || "") : "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;

    try {
      const targetId = editingCat ? (editingCat.id || editingCat.categoryId) : null;
      if (editingCat) {
        const res = await adminService.updateCategory(targetId, {
          categoryName: catName,
        });
        setCategories((prev) =>
          prev.map((c) =>
            (c.id || c.categoryId) === targetId
              ? {
                  ...c,
                  id: res.result.categoryId,
                  categoryId: res.result.categoryId,
                  name: res.result.categoryName,
                  categoryName: res.result.categoryName,
                }
              : c,
          ),
        );
      } else {
        const res = await adminService.createCategory({
          categoryName: catName,
        });
        setCategories((prev) => [
          {
            id: res.result.categoryId,
            categoryId: res.result.categoryId,
            name: res.result.categoryName,
            categoryName: res.result.categoryName,
          },
          ...prev,
        ]);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await adminService.deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } catch (error) {
        alert(
          "Không thể xóa: " +
            (error.response?.data?.message || "Đang có sách dùng danh mục này"),
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderTree className="h-6 w-6 text-sky-600" />
            <span>Danh mục thể loại sách</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý danh mục tài liệu và phân loại chuẩn.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm thể loại sách mới</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên thể loại sách..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.length > 0 ? (
          filtered.map((cat) => (
            <div
              key={cat.id || cat.categoryId}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono px-2 py-1 rounded-md bg-slate-100 text-slate-600">
                  ID: {(cat.id || cat.categoryId)?.substring(0, 8)}...
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenModal(cat)}
                    className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id || cat.categoryId)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                {cat.name || cat.categoryName}
              </h3>
            </div>
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-slate-400 text-sm">
            Không tìm thấy danh mục nào.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">
                {editingCat ? "Cập nhật danh mục" : "Thêm danh mục mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="catName"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Tên danh mục *
                </label>
                <input
                  id="catName"
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-sky-500 text-sm"
                  placeholder="VD: Khoa học máy tính"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-600 rounded-xl hover:bg-sky-700"
                >
                  {editingCat ? "Lưu" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesView;
