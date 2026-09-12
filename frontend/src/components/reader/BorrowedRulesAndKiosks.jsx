import { ShieldCheck, Info, MapPin, Radio } from "lucide-react";

const BorrowedRulesAndKiosks = () => {
  const stations = [
    {
      id: "st1",
      number: "TRẠM SỐ 01",
      name: "Sảnh Nhà T1 (Hiệu bộ)",
      location: "Cổng chính • Mở cửa 24/7",
      status: "Băng chuyển: Sẵn sàng",
      online: true,
    },
    {
      id: "st2",
      number: "TRẠM SỐ 02",
      name: "Tầng 1 Nhà Ký túc xá",
      location: "Khu B4 Cổng phụ • Mở cửa 24/7",
      status: "Dung lượng: 42%",
      online: true,
    },
    {
      id: "st3",
      number: "TRẠM SỐ 03",
      name: "Sảnh Trung tâm Học liệu",
      location: "Hộp tráng ngoài trời • Mở cửa 24/7",
      status: "Cảm biến: Tối ưu",
      online: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Rules */}
      <div className="lg:col-span-5 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-900">
            <ShieldCheck className="h-5 w-5 text-blue-950" />
            <h4 className="text-base font-extrabold tracking-tight">
              Quy tắc Gia hạn & Trả sách tự động
            </h4>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Hệ thống Thư viện Đại học áp dụng cơ chế tự phục vụ thông minh theo tiêu chuẩn lưu thông ISO/IEC.
          </p>

          <div className="mt-4 space-y-3.5">
            {/* Step 1 */}
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-950 text-white font-mono text-xs font-bold">
                01
              </span>
              <div>
                <h5 className="text-xs font-bold text-slate-900">
                  Chu kỳ gia hạn tiêu chuẩn
                </h5>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  Mỗi lần đăng ký gia hạn trực tuyến thành công, hệ thống sẽ tự động cộng thêm <strong className="font-semibold">14 ngày</strong> tính từ thời điểm hạn trả của chu kỳ trước đó. Tối đa 2 lần/cuốn.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-950 text-white font-mono text-xs font-bold">
                02
              </span>
              <div>
                <h5 className="text-xs font-bold text-slate-900">
                  Điều kiện xếp hàng ưu tiên
                </h5>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  Sách không được phép gia hạn nếu đang có độc giả khác đặt trước trong hàng chờ mượn (Hold Reservation Queue) nhằm bảo đảm tính công bằng.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-950 text-white font-mono text-xs font-bold">
                03
              </span>
              <div>
                <h5 className="text-xs font-bold text-slate-900">
                  Khóa quyền mượn quá hạn
                </h5>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  Thẻ độc giả sẽ bị tự động khóa chức năng mượn và gia hạn khi tổng nợ phạt quá hạn vượt mức <strong className="font-semibold text-rose-700">50.000 VNĐ</strong> hoặc có tài liệu quá hạn từ 07 ngày trở lên.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Alert */}
        <div className="rounded-xl bg-teal-50 p-3 border border-teal-200/80 text-[11px] text-teal-900 font-medium flex items-start gap-2">
          <Info className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
          <span>
            Sau khi trả sách qua trạm tự động, biên nhận số sẽ lập tức gửi về ứng dụng và email sinh viên của bạn.
          </span>
        </div>
      </div>

      {/* Right Column: RFID Kiosk Map & Stations */}
      <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold tracking-wider text-teal-700 uppercase">
              HẠ TẦNG RFID KHÔNG CHẠM
            </span>
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
              Trạm Kiosk & Hộp trả sách 24/7 tại Khuôn viên
            </h4>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800 border border-teal-200">
            <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            3 Điểm đang online
          </span>
        </div>

        {/* Simulated Map View */}
        <div className="relative h-56 w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
          <iframe
            title="Campus Map"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src="https://maps.google.com/maps?q=21.0031177,105.8459416&z=15&output=embed"
            className="opacity-80 saturate-150"
          />

          {/* Map Overlay Badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-xs">
            <MapPin className="h-4 w-4 text-red-600" />
            <span>Khuôn viên Thư viện Trung tâm</span>
          </div>

          <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-mono text-white flex items-center gap-1">
            <Radio className="h-3 w-3 text-teal-400 animate-pulse" />
            <span>Tốc độ xử lý: 1.2 giây/cuốn</span>
          </div>
        </div>

        {/* 3 Station Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {stations.map((st) => (
            <div
              key={st.id}
              className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 hover:bg-white hover:shadow-xs transition-all space-y-1"
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
                <span>{st.number}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              </div>
              <h5 className="text-xs font-bold text-slate-900 truncate">
                {st.name}
              </h5>
              <p className="text-[11px] text-slate-500 truncate">
                {st.location}
              </p>
              <div className="pt-1 text-[11px] font-semibold text-teal-700 flex items-center justify-between">
                <span>{st.status}</span>
                <span>↳</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BorrowedRulesAndKiosks;
