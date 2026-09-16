import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import {
  AlertCircle,
  ArrowLeft,
  BookMarked,
  Calendar,
  CheckCircle2,
  DollarSign,
  Plus,
  RefreshCcw,
  Search,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import employeeService from "../../services/employeeService";

dayjs.extend(isSameOrBefore);

import ReaderEditModal from "./ReaderEditModal";

export default function EmployeeReadersView() {
  const [readers, setReaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReader, setSelectedReader] = useState(null);
  const [editingReader, setEditingReader] = useState(null);

  const fetchReaders = async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.listReaders();
      setReaders(data.result || []);
    } catch (err) {
      toast.error("Không thể tải danh sách thẻ độc giả.");
      console.error("Failed to fetch readers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReaders();
  }, []);

  const filteredReaders = useMemo(() => {
    return readers.filter((r) => {
      const q = searchQuery.toLowerCase();
      return (
        r.readerName?.toLowerCase().includes(q) ||
        r.readerId?.toLowerCase().includes(q) ||
        r.phoneNumber?.includes(q)
      );
    });
  }, [readers, searchQuery]);

  if (selectedReader) {
    return (
      <ReaderDetailPanel
        reader={selectedReader}
        onBack={() => {
          setSelectedReader(null);
          fetchReaders();
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-sky-950 mb-1">
            Quản lý Thẻ Độc giả
          </h2>
          <p className="text-sm text-slate-500">
            Kiểm tra thời hạn thẻ, số lượng sách đang mượn và nợ phạt
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm độc giả theo họ tên, mã RD, hoặc số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider">
                  Mã độc giả
                </th>
                <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider">
                  Họ và tên
                </th>
                <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider">
                  Số điện thoại / Email
                </th>
                <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider text-center">
                  Hạn thẻ
                </th>
                <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider text-center">
                  Đang mượn
                </th>
                <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider text-center">
                  Trạng thái
                </th>
                <th className="px-6 py-4 font-semibold uppercase text-[11px] tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredReaders.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    Không tìm thấy độc giả nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredReaders.map((reader) => {
                  const isExpired = dayjs(
                    reader.membershipExpiry,
                  ).isSameOrBefore(dayjs(), "day");
                  return (
                    <tr
                      key={reader.readerId}
                      className="hover:bg-slate-50/50 transition cursor-pointer"
                      onClick={() => setSelectedReader(reader)}
                    >
                      <td className="px-6 py-4 font-mono font-bold text-sky-700">
                        {reader.readerId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">
                          {reader.readerName}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          User ID: {reader.userId}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">
                          {reader.phoneNumber || "N/A"}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {reader.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`font-medium ${
                            isExpired ? "text-rose-600" : "text-slate-600"
                          }`}
                        >
                          {reader.membershipExpiry}
                          {isExpired && (
                            <span className="ml-1 text-xs">(Hết hạn)</span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center justify-center px-2 py-1 bg-slate-100 rounded-lg font-bold text-slate-700 text-xs">
                          {reader.currentlyBorrowedBooks || 0} / 5
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            reader.active
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {reader.active ? "Hoạt động" : "Đang khóa"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingReader(reader);
                            }}
                            className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-semibold transition border border-sky-200/50"
                          >
                            Cập nhật thông tin
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editingReader && (
        <ReaderEditModal
          reader={editingReader}
          onClose={() => setEditingReader(null)}
          onRefresh={fetchReaders}
        />
      )}
    </div>
  );
}

// ==========================================
// Sub-component: Detail Panel
// ==========================================
const ReaderDetailPanel = ({ reader: initialReader, onBack }) => {
  const [reader, setReader] = useState(initialReader);
  const [activeTab, setActiveTab] = useState("borrowed"); // borrowed, history, fines
  const [borrowings, setBorrowings] = useState([]);
  const [fines, setFines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Lập biên bản phạt
  const [showFineModal, setShowFineModal] = useState(false);
  const [fineDetailId, setFineDetailId] = useState("");
  const [finePrice, setFinePrice] = useState(150000);
  const [fineReason, setFineReason] = useState("");
  const [reviewBeforeSave, setReviewBeforeSave] = useState(false);
  const [creatingFine, setCreatingFine] = useState(false);

  const fetchData = async (fast = false) => {
    setIsLoading(true);
    try {
      const [borRes, finesRes] = await Promise.all([
        employeeService.getReaderBorrowings(reader.readerId),
        employeeService.getFines(reader.readerId, fast),
      ]);
      setBorrowings(borRes.result || []);
      setFines(finesRes.result || []);
    } catch (error) {
      console.error("Failed to load reader details:", error);
      toast.error("Không thể tải thông tin chi tiết.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCollectFine = async (fineId) => {
    if (!window.confirm("Xác nhận đã thu tiền phạt cho biên lai này?")) return;
    try {
      await employeeService.collectFine(fineId);
      toast.success("Đã ghi nhận thu tiền phạt.");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi thu tiền phạt.");
    }
  };

  const handleOpenFineModal = () => {
    setFineDetailId(currentBorrowings[0]?.detailId || "");
    setFinePrice(150000);
    setFineReason("");
    setReviewBeforeSave(false);
    setShowFineModal(true);
  };

  const handleCreateFine = async () => {
    if (!fineDetailId) {
      toast.error("Chọn phiếu mượn liên quan để lập biên bản.");
      return;
    }
    setCreatingFine(true);
    try {
      const res = await employeeService.createFine(
        { detailId: fineDetailId, finePrice, reason: fineReason || "Vi phạm quy định mượn trả" },
        reviewBeforeSave ? 6000 : 0,
        reviewBeforeSave,
      );
      toast.info(res.result?.message || `Đã lập biên bản phạt ${res.result?.fineId}.`);
      setShowFineModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi lập biên bản phạt.");
    } finally {
      setCreatingFine(false);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm("Bạn có chắc muốn khóa thẻ này?")) return;
    setIsProcessing(true);
    try {
      await employeeService.deactivateReader(reader.readerId);
      toast.success("Đã khóa thẻ thành công.");
      setReader((prev) => ({ ...prev, active: false }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khóa thẻ");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExtend = async () => {
    setIsProcessing(true);
    try {
      const newExpiry = dayjs(reader.membershipExpiry)
        .add(1, "year")
        .format("YYYY-MM-DD");
      await employeeService.updateReader(reader.readerId, {
        membershipExpiry: newExpiry,
        active: true,
      });
      toast.success("Đã gia hạn thêm 1 năm!");
      setReader((prev) => ({
        ...prev,
        membershipExpiry: newExpiry,
        active: true,
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi gia hạn thẻ");
    } finally {
      setIsProcessing(false);
    }
  };

  const isExpired = dayjs(reader.membershipExpiry).isSameOrBefore(
    dayjs(),
    "day",
  );
  const daysDiff = dayjs(reader.membershipExpiry).diff(dayjs(), "day");

  const currentBorrowings = borrowings.filter((b) => !b.actualReturnDate);
  const historyBorrowings = borrowings.filter((b) => b.actualReturnDate);
  const unpaidFinesTotal = fines
    .filter((f) => !f.paidStatus)
    .reduce((sum, f) => sum + f.finePrice, 0);

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 max-w-5xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-sky-700 transition font-medium mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Quay lại danh sách</span>
      </button>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center text-2xl font-black shadow-inner">
              {reader.readerName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-slate-900">
                  {reader.readerName}
                </h2>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-md font-mono">
                  {reader.readerId}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    reader.active
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {reader.active ? "Hoạt động" : "Đã khóa"}
                </span>
              </div>
              <div className="text-sm text-slate-500">
                User ID: {reader.userId} • Hạng thẻ: Độc giả Tiêu chuẩn
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {reader.active && (
              <button
                onClick={handleDeactivate}
                disabled={isProcessing}
                className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-sm font-semibold transition flex items-center gap-2"
              >
                <ShieldAlert className="h-4 w-4" /> Khóa thẻ
              </button>
            )}
            <button
              onClick={handleExtend}
              disabled={isProcessing}
              className="px-4 py-2 bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 rounded-xl text-sm font-semibold transition flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" /> Gia hạn (+1 năm)
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="p-6 md:p-8 border-b border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-slate-500">
                  Số sách đang mượn
                </span>
                <BookMarked className="h-5 w-5 text-sky-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-3">
                {currentBorrowings.length}{" "}
                <span className="text-sm font-normal text-slate-500">
                  / 5 cuốn tối đa
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all"
                  style={{ width: `${(currentBorrowings.length / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-slate-500">
                  Hạn thẻ độc giả
                </span>
                <Calendar className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {reader.membershipExpiry}
              </div>
              <div
                className={`text-sm font-semibold flex items-center gap-1 ${
                  isExpired ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {isExpired ? (
                  <>
                    <AlertCircle className="h-4 w-4" /> Đã quá hạn{" "}
                    {Math.abs(daysDiff)} ngày
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Còn {daysDiff} ngày
                    hiệu lực
                  </>
                )}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-slate-500">
                  Tiền phạt chưa thanh toán
                </span>
                <DollarSign className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {unpaidFinesTotal.toLocaleString("vi-VN")} đ
              </div>
              <div
                className={`text-sm font-semibold flex items-center gap-1 ${
                  unpaidFinesTotal > 0 ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {unpaidFinesTotal > 0 ? (
                  <>
                    <AlertCircle className="h-4 w-4" /> Yêu cầu thanh toán
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Không có nợ phạt
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details & Tabs */}
        <div className="p-6 md:p-8">
          <div className="flex gap-8 border-b border-slate-200 mb-6">
            <button
              onClick={() => setActiveTab("borrowed")}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === "borrowed"
                  ? "border-sky-500 text-sky-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Sách đang mượn ({currentBorrowings.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === "history"
                  ? "border-sky-500 text-sky-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Lịch sử đã trả ({historyBorrowings.length})
            </button>
            <button
              onClick={() => setActiveTab("fines")}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === "fines"
                  ? "border-sky-500 text-sky-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Biên lai phạt ({fines.length})
            </button>
          </div>

          <div className="min-h-[300px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-40 text-slate-400">
                Đang tải...
              </div>
            ) : (
              <>
                {/* SÁCH ĐANG MƯỢN */}
                {activeTab === "borrowed" && (
                  <div className="space-y-4">
                    {currentBorrowings.length === 0 ? (
                      <p className="text-center text-slate-400 py-10">
                        Độc giả không có sách đang mượn.
                      </p>
                    ) : (
                      currentBorrowings.map((b) => {
                        const isOverdue = dayjs().isAfter(
                          dayjs(b.expectedReturnDate),
                          "day",
                        );
                        const overdueDays = isOverdue
                          ? dayjs().diff(dayjs(b.expectedReturnDate), "day")
                          : 0;
                        return (
                          <div
                            key={b.detailId}
                            className={`p-5 rounded-2xl border ${
                              isOverdue
                                ? "border-rose-200 bg-rose-50/30"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="px-2 py-0.5 bg-sky-100 text-sky-700 font-bold font-mono text-[10px] rounded-md">
                                    {b.copyId}
                                  </span>
                                  <span className="text-xs text-slate-500 font-medium">
                                    Phiếu: {b.borrowingId}
                                  </span>
                                  {isOverdue && (
                                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 font-bold text-[10px] rounded-md flex items-center gap-1">
                                      <AlertCircle className="h-3 w-3" /> Quá
                                      hạn {overdueDays} ngày
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-bold text-lg text-slate-800 mb-1">
                                  {b.bookName}
                                </h4>
                                <div className="text-sm text-slate-600">
                                  Ngày mượn:{" "}
                                  <span className="font-semibold">
                                    {b.borrowingDate || "N/A"}
                                  </span>{" "}
                                  • Hạn trả:{" "}
                                  <span
                                    className={`font-semibold ${isOverdue ? "text-rose-600" : ""}`}
                                  >
                                    {b.expectedReturnDate}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition">
                                  Gia hạn (+14d)
                                </button>
                                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2 shadow-md shadow-emerald-500/20">
                                  <CheckCircle2 className="h-4 w-4" /> Nhận trả
                                  sách
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* LỊCH SỬ ĐÃ TRẢ */}
                {activeTab === "history" && (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Tên sách</th>
                          <th className="px-4 py-3 font-semibold">Ngày mượn</th>
                          <th className="px-4 py-3 font-semibold">
                            Ngày trả thực tế
                          </th>
                          <th className="px-4 py-3 font-semibold">
                            Phiếu mượn
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {historyBorrowings.length === 0 ? (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-4 py-8 text-center text-slate-400"
                            >
                              Chưa có lịch sử trả sách.
                            </td>
                          </tr>
                        ) : (
                          historyBorrowings.map((b) => (
                            <tr
                              key={b.detailId}
                              className="hover:bg-slate-50/50"
                            >
                              <td className="px-4 py-3 font-bold text-slate-700">
                                {b.bookName}
                              </td>
                              <td className="px-4 py-3">
                                {b.borrowingDate || "N/A"}
                              </td>
                              <td className="px-4 py-3 font-medium text-emerald-600">
                                {b.actualReturnDate}
                              </td>
                              <td className="px-4 py-3 font-mono text-xs">
                                {b.borrowingId}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* BIÊN LAI PHẠT */}
                {activeTab === "fines" && (
                  <div className="space-y-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => fetchData(true)}
                        title="Làm mới nhanh (ưu tiên tốc độ, không chờ giao dịch khác)"
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
                      >
                        <Zap className="h-3.5 w-3.5" /> Làm mới nhanh
                      </button>
                      <button
                        onClick={handleOpenFineModal}
                        disabled={currentBorrowings.length === 0}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Plus className="h-3.5 w-3.5" /> Lập biên bản phạt
                      </button>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3 font-semibold">
                              Mã biên lai
                            </th>
                            <th className="px-4 py-3 font-semibold">Lý do</th>
                            <th className="px-4 py-3 font-semibold">Số tiền</th>
                            <th className="px-4 py-3 font-semibold">
                              Trạng thái
                            </th>
                            <th className="px-4 py-3 font-semibold text-right">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {fines.length === 0 ? (
                            <tr>
                              <td
                                colSpan="5"
                                className="px-4 py-8 text-center text-slate-400"
                              >
                                Không có biên lai phạt nào.
                              </td>
                            </tr>
                          ) : (
                            fines.map((f) => (
                              <tr key={f.fineId} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-mono font-bold text-slate-700">
                                  {f.fineId}
                                </td>
                                <td className="px-4 py-3">{f.reason}</td>
                                <td className="px-4 py-3 font-bold text-rose-600">
                                  {f.finePrice.toLocaleString("vi-VN")} đ
                                </td>
                                <td className="px-4 py-3">
                                  {f.paidStatus ? (
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">
                                      Đã thanh toán
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full">
                                      Chưa thanh toán
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  {!f.paidStatus && (
                                    <button
                                      onClick={() => handleCollectFine(f.fineId)}
                                      className="px-3 py-1.5 bg-sky-600 text-white text-xs font-semibold rounded-lg hover:bg-sky-700 transition"
                                    >
                                      Thu tiền
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showFineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Lập biên bản phạt cho {reader.readerName}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Phiếu mượn liên quan
                </label>
                <select
                  value={fineDetailId}
                  onChange={(e) => setFineDetailId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500"
                >
                  {currentBorrowings.map((b) => (
                    <option key={b.detailId} value={b.detailId}>
                      {b.bookName} — {b.copyId}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Số tiền phạt (đ)
                </label>
                <input
                  type="number"
                  value={finePrice}
                  onChange={(e) => setFinePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Lý do
                </label>
                <input
                  type="text"
                  value={fineReason}
                  onChange={(e) => setFineReason(e.target.value)}
                  placeholder="VD: Trả sách hư, quá hạn..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500"
                />
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reviewBeforeSave}
                  onChange={(e) => setReviewBeforeSave(e.target.checked)}
                  className="accent-sky-600"
                />
                Giữ lại để rà soát trước khi lưu chính thức
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowFineModal(false)}
                className="px-4 py-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 font-semibold rounded-xl text-sm transition"
              >
                Huỷ
              </button>
              <button
                onClick={handleCreateFine}
                disabled={creatingFine}
                className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-sm transition disabled:opacity-50"
              >
                {creatingFine ? "Đang xử lý..." : "Lập biên bản"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
