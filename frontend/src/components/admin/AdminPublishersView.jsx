import {
  Building2,
  CheckCircle2,
  Edit,
  FileCheck,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

const AdminPublishersView = ({ publishers, setPublishers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState(null);

  const [formData, setFormData] = useState({
    vendorCode: "",
    name: "",
    country: "",
    repName: "",
    repEmail: "",
    phone: "",
    address: "",
    activeContracts: 10,
    status: "ACTIVE",
  });

  const filteredPublishers = useMemo(() => {
    return publishers?.filter((pub) => {
      if (!searchTerm.trim()) return true;
      const query = searchTerm.toLowerCase();
      return (
        pub.name.toLowerCase().includes(query) ||
        pub.vendorCode.toLowerCase().includes(query) ||
        pub.country.toLowerCase().includes(query) ||
        pub.repName.toLowerCase().includes(query)
      );
    });
  }, [publishers, searchTerm]);

  const handleOpenCreate = () => {
    setEditingPublisher(null);
    setFormData({
      vendorCode: `PUB-${Math.floor(100 + Math.random() * 900)}`,
      name: "",
      country: "Việt Nam",
      repName: "",
      repEmail: "",
      phone: "",
      address: "",
      activeContracts: 12,
      status: "ACTIVE",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pub) => {
    setEditingPublisher(pub);
    setFormData({
      vendorCode: pub.vendorCode,
      name: pub.name,
      country: pub.country,
      repName: pub.repName,
      repEmail: pub.repEmail,
      phone: pub.phone,
      address: pub.address,
      activeContracts: pub.activeContracts,
      status: pub.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingPublisher) {
      setPublishers((prev) =>
        prev.map((p) => (p.id === editingPublisher.id ? { ...p, ...formData } : p))
      );
    } else {
      const newPub = {
        id: `pub-${Date.now()}`,
        ...formData,
      };
      setPublishers((prev) => [newPub, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-sky-600" />
            <span>Danh mục Nhà xuất bản & Hợp đồng Đối tác (Publisher Registry)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý thông tin liên hệ nhà cung cấp, hợp đồng cung ứng tài liệu và đối tác bản quyền xuất bản.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Đăng ký Nhà xuất bản mới</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm nhà xuất bản theo tên, mã NXB, quốc gia, người đại diện..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Publishers Grid (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPublishers?.map((pub) => (
          <div
            key={pub.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header: Vendor Badge & Edit */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 font-mono text-[10px] font-extrabold uppercase border border-indigo-200">
                  {pub.vendorCode}
                </span>
                <button
                  onClick={() => handleOpenEdit(pub)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                  title="Chỉnh sửa thông tin"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>

              {/* Press Name & Country */}
              <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                {pub.name}
              </h3>
              <div className="text-xs font-semibold text-slate-400 mt-0.5">
                {pub.country}
              </div>

              {/* Contacts list */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-sky-600 shrink-0" />
                  <span>
                    Đại diện: <strong className="text-slate-800">{pub.repName}</strong>{" "}
                    <span className="text-slate-400 font-mono">&lt;{pub.repEmail}&gt;</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-sky-600 shrink-0" />
                  <span className="font-mono text-slate-700">{pub.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-sky-600 shrink-0" />
                  <span className="text-slate-600">{pub.address}</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer: Active Contracts & Status */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-extrabold">
                <FileCheck className="h-4 w-4" />
                <span>{pub.activeContracts} Hợp đồng còn hiệu lực</span>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase">
                {pub.status}
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
                <Building2 className="h-5 w-5 text-sky-600" />
                <span>
                  {editingPublisher ? "Chỉnh sửa Nhà xuất bản" : "Đăng ký Nhà xuất bản mới"}
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
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block font-bold text-slate-700 mb-1">Mã NXB</label>
                  <input
                    type="text"
                    value={formData.vendorCode}
                    onChange={(e) => setFormData({ ...formData, vendorCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 font-mono text-slate-700 rounded-xl outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Tên Nhà xuất bản *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Oxford University Press..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quốc gia *</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="United States, United Kingdom..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên đại diện liên hệ</label>
                  <input
                    type="text"
                    value={formData.repName}
                    onChange={(e) => setFormData({ ...formData, repName: e.target.value })}
                    placeholder="Nguyễn Văn A..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email đại diện</label>
                  <input
                    type="email"
                    value={formData.repEmail}
                    onChange={(e) => setFormData({ ...formData, repEmail: e.target.value })}
                    placeholder="contact@publisher.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+84 24 3822..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số hợp đồng hiệu lực</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.activeContracts}
                    onChange={(e) =>
                      setFormData({ ...formData, activeContracts: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Địa chỉ văn phòng</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Địa chỉ trụ sở chính..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500"
                />
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
                  Lưu nhà xuất bản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPublishersView;
