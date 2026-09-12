import { useMemo, useState } from "react";
import Footer from "../../components/Footer";
import ReaderHeader from "../../components/header/ReaderHeader";
import BookCatalogSection from "../../components/reader/BookCatalogSection";
import FeatureInfoCards from "../../components/reader/FeatureInfoCards";
import SearchFilterBar from "../../components/reader/SearchFilterBar";
import WelcomeHeroBanner from "../../components/reader/WelcomeHeroBanner";
import {
  CATALOG_BOOKS,
  READER_PROFILE,
} from "../../constants/readerMockData";

const ReaderDashboard = () => {
  const [activeNavTab, setActiveNavTab] = useState("explore");
  const [profile] = useState(READER_PROFILE);

  // Books state for catalog
  const [catalogBooks, setCatalogBooks] = useState(CATALOG_BOOKS);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("Công nghệ thông tin");
  const [selectedAuthor, setSelectedAuthor] = useState("Tác giả (Toàn bộ)");
  const [selectedYear, setSelectedYear] = useState("Năm xuất bản");
  const [availableOnly, setAvailableOnly] = useState(false);

  // Filter catalog books based on search & filter inputs
  const filteredCatalogBooks = useMemo(() => {
    return catalogBooks.filter((book) => {
      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = book.title.toLowerCase().includes(query);
        const matchesAuthor = book.author.toLowerCase().includes(query);
        const matchesIsbn = book.isbn.toLowerCase().includes(query);
        const matchesDesc = book.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAuthor && !matchesIsbn && !matchesDesc) {
          return false;
        }
      }

      // Major filter
      if (selectedMajor && selectedMajor !== "Công nghệ thông tin") {
        if (book.category !== selectedMajor) return false;
      }

      // Author filter
      if (selectedAuthor && selectedAuthor !== "Tác giả (Toàn bộ)") {
        if (book.author !== selectedAuthor) return false;
      }

      // Available only filter
      if (availableOnly && book.stockStatus !== "available") {
        return false;
      }

      return true;
    });
  }, [catalogBooks, searchTerm, selectedMajor, selectedAuthor, availableOnly]);

  // Handle Reset Filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedMajor("Công nghệ thông tin");
    setSelectedAuthor("Tác giả (Toàn bộ)");
    setSelectedYear("Năm xuất bản");
    setAvailableOnly(false);
  };

  // Handle Borrow Catalog Book
  const handleBorrowBook = (bookId) => {
    setCatalogBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, stockStatus: "requested" } : b,
      ),
    );
  };

  // Handle Reserve Catalog Book
  const handleReserveBook = (bookId) => {
    setCatalogBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, queueCount: (b.queueCount || 1) + 1 } : b,
      ),
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans antialiased text-slate-900">
      {/* Header */}
      <ReaderHeader
        activeTab={activeNavTab}
        onTabChange={setActiveNavTab}
        readerInfo={profile}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 1. Welcome Hero Banner */}
        <WelcomeHeroBanner profile={profile} />

        {/* 2. Search & Filter Bar */}
        <SearchFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedMajor={selectedMajor}
          setSelectedMajor={setSelectedMajor}
          selectedAuthor={selectedAuthor}
          setSelectedAuthor={setSelectedAuthor}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          availableOnly={availableOnly}
          setAvailableOnly={setAvailableOnly}
          onResetFilters={handleResetFilters}
          resultCount={filteredCatalogBooks.length * 12}
        />

        {/* 3. Curated Catalog Section */}
        <BookCatalogSection
          catalogBooks={filteredCatalogBooks}
          onBorrowBook={handleBorrowBook}
          onReserveBook={handleReserveBook}
        />

        {/* 4. Policy & Feature Cards */}
        <FeatureInfoCards />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ReaderDashboard;
