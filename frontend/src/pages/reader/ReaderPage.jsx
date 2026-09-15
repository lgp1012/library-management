import { useState } from "react";
import Footer from "../../components/Footer";
import ReaderHeader from "../../components/header/ReaderHeader";
import useReader from "../../hooks/useReader";

// Views
import ReaderDashboardView from "../../components/reader/ReaderDashboardView";
import ReaderBorrowedView from "../../components/reader/ReaderBorrowedView";
import ReaderReservationView from "../../components/reader/ReaderReservationView";
import ReaderHistoryView from "../../components/reader/ReaderHistoryView";
import ReaderProfileView from "../../components/reader/ReaderProfileView";

export default function ReaderPage() {
  const [activeTab, setActiveTab] = useState("explore");
  const { profile } = useReader();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans antialiased text-slate-900">
      <ReaderHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        readerInfo={profile}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "explore" && <ReaderDashboardView />}
        {activeTab === "borrows" && <ReaderBorrowedView />}
        {activeTab === "reservations" && <ReaderReservationView />}
        {activeTab === "history" && <ReaderHistoryView />}
        {activeTab === "profile" && <ReaderProfileView />}
      </main>

      <Footer />
    </div>
  );
}
