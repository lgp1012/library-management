import { Bell, Check, Search, Trash2 } from "lucide-react";
import { useState } from "react";

const EmployeeHeader = ({ searchKeyword, setSearchKeyword }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: "en-1",
      title: "Yêu cầu mượn sách mới",
      content: "Độc giả RD-0012 vừa tạo yêu cầu mượn sách 'Lập trình ReactJS'.",
      time: "2 phút trước",
      isUnread: true,
    },
    {
      id: "en-2",
      title: "Sách trễ hạn",
      content: "Có 5 bản sao sách vừa quá hạn trả hôm nay.",
      time: "30 phút trước",
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
            placeholder="Tìm kiếm sách, độc giả, phiếu mượn ..."
            className="w-full pl-10 pr-4 py-2 bg-sky-900/50 border border-sky-800/80 rounded-xl text-xs text-white placeholder-sky-300/60 outline-none transition focus:border-sky-400 focus:bg-sky-900/90 focus:ring-2 focus:ring-sky-500/20"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 flex-1">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-sky-300 hover:text-white hover:bg-sky-900/80 transition-all border border-transparent hover:border-sky-800/80"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-sky-950" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-sky-950 border border-sky-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 origin-top-right z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-sky-900">
                <div>
                  <h4 className="text-sm font-bold text-white">Thông báo</h4>
                  <p className="text-[10px] text-sky-300">
                    Bạn có {unreadCount} thông báo chưa đọc
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={markAllRead}
                    title="Đánh dấu tất cả đã đọc"
                    className="p-1.5 text-sky-400 hover:text-white hover:bg-sky-900 rounded-lg transition"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={clearNotifications}
                    title="Xóa tất cả"
                    className="p-1.5 text-sky-400 hover:text-white hover:bg-sky-900 rounded-lg transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-sky-900">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-sky-900/50">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 hover:bg-sky-900/30 transition-colors ${
                          notif.isUnread ? "bg-sky-900/10" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          {notif.isUnread && (
                            <div className="mt-1.5 h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                          )}
                          <div>
                            <h5
                              className={`text-xs ${
                                notif.isUnread
                                  ? "font-bold text-sky-100"
                                  : "font-semibold text-sky-200"
                              }`}
                            >
                              {notif.title}
                            </h5>
                            <p className="text-[11px] text-sky-300 mt-0.5 leading-relaxed">
                              {notif.content}
                            </p>
                            <span className="text-[10px] text-sky-500 font-medium mt-1.5 block">
                              {notif.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-sky-400 flex flex-col items-center">
                    <Bell className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-xs">Không có thông báo nào</p>
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

export default EmployeeHeader;
