import { useState, useEffect } from "react";
import { 
  Clock, 
  CheckCircle2, 
  Search, 
  AlertCircle,
  Inbox,
  CalendarDays,
  User,
  BookOpen,
  X
} from "lucide-react";
import employeeService from "../../services/employeeService";
import { toast } from "react-toastify";

export default function EmployeeReservationsView() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [expiring, setExpiring] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.getPendingReservations();
      if (data.result) {
        setReservations(data.result);
      }
    } catch (err) {
      toast.error("Không thể tải danh sách đặt trước.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleProcess = async (id) => {
    const daysStr = window.prompt("Nhập số ngày giữ sách (Hạn chót đến lấy sách, nếu sách chưa có sẵn thì cứ để mặc định 7 ngày):", "7");
    if (daysStr === null) return;
    
    const expiryDays = parseInt(daysStr, 10);
    if (isNaN(expiryDays) || expiryDays < 1) {
      toast.error("Số ngày không hợp lệ.");
      return;
    }

    setProcessingId(id);
    try {
      await employeeService.processReservation(id, { expiryDays });
      toast.success("Đã duyệt phiếu đặt trước thành công!");
      setSelectedReservation(null);
      fetchReservations();
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(msg || "Lỗi khi xử lý đặt trước.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleExpire = async () => {
    if (!window.confirm("Hệ thống sẽ tự động hủy các yêu cầu đặt trước đã quá hạn (hoặc chưa đến lấy sách). Bạn có chắc chắn không?")) {
      return;
    }
    setExpiring(true);
    try {
      const res = await employeeService.expireReservations();
      toast.success(`Đã quét và hủy ${res.result} phiếu đặt trước quá hạn.`);
      fetchReservations();
    } catch (err) {
      toast.error("Lỗi khi quét phiếu quá hạn.");
    } finally {
      setExpiring(false);
    }
  };

  const filteredReservations = reservations.filter((r) => {
    if (!searchQuery) return true;
    const lowerQ = searchQuery.toLowerCase();
    return (
      r.reservationId.toLowerCase().includes(lowerQ) ||
      (r.bookName && r.bookName.toLowerCase().includes(lowerQ)) ||
      (r.readerName && r.readerName.toLowerCase().includes(lowerQ)) ||
      (r.bookId && r.bookId.toLowerCase().includes(lowerQ))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Xử lý Đặt trước</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý hàng chờ đặt trước sách của bạn đọc và duyệt gán sách
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExpire}
            disabled={expiring}
            className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 transition rounded-xl text-sm font-bold border border-amber-200"
          >
            <AlertCircle className="h-4 w-4" />
            {expiring ? "Đang quét..." : "Quét phiếu quá hạn"}
          </button>
          <button 
            onClick={fetchReservations}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 transition rounded-xl text-sm font-bold shadow-sm"
          >
            <Clock className="h-4 w-4" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60 flex items-center gap-3">
        <Search className="h-5 w-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Tìm theo mã phiếu, tên sách, tên bạn đọc..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
        />
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400">
            <div className="h-8 w-8 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400">
            <Inbox className="h-12 w-12 mb-3 text-slate-300" />
            <p className="text-base font-semibold text-slate-600">Không có yêu cầu đặt trước nào</p>
            <p className="text-sm text-slate-500 mt-1">Hàng chờ hiện đang trống hoặc không tìm thấy kết quả.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80">
                  <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã Phiếu</th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Bạn Đọc</th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Sách Đặt</th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày Đặt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReservations.map((item) => (
                  <tr 
                    key={item.reservationId} 
                    className="hover:bg-slate-50/50 transition cursor-pointer"
                    onClick={() => setSelectedReservation(item)}
                  >
                    <td className="py-4 px-5">
                      <span className="font-mono text-sm font-bold text-slate-700">{item.reservationId}</span>
                      <div className="mt-1">
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-800">{item.readerName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-start gap-2 max-w-xs">
                        <BookOpen className="h-4 w-4 text-sky-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-slate-800 line-clamp-2">{item.bookName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                        {new Date(item.reservationDate).toLocaleDateString("vi-VN")}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Chi tiết đặt trước</h2>
              <button onClick={() => setSelectedReservation(null)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 flex-1 overflow-y-auto">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Mã phiếu</span>
                  <span className="font-mono text-sm font-bold text-slate-800">{selectedReservation.reservationId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Ngày tạo</span>
                  <span className="text-sm font-semibold text-slate-700">{new Date(selectedReservation.reservationDate).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Trạng thái</span>
                  <span className="text-sm font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{selectedReservation.status}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Thông tin độc giả</h3>
                <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                  <div className="h-10 w-10 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{selectedReservation.readerName}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">ID: {selectedReservation.readerId}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Thông tin sách</h3>
                <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-start gap-3">
                  <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-snug">{selectedReservation.bookName}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-1">ID: {selectedReservation.bookId}</p>
                  </div>
                </div>
              </div>

              {selectedReservation.estimatedAvailableDate && (
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <Clock className="h-6 w-6 text-sky-500 mb-2" />
                  <p className="text-xs font-bold text-sky-800 uppercase tracking-wider">Thời gian dự kiến có sách</p>
                  <p className="text-sm font-medium text-sky-700 mt-1">{new Date(selectedReservation.estimatedAvailableDate).toLocaleDateString("vi-VN")}</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedReservation(null)}
                className="px-4 py-2 bg-white text-slate-600 hover:bg-slate-100 transition rounded-xl text-sm font-bold border border-slate-200"
              >
                Đóng
              </button>
              <button 
                onClick={() => handleProcess(selectedReservation.reservationId)}
                disabled={processingId === selectedReservation.reservationId}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-teal-600 text-white hover:bg-teal-700 transition rounded-xl text-sm font-bold disabled:opacity-50 shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4" />
                {processingId === selectedReservation.reservationId ? "Đang xử lý..." : "Duyệt cấp sách"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
