import { useState } from "react";
import Footer from "../../components/Footer";
import ReaderHeader from "../../components/header/ReaderHeader";
import { READER_PROFILE } from "../../constants/readerMockData";
import { History, CheckCircle2 } from "lucide-react";

const HistoryPage = () => {
  const [profile] = useState(READER_PROFILE);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans antialiased text-slate-900">
      <ReaderHeader activeTab="history" readerInfo={profile} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-blue-950">
            <History className="h-6 w-6 text-sky-600" />
            <h2 className="text-2xl font-extrabold">Lịch sử mượn trả & Phạt</h2>
          </div>
          <p className="text-xs text-slate-600">
            Nhật ký lưu thông toàn bộ các chu kỳ mượn trả tài liệu và trạng thái thanh toán phí phạt trễ (nếu có).
          </p>

          <div className="rounded-xl bg-slate-50 p-6 text-center text-xs text-slate-500 space-y-2 border border-slate-200/70">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
            <p className="font-bold text-slate-800">Tài khoản chuẩn mực - 0đ nợ phạt tích lũy</p>
            <p className="text-slate-500">Hiển thị lịch sử 12 cuốn sách đã hoàn trả thành công trong năm 2024.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HistoryPage;
