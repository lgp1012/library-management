import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Edit3,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useReader from "../../hooks/useReader";
import readerService from "../../services/readerService";

export default function ReaderProfileView() {
  const { profile, refetch } = useReader();
  const [activeTab, setActiveTab] = useState("borrowed"); // borrowed, returned, fines, unpaid

  const [borrowings, setBorrowings] = useState([]);
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    readerName: "",
    phoneNumber: "",
    email: "", // read-only usually, but just in case
  });

  useEffect(() => {
    if (profile) {
      setEditForm({
        readerName: profile.name || "",
        phoneNumber: profile.phone || "", // Assuming we add phone
        email: profile.email || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const [borrowsData, finesData] = await Promise.all([
          readerService.getMyBorrowings(),
          readerService.getMyFines(),
        ]);

        if (borrowsData.result) setBorrowings(borrowsData.result);
        if (finesData.result) setFines(finesData.result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const currentlyBorrowed = borrowings.filter((b) => !b.actualReturnDate);
  const returnedHistory = borrowings.filter((b) => b.actualReturnDate);
  const paidFines = fines.filter((f) => f.paidStatus);
  const unpaidFines = fines.filter((f) => !f.paidStatus);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await readerService.updateProfile({
        readerName: editForm.readerName,
        phoneNumber: editForm.phoneNumber,
        email: editForm.email,
      });
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      refetch(); // refresh context
    } catch (error) {
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
      console.error(error);
    }
  };

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Thông tin cá nhân & Lịch sử
        </h2>
        <p className="mt-1 text-xs text-slate-500 max-w-2xl">
          Quản lý thông tin tài khoản, theo dõi lịch sử mượn trả và các khoản
          phí phạt.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Profile Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden">
            {/* Background design */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-sky-900 to-indigo-900" />

            <div className="relative pt-12 flex flex-col items-center">
              <img
                src={
                  profile.avatarUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                }
                alt="Avatar"
                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm mb-4"
              />

              {!isEditing ? (
                <>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {profile.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 mb-4">
                    <span className="rounded-full bg-sky-100 text-sky-800 px-2.5 py-0.5 text-[11px] font-bold border border-sky-200">
                      {profile.cardNumber}
                    </span>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-bold border border-emerald-200">
                      {profile.status}
                    </span>
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" /> Chỉnh sửa thông tin
                  </button>

                  <div className="w-full mt-6 space-y-4">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <Mail className="h-4 w-4" />
                      </div>
                      <span className="truncate">
                        {profile.email || "Chưa cập nhật email"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <Phone className="h-4 w-4" />
                      </div>
                      <span className="truncate">
                        {profile.phone || "Chưa cập nhật số điện thoại"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <span>
                        Hạn thẻ:{" "}
                        <strong className="text-slate-800">
                          {profile.nearestDueDate}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <span>{profile.accountStatus}</span>
                    </div>
                  </div>
                </>
              ) : (
                <form
                  onSubmit={handleUpdateProfile}
                  className="w-full space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.readerName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, readerName: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.phoneNumber}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-700 transition-colors"
                    >
                      Lưu
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-red-700 font-bold mb-1">
              <AlertCircle className="h-5 w-5" />
              Tổng nợ chưa thanh toán
            </div>
            <div className="text-3xl font-black text-red-600 mt-2">
              {profile.unpaidFine}
            </div>
            <p className="text-xs text-red-600/80 mt-1 font-medium">
              Vui lòng thanh toán tại quầy thư viện
            </p>
          </div>
        </div>

        {/* Right: History & Fines */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
            {[
              {
                id: "borrowed",
                label: "Lịch sử mượn",
                count: currentlyBorrowed.length,
                icon: <BookOpen className="h-4 w-4" />,
              },
              {
                id: "returned",
                label: "Lịch sử trả",
                count: returnedHistory.length,
                icon: <CheckCircle className="h-4 w-4" />,
              },
              {
                id: "unpaid",
                label: "Phiếu phạt",
                count: unpaidFines.length,
                icon: <AlertTriangle className="h-4 w-4" />,
                alert: true,
              },
              {
                id: "fines",
                label: "Đã nộp phạt",
                count: paidFines.length,
                icon: <CreditCard className="h-4 w-4" />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? tab.alert
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-slate-900 text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {tab.icon}
                {tab.label}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab.id
                      ? tab.alert
                        ? "bg-red-500 text-white"
                        : "bg-slate-700 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 min-h-[400px]">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-400 py-20">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />
                  <span className="text-sm font-medium">
                    Đang tải dữ liệu...
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {activeTab === "borrowed" &&
                  (currentlyBorrowed.length === 0 ? (
                    <EmptyState msg="Không có sách nào đang mượn." />
                  ) : (
                    currentlyBorrowed.map((b) => (
                      <HistoryItem
                        key={b.detailId}
                        title={b.bookName}
                        code={b.copyId}
                        dateLabel="Ngày mượn"
                        dateVal={b.borrowingDate}
                        dueDateLabel="Hạn trả"
                        dueDateVal={b.expectedReturnDate}
                        statusText="Đang mượn"
                        statusColor="bg-blue-100 text-blue-800"
                      />
                    ))
                  ))}

                {activeTab === "returned" &&
                  (returnedHistory.length === 0 ? (
                    <EmptyState msg="Chưa có lịch sử trả sách." />
                  ) : (
                    returnedHistory.map((b) => (
                      <HistoryItem
                        key={b.detailId}
                        title={b.bookName}
                        code={b.copyId}
                        dateLabel="Ngày mượn"
                        dateVal={b.borrowingDate}
                        dueDateLabel="Ngày trả"
                        dueDateVal={b.actualReturnDate}
                        statusText="Đã trả"
                        statusColor="bg-emerald-100 text-emerald-800"
                      />
                    ))
                  ))}

                {activeTab === "unpaid" &&
                  (unpaidFines.length === 0 ? (
                    <EmptyState msg="Không có phiếu phạt nào chưa thanh toán. Tuyệt vời!" />
                  ) : (
                    unpaidFines.map((f) => <FineItem key={f.fineId} fine={f} />)
                  ))}

                {activeTab === "fines" &&
                  (paidFines.length === 0 ? (
                    <EmptyState msg="Chưa có lịch sử nộp phạt." />
                  ) : (
                    paidFines.map((f) => <FineItem key={f.fineId} fine={f} />)
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryItem({
  title,
  code,
  dateLabel,
  dateVal,
  dueDateLabel,
  dueDateVal,
  statusText,
  statusColor,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors gap-4">
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
            MÃ BẢN SAO: {code}
          </span>
        </div>
      </div>
      <div className="flex flex-col sm:items-end gap-1.5 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span>
            {dateLabel}: <strong className="text-slate-800">{dateVal}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            {dueDateLabel}:{" "}
            <strong className="text-slate-800">{dueDateVal}</strong>
          </span>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${statusColor}`}
        >
          {statusText}
        </span>
      </div>
    </div>
  );
}

function FineItem({ fine }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors gap-4">
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-900">
          {fine.bookName || "Phạt vi phạm"}
        </h4>
        <p className="text-xs text-slate-600">Lý do: {fine.reason}</p>
        <span className="inline-block font-mono text-[10px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded mt-1">
          MÃ PHIẾU: {fine.fineId}
        </span>
      </div>
      <div className="flex flex-col sm:items-end gap-1.5 text-xs text-slate-600">
        <div className="text-lg font-black text-red-600">
          {fine.finePrice.toLocaleString("vi-VN")} đ
        </div>
        {fine.paidStatus ? (
          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
            Đã thanh toán ({fine.paidDate})
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-red-100 text-red-800 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Chưa thanh toán
          </span>
        )}
      </div>
    </div>
  );
}

function EmptyState({ msg }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-3">
      <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center">
        <BookOpen className="h-6 w-6 text-slate-300" />
      </div>
      <p className="text-sm font-medium">{msg}</p>
    </div>
  );
}
