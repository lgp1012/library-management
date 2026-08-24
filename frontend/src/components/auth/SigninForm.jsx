import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  emailValidation,
  passwordValidation,
} from "../../validations/loginValidation";

const SigninForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: null,
    password: null,
  });

  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    let errorMessage = null;

    if (name === "email") {
      errorMessage = emailValidation(value);
    }

    if (name === "password") {
      errorMessage = passwordValidation(value);
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
    const passwordError = passwordValidation(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (!emailError && !passwordError) {
      // Proceed with form submission (e.g., API call)
      console.log("Form submitted:", formData);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-4xl shadow-md ">
      <h2 className="mb-6 text-2xl font-bold text-slate-800 text-center">
        Đăng nhập
      </h2>
      <p className="mb-6 text-xs text-slate-600 text-center">
        Vui lòng nhập thông tin đăng nhập của bạn để tiếp tục.
      </p>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-semibold text-slate-700"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="email"
              id="email"
              value={email}
              placeholder="Nhập email của bạn"
              onChange={handleChange}
              onBlur={handleChange}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-semibold text-slate-700"
          >
            Mật khẩu
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={password}
              placeholder="Nhập mật khẩu của bạn"
              onChange={handleChange}
              onBlur={handleChange}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              name="remember"
              id="remember"
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            {"Ghi nhớ đăng nhập"}
          </label>
          <button
            type="button"
            className="text-sm font-medium text-blue-700 transition hover:text-blue-800"
          >
            {"Quên mật khẩu?"}
          </button>
        </div>

        <button
          className="w-full bg-sky-900 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg"
          type="submit"
        >
          {"Đăng nhập"}
        </button>

        <div className="pt-1 text-center text-sm text-slate-500">
          Chưa có tài khoản?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Đăng ký ngay
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SigninForm;
