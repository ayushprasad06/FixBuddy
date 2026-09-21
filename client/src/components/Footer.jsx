import { Link } from "react-router-dom";

function Footer() {
  const linkedInUrl = "https://www.linkedin.com/in/ayushprasad2006";
  const githubUrl = "https://github.com/ayushprasad06?tab=repositories";

  return (
    <footer className="border-t border-gray-800 bg-gray-950 text-white">

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight"
            >
              Fix<span className="text-emerald-400">Buddy</span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-gray-400">
              Your trusted platform for everyday home repairs,
              maintenance and professional services.
            </p>

            <p className="mt-6 text-sm text-gray-500">
              Making home services simpler, one booking at a time.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold">
              Company
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                to="/"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                Home
              </Link>

              <a
                href="#about"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                About
              </a>

              <a
                href="#how-it-works"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                How It Works
              </a>

              <Link
                to="/services"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                Services
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold">
              Support
            </h3>

            <div className="mt-5 space-y-3">
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                Help Center
              </a>

              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                Contact Us
              </a>

              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                Privacy Policy
              </a>

              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                Terms of Service
              </a>
            </div>
          </div>

        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-gray-800 pt-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © 2026 FixBuddy. All rights reserved.
          </p>

          <p>
            Built with{" "}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              React
            </a>
            {" · "}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              Node.js
            </a>
            {" · "}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              Express
            </a>
            {" · "}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              MongoDB
            </a>
            {" ― "}
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              By Ayush Prasad
            </a>
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;