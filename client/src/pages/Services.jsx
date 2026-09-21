import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services");

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await response.json();

        setServices(data.services);
      } catch (error) {
        console.error(error);
        setError("Unable to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Header */}
        <section className="border-b border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              FixBuddy services
            </p>

            <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight text-gray-950 sm:text-6xl">
              What does your home need today?
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Choose a service, tell us what you need and we'll connect you
              with the right professional.
            </p>
          </div>
        </section>

        {/* Services */}
        <section>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            {loading && (
              <div className="flex min-h-64 items-center justify-center">
                <p className="text-gray-500">Loading services...</p>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                  >
                    {/* Icon */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                      {service.icon}
                    </div>

                    {/* Content */}
                    <h2 className="mt-6 min-h-14 text-2xl font-bold text-gray-950">
                      {service.name}
                    </h2>

                    <p className="mt-3 min-h-14 text-sm leading-6 text-gray-500">
                      {service.description}
                    </p>

                    {/* Details */}
                    <div className="mt-auto">
                      <div className="mt-6 flex min-h-20 items-center justify-between border-t border-gray-100 pt-5">
                        <div>
                          <p className="text-xs text-gray-400">
                            Starting from
                          </p>

                          <p className="mt-1 text-lg font-bold text-gray-950">
                            ₹{service.price}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            Duration
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-700">
                            {service.duration}
                          </p>
                        </div>
                      </div>

                      {/* Button */}
                      <Link
                        to={`/services/${service.slug}`}
                        className="mt-6 flex w-full items-center justify-center rounded-xl bg-gray-950 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                      >
                        View Service
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Services;