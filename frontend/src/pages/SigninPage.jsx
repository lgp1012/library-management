import { BookOpen } from "lucide-react";
import SigninForm from "../components/auth/SigninForm.jsx";
import Header from "../components/Header.jsx";

export default function SigninPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Header />

      <main className="mx-auto grid max-w-350 gap-20 lg:grid-cols-[1.35fr_0.9fr]">
        <section className=" bg-linear-to-b from-slate-100 px-6 py-8 sm:px-10 lg:px-12">
          <p className="mb-2 text-3xl font-semibold text-sky-950">
            Chào mừng bạn đến với
          </p>
          <h2 className="mb-3 text-4xl font-extrabold uppercase tracking-wide text-sky-950">
            THƯ VIỆN PPNNT
          </h2>

          <div className="relative mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="absolute -left-24 top-16 h-48 w-48 rounded-full bg-blue-100 blur-2xl" />
            <div className="absolute -right-24 bottom-6 h-48 w-48 rounded-full bg-cyan-100 blur-2xl" />

            <div className="relative mx-auto flex h-80 max-w-3xl items-center justify-center rounded-2xl border border-blue-100 bg-linear-to-b from-slate-50 to-blue-50">
              <div className="text-center">
                <BookOpen className="mx-auto mb-4 h-14 w-14 text-blue-600" />
                <p className="text-lg font-semibold text-slate-800">
                  Khu vực minh họa hệ thống dashboard thư viện
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Bạn có thể thay bằng ảnh thật trong src/assets/images
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-500">
            © 2026 Hệ thống quản lý thư viện. Tất cả quyền được bảo lưu.
          </p>
        </section>

        <section className="flex items-center justify-center bg-slate-50 px-4 py-8 sm:px-8 lg:px-10">
          <SigninForm />
        </section>
      </main>
    </div>
  );
}
