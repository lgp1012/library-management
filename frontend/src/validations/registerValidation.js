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
  return null;
};

const passwordValidation = (password) => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  return null;
};

const confirmPasswordValidation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return "Confirm Password is required";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
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
