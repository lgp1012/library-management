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

const passwordValidation = (password) => {
  if (!password) {
    return "Mật khẩu không được để trống";
  }

  if (password.length < 6) {
    return "Mật khẩu phải có ít nhất 6 ký tự";
  }

  return null;
};

export { emailValidation, passwordValidation };
