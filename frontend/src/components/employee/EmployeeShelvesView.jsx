import { useState, useMemo } from "react";
import { useEmployee } from "../../hooks/useEmployee";
import { Layers, MapPin, Search, BookOpen, Hash, ArrowRight, X, Copy, BookMarked, Tag, User } from "lucide-react";

const EmployeeShelvesView = () => {
  const { shelves, books } = useEmployee();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShelf, setSelectedShelf] = useState(null);

  // Group shelves by area/position and calculate statistics
  const processedInventory = useMemo(() => {
    const safeShelves = shelves || [];
    const safeBooks = books || [];

    // Group by position
    const grouped = {};

    safeShelves.forEach((shelf) => {
      const position = shelf.position || shelf.shelfLocation || "Khu vực khác";
      
      if (!grouped[position]) {
        grouped[position] = {
          positionName: position,
          shelves: [],
        };
      }

      // Calculate statistics for this shelf
      const booksOnShelf = safeBooks.filter(book => 
        book.copies && book.copies.some(copy => copy.shelfId === shelf.shelfId)
      );

      let totalCopies = 0;
      const booksDetails = booksOnShelf.map(book => {
        const copiesOnThisShelf = book.copies.filter(c => c.shelfId === shelf.shelfId);
        totalCopies += copiesOnThisShelf.length;
        
        return {
          ...book,
          copiesOnShelf: copiesOnThisShelf
        };
      });

      grouped[position].shelves.push({
        ...shelf,
        totalTitles: booksOnShelf.length,
        totalCopies: totalCopies,
        books: booksDetails
      });
    });

    // Apply search filter
    const query = searchTerm.toLowerCase().trim();
    if (!query) {
      return Object.values(grouped).sort((a, b) => a.positionName.localeCompare(b.positionName));
    }

    const filtered = [];
    Object.values(grouped).forEach(group => {
      // If position matches, include whole group
      if (group.positionName.toLowerCase().includes(query)) {
        filtered.push(group);
      } else {
        // Otherwise filter shelves inside
        const matchedShelves = group.shelves.filter(sh => 
          sh.shelfName?.toLowerCase().includes(query) || 
          sh.shelfId?.toLowerCase().includes(query)
        );
        
        if (matchedShelves.length > 0) {
          filtered.push({
            ...group,
            shelves: matchedShelves
          });
        }
      }
    });

    return filtered.sort((a, b) => a.positionName.localeCompare(b.positionName));
  }, [shelves, books, searchTerm]);

  // Status mapping for visual styling
  const statusConfig = {
    AVAILABLE: { label: "Sẵn sàng", class: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    BORROWED: { label: "Đang mượn", class: "bg-amber-100 text-amber-700 border-amber-200" },
    RESERVED: { label: "Đã giữ chỗ", class: "bg-blue-100 text-blue-700 border-blue-200" },
    LOST: { label: "Đã mất", class: "bg-rose-100 text-rose-700 border-rose-200" },
    DAMAGED: { label: "Hư hỏng", class: "bg-purple-100 text-purple-700 border-purple-200" },
  };

  const getStatusBadge = (status) => {
    const conf = statusConfig[status] || { label: status, class: "bg-slate-100 text-slate-700 border-slate-200" };
    return (
      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${conf.class}`}>
        {conf.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="h-6 w-6 text-sky-600" />
            <span>Kiểm Kê Kho & Vị Trí Kệ (Inventory)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý, tra cứu vị trí tài liệu, kiểm kê số lượng sách và bản sao trên từng kệ thực tế.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo khu vực (Khu A...), hoặc tên/mã kệ..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Main Content: Grouped by Position */}
      <div className="space-y-8">
        {processedInventory.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Không tìm thấy khu vực hoặc kệ nào khớp với từ khóa.</p>
          </div>
        ) : (
          processedInventory.map((group, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-sky-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">
                  {group.positionName}
                </h2>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                  {group.shelves.length} kệ
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.shelves.map((shelf) => (
                  <div
                    key={shelf.shelfId}
                    onClick={() => setSelectedShelf(shelf)}
                    className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-[10px] font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                          {shelf.shelfId}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 transition-colors" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-sky-700 transition-colors">
                        {shelf.shelfName}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                      <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-2">
                        <BookOpen className="w-4 h-4 text-slate-400 mb-1" />
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Đầu Sách</span>
                        <span className="text-sm font-extrabold text-slate-700">{shelf.totalTitles}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-indigo-50/50 rounded-xl p-2">
                        <Copy className="w-4 h-4 text-indigo-400 mb-1" />
                        <span className="text-[10px] text-indigo-500 uppercase font-bold">Bản Sao</span>
                        <span className="text-sm font-extrabold text-indigo-700">{shelf.totalCopies}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Shelf Details Modal */}
      {selectedShelf && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-extrabold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100">
                    {selectedShelf.shelfId}
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedShelf.position || selectedShelf.shelfLocation || "Khu vực khác"}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  Chi tiết Kệ: {selectedShelf.shelfName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedShelf(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
              {selectedShelf.books.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-slate-200">
                  <BookMarked className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Hiện không có cuốn sách nào được đặt trên kệ này.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedShelf.books.map((book) => (
                    <div key={book.bookId} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div>
                          <h4 className="text-base font-extrabold text-slate-900 mb-1">{book.bookName}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">ID: {book.bookId}</span>
                            <span>XB: {book.year}</span>
                            {book.authorIds && book.authorIds.length > 0 && (
                              <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5" />
                                {book.authorIds.length} Tác giả
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                          <Copy className="w-3.5 h-3.5" />
                          <span>{book.copiesOnShelf.length} Bản sao trên kệ</span>
                        </div>
                      </div>

                      {/* Copies Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
                        {book.copiesOnShelf.map((copy) => (
                          <div key={copy.copyId} className="flex flex-col bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                            <div className="flex justify-between items-center mb-1.5">
                              <Tag className="w-3.5 h-3.5 text-slate-400" />
                              {getStatusBadge(copy.status)}
                            </div>
                            <span className="font-mono text-xs font-bold text-slate-700 text-center">
                              {copy.copyId}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeShelvesView;
