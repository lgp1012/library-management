const loginValidation = (formData) => {
  const errors = {};
  const usernameRegex = /\w{3,20}$/; // Phải có cả chữ và số, từ 3 đến 20 ký tự

  if (!formData.username) {
    errors.username = "Tên đăng nhập là bắt buộc";
  } else if (!usernameRegex.test(formData.username)) {
    errors.username = "Tên đăng nhập không hợp lệ";
  }
};

export default loginValidation;
