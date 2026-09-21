import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isTechnician = user?.role === "technician";
  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  const dashboardPath = isTechnician
    ? "/technician/dashboard"
    : isAdmin
      ? "/admin/dashboard"
      : "/dashboard";

  const logoPath = isTechnician || isAdmin ? dashboardPath : "/";

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNavClick = (path) => {
    if (location.pathname === path) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const navLinkClass = ({ isActive }) =>
    `relative flex h-full items-center text-sm font-medium transition ${
      isActive
        ? "text-gray-950 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-emerald-500"
        : "text-gray-600 hover:text-emerald-600"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-emerald-50 text-emerald-700"
        : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to={logoPath}
          onClick={() => {
            closeMobileMenu();
            handleNavClick(logoPath);
          }}
          className="shrink-0 text-[26px] font-bold tracking-tight text-gray-950 transition hover:opacity-90"
          aria-label="FixBuddy home"
        >
          Fix<span className="text-emerald-600">Buddy</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden h-full items-center gap-8 lg:flex">

          {isTechnician ? (
            <NavLink
              to="/technician/dashboard"
              onClick={() => handleNavClick("/technician/dashboard")}
              className={navLinkClass}
            >
              Dashboard
            </NavLink>
          ) : isAdmin ? (
            <>
              <NavLink
                to="/admin/dashboard"
                onClick={() => handleNavClick("/admin/dashboard")}
                className={navLinkClass}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/technicians"
                onClick={() => handleNavClick("/admin/technicians")}
                className={navLinkClass}
              >
                Manage Technicians
              </NavLink>

              <NavLink
                to="/admin/services"
                onClick={() => handleNavClick("/admin/services")}
                className={navLinkClass}
              >
                Manage Services
              </NavLink>

              <NavLink
                to="/admin/admins"
                onClick={() => handleNavClick("/admin/admins")}
                className={navLinkClass}
              >
                Manage Admins
              </NavLink>

              <NavLink
                to="/admin/technicians/new"
                onClick={() => handleNavClick("/admin/technicians/new")}
                className={navLinkClass}
              >
                Add Technician
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/"
                end
                onClick={() => handleNavClick("/")}
                className={navLinkClass}
              >
                Home
              </NavLink>

              <NavLink
                to="/services"
                onClick={() => handleNavClick("/services")}
                className={navLinkClass}
              >
                Services
              </NavLink>

              {isCustomer && (
                <NavLink
                  to="/dashboard"
                  onClick={() => handleNavClick("/dashboard")}
                  className={navLinkClass}
                >
                  Dashboard
                </NavLink>
              )}

              <Link
                to="/#how-it-works"
                className="flex h-full items-center text-sm font-medium text-gray-600 transition hover:text-emerald-600"
              >
                How It Works
              </Link>

              <Link
                to="/#about"
                className="flex h-full items-center text-sm font-medium text-gray-600 transition hover:text-emerald-600"
              >
                About
              </Link>
            </>
          )}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              {/* User */}
              <div className="flex items-center gap-2.5 px-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="leading-tight">
                  <p className="text-sm font-semibold text-gray-800">
                    Hi, {user?.name?.split(" ")[0] || "User"}
                  </p>

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                    {user?.role || "user"}
                  </p>
                </div>
              </div>

              <div className="mx-1 h-7 w-px bg-gray-200" />

              <button
                type="button"
                onClick={logout}
                className="rounded-full px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-red-50 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
              >
                Register
              </Link>
            </>
          )}

          {/* Customer CTA */}
          {isCustomer && (
            <Link
              to="/services"
              className="ml-1 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
            >
              Book a Service
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="rounded-xl p-2 text-gray-700 transition hover:bg-gray-100 lg:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="h-6 w-6"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white shadow-lg lg:hidden">
          <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-1.5">

              {isTechnician ? (
                <NavLink
                  to="/technician/dashboard"
                  onClick={() => {
                    handleNavClick("/technician/dashboard");
                    closeMobileMenu();
                  }}
                  className={mobileNavLinkClass}
                >
                  Dashboard
                </NavLink>
              ) : isAdmin ? (
                <>
                  <NavLink
                    to="/admin/dashboard"
                    onClick={() => {
                      handleNavClick("/admin/dashboard");
                      closeMobileMenu();
                    }}
                    className={mobileNavLinkClass}
                  >
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/admin/technicians"
                    onClick={() => {
                      handleNavClick("/admin/technicians");
                      closeMobileMenu();
                    }}
                    className={mobileNavLinkClass}
                  >
                    Manage Technicians
                  </NavLink>

                  <NavLink
                    to="/admin/services"
                    onClick={() => {
                      handleNavClick("/admin/services");
                      closeMobileMenu();
                    }}
                    className={mobileNavLinkClass}
                  >
                    Manage Services
                  </NavLink>

                  <NavLink
                    to="/admin/admins"
                    onClick={() => {
                      handleNavClick("/admin/admins");
                      closeMobileMenu();
                    }}
                    className={mobileNavLinkClass}
                  >
                    Manage Admins
                  </NavLink>

                  <NavLink
                    to="/admin/technicians/new"
                    onClick={() => {
                      handleNavClick("/admin/technicians/new");
                      closeMobileMenu();
                    }}
                    className={mobileNavLinkClass}
                  >
                    Add Technician
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/"
                    end
                    onClick={() => {
                      handleNavClick("/");
                      closeMobileMenu();
                    }}
                    className={mobileNavLinkClass}
                  >
                    Home
                  </NavLink>

                  <NavLink
                    to="/services"
                    onClick={() => {
                      handleNavClick("/services");
                      closeMobileMenu();
                    }}
                    className={mobileNavLinkClass}
                  >
                    Services
                  </NavLink>

                  {isCustomer && (
                    <NavLink
                      to="/dashboard"
                      onClick={() => {
                        handleNavClick("/dashboard");
                        closeMobileMenu();
                      }}
                      className={mobileNavLinkClass}
                    >
                      Dashboard
                    </NavLink>
                  )}

                  <Link
                    to="/#how-it-works"
                    onClick={closeMobileMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-emerald-600"
                  >
                    How It Works
                  </Link>

                  <Link
                    to="/#about"
                    onClick={closeMobileMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-emerald-600"
                  >
                    About
                  </Link>
                </>
              )}
            </div>

            <div className="my-4 h-px bg-gray-100" />

            {/* Mobile Auth */}
            {isAuthenticated ? (
              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user?.name || "User"}
                    </p>

                    <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                      {user?.role || "user"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="mt-4 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-left text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Customer CTA */}
            {isCustomer && (
              <Link
                to="/services"
                onClick={closeMobileMenu}
                className="mt-4 block rounded-xl bg-emerald-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Book a Service
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;