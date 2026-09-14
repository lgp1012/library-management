import { useState } from "react";
import Footer from "../../components/Footer";
import ReaderHeader from "../../components/header/ReaderHeader";
import ReservationContent from "../../components/reader/ReservationContent";
import { READER_PROFILE } from "../../constants/readerMockData";

const ReservationPage = () => {
  const [profile] = useState(READER_PROFILE);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans antialiased text-slate-900">
      <ReaderHeader activeTab="reservations" readerInfo={profile} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <ReservationContent />
      </main>

      <Footer />
    </div>
  );
};

export default ReservationPage;
