import {
  BookOpen,
  LayoutDashboard,
  Library,
  Users,
  CalendarClock,
  Banknote,
  ArchiveRestore,
} from "lucide-react";
import { useEmployee } from "../../hooks/useEmployee";
import Signout from "../auth/Signout";

const EmployeeSidebar = ({ activeTab, onTabChange }) => {
  const { employeeProfile, books, shelves } = useEmployee();
  
  const menuSections = [
    {
      title: null,
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "QUẢN LÝ TÀI NGUYÊN",
      items: [
        {
          id: "books",
          label: "Đầu Sách & Kho",
          icon: BookOpen,
          badge: books?.length || 0,
          badgeColor: "bg-sky-900/80 text-sky-200 border border-sky-700/50",
        },
        {
          id: "shelves",
          label: "Kiểm Kê Kho",
          icon: ArchiveRestore,
          badge: shelves?.length || 0,
          badgeColor: "bg-sky-900/80 text-sky-200 border border-sky-700/50",
        },
      ],
    },
    {
      title: "NGHIỆP VỤ",
      items: [
        {
          id: "borrow-return",
          label: "Mượn / Trả Sách",
          icon: CalendarClock,
        },
        {
          id: "fines",
          label: "Thu Phí Phạt",
          icon: Banknote,
        },
      ],
    },
    {
      title: "NGƯỜI DÙNG",
      items: [
        {
          id: "readers",
          label: "Hồ Sơ Độc Giả",
          icon: Users,
        },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-sky-950 text-slate-100 flex flex-col h-screen sticky top-0 border-r border-sky-900/60 shadow-xl select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-sky-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white shadow-md">
            <Library className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wide text-white leading-tight">
              LIBRARY STAFF
            </h1>
            <p className="text-[11px] font-medium text-sky-300/80 tracking-wider uppercase">
              Operations Desk
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-sky-900">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && (
              <h3 className="px-3 text-[11px] font-bold text-sky-400/80 tracking-wider uppercase mb-2">
                {section.title}
              </h3>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                    isActive
                      ? "bg-sky-600 text-white shadow-md shadow-sky-900/50 font-bold"
                      : "text-slate-300 hover:bg-sky-900/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                        isActive
                          ? "text-white"
                          : "text-sky-400/80 group-hover:text-sky-300"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Employee User Profile Bottom Widget */}
      <div className="p-3.5 border-t border-sky-900/60 bg-sky-950/80">
        <div className="flex items-center justify-between bg-sky-900/40 p-2.5 rounded-xl border border-sky-900/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-sky-800 text-sky-200 font-bold text-xs flex items-center justify-center border border-sky-600/50">
              EMP
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white leading-tight">
                {employeeProfile?.name || "Employee"}
              </div>
              <div className="text-[10px] font-medium text-sky-300/80">
                {employeeProfile?.role || "Thủ thư"}
              </div>
            </div>
          </div>
          <Signout iconOnly />
        </div>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;
