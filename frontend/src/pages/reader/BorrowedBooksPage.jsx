import { useState } from "react";
import Footer from "../../components/Footer";
import ReaderHeader from "../../components/header/ReaderHeader";
import BorrowedHeaderSummary from "../../components/reader/BorrowedHeaderSummary";
import BorrowedDueAlert from "../../components/reader/BorrowedDueAlert";
import BorrowedListSection from "../../components/reader/BorrowedListSection";
import BorrowedRulesAndKiosks from "../../components/reader/BorrowedRulesAndKiosks";
import { READER_PROFILE } from "../../constants/readerMockData";

const BorrowedBooksPage = () => {
  const [profile] = useState(READER_PROFILE);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans antialiased text-slate-900">
      {/* Header */}
      <ReaderHeader activeTab="borrows" readerInfo={profile} />

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 1. Header Summary Banner */}
        <BorrowedHeaderSummary profile={profile} />

        {/* 2. Due Alert Box */}
        <BorrowedDueAlert />

        {/* 3. Main List Section */}
        <BorrowedListSection />

        {/* 4. Rules & 24/7 Kiosk Map */}
        <BorrowedRulesAndKiosks />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BorrowedBooksPage;
