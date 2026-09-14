export const getSigninErrorMessage = (error) => {
  if (!error.response) {
    return "Không thể kết nối đến máy chủ.";
  }

  switch (error.response.status) {
    case 400:
      return (
        error.response.data?.message ||
        "Thông tin đăng nhập không hợp lệ."
      );

    case 401:
      return "Tên đăng nhập hoặc mật khẩu không đúng.";

    case 403:
      return "Tài khoản của bạn đã bị vô hiệu hóa hoặc không có quyền đăng nhập.";

    case 404:
      return "Không tìm thấy tài khoản hoặc tài nguyên yêu cầu.";

    case 500:
      return "Máy chủ đang gặp lỗi. Vui lòng thử lại sau.";

    default:
      return (
        error.response.data?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại."
      );
  }
};
