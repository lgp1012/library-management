import { useState, useEffect, useMemo } from "react";
import { Search, Receipt, AlertCircle, CheckCircle2, ChevronRight, Download, DollarSign } from "lucide-react";
import employeeService from "../../services/employeeService";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export default function EmployeeFinesView() {
  const [fines, setFines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, unpaid, paid
  const [selectedFine, setSelectedFine] = useState(null); // For modal

  const fetchFines = async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.getAllFines();
      setFines(data.result || []);
    } catch (err) {
      toast.error("Không thể tải dữ liệu tiền phạt.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  const { filteredFines, metrics } = useMemo(() => {
    let unpaidTotal = 0;
    let paidTotal = 0;
    let unpaidCount = 0;
    let paidCount = 0;

    fines.forEach(f => {
      if (f.paidStatus) {
        paidTotal += f.finePrice;
        paidCount++;
      } else {
        unpaidTotal += f.finePrice;
        unpaidCount++;
      }
    });

    const filtered = fines.filter((f) => {
      if (activeTab === "unpaid" && f.paidStatus) return false;
      if (activeTab === "paid" && !f.paidStatus) return false;

      const q = searchQuery.toLowerCase();
      if (!q) return true;
      return (
        f.fineId?.toLowerCase().includes(q) ||
        f.readerName?.toLowerCase().includes(q) ||
        f.readerId?.toLowerCase().includes(q) ||
        f.borrowingId?.toLowerCase().includes(q)
      );
    });

    return {
      filteredFines: filtered,
      metrics: { unpaidTotal, paidTotal, unpaidCount, paidCount, totalFines: fines.length }
    };
  }, [fines, searchQuery, activeTab]);

  const handleCollectFine = async (fineId) => {
    if (!window.confirm("Xác nhận đã thu tiền phạt cho biên lai này?")) return;
    try {
      await employeeService.collectFine(fineId);
      toast.success("Đã ghi nhận thu tiền phạt thành công!");
      if (selectedFine && selectedFine.fineId === fineId) {
        setSelectedFine(prev => ({ ...prev, paidStatus: true, paidDate: dayjs().format("YYYY-MM-DD") }));
      }
      fetchFines();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi thu tiền phạt.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div>
        <h2 className="text-xl font-bold text-sky-950 mb-1">Xử lý Vi phạm & Phạt</h2>
        <p className="text-sm text-slate-500">Quản lý các khoản phạt trễ hạn, hư hỏng, làm mất sách</p>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="text-sm font-semibold text-slate-500 mb-2">Tổng tiền phạt phát sinh</div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {(metrics.unpaidTotal + metrics.paidTotal).toLocaleString("vi-VN")} đ
          </div>
          <div className="text-sm text-slate-500">Tất cả {metrics.totalFines} biên lai vi phạm</div>
        </div>
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl shadow-sm">
          <div className="text-sm font-semibold text-rose-600 mb-2">Chưa thanh toán (Dư nợ)</div>
          <div className="text-3xl font-black text-rose-700 mb-1">
            {metrics.unpaidTotal.toLocaleString("vi-VN")} đ
          </div>
          <div className="text-sm text-rose-600/80">{metrics.unpaidCount} phiếu cần thu tiền</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl shadow-sm">
          <div className="text-sm font-semibold text-emerald-600 mb-2">Đã thu ngân quỹ</div>
          <div className="text-3xl font-black text-emerald-700 mb-1">
            {metrics.paidTotal.toLocaleString("vi-VN")} đ
          </div>
          <div className="text-sm text-emerald-600/80">{metrics.paidCount} phiếu đã hoàn tất</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === "all" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Tất cả ({metrics.totalFines})
            </button>
            <button
              onClick={() => setActiveTab("unpaid")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === "unpaid" ? "bg-white text-rose-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Chưa thanh toán ({metrics.unpaidCount})
            </button>
            <button
              onClick={() => setActiveTab("paid")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === "paid" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Đã thu ({metrics.paidCount})
            </button>
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm biên lai, độc giả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider">Mã biên lai</th>
                <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider">Độc giả vi phạm</th>
                <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider">Lý do & Chi tiết</th>
                <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider text-right">Số tiền phạt</th>
                <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider text-center">Trạng thái</th>
                <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-400">Đang tải...</td></tr>
              ) : filteredFines.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-400">Không tìm thấy biên lai nào.</td></tr>
              ) : (
                filteredFines.map((f) => (
                  <tr 
                    key={f.fineId} 
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                    onClick={() => setSelectedFine(f)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-slate-800">{f.fineId}</div>
                      <div className="text-xs text-slate-400 mt-0.5 font-mono">Phiếu: {f.borrowingId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-sky-700">{f.readerName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{f.readerId}</div>
                    </td>
                    <td className="px-6 py-4 font-medium max-w-xs truncate" title={f.reason}>
                      {f.reason}
                    </td>
                    <td className="px-6 py-4 font-bold text-right text-rose-600">
                      {f.finePrice.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="px-6 py-4 text-center">
                      {f.paidStatus ? (
                        <span className="inline-flex px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">Đã thu</span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-full">Chưa thanh toán</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1.5"
                        onClick={(e) => { e.stopPropagation(); setSelectedFine(f); }}
                      >
                        <Receipt className="h-3.5 w-3.5" /> Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fine Detail Modal */}
      {selectedFine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-sky-600" /> Biên lai phạt: {selectedFine.fineId}
                </h3>
                <p className="text-sm text-slate-500 mt-1">Hệ thống ghi nhận vi phạm</p>
              </div>
              {selectedFine.paidStatus ? (
                <div className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Đã thu tiền
                </div>
              ) : (
                <div className="px-3 py-1 bg-rose-100 text-rose-700 font-bold text-xs rounded-full flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> Dư nợ
                </div>
              )}
            </div>
            
            <div className="p-6 space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 mb-1">Độc giả</div>
                <div className="font-bold text-slate-900 text-lg">{selectedFine.readerName}</div>
                <div className="text-sm text-slate-500">Mã độc giả: {selectedFine.readerId}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Mã phiếu mượn</div>
                  <div className="font-mono font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block">{selectedFine.borrowingId}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Mã chi tiết (Detail)</div>
                  <div className="font-mono font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block">{selectedFine.detailId}</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Lý do vi phạm</div>
                <div className="font-medium text-slate-800 bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                  {selectedFine.reason}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Tổng tiền phạt</div>
                  <div className="text-3xl font-black text-rose-600">
                    {selectedFine.finePrice.toLocaleString("vi-VN")} <span className="text-lg">đ</span>
                  </div>
                </div>
                {selectedFine.paidStatus && selectedFine.paidDate && (
                  <div className="text-right">
                    <div className="text-xs text-slate-500 mb-1">Ngày thu tiền</div>
                    <div className="font-semibold text-slate-700">{selectedFine.paidDate}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedFine(null)}
                className="px-4 py-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 font-semibold rounded-xl text-sm transition"
              >
                Đóng
              </button>
              {!selectedFine.paidStatus && (
                <button 
                  onClick={() => handleCollectFine(selectedFine.fineId)}
                  className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-sm transition shadow-md shadow-sky-600/20 flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4" /> Xác nhận thu tiền
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
