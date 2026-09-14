import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import signinIllustration from "../assets/images/signinup_page_pic.png";
import SigninForm from "../components/auth/SigninForm.jsx";
import Footer from "../components/Footer.jsx";
import Header from "../components/header/AuthHeader.jsx";
import ROLE_ROUTES from "../constants/roleRoutes.js";
import useAuth from "../hooks/useAuth.js";

export default function SigninPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user && !hasNavigated.current) {
      hasNavigated.current = true;
      const roleName = user.role?.roleName?.toUpperCase();
      navigate(ROLE_ROUTES[roleName] ?? "/", { replace: true });
    }
  }, [user, loading]);

  if (loading) {
    return <div>{"Loading..."}</div>;
  }
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header authAction="signin" />

      <main className="mx-auto grid w-full max-w-350 flex-1 items-center gap-20 lg:grid-cols-[1.35fr_0.9fr]">
        <section className="flex flex-col justify-center bg-linear-to-b from-slate-100 px-6 py-8 sm:px-10 lg:px-12">
          <p className="mb-2 text-3xl font-semibold text-sky-950">
            Chào mừng bạn đến với
          </p>

          <h2 className="mb-3 text-4xl font-extrabold uppercase tracking-wide text-sky-950">
            THƯ VIỆN PPNNT
          </h2>

          <img
            src={signinIllustration}
            alt="Signin Illustration"
            className=" w-full object-contain mix-blend-multiply"
          />
        </section>

        <section className="flex items-center justify-center bg-slate-50 px-4 py-8 sm:px-8 lg:min-h-[calc(100vh-3.5rem)] lg:px-10">
          <SigninForm />
        </section>
      </main>

      <Footer />
    </div>
  );
}
