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

export { passwordValidation, usernameValidation };
