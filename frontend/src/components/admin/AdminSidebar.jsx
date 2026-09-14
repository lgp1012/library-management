import {
  Building2,
  Coins,
  FileText,
  FolderTree,
  Layers,
  LayoutDashboard,
  Library,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { useAdmin } from "../../hooks/useAdmin";
import Signout from "../auth/Signout";

const AdminSidebar = ({ activeTab, onTabChange }) => {
  const { adminProfile, employees, auditLogs, shelves } = useAdmin();
  const menuSections = [
    {
      title: null, // Top single item
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "TRUY CẬP & PHÂN QUYỀN",
      items: [
        {
          id: "employees",
          label: "Tài khoản nhân viên",
          icon: Users,
          badge: employees?.length || 0,
          badgeColor: "bg-sky-900/80 text-sky-200 border border-sky-700/50",
        },
        {
          id: "audit-logs",
          label: "Nhật ký hệ thống",
          icon: FileText,
          badge: auditLogs?.length || 0,
          badgeColor: "bg-sky-900/80 text-sky-200 border border-sky-700/50",
        },
      ],
    },
    {
      title: "CẤU HÌNH HỆ THỐNG",
      items: [
        {
          id: "borrowing-rules",
          label: "Quy định mượn trả",
          icon: ShieldCheck,
        },
        {
          id: "fine-settings",
          label: "Thiết lập phí phạt",
          icon: Coins,
        },
      ],
    },
    {
      title: "DANH MỤC & PHÂN LOẠI",
      items: [
        {
          id: "categories",
          label: "Thể loại sách",
          icon: FolderTree,
        },
        {
          id: "authors",
          label: "Tác giả",
          icon: UserCheck,
        },
        {
          id: "publishers",
          label: "Nhà xuất bản",
          icon: Building2,
        },
      ],
    },
    {
      title: "HẠ TẦNG & VỊ TRÍ",
      items: [
        {
          id: "shelves",
          label: "Vị trí & Kệ sách",
          icon: Layers,
          badge: shelves?.length || 0,
          badgeColor: "bg-sky-900/80 text-sky-200 border border-sky-700/50",
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
              LIBRARY ADMIN
            </h1>
            <p className="text-[11px] font-medium text-sky-300/80 tracking-wider uppercase">
              Central System OS
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-sky-400 bg-sky-900/80 px-2 py-0.5 rounded-full border border-sky-700/60">
          v2.4
        </span>
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
                  {item.badge && (
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

      {/* Admin User Profile Bottom Widget */}
      <div className="p-3.5 border-t border-sky-900/60 bg-sky-950/80">
        <div className="flex items-center justify-between bg-sky-900/40 p-2.5 rounded-xl border border-sky-900/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-sky-800 text-sky-200 font-bold text-xs flex items-center justify-center border border-sky-600/50">
              EV
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white leading-tight">
                {adminProfile?.name || "TS. Eleanor Vance"}
              </div>
              <div className="text-[10px] font-medium text-sky-300/80">
                {adminProfile?.code || "LIB-ADM-001"}
              </div>
            </div>
          </div>
          <Signout iconOnly />
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
