import { Edit, Power, Search, Shield, UserPlus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import adminService from "../../services/adminService";

const AdminEmployeeView = () => {
  const { employees, setEmployees } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Modal State for Create/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    phoneNumber: "",
    address: "",
  });

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    return employees?.filter((emp) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = emp.name.toLowerCase().includes(query);
        const matchesCode = emp.code.toLowerCase().includes(query);
        const matchesEmail = emp.email.toLowerCase().includes(query);
        const matchesDept = emp.department.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesEmail && !matchesDept) {
          return false;
        }
      }

      // Status Filter
      if (selectedStatus !== "ALL" && emp.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [employees, searchTerm, selectedStatus]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingEmployee(null);
    setFormData({
      name: "",
      email: "",
      username: "",
      password: "",
      phoneNumber: "",
      address: "",
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      username: "",
      password: "",
      phoneNumber: emp.phoneNumber || "",
      address: emp.department || "",
    });
    setIsModalOpen(true);
  };

  // Toggle Employee Lock Status
  const handleToggleStatus = async (empId) => {
    try {
      await adminService.deactivateEmployee(empId);
      setEmployees((prev) =>
        prev.map((emp) => {
          if (emp.id === empId) {
            return { ...emp, status: "Inactive" };
          }
          return emp;
        }),
      );
      alert("Đã hủy kích hoạt tài khoản thành công!");
    } catch (error) {
      alert(
        "Lỗi khi hủy kích hoạt: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  // Handle Form Submission (Create or Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingEmployee) {
      alert("Backend hiện tại chưa hỗ trợ API cập nhật thông tin nhân viên.");
    } else {
      try {
        const res = await adminService.createEmployee({
          employeeName: formData.name,
          username: formData.username,
          password: formData.password,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        });

        const newEmp = {
          id: res.result.employeeId,
          name: res.result.employeeName,
          code: res.result.employeeId,
          email: res.result.email,
          role: "Thủ thư",
          department: res.result.address || "",
          status: res.result.active ? "Active" : "Inactive",
          permissionsCount: 5,
          lastActive: "Chưa ghi nhận",
          initials: res.result.employeeName.substring(0, 2).toUpperCase(),
        };
        setEmployees((prev) => [newEmp, ...prev]);
        setIsModalOpen(false);
      } catch (error) {
        alert(
          "Lỗi tạo nhân viên: " +
            (error.response?.data?.message || error.message),
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-sky-600" />
            <span>Quản lý tài khoản nhân viên tại quầy</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cấp tài khoản nhân sự, phân quyền vai trò tổ chức, quản lý đặc quyền
            hệ thống và kiểm soát vòng đời tài khoản.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all"
        >
          <UserPlus className="h-4 w-4" />
          <span>Tạo tài khoản nhân viên mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên nhân viên, mã NV, email, phòng ban..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
          />
        </div>

        {/* Filters Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Trạng thái:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold outline-none focus:border-sky-500"
            >
              <option value="ALL">Tất cả</option>
              <option value="Active">Hoạt động (Active)</option>
              <option value="Inactive">Ngừng hoạt động (Inactive)</option>
              <option value="Suspended">Tạm khóa (Suspended)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Nhân viên</th>
                <th className="py-3.5 px-4">Mã NV</th>

                <th className="py-3.5 px-4">Địa chỉ</th>
                <th className="py-3.5 px-4">Trạng thái</th>

                <th className="py-3.5 px-4">Hoạt động cuối</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Member */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-sky-900 text-sky-100 font-bold text-xs flex items-center justify-center border border-sky-700/50">
                          {emp.initials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {emp.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Employee Code */}
                    <td className="py-4 px-4 font-mono font-bold text-slate-700">
                      {emp.code}
                    </td>

                    {/* Role Badge */}

                    {/* Department */}
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {emp.department}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          emp.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : emp.status === "Inactive"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            emp.status === "Active"
                              ? "bg-emerald-500"
                              : emp.status === "Inactive"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          }`}
                        />
                        {emp.status === "Active"
                          ? "Hoạt động"
                          : emp.status === "Inactive"
                            ? "Ngừng hoạt động"
                            : "Tạm khóa"}
                      </span>
                    </td>

                    {/* Last Active */}
                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                      {emp.lastActive}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(emp)}
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="Chỉnh sửa thông tin"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(emp.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            emp.status === "Active"
                              ? "text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                              : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={
                            emp.status === "Active"
                              ? "Khóa/Ngừng hoạt động"
                              : "Kích hoạt lại"
                          }
                        >
                          <Power className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Không tìm thấy tài khoản nhân viên nào phù hợp với tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Employee Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-sky-600" />
                <span>
                  {editingEmployee
                    ? "Chỉnh sửa tài khoản nhân viên"
                    : "Tạo tài khoản nhân viên mới"}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitForm}
              className="mt-4 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Họ và tên nhân viên *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập họ và tên..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Địa chỉ Email trường *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@library.edu.vn"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              {!editingEmployee && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Tên đăng nhập *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      placeholder="Tên đăng nhập"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Mật khẩu *
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Mật khẩu"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    placeholder="Số điện thoại"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Địa chỉ..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white"
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
                  {editingEmployee ? "Lưu thay đổi" : "Tạo tài khoản"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployeeView;
