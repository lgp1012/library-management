import { useEffect, useState, useMemo } from "react";
import BorrowedHeaderSummary from "./BorrowedHeaderSummary";
import BorrowedDueAlert from "./BorrowedDueAlert";
import BorrowedListSection from "./BorrowedListSection";
import useReader from "../../hooks/useReader";
import readerService from "../../services/readerService";

const ReaderBorrowedView = () => {
  const { profile, catalogBooks } = useReader();
  const [borrowings, setBorrowings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBorrowings = async () => {
    try {
      const data = await readerService.getMyBorrowings();
      if (data.result) {
        setBorrowings(data.result);
      }
    } catch (error) {
      console.error("Failed to fetch borrowings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  // Map borrowings to UI items using catalogBooks to find cover/author
  const enrichedBorrowings = useMemo(() => {
    return borrowings.map((b) => {
      const book = catalogBooks.find((cb) => cb.id === b.bookId);
      
      const expectedDate = new Date(b.expectedReturnDate);
      const today = new Date();
      // Ensure we compare based on dates, discarding time
      today.setHours(0, 0, 0, 0);
      expectedDate.setHours(0, 0, 0, 0);
      const diffTime = expectedDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let statusTag = "";
      let statusType = "success";
      
      if (diffDays < 0) {
        statusTag = `Quá hạn (${Math.abs(diffDays)} ngày)`;
        statusType = "danger";
      } else if (diffDays <= 3) {
        statusTag = `Sắp hết hạn (Còn ${diffDays} ngày)`;
        statusType = "danger";
      } else {
        statusTag = `Đang lưu thông (Còn ${diffDays} ngày)`;
        statusType = "success";
      }

      return {
        id: b.detailId,
        barcode: b.copyId,
        statusTag,
        statusType,
        location: book?.shelfLocation || "N/A",
        title: b.bookName,
        author: book?.author || "Chưa rõ",
        borrowDate: new Date(b.borrowingDate).toLocaleDateString("vi-VN"),
        dueDate: new Date(b.expectedReturnDate).toLocaleDateString("vi-VN"),
        renewCount: 0, // Since backend doesn't provide this yet
        maxRenew: 2,
        coverImage: book?.coverImage || "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&auto=format&fit=crop&q=80",
        canRenew: diffDays >= 0,
        buttonText: diffDays >= 0 ? "Gia hạn thêm" : "Không thể gia hạn",
        diffDays,
        expectedReturnDate: b.expectedReturnDate
      };
    });
  }, [borrowings, catalogBooks]);

  const nearestDueBook = useMemo(() => {
    const nearDue = enrichedBorrowings.filter((b) => b.diffDays >= 0 && b.diffDays <= 3);
    nearDue.sort((a, b) => a.diffDays - b.diffDays);
    return nearDue[0];
  }, [enrichedBorrowings]);

  return (
    <div className="space-y-6">
      {/* 1. Header Summary Banner */}
      <BorrowedHeaderSummary profile={profile} />

      {/* 2. Due Alert Box - Only show if there is a near-due book */}
      {nearestDueBook && (
        <BorrowedDueAlert nearestDueBook={nearestDueBook} />
      )}

      {/* 3. Main List Section */}
      <BorrowedListSection items={enrichedBorrowings} isLoading={isLoading} onRenewed={fetchBorrowings} />
    </div>
  );
};

export default ReaderBorrowedView;
