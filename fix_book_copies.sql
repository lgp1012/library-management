ALTER TABLE book_copies DROP CONSTRAINT CK_BookCopies_Status;
UPDATE book_copies SET status = UPPER(status);
ALTER TABLE book_copies ADD CONSTRAINT CK_BookCopies_Status CHECK (status IN ('AVAILABLE', 'BORROWED', 'RESERVED', 'LOST', 'DAMAGED'));
