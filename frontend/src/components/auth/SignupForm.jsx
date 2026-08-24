import { useState } from "react";
import {
  confirmPasswordValidation,
  emailValidation,
  passwordValidation,
  phoneValidation,
  usernameValidation,
} from "../../validations/registerValidation";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    email: null,
    username: null,
    password: null,
    confirmPassword: null,
    phone: null,
  });

  const { email, username, password, confirmPassword, phone } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    let errorMessage = null;

    switch (name) {
      case "email":
        errorMessage = emailValidation(value);
        break;
      case "username":
        errorMessage = usernameValidation(value);
        break;
      case "password":
        errorMessage = passwordValidation(value);
        break;
      case "confirmPassword":
        errorMessage = confirmPasswordValidation(password, value);
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    const emailError = emailValidation(email);
    const usernameError = usernameValidation(username);
    const passwordError = passwordValidation(password);
    const confirmPasswordError = confirmPasswordValidation(
      password,
      confirmPassword,
    );
    const phoneError = phoneValidation(phone);

    setErrors({
      email: emailError,
      username: usernameError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      phone: phoneError,
    });

    if (
      emailError ||
      usernameError ||
      passwordError ||
      confirmPasswordError ||
      phoneError
    ) {
      // Handle validation errors (e.g., display error messages)
      console.log("Validation errors:", {
        emailError,
        usernameError,
        passwordError,
        confirmPasswordError,
        phoneError,
      });
    }
  };

  return (
    <div>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="email-field">
          <label htmlFor="email">
            {"Email"}
            <span className="required">*</span>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="example@gmail.com"
              required
              value={email}
              onChange={handleChange}
              onBlur={handleChange}
            />
          </label>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="username-field">
          <label htmlFor="username">
            {"Tên đăng nhập"}
            <span className="required">*</span>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="example123"
              required
              value={username}
              onChange={handleChange}
              onBlur={handleChange}
            />
          </label>
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>

        <div className="password-field">
          <label htmlFor="password">
            {"Mật khẩu"}
            <span className="required">*</span>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={handleChange}
            />
          </label>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <div className="confirm-password-field">
          <label htmlFor="confirm-password">
            {"Xác nhận mật khẩu"}
            <span className="required">*</span>
            <input
              type="password"
              name="confirmPassword"
              id="confirm-password"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={handleChange}
            />
          </label>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="phone-field">
          <label htmlFor="phone">
            {"Số điện thoại"}
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="0123456789"
              value={phone}
              onChange={handleChange}
            />
          </label>
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        <button type="submit" className="signup-btn">
          {"Đăng ký"}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
