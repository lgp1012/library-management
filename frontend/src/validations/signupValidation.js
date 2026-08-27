const emailValidation = (email) => {
  if (!email) {
    return "Email không được để trống";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Email không hợp lệ";
  }

  return null;
};

const usernameValidation = (username) => {
  if (!username) {
    return "Tên đăng nhập không được để trống";
  }

  if (username.length < 8) {
    return "Tên đăng nhập phải có ít nhất 8 ký tự";
  }
  const usernameRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{8,20}$/;
  if (!usernameRegex.test(username)) {
    return "Tên đăng nhập phải có cả chữ và số";
  }
  return null;
};

const passwordValidation = (password) => {
  if (!password) {
    return "Mật khẩu không được để trống";
  }
  if (password.length < 6) {
    return "Mật khẩu phải có ít nhất 6 ký tự";
  }
  return null;
};

const confirmPasswordValidation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return "Xác nhận mật khẩu không được để trống";
  }
  if (password !== confirmPassword) {
    return "Mật khẩu xác nhận không khớp";
  }
  return null;
};

const phoneValidation = (phone) => {
  const phoneRegex = /^\d{10}$/; // Assuming a 10-digit phone number format

  if (!phone || !phoneRegex.test(phone)) {
    return "Số điện thoại không hợp lệ";
  }
  return null;
};

export {
  confirmPasswordValidation,
  emailValidation,
  passwordValidation,
  phoneValidation,
  usernameValidation,
};
