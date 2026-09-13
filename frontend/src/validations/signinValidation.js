const usernameValidation = (username) => {
  if (!username) {
    return "Tên đăng nhập không được để trống";
  }

  if (username === "admin") {
    return null; // Allow "admin" as a valid username without further validation
  }

  if (username.length < 5) {
    return "Tên đăng nhập phải có ít nhất 5 ký tự";
  }
  return null;
};

const passwordValidation = (password) => {
  if (!password) {
    return "Mật khẩu không được để trống";
  }

  if (password === "admin") {
    return null; // Allow "admin" as a valid password without further validation
  }

  if (password.length < 6) {
    return "Mật khẩu phải có ít nhất 6 ký tự";
  }

  return null;
};

export { passwordValidation, usernameValidation };
