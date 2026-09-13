import {
  AlertTriangle,
  CheckCircle2,
  Edit,
  Filter,
  Layers,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

const AdminShelvesView = ({ shelves, setShelves }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShelf, setEditingShelf] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    floor: "Floor 1",
    location: "Khu Bắc · Khoa học Máy tính",
    taxonomy: "Computer Science & Software Systems",
    currentLoad: 150,
    maxCapacity: 250,
  });

  const filteredShelves = useMemo(() => {
    return shelves?.filter((sh) => {
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesCode = sh.code.toLowerCase().includes(query);
        const matchesLoc = sh.location.toLowerCase().includes(query);
        const matchesTax = sh.taxonomy.toLowerCase().includes(query);
        if (!matchesCode && !matchesLoc && !matchesTax) return false;
      }

      // Floor Filter
      if (selectedFloor !== "ALL" && sh.floor !== selectedFloor) {
        return false;
      }

      return true;
    });
  }, [shelves, searchTerm, selectedFloor]);

  const handleOpenCreate = () => {
    setEditingShelf(null);
    setFormData({
      code: `FL1-CW-SEC${Math.floor(10 + Math.random() * 90)}`,
      floor: "Floor 1",
      location: "Khu Trung tâm · Công nghệ",
      taxonomy: "Information & Network Technology",
      currentLoad: 120,
      maxCapacity: 200,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sh) => {
    setEditingShelf(sh);
    setFormData({
      code: sh.code,
      floor: sh.floor,
      location: sh.location,
      taxonomy: sh.taxonomy,
      currentLoad: sh.currentLoad,
      maxCapacity: sh.maxCapacity,
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const load = parseInt(formData.currentLoad) || 0;
    const max = parseInt(formData.maxCapacity) || 200;
    const occupancy = Math.round((load / max) * 100);
    const freeSlots = Math.max(0, max - load);

    let status = "Optimal Load";
    let statusType = "success";
    if (occupancy >= 95) {
      status = "Capacity Critical (Full)";
      statusType = "danger";
    } else if (occupancy >= 85) {
      status = "Near Capacity";
      statusType = "warning";
    }

    if (editingShelf) {
      setShelves((prev) =>
        prev.map((s) =>
          s.id === editingShelf.id
            ? {
                ...s,
                ...formData,
                currentLoad: load,
                maxCapacity: max,
                occupancy,
                freeSlots,
                status,
                statusType,
              }
            : s
        )
      );
    } else {
      const newShelf = {
        id: `sh-${Date.now()}`,
        ...formData,
        currentLoad: load,
        maxCapacity: max,
        occupancy,
        freeSlots,
        status,
        statusType,
      };
      setShelves((prev) => [...prev, newShelf]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="h-6 w-6 text-sky-600" />
            <span>Quản lý Vị trí & Tải trọng Kệ sách (Physical Shelves Allocation)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Giám sát không gian lưu trữ, mật độ theo khu vực, ánh xạ phân loại sách và lập kế hoạch mở rộng kệ sách vật lý.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm vị trí kệ mới</span>
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
            placeholder="Tìm theo mã kệ, khu vực tầng, chuyên ngành phân loại..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>

        {/* Floor Filter */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <span>Tầng:</span>
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold outline-none focus:border-sky-500"
          >
            <option value="ALL">Tất cả các tầng (All Floors)</option>
            <option value="Floor 1">Tầng 1 (Floor 1)</option>
            <option value="Floor 2">Tầng 2 (Floor 2)</option>
            <option value="Floor 3">Tầng 3 (Floor 3)</option>
          </select>
        </div>
      </div>

      {/* Shelves Grid (3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShelves?.map((sh) => (
          <div
            key={sh.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Top Header: Code, Floor & Edit */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-extrabold text-slate-900">
                    {sh.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">
                    {sh.floor}
                  </span>
                </div>
                <button
                  onClick={() => handleOpenEdit(sh)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                  title="Chỉnh sửa thông số kệ"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>

              {/* Sub-location */}
              <div className="text-xs text-slate-500 font-medium mt-1">
                {sh.location}
              </div>

              {/* Dedicated Taxonomy Box */}
              <div className="mt-3.5 p-3 rounded-2xl bg-sky-50/70 border border-sky-100">
                <div className="text-[10px] font-extrabold uppercase text-sky-800 tracking-wider">
                  DEDICATED TAXONOMY
                </div>
                <div className="text-xs font-bold text-sky-950 mt-0.5">
                  {sh.taxonomy}
                </div>
              </div>

              {/* Load Progress Section */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Tải trọng:{" "}
                    <strong className="text-slate-900 font-mono">
                      {sh.currentLoad} / {sh.maxCapacity}
                    </strong>
                  </span>
                  <span
                    className={`font-extrabold font-mono ${
                      sh.occupancy >= 95
                        ? "text-rose-600"
                        : sh.occupancy >= 85
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {sh.occupancy}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      sh.occupancy >= 95
                        ? "bg-rose-500"
                        : sh.occupancy >= 85
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${sh.occupancy}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Footer: Status Badge & Free Slots */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                  sh.occupancy >= 95
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : sh.occupancy >= 85
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {sh.status}
              </span>

              <span className="text-slate-400 font-mono text-[11px]">
                Còn trống <strong className="text-slate-700">{sh.freeSlots} chỗ</strong>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-5 w-5 text-sky-600" />
                <span>
                  {editingShelf ? "Chỉnh sửa vị trí kệ" : "Thêm vị trí kệ sách mới"}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mã vị trí kệ *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 font-mono font-bold rounded-xl outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tầng đặt kệ</label>
                  <select
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 font-semibold rounded-xl outline-none focus:border-sky-500"
                  >
                    <option value="Floor 1">Floor 1 (Tầng 1)</option>
                    <option value="Floor 2">Floor 2 (Tầng 2)</option>
                    <option value="Floor 3">Floor 3 (Tầng 3)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Khu vực vị trí chi tiết</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Khu Bắc · Khoa học Máy tính..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chuyên ngành ánh xạ (Taxonomy)</label>
                <input
                  type="text"
                  value={formData.taxonomy}
                  onChange={(e) => setFormData({ ...formData, taxonomy: e.target.value })}
                  placeholder="Computer Science & Software Systems..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số sách hiện tại</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.currentLoad}
                    onChange={(e) =>
                      setFormData({ ...formData, currentLoad: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sức chứa tối đa (chỗ)</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.maxCapacity}
                    onChange={(e) =>
                      setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md"
                >
                  Lưu vị trí kệ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShelvesView;
