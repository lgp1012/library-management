import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CATALOG_BOOKS, READER_PROFILE } from "../constants/readerMockData";
import readerService from "../services/readerService";
import AuthContext from "./authContext";

const ReaderContext = createContext();

export const ReaderProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(READER_PROFILE);
  const [catalogBooks, setCatalogBooks] = useState(CATALOG_BOOKS);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReaderData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [profileData, configData] = await Promise.all([
        readerService.getProfile(),
        readerService.getBorrowingConfig()
      ]);
      if (profileData.result) {
        const p = profileData.result;

        let daysRemaining = 0;
        let formattedDate = "";
        if (p.membershipExpiry) {
          const expiryDate = new Date(p.membershipExpiry);
          const today = new Date();
          const diffTime = expiryDate - today;
          daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          formattedDate = expiryDate.toLocaleDateString("vi-VN");
        }

        setProfile({
          ...READER_PROFILE,
          name: p.readerName,
          cardNumber: p.readerId,
          email: p.email,
          phone: p.phoneNumber,
          status: p.active ? "Đang hoạt động" : "Đang khóa",
          currentBorrows: p.currentlyBorrowedBooks || 0,
          maxBorrows: configData.result?.maxBooksPerReader ?? "Chưa có thông tin",
          nearestDueDate: formattedDate,
          daysRemaining: daysRemaining,
          unpaidFine: (p.unpaidFine || 0).toLocaleString("vi-VN") + " đ",
          hasUnpaidFine: p.unpaidFine > 0,
          accountStatus:
            p.unpaidFine > 0 ? "Có nợ phạt" : "Tài khoản chuẩn mực",
        });
      }

      const [booksData, shelvesData, authorsData] = await Promise.all([
        readerService.listBooks(),
        readerService.listShelves(),
        readerService.listAuthors(),
      ]);

      if (booksData.result && shelvesData.result && authorsData.result) {
        const shelves = shelvesData.result;
        const authors = authorsData.result;

        const formattedBooks = booksData.result.map((b) => {
          const availableCopies = b.copies
            ? b.copies.filter((c) => c.status === "AVAILABLE").length
            : 0;

          let shelfLocationStr = "N/A";
          if (b.copies && b.copies.length > 0 && b.copies[0].shelfId) {
            const shelf = shelves.find(
              (s) => s.shelfId === b.copies[0].shelfId,
            );
            if (shelf) {
              shelfLocationStr = `Kệ ${shelf.shelfName} - Khu ${shelf.position}`;
            } else {
              shelfLocationStr = `Kệ ${b.copies[0].shelfId}`;
            }
          }

          let authorNamesStr = "Chưa rõ";
          if (b.authorIds && b.authorIds.length > 0) {
            const resolvedAuthors = b.authorIds.map((aid) => {
              const authorInfo = authors.find((a) => a.authorId === aid);
              return authorInfo ? authorInfo.authorName : aid;
            });
            authorNamesStr = resolvedAuthors.join(", ");
          }

          return {
            id: b.bookId,
            title: b.bookName || "Không có tựa đề",
            subTitle: "",
            author: authorNamesStr,
            stockTag: `Còn ${availableCopies} bản`,
            stockStatus: availableCopies > 0 ? "available" : "out",
            shelfLocation: shelfLocationStr,
            rating: 5,
            reviewCount: 0,
            description: b.description || "",
            isbn: b.bookId || "",
            year: b.year,
            coverImage:
              "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80",
            category:
              b.categoryIds && b.categoryIds.length > 0
                ? b.categoryIds[0]
                : "Khác",
            isEbook: false,
            _original: b,
          };
        });
        setCatalogBooks(formattedBooks);
      }
    } catch (error) {
      console.error("Failed to load reader data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReaderData();
  }, [fetchReaderData]);

  const value = useMemo(
    () => ({
      profile,
      catalogBooks,
      isLoading,
      refetch: fetchReaderData,
    }),
    [profile, catalogBooks, isLoading, fetchReaderData],
  );

  return (
    <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>
  );
};

export default ReaderContext;
