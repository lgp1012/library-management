import {
  Eye,
  EyeOff,
  Loader,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  UserCircle,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import {
  confirmPasswordValidation,
  emailValidation,
  passwordValidation,
  phoneValidation,
  usernameValidation,
} from "../../validations/signupValidation";

const SignupForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    readerName: "",
    phoneNumber: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errorsValidation, setErrorsValidation] = useState({});
  const [errorAPI, setErrorAPI] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    readerName,
    phoneNumber,
    email,
    username,
    password,
    confirmPassword,
  } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    let errorMessage = null;

    switch (name) {
      case "readerName":
        errorMessage =
          value.trim().length === 0 ? "Họ và tên không được để trống" : null;
        break;
      case "phoneNumber":
        errorMessage = value ? phoneValidation(value) : null;
        break;
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

    setErrorsValidation((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const readerNameError =
      readerName.trim().length === 0 ? "Họ và tên không được để trống" : null;
    const phoneError = phoneNumber ? phoneValidation(phoneNumber) : null;
    const emailError = emailValidation(email);
    const usernameError = usernameValidation(username);
    const passwordError = passwordValidation(password);
    const confirmPasswordError = confirmPasswordValidation(
      password,
      confirmPassword,
    );

    setErrorsValidation({
      readerName: readerNameError,
      phoneNumber: phoneError,
      email: emailError,
      username: usernameError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    if (
      readerNameError ||
      phoneError ||
      emailError ||
      usernameError ||
      passwordError ||
      confirmPasswordError
    ) {
      return;
    }

    setLoading(true);
    try {
      await authService.signup({
        readerName,
        phoneNumber,
        email,
        username,
        password,
      });
      navigate("/signin");
    } catch (error) {
      setErrorAPI(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-4xl shadow-md ">
      <h2 className="mb-6 text-center text-2xl font-bold text-slate-800">
        Đăng ký thẻ Độc giả
      </h2>
      <p className="mb-6 text-center text-sm text-slate-600">
        Tạo tài khoản mới để bắt đầu sử dụng hệ thống thư viện.
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="reader-name-field">
          <label
            htmlFor="readerName"
            className="mb-1 block text-sm font-semibold text-slate-700"
          >
            Họ và tên
            <span className="required text-red-500">*</span>
          </label>
          <div className="relative">
            <UserCircle className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="readerName"
              id="readerName"
              value={readerName}
              placeholder="Nguyễn Văn A"
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          {errorsValidation.readerName && (
            <p className="text-red-500 text-sm">
              {errorsValidation.readerName}
            </p>
          )}
        </div>

        <div className="phone-field">
          <label
            htmlFor="phoneNumber"
            className="mb-1 block text-sm font-semibold text-slate-700"
          >
            Số điện thoại
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              value={phoneNumber}
              placeholder="0912345678"
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          {errorsValidation.phoneNumber && (
            <p className="text-red-500 text-sm">
              {errorsValidation.phoneNumber}
            </p>
          )}
        </div>

        <div className="email-field">
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-semibold text-slate-700"
          >
            Email
            <span className="required text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              placeholder="example@gmail.com"
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          {errorsValidation.email && (
            <p className="text-red-500 text-sm">{errorsValidation.email}</p>
          )}
        </div>

        <div className="username-field">
          <label
            htmlFor="username"
            className="mb-1 block text-sm font-semibold text-slate-700"
          >
            Tên đăng nhập
            <span className="required text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="username"
              id="username"
              placeholder="example123"
              required
              value={username}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          {errorsValidation.username && (
            <p className="text-red-500 text-sm">{errorsValidation.username}</p>
          )}
        </div>

        <div className="password-field">
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-semibold text-slate-700"
          >
            Mật khẩu
            <span className="required text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
          {errorsValidation.password && (
            <p className="text-red-500 text-sm">{errorsValidation.password}</p>
          )}
        </div>

        <div className="confirm-password-field">
          <label
            htmlFor="confirm-password"
            className="mb-1 block text-sm font-semibold text-slate-700 "
          >
            Xác nhận mật khẩu
            <span className="required text-red-500">*</span>
          </label>
          <div className="relative">
            <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirm-password"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errorsValidation.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errorsValidation.confirmPassword}
            </p>
          )}
        </div>

        {errorAPI && <p className="text-red-500 text-sm">{errorAPI}</p>}
        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-900 px-4 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader className="h-4 w-4" />
            </span>
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          Đăng ký Thẻ Độc giả
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
