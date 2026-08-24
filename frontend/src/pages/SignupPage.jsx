import { Link } from "react-router-dom";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <section className="rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-sky-950">Đăng ký tài khoản</h1>

        <Link
          to="/signin"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800"
        >
          Quay lại đăng nhập
        </Link>
      </section>
    </main>
  );
}
