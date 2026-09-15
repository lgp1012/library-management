ALTER TABLE reservations DROP CONSTRAINT CK_Reservations_Status;
ALTER TABLE reservations ADD CONSTRAINT CK_Reservations_Status CHECK (status IN (N'Chưa xử lý', N'Đang đợi xử lý', N'Đã xử lý', N'Hết hạn', N'Đã hủy', N'Đã hoàn tất'));
