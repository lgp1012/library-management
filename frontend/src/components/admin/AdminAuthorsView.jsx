import { Plus, Search, UserCheck, Edit, X, Globe, Calendar, ChevronDown } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import adminService from "../../services/adminService";

const COUNTRIES = [
  "Việt Nam", "Mỹ (Hoa Kỳ)", "Anh", "Pháp", "Đức", "Nhật Bản", "Hàn Quốc", "Trung Quốc", "Nga", "Canada",
  "Úc", "Ý", "Tây Ban Nha", "Brazil", "Ấn Độ", "Mexico", "Nam Phi", "Argentina", "Colombia",
  "Thái Lan", "Indonesia", "Malaysia", "Singapore", "Philippines", "Bỉ", "Hà Lan", "Thụy Sĩ",
  "Thụy Điển", "Đan Mạch", "Na Uy", "Phần Lan", "Bồ Đào Nha", "Hy Lạp", "Áo", "Cộng hòa Séc",
  "Ba Lan", "Thổ Nhĩ Kỳ", "Ai Cập", "Israel", "Ả Rập Xê Út", "UAE", "New Zealand", "Khác"
].sort();

const AdminAuthorsView = () => {
  const { authors, setAuthors } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    nationality: "",
  });

  // Autocomplete dropdown state
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredAuthors = useMemo(() => {
    return authors?.filter((author) => {
      if (!searchTerm.trim()) return true;
      const query = searchTerm.toLowerCase();
      return (
        author.authorName?.toLowerCase().includes(query) ||
        author.nationality?.toLowerCase().includes(query)
      );
    });
  }, [authors, searchTerm]);

  const filteredCountries = useMemo(() => {
    if (!formData.nationality) return COUNTRIES;
    return COUNTRIES.filter(c => c.toLowerCase().includes(formData.nationality.toLowerCase()));
  }, [formData.nationality]);

  const handleOpenCreate = () => {
    setEditingAuthor(null);
    setFormData({ name: "", birthday: "", nationality: "" });
    setShowDropdown(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (author) => {
    setEditingAuthor(author);
    let dob = author.birthday || "";
    if (Array.isArray(author.birthday)) {
      const [y, m, d] = author.birthday;
      dob = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
    setFormData({ 
      name: author.authorName || "",
      birthday: dob,
      nationality: author.nationality || "",
    });
    setShowDropdown(false);
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

    const payload = {
      authorName: formData.name,
      birthday: formData.birthday || null,
      nationality: formData.nationality || null
    };

    try {
      if (editingAuthor) {
        const res = await adminService.updateAuthor(editingAuthor.authorId, payload);
        setAuthors((prev) => prev.map((a) => a.authorId === editingAuthor.authorId ? res.result : a));
      } else {
        const res = await adminService.createAuthor(payload);
        setAuthors((prev) => [...prev, res.result]);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Lỗi lưu tác giả: " + (error.response?.data?.message || error.message));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    if (Array.isArray(dateString)) {
      const [year, month, day] = dateString;
      return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-sky-600" />
            <span>Danh mục Tác giả & Hồ sơ Biên mục</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý thông tin tác giả, ngày tháng năm sinh và quốc tịch.
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
            placeholder="Tìm kiếm tác giả theo tên, quốc tịch..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Authors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuthors?.map((author) => (
          <div
            key={author.authorId}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center text-sky-600 font-bold text-lg border border-sky-100">
                    {author.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 line-clamp-1" title={author.authorName}>
                      {author.authorName}
                    </h3>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      ID: {author.authorId}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
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
              
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium w-16 text-slate-500">Ngày sinh:</span>
                  <span className="font-bold">{formatDate(author.birthday)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium w-16 text-slate-500">Quốc tịch:</span>
                  <span className="font-bold">{author.nationality || "Chưa cập nhật"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 overflow-visible">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-sky-600" />
                <span>
                  {editingAuthor ? "Chỉnh sửa hồ sơ tác giả" : "Thêm tác giả mới"}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Tên tác giả *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên tác giả..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Ngày tháng năm sinh</label>
                <input
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white transition-colors text-slate-700"
                />
              </div>

              <div className="relative" ref={dropdownRef}>
                <label className="block font-bold text-slate-700 mb-1.5">Quốc tịch / Quốc gia</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => {
                      setFormData({ ...formData, nationality: e.target.value });
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Nhập hoặc chọn quốc gia..."
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {showDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <button
                          type="button"
                          key={country}
                          className="w-full text-left px-4 py-2.5 hover:bg-sky-50 text-slate-700 text-xs transition-colors border-b border-slate-50 last:border-0"
                          onClick={() => {
                            setFormData({ ...formData, nationality: country });
                            setShowDropdown(false);
                          }}
                        >
                          {country}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-slate-500 text-center italic">
                        Không tìm thấy "{formData.nationality}" - Bạn vẫn có thể dùng tên này
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md transition-all active:scale-95"
                >
                  Lưu thông tin
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
