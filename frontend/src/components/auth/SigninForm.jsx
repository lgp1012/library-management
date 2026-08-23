import { useState } from "react";
import loginValidation from "../../validations/loginValidation.js";

const SigninForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { username, password } = formData;

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

  const errors = loginValidation(formData);

  return (
    <div className="pd-4">
      <form className="p-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">
            {"Tên đăng nhập"}
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              placeholder="example123"
              onChange={handleChange}
            />
          </label>
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>
        <div>
          <label htmlFor="password">
            {"Mật khẩu"}
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              placeholder="••••••••"
              onChange={handleChange}
            />
          </label>
        </div>

        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          type="submit"
        >
          {"Đăng nhập"}
        </button>
      </form>
    </div>
  );
};

export default SigninForm;
