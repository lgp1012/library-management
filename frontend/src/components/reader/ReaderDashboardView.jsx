import { useMemo, useState } from "react";
import BookCatalogSection from "./BookCatalogSection";
import FeatureInfoCards from "./FeatureInfoCards";
import SearchFilterBar from "./SearchFilterBar";
import WelcomeHeroBanner from "./WelcomeHeroBanner";
import useReader from "../../hooks/useReader";

const ReaderDashboardView = () => {
  const { profile, catalogBooks } = useReader();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("Chuyên ngành (Toàn bộ)");
  const [selectedAuthor, setSelectedAuthor] = useState("Tác giả (Toàn bộ)");
  const [selectedYear, setSelectedYear] = useState("Tất cả năm");
  const [availableOnly, setAvailableOnly] = useState(false);

  const filterOptions = useMemo(() => {
    const majorsSet = new Set(["Chuyên ngành (Toàn bộ)"]);
    const authorsSet = new Set(["Tác giả (Toàn bộ)"]);
    const yearsSet = new Set(["Tất cả năm"]);

    catalogBooks.forEach((b) => {
      if (b.category) majorsSet.add(b.category);
      if (b.author && b.author !== "Chưa rõ") {
        b.author.split(", ").forEach(a => authorsSet.add(a.trim()));
      }
      if (b.year) yearsSet.add(String(b.year));
    });

    return {
      majors: Array.from(majorsSet),
      authors: Array.from(authorsSet).sort(),
      publishYears: Array.from(yearsSet).sort((a,b) => b.localeCompare(a)) // descending
    };
  }, [catalogBooks]);

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
      if (selectedMajor && selectedMajor !== "Chuyên ngành (Toàn bộ)") {
        if (book.category !== selectedMajor) return false;
      }

      // Author filter
      if (selectedAuthor && selectedAuthor !== "Tác giả (Toàn bộ)") {
        if (!book.author.includes(selectedAuthor)) return false;
      }

      // Year filter
      if (selectedYear && selectedYear !== "Tất cả năm") {
        if (String(book.year) !== selectedYear) return false;
      }

      // Available only filter
      if (availableOnly && book.stockStatus !== "available") {
        return false;
      }

      return true;
    });
  }, [catalogBooks, searchTerm, selectedMajor, selectedAuthor, selectedYear, availableOnly]);

  // Handle Reset Filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedMajor("Chuyên ngành (Toàn bộ)");
    setSelectedAuthor("Tác giả (Toàn bộ)");
    setSelectedYear("Tất cả năm");
    setAvailableOnly(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Hero Banner */}
      <WelcomeHeroBanner profile={profile} />

      {/* 2. Feature Info Cards */}
      <FeatureInfoCards />


      {/* 3. Search & Filter Bar */}
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
        resultCount={filteredCatalogBooks.length}
        filterOptions={filterOptions}
      />

      {/* 4. Book Catalog Grid */}
      <BookCatalogSection books={filteredCatalogBooks} />
    </div>
  );
};

export default ReaderDashboardView;
