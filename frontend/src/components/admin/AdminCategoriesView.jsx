import { BookOpen, FolderTree, Plus, Search } from "lucide-react";
import { useState } from "react";

const AdminCategoriesView = ({ categories }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = categories?.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.dewey.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderTree className="h-6 w-6 text-sky-600" />
            <span>Phân loại Phân mục & Mã Thập phân Dewey</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý cây danh mục tài liệu, mã phân loại Dewey chuẩn quốc tế và gắn chính sách lưu thông riêng.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Thêm phân mục Dewey mới</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên phân mục hoặc dải mã Dewey..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.map((cat) => (
          <div
            key={cat.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-md bg-sky-100 text-sky-800">
                Mã Dewey: {cat.dewey}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {cat.bookCount} cuốn
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
              Quy tắc áp dụng: <span className="font-bold text-slate-700">{cat.activeRules}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategoriesView;
