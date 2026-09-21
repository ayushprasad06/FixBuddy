import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ServiceCard from "../components/ServiceCard";
import StepCard from "../components/StepCard";
import TrustCard from "../components/TrustCard";
import Footer from "../components/Footer";
import heroImage from "../assets/hero.png";

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-white">
          {/* Soft background glow */}
          <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-emerald-50/70 blur-3xl" />
          <div className="pointer-events-none absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-emerald-50/40 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-6 sm:pb-10 sm:pt-8 lg:px-8 lg:pb-10 lg:pt-8">
            <div className="grid items-center gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-4">
              {/* ================= LEFT CONTENT ================= */}
              <div className="relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[11px]">
                    ✓
                  </span>
                  Trusted home services
                </div>

                {/* Heading */}
                <h1 className="mt-5 max-w-2xl text-5xl font-bold leading-[1.02] tracking-[-0.035em] text-gray-950 sm:text-6xl lg:text-[64px]">
                  Your home needs
                  <br />
                  fixing?
                  <span className="mt-1 block text-emerald-600">
                    We've got a Buddy
                    <br className="hidden sm:block" /> for that.
                  </span>
                </h1>

                {/* Description */}
                <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                  Book trusted professionals for repairs, maintenance and
                  everyday home services — quickly, reliably and at transparent
                  prices.
                </p>

                {/* CTA Buttons */}
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-4 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg"
                  >
                    <span>Book a Service</span>
                    <span className="text-base">→</span>
                  </Link>

                  <a
                    href="#services"
                    className="inline-flex items-center rounded-full border border-gray-300 bg-white px-7 py-4 text-sm font-semibold text-gray-800 transition duration-200 hover:-translate-y-0.5 hover:border-gray-400 hover:bg-gray-50"
                  >
                    Explore Services
                  </a>
                </div>

                {/* Trust indicators */}
                <div className="mt-7 grid max-w-xl grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4 sm:gap-x-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm text-emerald-600">
                      ✓
                    </div>

                    <span className="text-xs font-medium leading-4 text-gray-600">
                      Verified
                      <br />
                      professionals
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-600">
                      ₹
                    </div>

                    <span className="text-xs font-medium leading-4 text-gray-600">
                      Transparent
                      <br />
                      pricing
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm text-emerald-600">
                      ★
                    </div>

                    <span className="text-xs font-medium leading-4 text-gray-600">
                      Reliable
                      <br />
                      service
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm text-emerald-600">
                      ◷
                    </div>

                    <span className="text-xs font-medium leading-4 text-gray-600">
                      On-time
                      <br />
                      assistance
                    </span>
                  </div>
                </div>
              </div>

              {/* ================= RIGHT VISUAL ================= */}
              <div className="relative flex items-center justify-center lg:-mr-10">
                {/* Glow behind visual */}
                <div className="pointer-events-none absolute inset-10 rounded-full bg-emerald-100/60 blur-3xl" />

                {/* Hero image */}
                <div className="relative w-full max-w-[620px]">
                  <img
                    src={heroImage}
                    alt="FixBuddy professional technician"
                    className="relative z-10 h-auto w-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* ================= STATS ================= */}
            <div className="mt-5 border-t border-gray-100 pt-5 lg:mt-6 lg:pt-6">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-0">
                <div className="sm:border-r sm:border-gray-200 sm:pr-8">
                  <p className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
                    4.9<span className="text-emerald-500">★</span>
                  </p>

                  <p className="mt-1 text-xs text-gray-500">Customer rating</p>
                </div>

                <div className="sm:border-r sm:border-gray-200 sm:px-8">
                  <p className="text-2xl font-bold tracking-tight text-gray-950">
                    10K+
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Bookings completed
                  </p>
                </div>

                <div className="sm:border-r sm:border-gray-200 sm:px-8">
                  <p className="text-2xl font-bold tracking-tight text-gray-950">
                    500+
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Verified professionals
                  </p>
                </div>

                <div className="sm:pl-8">
                  <p className="text-2xl font-bold tracking-tight text-gray-950">
                    24/7
                  </p>

                  <p className="mt-1 text-xs text-gray-500">Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Services */}
        <section id="services" className="border-t border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Our services
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
                What can we fix today?
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                From everyday repairs to essential home maintenance, find the
                right professional for the job.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <ServiceCard
                icon="🔧"
                title="Plumbing"
                description="Leaks, taps, pipes, fittings and everyday plumbing repairs."
              />

              <ServiceCard
                icon="⚡"
                title="Electrical"
                description="Switches, wiring, fans, lights and electrical repairs."
              />

              <ServiceCard
                icon="❄️"
                title="AC & Cooling"
                description="AC repair, servicing, installation and maintenance."
              />

              <ServiceCard
                icon="🧹"
                title="Home Cleaning"
                description="Deep cleaning, regular cleaning and move-in services."
              />

              <ServiceCard
                icon="🛠️"
                title="Appliance Repair"
                description="Professional repair for everyday household appliances."
              />

              <ServiceCard
                icon="🎨"
                title="Painting"
                description="Interior painting, touch-ups and complete home makeovers."
              />
            </div>
          </div>
        </section>
        {/* How It Works */}
        <section id="how-it-works" className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              {/* Left */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  How it works
                </p>

                <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
                  Getting help shouldn't be complicated.
                </h2>

                <p className="mt-5 max-w-lg text-lg leading-8 text-gray-600">
                  Tell us what you need, choose a convenient time, and let a
                  verified FixBuddy handle the rest.
                </p>

                <Link
                  to="/services"
                  className="mt-8 inline-flex rounded-full bg-gray-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Find a Service
                </Link>
              </div>

              {/* Steps */}
              <div className="grid gap-10 sm:grid-cols-3">
                <StepCard
                  number="01"
                  icon="🔍"
                  title="Choose"
                  description="Browse our services and find exactly what your home needs."
                />

                <StepCard
                  number="02"
                  icon="📅"
                  title="Book"
                  description="Pick your preferred date and time and confirm your booking."
                />

                <StepCard
                  number="03"
                  icon="✨"
                  title="Relax"
                  description="A verified technician arrives and takes care of the job."
                />
              </div>
            </div>
          </div>
        </section>
        {/* Why FixBuddy */}
        <section id="about" className="border-y border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              {/* Left */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  Why FixBuddy
                </p>

                <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
                  Reliable help for the things that matter at home.
                </h2>

                <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
                  Finding someone to fix a problem shouldn't mean calling
                  multiple people, negotiating prices or wondering who will
                  actually show up.
                </p>

                <p className="mt-4 max-w-xl text-base leading-7 text-gray-500">
                  FixBuddy brings trusted professionals, simple booking and
                  transparent service management into one place.
                </p>

                <Link
                  to="/services"
                  className="mt-8 inline-flex rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Book your first service
                </Link>
              </div>

              {/* Stats */}
              <div className="grid gap-10 sm:grid-cols-2">
                <TrustCard
                  value="10K+"
                  label="Services completed"
                  description="Helping customers get everyday home problems sorted."
                />

                <TrustCard
                  value="500+"
                  label="Verified professionals"
                  description="Skilled technicians available across multiple services."
                />

                <TrustCard
                  value="4.9★"
                  label="Average customer rating"
                  description="Built around reliable service and customer feedback."
                />

                <TrustCard
                  value="24/7"
                  label="Support available"
                  description="Get help with bookings, services and your requests."
                />
              </div>
            </div>
          </div>
        </section>
        {/* Final CTA */}
        <section className="bg-gray-950">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Need a hand?
                </p>

                <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Let's get your home back in shape.
                </h2>

                <p className="mt-5 text-lg leading-8 text-gray-400">
                  Tell us what needs fixing and we'll help you find the right
                  professional for the job.
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-4">
                <Link
                  to="/services"
                  className="rounded-full bg-emerald-500 px-7 py-4 text-sm font-semibold text-white transition hover:bg-emerald-400"
                >
                  Book a Service
                </Link>

                <Link
                  to="/login"
                  className="rounded-full border border-gray-700 px-7 py-4 text-sm font-semibold text-white transition hover:border-gray-500"
                >
                  Create an Account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
