import { Bell, Check, LibraryBig, Trash2 } from "lucide-react";
import { useState } from "react";
import Signout from "../auth/Signout";

const ReaderHeader = ({ activeTab = "explore", onTabChange, readerInfo }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  // Notification items state
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      title: "Gia hạn thành công",
      content:
        'Bạn đã gia hạn sách "Deep Learning with Python" thành công. Hạn trả mới: 09/12/2024.',
      time: "1 giờ trước",
      isUnread: true,
    },
    {
      id: "n2",
      title: "Đặt trước thành công",
      content:
        'Bạn đã đăng ký hàng chờ cho sách "Machine Learning Yearning" (Vị trí #1).',
      time: "2 giờ trước",
      isUnread: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const navItems = [
    { id: "explore", label: "Tra cứu & Khám phá" },
    { id: "borrows", label: "Sách đang mượn" },
    { id: "reservations", label: "Đặt trước sách" },
    { id: "history", label: "Lịch sử mượn/trả sách" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-sky-950 text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <LibraryBig className="h-6 w-6 text-sky-400" />
            <h1 className="text-base font-extrabold tracking-wide sm:text-lg text-white">
              PPNNT Library
            </h1>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-1 ml-20">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange?.(item.id)}
                  className={`relative px-3.5 py-2 text-sm font-semibold transition-all duration-150 rounded-lg ${
                    isActive
                      ? "bg-sky-900 text-white shadow-xs"
                      : "text-sky-200 hover:text-white hover:bg-sky-900/60"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-sky-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Notifications & User Profile */}
        <div className="flex items-center gap-4">
          {/* Notification Button & Popup Box */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotificationMenu(!showNotificationMenu);
                setShowProfileMenu(false);
              }}
              className="relative rounded-full p-2 text-sky-200 hover:bg-sky-900 hover:text-white transition-colors"
              title="Thông báo"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              )}
            </button>

            {/* Notification Dropdown Box */}
            {showNotificationMenu && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white text-slate-900 p-4 shadow-2xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Notification Box Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Thông báo
                    </h3>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-extrabold text-red-700">
                        {unreadCount} mới
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1"
                        title="Đánh dấu đã đọc"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Đã đọc</span>
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Xóa tất cả"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Notification List Body */}
                <div className="mt-3 max-h-72 overflow-y-auto space-y-2.5 pr-1">
                  {notifications.length > 0 ? (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-xl p-3 text-xs transition-colors border ${
                          item.isUnread
                            ? "bg-sky-50/70 border-sky-100"
                            : "bg-slate-50 border-slate-100 opacity-80"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          {item.content}
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

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotificationMenu(false);
              }}
              className="flex items-center gap-3 rounded-full p-1 hover:bg-sky-900 transition-colors focus:outline-none"
            >
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white leading-tight">
                  {readerInfo?.name || "Lê Hoàng Nam"}
                </div>
                <div className="text-[11px] font-medium text-sky-200">
                  {readerInfo?.roleTitle || "Độc giả SV-2024"}
                </div>
              </div>
              <img
                src={
                  readerInfo?.avatarUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                }
                alt="Avatar"
                className="h-9 w-9 rounded-full object-cover border-2 border-sky-400/50 shadow-xs"
              />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white text-slate-900 p-2 shadow-2xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 sm:hidden">
                  <div className="text-sm font-bold text-slate-900">
                    {readerInfo?.name || "Lê Hoàng Nam"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {readerInfo?.roleTitle || "Độc giả SV-2024"}
                  </div>
                </div>
                <div className="px-3 py-2 text-xs text-slate-500 font-medium border-b border-slate-100">
                  Mã thẻ:{" "}
                  <span className="font-bold text-slate-700">
                    {readerInfo?.cardNumber || "VN-EDU-2024-8849"}
                  </span>
                </div>
                <div className="py-1">
                  <Signout />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ReaderHeader;
