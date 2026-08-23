import { useState } from "react";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const { email, username, password, confirmPassword, phone } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
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
            />
          </label>
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
            />
          </label>
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
        </div>

        <button type="submit" className="signup-btn">
          {"Đăng ký"}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
