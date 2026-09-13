import { Download, FileSpreadsheet, Filter, History, Search } from "lucide-react";
import { useMemo, useState } from "react";

const AdminAuditLogsView = ({ auditLogs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesActor = log.actor.toLowerCase().includes(query);
        const matchesTarget = log.target.toLowerCase().includes(query);
        const matchesDetails = log.details.toLowerCase().includes(query);
        const matchesIp = log.ip.toLowerCase().includes(query);
        const matchesId = log.id.toLowerCase().includes(query);
        if (!matchesActor && !matchesTarget && !matchesDetails && !matchesIp && !matchesId) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "ALL" && log.eventCategory !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [auditLogs, searchTerm, selectedCategory]);

  const handleExportCSV = () => {
    const csvHeader = "ID,Timestamp,Actor,ActorCode,Tag,Target,Details,IP\n";
    const csvRows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actor}","${l.actorCode}","${l.eventTag}","${l.target}","${l.details}","${l.ip}"`
      )
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `audit_trail_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="h-6 w-6 text-sky-600" />
            <span>Nhật ký Kiểm toán & Ghi nhận Sự kiện Hệ thống</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Nhật ký ghi nhận chi tiết các thao tác quản trị, thay đổi cấu hình, giao dịch và phân quyền trên toàn hệ thống thư viện.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all border border-slate-700"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
          <span>Xuất file Ledger (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo người thực hiện, loại thao tác, đối tượng, IP..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <span>Loại sự kiện:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold outline-none focus:border-sky-500"
          >
            <option value="ALL">Tất cả sự kiện</option>
            <option value="fine">Cấu hình phí phạt</option>
            <option value="rules">Quy định mượn trả</option>
            <option value="employee">Thao tác nhân viên</option>
            <option value="shelves">Thay đổi kệ sách</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Thời gian & Mã TX</th>
                <th className="py-3.5 px-4">Người thực hiện</th>
                <th className="py-3.5 px-4">Loại sự kiện</th>
                <th className="py-3.5 px-4">Đối tượng tác động</th>
                <th className="py-3.5 px-4">Chi tiết thao tác</th>
                <th className="py-3.5 px-4 text-right">Địa chỉ IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Timestamp & ID */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 font-mono">
                        {log.timestamp}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.id}</div>
                    </td>

                    {/* Actor */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{log.actor}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {log.actorCode} • {log.actorRole}
                      </div>
                    </td>

                    {/* Event Tag */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                          log.eventTagType === "warning"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : log.eventTagType === "purple"
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : log.eventTagType === "cyan"
                            ? "bg-sky-100 text-sky-800 border border-sky-200"
                            : log.eventTagType === "danger"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {log.eventTag}
                      </span>
                    </td>

                    {/* Target */}
                    <td className="py-4 px-4 font-bold text-slate-800">{log.target}</td>

                    {/* Details */}
                    <td className="py-4 px-4 text-slate-600 leading-relaxed max-w-sm">
                      {log.details}
                    </td>

                    {/* IP */}
                    <td className="py-4 px-4 text-right font-mono text-slate-500 text-[11px]">
                      {log.ip}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Không có nhật ký nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLogsView;
