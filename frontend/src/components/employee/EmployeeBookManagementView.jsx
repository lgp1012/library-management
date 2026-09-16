import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Filter,
  Plus,
  Search,
  Settings,
  XCircle,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useEmployee } from "../../hooks/useEmployee";
import employeeService from "../../services/employeeService";

// Helper Component: Progress Bar
const AvailabilityProgressBar = ({ available, total }) => {
  const percentage = total === 0 ? 0 : Math.round((available / total) * 100);
  return (
    <div className="w-full mt-2">
      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
        <span>Sẵn sàng: {available}</span>
        <span>Tổng: {total}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            percentage > 50
              ? "bg-emerald-500"
              : percentage > 0
                ? "bg-amber-500"
                : "bg-rose-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default function EmployeeBookManagementView() {
  const { books, categories, authors, publishers, shelves, refreshBooks } =
    useEmployee();

  const [selectedBook, setSelectedBook] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteBook = async (e, bookId) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc chắn muốn xóa sách này? Toàn bộ các bản sao của sách này cũng sẽ bị xóa khỏi hệ thống.")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await employeeService.deleteBook(bookId);
      toast.success("Xóa sách thành công");
      refreshBooks();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Lỗi khi xóa sách");
    } finally {
      setIsDeleting(false);
    }
  };

  // Metrics Calculation
  const metrics = useMemo(() => {
    let totalCopies = 0;
    let availableCopies = 0;
    let borrowedCopies = 0;
    let damagedLostCopies = 0;

    books.forEach((book) => {
      book.copies?.forEach((copy) => {
        totalCopies++;
        if (copy.status === "AVAILABLE") availableCopies++;
        else if (copy.status === "BORROWED") borrowedCopies++;
        else damagedLostCopies++; // DAMAGED, LOST, etc.
      });
    });

    return {
      totalBooks: books.length,
      totalCopies,
      availableCopies,
      borrowedCopies,
      damagedLostCopies,
    };
  }, [books]);

  // Filtered Books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = book.bookName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "ALL" || book.categoryIds?.includes(categoryFilter);
      return matchesSearch && matchesCategory;
    });
  }, [books, searchQuery, categoryFilter]);

  // Detail View Mode
  if (selectedBook) {
    return (
      <BookDetailPanel
        book={selectedBook}
        onBack={() => {
          setSelectedBook(null);
          refreshBooks(); // refresh to ensure data is up to date when going back
        }}
        shelves={shelves}
      />
    );
  }

  // Main Dashboard View
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Metrics */}
      <div>
        <h2 className="text-xl font-bold text-sky-950 mb-4">
          Quản lý Đầu Sách & Bản Sao Lưu Kho
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
            <span className="text-xs font-semibold text-slate-500">
              Tổng số đầu sách
            </span>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-sky-600">
                {metrics.totalBooks}
              </span>
              <BookOpen className="h-5 w-5 text-sky-400 mb-1" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
            <span className="text-xs font-semibold text-slate-500">
              Tổng bản sao (Vật lý)
            </span>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-sky-900">
                {metrics.totalCopies}
              </span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-200 flex flex-col justify-center">
            <span className="text-xs font-semibold text-emerald-600">
              Sẵn sàng phục vụ
            </span>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-600">
                {metrics.availableCopies}
              </span>
              <CheckCircle2 className="h-5 w-5 text-emerald-400 mb-1" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-200 flex flex-col justify-center">
            <span className="text-xs font-semibold text-amber-600">
              Đang cho mượn
            </span>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-amber-600">
                {metrics.borrowedCopies}
              </span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-rose-200 flex flex-col justify-center">
            <span className="text-xs font-semibold text-rose-600">
              Hư hỏng / Thất lạc
            </span>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-rose-600">
                {metrics.damagedLostCopies}
              </span>
              <XCircle className="h-5 w-5 text-rose-400 mb-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-1 w-full gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sách..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
            />
          </div>
          <div className="relative w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 appearance-none transition-all"
            >
              <option value="ALL">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition flex items-center justify-center gap-2 shadow-md shadow-sky-600/20"
        >
          <Plus className="h-4 w-4" />
          <span>Đăng ký sách mới</span>
        </button>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          <p className="font-medium">Không tìm thấy sách nào phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredBooks.map((book) => {
            const available =
              book.copies?.filter((c) => c.status === "AVAILABLE").length || 0;
            const total = book.copies?.length || 0;
            const displayCat =
              categories.find((c) => book.categoryIds?.includes(c.categoryId))
                ?.categoryName || "Khác";

            return (
              <div
                key={book.bookId}
                onClick={() => setSelectedBook(book)}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-sky-300 transition-all cursor-pointer overflow-hidden group flex flex-col"
              >
                {/* Book Cover Placeholder */}
                <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden group-hover:bg-sky-50 transition-colors">
                  <div className="absolute inset-0 bg-linear-to-br from-sky-400/10 to-transparent"></div>
                  <BookOpen className="h-12 w-12 text-sky-200 group-hover:text-sky-300 transition-colors drop-shadow-sm" />
                  <button
                    onClick={(e) => handleDeleteBook(e, book.bookId)}
                    disabled={isDeleting}
                    className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-full transition-colors backdrop-blur-sm shadow-xs"
                    title="Xóa sách"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Book Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="font-bold text-sky-950 text-sm line-clamp-2 leading-tight group-hover:text-sky-700 transition-colors">
                      {book.bookName}
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full self-start mb-2">
                    {displayCat}
                  </span>

                  <div className="mt-auto pt-3 border-t border-slate-100">
                    <AvailabilityProgressBar
                      available={available}
                      total={total}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateBookModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            refreshBooks();
          }}
          categories={categories}
          authors={authors}
          publishers={publishers}
          shelves={shelves}
        />
      )}
    </div>
  );
}

// ==========================================
// Sub-component: Detail Panel
// ==========================================
const BookDetailPanel = ({ book, onBack, shelves }) => {
  const [copies, setCopies] = useState(book.copies || []);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingCopyId, setEditingCopyId] = useState(null);

  // States for quick edit
  const [editStatus, setEditStatus] = useState("");
  const [editShelf, setEditShelf] = useState("");

  const handleEditClick = (copy) => {
    setEditingCopyId(copy.copyId);
    setEditStatus(copy.status);
    setEditShelf(copy.shelfId || "");
  };

  const handleCancelEdit = () => {
    setEditingCopyId(null);
  };

  const handleSaveEdit = async (copyId) => {
    setIsUpdating(true);
    try {
      const req = {
        copyId: copyId,
        status: editStatus,
        shelfId: editShelf || null,
      };
      await employeeService.updateInventory(req);
      
      // update local state to reflect changes instantly without re-fetching full book list
      setCopies((prev) =>
        prev.map((c) =>
          c.copyId === copyId
            ? { ...c, status: editStatus, shelfId: editShelf }
            : c,
        ),
      );
      setEditingCopyId(null);
      toast.success("Cập nhật bản sao thành công");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật bản sao");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCopy = async (copyId) => {
    if (!window.confirm(`Bạn có chắc muốn xoá bản sao ${copyId} không?`)) return;
    setIsUpdating(true);
    try {
      await employeeService.deleteBookCopy(copyId);
      setCopies((prev) => prev.filter((c) => c.copyId !== copyId));
      toast.success("Đã xoá bản sao thành công");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xoá bản sao");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-300">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-sky-700 transition font-medium mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Quay lại danh sách</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Detail Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-32 h-44 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
            <BookOpen className="h-10 w-10 text-slate-300" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-sky-950 mb-2">
              {book.bookName}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <span className="block text-xs text-slate-400">
                  Năm xuất bản
                </span>
                <span className="font-semibold text-slate-700">
                  {book.year || "N/A"}
                </span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Số bản sao</span>
                <span className="font-semibold text-slate-700">
                  {copies.length}
                </span>
              </div>
              <div className="col-span-2">
                <span className="block text-xs text-slate-400">Mô tả</span>
                <span className="text-sm text-slate-600 line-clamp-2">
                  {book.description || "Không có mô tả."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copies Table */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">
              Danh sách bản sao vật lý
            </h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">
                    Mã bản sao (Copy ID)
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    Trạng thái lưu thông
                  </th>
                  <th className="px-4 py-3 font-semibold">Vị trí kệ sách</th>
                  <th className="px-4 py-3 font-semibold w-32">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {copies.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-8 text-center text-slate-400"
                    >
                      Không có bản sao nào.
                    </td>
                  </tr>
                ) : (
                  copies.map((copy) => {
                    const isEditing = editingCopyId === copy.copyId;
                    const shelfName =
                      shelves.find((s) => s.shelfId === copy.shelfId)
                        ?.shelfName || "N/A";

                    return (
                      <tr
                        key={copy.copyId}
                        className="hover:bg-slate-50/50 transition"
                      >
                        <td className="px-4 py-3 font-mono font-medium text-sky-700">
                          {copy.copyId}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              className="border border-sky-300 rounded-md px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-sky-500"
                            >
                              <option value="AVAILABLE">
                                AVAILABLE (Sẵn sàng)
                              </option>
                              <option value="BORROWED">
                                BORROWED (Đã mượn)
                              </option>
                              <option value="DAMAGED">DAMAGED (Hư hỏng)</option>
                              <option value="LOST">LOST (Thất lạc)</option>
                            </select>
                          ) : (
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                copy.status === "AVAILABLE"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : copy.status === "BORROWED"
                                    ? "bg-amber-100 text-amber-700"
                                    : copy.status === "RESERVED"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-rose-100 text-rose-700"
                              }`}
                            >
                              {copy.status}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <select
                              value={editShelf}
                              onChange={(e) => setEditShelf(e.target.value)}
                              className="border border-sky-300 rounded-md px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-sky-500"
                            >
                              <option value="">-- Chọn kệ --</option>
                              {shelves.map((s) => (
                                <option key={s.shelfId} value={s.shelfId}>
                                  {s.shelfName}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-slate-600 font-medium">
                              {shelfName}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSaveEdit(copy.copyId)}
                                disabled={isUpdating}
                                className="text-emerald-600 hover:text-emerald-700 font-medium text-xs px-2 py-1 bg-emerald-50 rounded"
                              >
                                Lưu
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                                className="text-slate-500 hover:text-slate-700 font-medium text-xs px-2 py-1 bg-slate-100 rounded"
                              >
                                Hủy
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(copy)}
                                className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition border border-transparent hover:border-sky-200"
                                title="Cập nhật bản sao"
                              >
                                <Settings className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCopy(copy.copyId)}
                                disabled={isUpdating}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-200"
                                title="Xoá bản sao"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Sub-component: Create Book Modal
// ==========================================
const CreateBookModal = ({
  onClose,
  onSuccess,
  categories,
  authors,
  publishers,
  shelves,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    bookName: "",
    publisherId: "",
    year: new Date().getFullYear(),
    description: "",
    authorIds: [],
    categoryIds: [],
  });

  // Copies generation
  const [copySettings, setCopySettings] = useState({
    quantity: 1,
    status: "AVAILABLE",
    shelfId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Build copies array
      const copies = Array.from({ length: copySettings.quantity }).map(() => ({
        status: copySettings.status,
        shelfId: copySettings.shelfId || null,
      }));

      const requestPayload = {
        ...formData,
        // For array fields that come from single select in this simple UI, ensure arrays
        authorIds: formData.authorIds.length > 0 ? formData.authorIds : [],
        categoryIds:
          formData.categoryIds.length > 0 ? formData.categoryIds : [],
        copies: copies,
      };

      await employeeService.createBook(requestPayload);
      toast.success("Đăng ký sách mới thành công!");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi đăng ký sách");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-sky-950">
            Đăng Ký Đầu Sách Mới
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200"
        >
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-700 border-b pb-2">
              1. Thông tin chung
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Tên sách <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="bookName"
                  value={formData.bookName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                  placeholder="Nhập tên sách..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Danh mục
                </label>
                <select
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      categoryIds: [e.target.value],
                    }))
                  }
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Tác giả
                </label>
                <select
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      authorIds: [e.target.value],
                    }))
                  }
                >
                  <option value="">-- Chọn tác giả --</option>
                  {authors.map((a) => (
                    <option key={a.authorId} value={a.authorId}>
                      {a.authorName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Nhà xuất bản
                </label>
                <select
                  name="publisherId"
                  value={formData.publisherId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                >
                  <option value="">-- Chọn NXB --</option>
                  {publishers.map((p) => (
                    <option key={p.publisherId} value={p.publisherId}>
                      {p.publisherName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Năm xuất bản
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Mô tả thêm
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                  placeholder="ISBN, Tóm tắt..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-700 border-b pb-2">
              2. Khởi tạo bản sao (Vật lý)
            </h4>
            <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-sky-900 mb-1">
                  Số lượng bản sao
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={copySettings.quantity}
                  onChange={(e) =>
                    setCopySettings((prev) => ({
                      ...prev,
                      quantity: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sky-900 mb-1">
                  Tình trạng chung
                </label>
                <select
                  value={copySettings.status}
                  onChange={(e) =>
                    setCopySettings((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                >
                  <option value="AVAILABLE">AVAILABLE (Sẵn sàng)</option>
                  <option value="DAMAGED">DAMAGED (Hư hỏng)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sky-900 mb-1">
                  Vị trí kệ sách
                </label>
                <select
                  value={copySettings.shelfId}
                  onChange={(e) =>
                    setCopySettings((prev) => ({
                      ...prev,
                      shelfId: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                >
                  <option value="">-- Tùy chọn kệ --</option>
                  {shelves.map((s) => (
                    <option key={s.shelfId} value={s.shelfId}>
                      {s.shelfName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Mã bản sao (Copy ID) sẽ được hệ thống sinh tự động. Bạn có thể cập
              nhật vị trí chi tiết của từng bản sao sau khi tạo.
            </p>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition flex items-center gap-2 shadow-md shadow-sky-600/20"
            >
              {isLoading ? "Đang xử lý..." : "Lưu & Khởi tạo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
