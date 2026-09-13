import { Bell, Check, Search, Trash2 } from "lucide-react";
import { useState } from "react";

const AdminHeader = ({ searchKeyword, setSearchKeyword }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: "an-1",
      title: "Cảnh báo tải kệ sách",
      content: "Kệ FL1-EW-MATH01 đạt 99% sức chứa. Cần luân chuyển bớt sách.",
      time: "5 phút trước",
      isUnread: true,
    },
    {
      id: "an-2",
      title: "Điều chỉnh quy định",
      content:
        "TS. Eleanor Vance vừa cập nhật chính sách mượn trả cho Giảng viên.",
      time: "1 giờ trước",
      isUnread: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <header className="sticky top-0 z-20 h-16 w-full bg-sky-950 border-b border-sky-900/60 text-white px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Global Search Bar */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-300/70 pointer-events-none" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm kiếm nhân viên, quy định mượn, thể loại ..."
            className="w-full pl-10 pr-4 py-2 bg-sky-900/50 border border-sky-800/80 rounded-xl text-xs text-white placeholder-sky-300/60 outline-none transition focus:border-sky-400 focus:bg-sky-900/90 focus:ring-2 focus:ring-sky-500/20"
          />
        </div>
      </div>

      {/* Right Actions: System status, Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
            }}
            className="relative p-2 rounded-xl text-sky-200 hover:bg-sky-900 hover:text-white transition-colors"
            title="Thông báo quản trị"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white text-slate-900 p-4 shadow-2xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Thông báo Quản trị
                  </h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-rose-700">
                      {unreadCount} mới
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Đã đọc</span>
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3 max-h-72 overflow-y-auto space-y-2.5 pr-1">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`rounded-xl p-3 text-xs border ${
                        n.isUnread
                          ? "bg-sky-50/80 border-sky-200"
                          : "bg-slate-50 border-slate-100 text-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        {n.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-400 space-y-2">
                    <Bell className="mx-auto h-8 w-8 text-slate-300 stroke-1" />
                    <p className="text-xs font-medium">
                      Không có thông báo mới
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
