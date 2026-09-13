import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
  Layers,
  Plus,
  Shield,
  ShieldCheck,
  Sliders,
  Users,
} from "lucide-react";

import { useAdmin } from "../../hooks/useAdmin";

const AdminDashboardView = ({ onNavigateTab, onEditRule }) => {
  const { borrowingRules, auditLogs, employees, shelves, fineSettings } =
    useAdmin();

  // Tạo KPI động dựa trên dữ liệu thật
  const kpiMetrics = {
    authorizedPersonnel: {
      active: employees?.filter((e) => e.status === "Active").length || 0,
      registered: employees?.length || 0,
      auditText: "Đã đồng bộ với CSDL",
    },
    borrowingTiers: {
      activeClasses: borrowingRules?.length || 0,
      loanCapRange:
        borrowingRules?.length > 0
          ? `${borrowingRules[0].maxBooksPerReader || 0} cuốn`
          : "N/A",
    },
    overdueFine: {
      dailyRateText:
        fineSettings?.length > 0
          ? `${fineSettings[0].fineRatePerDay?.toLocaleString("vi-VN")}đ/ngày`
          : "N/A",
      maxCapText: "Phạt theo ngày",
      graceText: fineSettings?.length > 0 ? fineSettings[0].fineType : "N/A",
    },
    physicalStacks: {
      capacityPercent: shelves?.length > 0 ? 50 : 0, // Mock sức chứa vì CSDL chưa có
      currentCount: shelves?.length || 0,
      maxCount: 100,
    },
  };

  // Helper function to resolve log status colors and avoid nested ternaries (SonarQube S3358)
  const getLogTagStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "warning":
        return "bg-amber-100 text-amber-800";
      case "danger":
      case "error":
        return "bg-rose-100 text-rose-800";
      case "success":
        return "bg-emerald-100 text-emerald-800";
      case "purple":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-sky-100 text-sky-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-linear-to-r from-sky-950 via-sky-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-sky-800/50 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-900/80 border border-sky-700/60 text-sky-300 text-xs font-semibold uppercase tracking-wider">
            <Shield className="h-3.5 w-3.5 text-sky-400" />
            <span>QUẢN TRỊ HỆ THỐNG • Institutional Governance Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Tổng quan & Điều hành Hệ thống Thư viện
          </h1>
          <p className="text-sm text-sky-200/80 leading-relaxed">
            Thống kê vận hành thời gian thực về tài khoản nhân viên, chính sách
            lưu thông sách, thông số phí phạt quá hạn và hạ tầng kệ sách vật lý.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab("employees")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Quản lý nhân viên</span>
          </button>
          <button
            onClick={() => onNavigateTab("borrowing-rules")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-900/90 hover:bg-sky-800 text-sky-100 font-semibold text-xs border border-sky-700/80 transition-all"
          >
            <Sliders className="h-4 w-4 text-sky-400" />
            <span>Quy định mượn</span>
          </button>
          <button
            onClick={() => onNavigateTab("fine-settings")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-900/90 hover:bg-sky-800 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-all"
          >
            <Coins className="h-4 w-4 text-amber-400" />
            <span>Biểu phí phạt</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (4 items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nhân sự hệ thống
            </span>
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {kpiMetrics?.authorizedPersonnel?.active} /{" "}
              {kpiMetrics?.authorizedPersonnel?.registered}{" "}
              <span className="text-xs font-semibold text-slate-500">
                tài khoản
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{kpiMetrics?.authorizedPersonnel?.auditText}</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Hạng độc giả áp dụng
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {kpiMetrics?.borrowingTiers?.activeClasses}{" "}
              <span className="text-xs font-semibold text-slate-500">
                nhóm phân loại
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500 font-medium">
              Hạn mức:{" "}
              <span className="font-bold text-slate-700">
                {kpiMetrics?.borrowingTiers?.loanCapRange}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Thông số phí phạt quá hạn
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Coins className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-600">
              {kpiMetrics?.overdueFine?.dailyRateText}
            </div>
            <div className="mt-2 text-[11px] text-slate-500 font-medium">
              {kpiMetrics?.overdueFine?.maxCapText} |{" "}
              {kpiMetrics?.overdueFine?.graceText}
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sức chứa kệ sách
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xl font-extrabold text-slate-900">
                {kpiMetrics?.physicalStacks?.capacityPercent}%
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ({kpiMetrics?.physicalStacks?.currentCount}/
                {kpiMetrics?.physicalStacks?.maxCount})
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${kpiMetrics?.physicalStacks?.capacityPercent}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Policy Matrix (Left) & Activity Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): System Borrowing Policy Matrix */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-sky-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Ma trận Quy định Mượn trả Hệ thống
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab("borrowing-rules")}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 transition-colors"
              >
                <span>Cấu hình quy định</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-2">Hạng độc giả</th>
                    <th className="py-3 px-2 text-center">Tối đa</th>
                    <th className="py-3 px-2 text-center">Thời hạn</th>
                    <th className="py-3 px-2 text-center">Gia hạn</th>
                    <th className="py-3 px-2 text-center">Giữ chỗ</th>
                    <th className="py-3 px-2 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {borrowingRules?.map((rule, idx) => (
                    <tr
                      key={rule.configId || idx}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3.5 px-2">
                        <div className="font-bold text-slate-900">
                          Quy định chung
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          ALL-TIERS
                        </div>
                      </td>
                      <td className="py-3.5 px-2 text-center font-bold text-sky-900">
                        {rule.maxBooksPerReader} cuốn
                      </td>
                      <td className="py-3.5 px-2 text-center text-slate-700">
                        {rule.maxBorrowDays} ngày
                      </td>
                      <td className="py-3.5 px-2 text-center text-slate-700">
                        1 lần
                      </td>
                      <td className="py-3.5 px-2 text-center text-slate-700">
                        3 ngày
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <button
                          onClick={() => onEditRule(rule)}
                          className="px-2.5 py-1 text-[11px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors"
                        >
                          Chỉnh sửa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Administrative Activity Feed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Nhật ký Hoạt động Quản trị
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab("audit-logs")}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 transition-colors"
              >
                Xem tất cả
              </button>
            </div>

            {/* Timeline Feed */}
            <div className="space-y-4 max-h-95 overflow-y-auto pr-1">
              {auditLogs?.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${getLogTagStyle(
                        log.status,
                      )}`}
                    >
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {log.time}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900">
                    Admin: {log.admin}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {log.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardView;
