import { SlidersHorizontal, QrCode, Headphones } from "lucide-react";

const FeatureInfoCards = () => {
  const features = [
    {
      id: "rule",
      icon: <SlidersHorizontal className="h-5 w-5 text-blue-700" />,
      iconBg: "bg-blue-100/80",
      title: "Quy chế Mượn & Gia hạn",
      description:
        "Độc giả sinh viên được mượn tối đa 5 cuốn trong thời hạn 14 ngày. Được gia hạn online tối đa 2 lần nếu sách không có bạn đọc khác xếp hàng đặt trước.",
    },
    {
      id: "station",
      icon: <QrCode className="h-5 w-5 text-emerald-700" />,
      iconBg: "bg-emerald-100/80",
      title: "Trạm Trả sách Tự động 24/7",
      description:
        "Không cần chờ quầy mở cửa. Quét thẻ và hoàn trả tài liệu bất kỳ lúc nào tại Hộp trả sách thông minh RFID đặt ở cổng sảnh A1 của khuôn viên thư viện.",
    },
    {
      id: "support",
      icon: <Headphones className="h-5 w-5 text-purple-700" />,
      iconBg: "bg-purple-100/80",
      title: "Thủ thư Hỗ trợ Tra cứu",
      description:
        "Cần trích dẫn chuẩn APA, định dạng Marc21 hay hỗ trợ tìm kiếm tài liệu chuyên khảo cho khóa luận? Liên hệ dịch vụ Tra cứu trực tuyến.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {features.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-blue-50/40 p-4 sm:p-5 shadow-xs hover:bg-blue-50/70 transition-colors"
        >
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
          >
            {item.icon}
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900">
              {item.title}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureInfoCards;
