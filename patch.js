const fs = require("fs");
let content = fs.readFileSync("frontend/src/components/employee/EmployeeBorrowReturnView.jsx", "utf8");

content = content.replace("DollarSign", "DollarSign, XCircle");

const borrowBooksFlowReplacement = `
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

  const handleAddCopy = (copy) => {
    if (selectedCopies.length >= 5) {
      toast.warning("Chỉ được mượn tối đa 5 cuốn mỗi lượt.");
      return;
    }
    if (selectedCopies.find(c => c.copyId === copy.copyId)) return;
    setSelectedCopies([...selectedCopies, { ...copy, bookName: selectedBook.bookName }]);
  };

  const handleRemoveCopy = (copyId) => {
    setSelectedCopies(selectedCopies.filter(c => c.copyId !== copyId));
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
                          // use onMouseDown instead of onClick to fire before onBlur
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
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      selectedBook?.bookId === b.bookId ? "bg-sky-50 border-sky-200 ring-1 ring-sky-500/30" : "bg-white border-slate-100 hover:border-sky-200"
                    }`}
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

            {/* Copies Selection & Cart */}
            <div className="flex flex-col min-h-0 h-full">
              {/* Available Copies */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-700 mb-3">
                  {selectedBook ? `Bản sao rảnh của "${selectedBook.bookName}"` : "Chọn 1 tựa sách bên trái"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBook ? (
                    selectedBook.copies?.filter(c => c.status === "AVAILABLE").length > 0 ? (
                      selectedBook.copies.filter(c => c.status === "AVAILABLE").map(copy => (
                        <button
                          key={copy.copyId}
                          onClick={() => handleAddCopy(copy)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border hover:border-emerald-200 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" /> {copy.copyId}
                        </button>
                      ))
                    ) : (
                      <div className="text-sm text-rose-500 italic">Không còn bản sao rảnh.</div>
                    )
                  ) : null}
                </div>
              </div>

              {/* Cart */}
              <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col min-h-0">
                <h4 className="text-sm font-bold text-slate-700 mb-3 border-b border-slate-200 pb-2">Đã chọn ({selectedCopies.length}/5)</h4>
                {selectedCopies.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-50">
                    <BookUp className="h-12 w-12 mb-2" />
                    <p className="text-sm">Chưa có bản sao nào.</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {selectedCopies.map(c => (
                      <div key={c.copyId} className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <div>
                          <div className="text-xs font-bold font-mono text-sky-700 mb-0.5">{c.copyId}</div>
                          <div className="text-sm font-medium text-slate-800 line-clamp-1">{c.bookName}</div>
                        </div>
                        <button 
                          onClick={() => handleRemoveCopy(c.copyId)}
                          className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md transition"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
`;

const regex = /\/\/ ==========================================\s*\/\/ VIEW 2: NEW BORROWING\s*\/\/ ==========================================\s*const BorrowBooksFlow =.*?\}\s*;\s*\n(?=\s*\/\/ ==========================================\s*\/\/ VIEW 3: RETURN BOOKS)/s;

content = content.replace(regex, borrowBooksFlowReplacement + "\n");

fs.writeFileSync("frontend/src/components/employee/EmployeeBorrowReturnView.jsx", content, "utf8");
console.log("Done patching");

