import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

function ServiceDetails() {
  const { slug } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/services/${slug}`);
        const data = response.data;

        setService(data.service);
      } catch (error) {
        console.error(error);
        setError("We couldn't find this service.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-500">Loading service...</p>
        </div>

        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-950">
            Service not found
          </h1>

          <p className="mt-4 text-gray-500">
            The service you're looking for doesn't exist.
          </p>

          <Link
            to="/services"
            className="mt-7 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white"
          >
            Browse Services
          </Link>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="bg-gray-950">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
            <Link
              to="/services"
              className="text-sm font-medium text-gray-400 transition hover:text-white"
            >
              ← Back to services
            </Link>

            <div className="mt-10 grid items-center gap-16 lg:grid-cols-2">
              <div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl">
                  {service.icon}
                </div>

                <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  FixBuddy service
                </p>

                <h1 className="mt-4 text-5xl font-bold tracking-tight text-white sm:text-6xl">
                  {service.name}
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
                  {service.description}
                </p>
              </div>

              {/* Booking summary */}
              <div className="rounded-3xl bg-white p-7 shadow-2xl">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Service details
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-gray-50 p-5">
                    <p className="text-xs text-gray-400">
                      Starting price
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-950">
                      ₹{service.price ?? service.basePrice}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-5">
                    <p className="text-xs text-gray-400">
                      Estimated duration
                    </p>

                    <p className="mt-2 text-lg font-bold text-gray-950">
                      {service.duration ?? service.estimatedDuration}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-6">
                  <p className="text-sm leading-6 text-gray-500">
                    Final pricing may vary depending on the actual work
                    required. You'll be shown the booking details before
                    confirmation.
                  </p>
                </div>

                <Link
                  to={`/book/${service.slug}`}
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-emerald-600 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Book This Service
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                What you get
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-950">
                Professional service, without the hassle.
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Every FixBuddy booking is designed to make getting
                professional help simple and transparent.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 p-6">
                <div className="text-2xl">✓</div>

                <h3 className="mt-4 font-bold text-gray-950">
                  Verified professionals
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Get connected with professionals registered on
                  the FixBuddy platform.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 p-6">
                <div className="text-2xl">₹</div>

                <h3 className="mt-4 font-bold text-gray-950">
                  Transparent pricing
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  See the starting price and booking details before
                  confirming your request.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 p-6">
                <div className="text-2xl">★</div>

                <h3 className="mt-4 font-bold text-gray-950">
                  Customer reviews
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Review your technician after the service is completed.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ServiceDetails;