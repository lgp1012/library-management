import { useState, useEffect, useMemo } from "react";
import { 
  Search, Clock, ChevronRight, CheckCircle2, AlertCircle, Plus, 
  RotateCcw, ShieldAlert, ArrowLeft, BookOpen, UserCircle2, BookUp, DollarSign
} from "lucide-react";
import employeeService from "../../services/employeeService";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export default function EmployeeBorrowReturnView() {
  const [activeView, setActiveView] = useState("dashboard"); // dashboard, borrow, return
  const [borrowings, setBorrowings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBorrowings = async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.getAllActiveBorrowings();
      setBorrowings(data.result || []);
    } catch (err) {
      toast.error("Không thể tải danh sách phiếu mượn.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === "dashboard") {
      fetchBorrowings();
    }
  }, [activeView]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
              activeView === "dashboard" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Clock className="h-4 w-4" /> Đang mượn ({activeView === "dashboard" ? borrowings.length : "-"})
          </button>
          <button
            onClick={() => setActiveView("borrow")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
              activeView === "borrow" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Plus className="h-4 w-4" /> Lập phiếu mượn
          </button>
          <button
            onClick={() => setActiveView("return")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
              activeView === "return" ? "bg-white text-rose-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <RotateCcw className="h-4 w-4" /> Nhận trả sách & Phạt
          </button>
        </div>
        <div className="text-sm font-semibold text-slate-500 flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          Hôm nay: <span className="text-slate-900">{dayjs().format("DD/MM/YYYY")}</span>
        </div>
      </div>

      {activeView === "dashboard" && <BorrowingsDashboard borrowings={borrowings} isLoading={isLoading} fetchBorrowings={fetchBorrowings} />}
      {activeView === "borrow" && <BorrowBooksFlow onFinish={() => setActiveView("dashboard")} />}
      {activeView === "return" && <ReturnBooksFlow onFinish={() => setActiveView("dashboard")} />}
    </div>
  );
}

// ==========================================
// VIEW 1: DASHBOARD
// ==========================================
const BorrowingsDashboard = ({ borrowings, isLoading, fetchBorrowings }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [phoneVerify, setPhoneVerify] = useState(false);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return borrowings.filter((b) =>
      b.readerName?.toLowerCase().includes(q) ||
      b.readerId?.toLowerCase().includes(q) ||
      b.bookName?.toLowerCase().includes(q) ||
      b.copyId?.toLowerCase().includes(q) ||
      b.borrowingId?.toLowerCase().includes(q)
    );
  }, [borrowings, searchQuery]);

  const handleRenew = async (detailId) => {
    if (!phoneVerify && !window.confirm("Gia hạn thêm 14 ngày cho sách này?")) return;
    if (phoneVerify) {
      toast.info(
        `[${detailId}] Đang xác thực qua điện thoại (khoảng 10s) trước khi ghi nhận...`,
        { autoClose: 9000 },
      );
    }
    try {
      const res = await employeeService.renewBorrowing(detailId, phoneVerify ? 10000 : 0);
      toast.success(
        `[${detailId}] Gia hạn thành công! Hạn mới: ${res.result?.expectedReturnDate ?? "?"}`
      );
      fetchBorrowings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi gia hạn.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Danh sách phiếu mượn đang lưu hành</h3>
          <p className="text-sm text-slate-500">Theo dõi các bản sao sách đang ở tay độc giả</p>
          <label className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-slate-200 transition">
            <input
              type="checkbox"
              checked={phoneVerify}
              onChange={(e) => setPhoneVerify(e.target.checked)}
              className="accent-sky-600"
            />
            Xác thực qua điện thoại trước khi ghi nhận (dành cho yêu cầu gia hạn qua tổng đài)
          </label>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo độc giả, mã sách, phiếu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-white text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider">Mã chi tiết / Phiếu</th>
              <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider">Độc giả</th>
              <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider">Mã bản sao & Tựa sách</th>
              <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider">Ngày mượn</th>
              <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider">Hạn trả</th>
              <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider text-center">Tình trạng</th>
              <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-400">Đang tải...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-400">Không có dữ liệu.</td></tr>
            ) : (
              filtered.map((b) => {
                const isOverdue = dayjs().isAfter(dayjs(b.expectedReturnDate), "day");
                return (
                  <tr key={b.detailId} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold font-mono text-slate-800">{b.detailId}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{b.borrowingId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-sky-700">{b.readerName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{b.readerId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{b.bookName}</div>
                      <div className="text-xs font-mono text-slate-500 mt-0.5 bg-slate-100 inline-block px-1 rounded">{b.copyId}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">{b.borrowingDate || "N/A"}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{b.expectedReturnDate}</td>
                    <td className="px-6 py-4 text-center">
                      {isOverdue ? (
                        <span className="inline-flex px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-full">Đã quá hạn</span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">Trong hạn</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleRenew(b.detailId)}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1.5"
                      >
                        Gia hạn (+14 ngày)
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// VIEW 2: NEW BORROWING
// ==========================================
const BorrowBooksFlow = ({ onFinish }) => {
  const [readers, setReaders] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedReaderId, setSelectedReaderId] = useState("");
  const [readerSearchTerm, setReaderSearchTerm] = useState("");
  const [isReaderDropdownOpen, setIsReaderDropdownOpen] = useState(false);
  const [searchBookTerm, setSearchBookTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  
  const [selectedCopies, setSelectedCopies] = useState([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    employeeService.listReaders().then(res => setReaders(res.result || []));
    employeeService.listBooks().then(res => setBooks(res.result || []));
  }, []);

  const handleToggleCopy = (copy) => {
    if (selectedCopies.length > 0 && selectedCopies[0].copyId === copy.copyId) {
      setSelectedCopies([]); // Deselect if already selected
    } else {
      setSelectedCopies([{ ...copy, bookName: selectedBook.bookName }]); // Select only this one
    }
  };

  const handleSubmit = async () => {
    setFormError(null);
    if (!selectedReaderId) {
      setFormError("Vui lòng chọn độc giả.");
      return;
    }
    if (selectedCopies.length === 0) {
      setFormError("Vui lòng chọn ít nhất 1 bản sao.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await employeeService.borrowBooks({
        readerId: selectedReaderId,
        copyIds: selectedCopies.map(c => c.copyId),
        notes: notes || "Mượn trực tiếp tại quầy"
      });
      toast.success("Đã lập phiếu mượn thành công!");
      onFinish();
    } catch (err) {
      setFormError(err.response?.data?.message || "Lỗi khi lập phiếu mượn.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBooks = books.filter(b => 
    b.bookName.toLowerCase().includes(searchBookTerm.toLowerCase()) && 
    (b.copies?.filter(c => c.status === "AVAILABLE").length > 0)
  );
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-right-8">
      {/* Left Column: Form Setup */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="bg-sky-100 text-sky-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span> 
            Thông tin người mượn
          </h3>
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Chọn độc giả *</label>
              <input
                type="text"
                placeholder="Nhập tên hoặc mã RD..."
                value={readerSearchTerm}
                onChange={(e) => {
                  setReaderSearchTerm(e.target.value);
                  setIsReaderDropdownOpen(true);
                  setSelectedReaderId(""); // reset when typing
                }}
                onFocus={() => setIsReaderDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsReaderDropdownOpen(false), 200)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-medium"
              />
              {isReaderDropdownOpen && readerSearchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 shadow-lg rounded-xl max-h-60 overflow-y-auto">
                  {readers
                    .filter(r => r.readerName.toLowerCase().includes(readerSearchTerm.toLowerCase()) || r.readerId.toLowerCase().includes(readerSearchTerm.toLowerCase()))
                    .map(r => (
                      <div 
                        key={r.readerId}
                        onMouseDown={(e) => {
                          e.preventDefault(); 
                          setSelectedReaderId(r.readerId);
                          setReaderSearchTerm(`${r.readerName} (${r.readerId})`);
                          setIsReaderDropdownOpen(false);
                        }}
                        className={`px-4 py-3 cursor-pointer hover:bg-slate-50 border-b last:border-b-0 border-slate-100 ${!r.active ? "opacity-50" : ""}`}
                      >
                        <div className="font-bold text-sm text-slate-800">{r.readerName}</div>
                        <div className="text-xs text-slate-500">{r.readerId} {!r.active ? "- Bị khóa" : ""}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ghi chú phiếu mượn</label>
              <input
                type="text"
                placeholder="VD: Mượn tại quầy..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </div>
          
          <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
            <div className="font-bold text-slate-700 mb-2">Quy định mượn:</div>
            <ul className="text-slate-500 space-y-1 list-disc pl-4 text-xs">
              <li>Thời hạn tiêu chuẩn: 14 ngày.</li>
              <li>Thao tác: Mỗi phiếu chỉ mượn 1 cuốn.</li>
              <li>Hạn ngạch: Tối đa 5 cuốn / độc giả.</li>
              <li>Sách trả trễ hạn sẽ áp dụng đơn giá phạt mặc định.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Column: Book Selection & Cart */}
      <div className="lg:col-span-2 space-y-6 flex flex-col h-full min-h-[500px]">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span> 
            Thêm bản sao sách ({selectedCopies.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
            {/* Book Search */}
            <div className="border-r border-slate-100 pr-6 flex flex-col min-h-0">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tựa sách..."
                  value={searchBookTerm}
                  onChange={(e) => setSearchBookTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {filteredBooks.slice(0, 20).map(b => (
                  <div 
                    key={b.bookId} 
                    onClick={() => setSelectedBook(b)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${selectedBook?.bookId === b.bookId ? "bg-sky-50 border-sky-200 ring-1 ring-sky-500/30" : "bg-white border-slate-100 hover:border-sky-200"}`}
                  >
                    <div className="font-bold text-slate-800 text-sm mb-1">{b.bookName}</div>
                    <div className="text-xs text-slate-500 flex justify-between">
                      <span>Mã: {b.bookId}</span>
                      <span className="text-sky-600 font-semibold">{b.copies?.filter(c => c.status === "AVAILABLE").length || 0} bản rảnh</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Copies Selection */}
            <div className="flex flex-col min-h-0 h-full overflow-y-auto custom-scrollbar pr-2">
              <div className="mb-6 flex-1">
                <h4 className="text-sm font-bold text-slate-700 mb-3">
                  {selectedBook ? `Bản sao rảnh của "${selectedBook.bookName}"` : "Chọn 1 tựa sách bên trái"}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedBook ? (
                    selectedBook.copies?.filter(c => c.status === "AVAILABLE").length > 0 ? (
                      selectedBook.copies.filter(c => c.status === "AVAILABLE").map(copy => {
                        const isSelected = selectedCopies.length > 0 && selectedCopies[0].copyId === copy.copyId;
                        return (
                          <div
                            key={copy.copyId}
                            onClick={() => handleToggleCopy(copy)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col gap-1 items-center justify-center text-center ${
                              isSelected 
                                ? "border-emerald-500 bg-emerald-50 shadow-sm" 
                                : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/50"
                            }`}
                          >
                            <div className={`text-sm font-mono font-bold ${isSelected ? "text-emerald-700" : "text-slate-700"}`}>
                              {copy.copyId}
                            </div>
                            <div className={`text-[10px] uppercase font-bold ${isSelected ? "text-emerald-600" : "text-slate-400"}`}>
                              {isSelected ? "Đã chọn" : "Nhấn để chọn"}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-2 flex flex-col items-center justify-center py-10 text-slate-400 opacity-50 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                        <BookUp className="h-10 w-10 mb-2 text-slate-300" />
                        <span className="text-sm">Không còn bản sao rảnh.</span>
                      </div>
                    )
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Error and Button */}
          <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col items-end gap-3">
            {formError && (
              <div className="w-full bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-sm font-medium leading-relaxed">
                  {formError}
                </div>
              </div>
            )}
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || selectedCopies.length === 0 || !selectedReaderId}
              className="w-full md:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" /> Xác nhận lập phiếu ({selectedCopies.length} cuốn)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// ==========================================
// VIEW 3: RETURN BOOKS
// ==========================================
const ReturnBooksFlow = ({ onFinish }) => {
  const [readers, setReaders] = useState([]);
  const [selectedReaderId, setSelectedReaderId] = useState("");
  const [borrowings, setBorrowings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fineConfigs, setFineConfigs] = useState({
    OVERDUE: { fineRatePerDay: 5000 },
    DAMAGED: { fineRatePerDay: 50000 },
    LOST: { fineRatePerDay: 30000 },
    OTHER: { fineRatePerDay: 20000 }
  });
  
  const [selectedToReturn, setSelectedToReturn] = useState({}); // { detailId: "NORMAL" | "DAMAGED" | "LOST" }
  const [returnParams, setReturnParams] = useState({}); // { detailId: { price: "", percentage: 100 } }
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    employeeService.listReaders().then(res => setReaders(res.result || []));
    employeeService.getFineConfigs().then(res => {
      const list = res.result || [];
      if (list.length > 0) {
        const map = {};
        list.forEach(cfg => {
          if (cfg.fineType) {
            map[cfg.fineType.toUpperCase()] = cfg;
          }
        });
        setFineConfigs(prev => ({ ...prev, ...map }));
      }
    }).catch(err => console.error("Could not fetch fine config", err));
  }, []);

  const handleReaderChange = async (readerId) => {
    setSelectedReaderId(readerId);
    setSelectedToReturn({});
    setReturnParams({});
    if (!readerId) {
      setBorrowings([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await employeeService.getReaderBorrowings(readerId);
      // Only show active borrowings (not returned yet)
      setBorrowings((res.result || []).filter(b => !b.actualReturnDate));
    } catch (err) {
      toast.error("Không thể lấy sách đang mượn.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectReturn = (detailId, condition) => {
    setSelectedToReturn(prev => {
      const next = { ...prev };
      if (next[detailId] === condition) {
        delete next[detailId]; // deselect
      } else {
        next[detailId] = condition;
      }
      return next;
    });
    
    // Initialize default params if damaged or lost
    if (condition === "DAMAGED" || condition === "LOST") {
      setReturnParams(prev => {
        if (!prev[detailId]) {
          return { ...prev, [detailId]: { price: "", percentage: 100 } };
        }
        return prev;
      });
    }
  };

  const handleParamChange = (detailId, field, value) => {
    setReturnParams(prev => ({
      ...prev,
      [detailId]: {
        ...(prev[detailId] || { price: "", percentage: 100 }),
        [field]: value
      }
    }));
  };

  const handleConfirmReturns = async () => {
    const detailIds = Object.keys(selectedToReturn);
    if (detailIds.length === 0) return;
    
    // Validation
    for (const detailId of detailIds) {
      const condition = selectedToReturn[detailId];
      if (condition === "LOST") {
        const params = returnParams[detailId];
        if (!params || !params.price || isNaN(params.price) || Number(params.price) <= 0) {
          toast.error("Vui lòng nhập giá bìa sách hợp lệ cho sách bị mất.");
          return;
        }
      }
    }

    setIsSubmitting(true);
    let successCount = 0;
    try {
      for (const detailId of detailIds) {
        let condition = selectedToReturn[detailId];
        let finePrice = undefined;
        
        if (condition === "LOST") {
           finePrice = Number(returnParams[detailId].price);
        } else if (condition === "DAMAGED") {
           const damagedBaseRate = fineConfigs['DAMAGED']?.fineRatePerDay ?? 50000;
           finePrice = damagedBaseRate * (Number(returnParams[detailId]?.percentage || 100) / 100);
        }

        if (condition === "NORMAL") condition = "AVAILABLE";
        
        const borrowing = borrowings.find(b => b.detailId === detailId);
        if (!borrowing) continue;

        await employeeService.returnBook({
          copyId: borrowing.copyId,
          condition: condition,
          finePrice: finePrice
        });
        successCount++;
      }
      toast.success(`Đã nhận trả thành công ${successCount} cuốn sách!`);
      onFinish(); // Go back to dashboard to refresh
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi nhận trả sách.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-right-8">
      {/* Left: Reader Lookup */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            Tìm độc giả trả sách
          </h3>
          <select
            value={selectedReaderId}
            onChange={(e) => handleReaderChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-medium"
          >
            <option value="">-- Nhập/Chọn Độc giả --</option>
            {readers.map(r => (
              <option key={r.readerId} value={r.readerId}>
                {r.readerName} ({r.readerId})
              </option>
            ))}
          </select>

          <div className="mt-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
            <h4 className="font-bold text-slate-700 text-sm mb-3">Nguyên tắc xử lý</h4>
            <ul className="text-xs text-slate-500 space-y-2">
              <li className="flex gap-2"><div className="font-bold text-slate-700">1.</div> Tích chọn sách và tình trạng thực tế khi nhận.</li>
              <li className="flex gap-2"><div className="font-bold text-slate-700">2.</div> Quá hạn sẽ tự sinh tiền phạt (5.000đ/ngày).</li>
              <li className="flex gap-2"><div className="font-bold text-slate-700">3.</div> Hư hỏng/Mất sẽ tự sinh biên lai phạt riêng.</li>
              <li className="flex gap-2"><div className="font-bold text-slate-700">4.</div> Sau khi nhận, sách rảnh (Available) sẽ được mang về kệ.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right: Borrowed Books List */}
      <div className="lg:col-span-2">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              Sách đang mượn ({borrowings.length})
            </h3>
            <button
              onClick={handleConfirmReturns}
              disabled={isSubmitting || Object.keys(selectedToReturn).length === 0}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition shadow-md shadow-emerald-600/20 flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" /> Xác nhận thu hồi ({Object.keys(selectedToReturn).length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {!selectedReaderId ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <UserCircle2 className="h-12 w-12 mb-2 opacity-50" />
                <p>Vui lòng chọn độc giả bên trái.</p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-10 text-slate-500">Đang tải...</div>
            ) : borrowings.length === 0 ? (
              <div className="text-center py-10 text-slate-500 font-medium">Độc giả này hiện không giữ sách nào.</div>
            ) : (
              borrowings.map(b => {
                const isOverdue = dayjs().isAfter(dayjs(b.expectedReturnDate), "day");
                const overdueDays = isOverdue ? dayjs().diff(dayjs(b.expectedReturnDate), "day") : 0;
                const selectedCondition = selectedToReturn[b.detailId];
                
                return (
                  <div key={b.detailId} className={`p-4 rounded-xl border-2 transition-all ${
                    selectedCondition ? "border-emerald-500 bg-emerald-50/20" : "border-slate-100 bg-slate-50/50"
                  }`}>
                    <div className="flex justify-between items-start mb-3 border-b border-slate-200/60 pb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">{b.copyId}</span>
                          <h4 className="font-bold text-slate-800">{b.bookName}</h4>
                        </div>
                        <div className="text-xs text-slate-500">
                          Phiếu: {b.borrowingId} • Hạn trả: <span className={isOverdue ? "text-rose-600 font-bold" : ""}>{b.expectedReturnDate}</span>
                        </div>
                      </div>
                      {isOverdue && (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-rose-100 text-rose-700 rounded-md">
                            <AlertCircle className="h-3 w-3" /> Trễ {overdueDays} ngày (Phạt {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(overdueDays * (fineConfigs['OVERDUE']?.fineRatePerDay ?? 5000))})
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase mb-2">Tình trạng khi nhận lại:</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSelectReturn(b.detailId, "NORMAL")}
                          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition border ${
                            selectedCondition === "NORMAL" ? "bg-emerald-100 border-emerald-500 text-emerald-800" : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300"
                          }`}
                        >
                          Bình thường
                        </button>
                        <button
                          onClick={() => handleSelectReturn(b.detailId, "DAMAGED")}
                          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition border ${
                            selectedCondition === "DAMAGED" ? "bg-amber-100 border-amber-500 text-amber-800" : "bg-white border-slate-200 text-slate-600 hover:border-amber-300"
                          }`}
                        >
                          Hư hỏng
                        </button>
                        <button
                          onClick={() => handleSelectReturn(b.detailId, "LOST")}
                          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition border ${
                            selectedCondition === "LOST" ? "bg-rose-100 border-rose-500 text-rose-800" : "bg-white border-slate-200 text-slate-600 hover:border-rose-300"
                          }`}
                        >
                          Làm mất
                        </button>
                      </div>
                      
                      {(selectedCondition === "DAMAGED" || selectedCondition === "LOST") && (
                        <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <div className="flex flex-col gap-3 mb-3">
                            {selectedCondition === "LOST" && (
                              <div>
                                <label className="text-xs font-semibold text-slate-600 mb-1 block">Giá bìa sách (VNĐ):</label>
                                <input 
                                  type="number" 
                                  min="0" 
                                  className="w-full text-sm p-2 border border-amber-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                                  value={returnParams[b.detailId]?.price || ""}
                                  onChange={(e) => handleParamChange(b.detailId, "price", e.target.value)}
                                  placeholder="Nhập giá bìa..."
                                />
                              </div>
                            )}
                            
                            {selectedCondition === "DAMAGED" && (
                              <div>
                                <label className="text-xs font-semibold text-slate-600 mb-1 block">Mức phạt (%):</label>
                                <div className="flex gap-2">
                                  {[25, 50, 75, 100].map(pct => (
                                    <button
                                      key={pct}
                                      onClick={() => handleParamChange(b.detailId, "percentage", pct)}
                                      className={`flex-1 py-1 text-xs font-bold rounded border transition ${
                                        returnParams[b.detailId]?.percentage === pct
                                          ? "bg-amber-500 text-white border-amber-600"
                                          : "bg-white text-slate-600 border-slate-300 hover:bg-amber-100"
                                      }`}
                                    >
                                      {pct}%
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 text-amber-800 text-sm font-bold border-t border-amber-200/60 pt-2">
                            <DollarSign className="h-4 w-4 text-amber-600" />
                            Phát sinh vé phạt: {
                              selectedCondition === "LOST"
                                ? (returnParams[b.detailId]?.price
                                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(returnParams[b.detailId].price))
                                    : "0 đ")
                                : (selectedCondition === "DAMAGED"
                                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                        (fineConfigs['DAMAGED']?.fineRatePerDay ?? 50000) * (Number(returnParams[b.detailId]?.percentage || 100) / 100)
                                      )
                                    : "0 đ")
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Extracted XCircle icon to be used
const XCircleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);
