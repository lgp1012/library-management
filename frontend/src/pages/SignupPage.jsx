import signinIllustration from "../assets/images/signinup_page_pic.png";
import SignupForm from "../components/auth/SignupForm.jsx";
import Footer from "../components/Footer.jsx";
import Header from "../components/header/AuthHeader.jsx";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header authAction="signup" />

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
          <SignupForm />
        </section>
      </main>

      <Footer />
    </div>
  );
}
