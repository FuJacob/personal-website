import { Link } from "react-router-dom";

function Resume() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
      <p className="text-lg text-ink/80">
        email me at{" "}
        <a
          href="mailto:jjacobfu@gmail.com"
          className="font-semibold underline decoration-ink/30 underline-offset-4 transition-colors hover:text-ink"
        >
          jjacobfu@gmail.com
        </a>{" "}
        :)
      </p>
      <Link
        to="/"
        className="text-ink/60 underline decoration-transparent decoration-from-font underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
      >
        ← Back
      </Link>
    </main>
  );
}

export default Resume;
