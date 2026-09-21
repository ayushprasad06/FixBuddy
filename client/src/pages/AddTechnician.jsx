import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  createTechnicianAccount,
} from "../services/adminService";
import api from "../services/api";

function AddTechnician() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    bio: "",
    experience: "",
    city: "",
    area: "",
    services: [],
    isAvailable: true,
    isVerified: true,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);

        const response = await api.get("/services");

        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to load services",
          );
        }

        setServices(response.data.services || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load services",
        );
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleServiceToggle = (serviceId) => {
    setForm((previous) => {
      const alreadySelected = previous.services.includes(serviceId);

      return {
        ...previous,
        services: alreadySelected
          ? previous.services.filter((id) => id !== serviceId)
          : [...previous.services, serviceId],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (form.services.length === 0) {
      setError("Select at least one service.");
      return;
    }

    try {
      setSubmitting(true);

      const data = await createTechnicianAccount({
        ...form,
        experience: Number(form.experience) || 0,
      });

      if (!data.success) {
        throw new Error(
          data.message || "Failed to create technician",
        );
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create technician",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
          <Link
            to="/admin/dashboard"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                Technician Management
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                Add Technician
              </h1>

              <p className="mt-2 text-gray-600">
                Create a technician account and assign the services they can
                handle.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="text-lg font-bold text-gray-950">
                  Account Information
                </h2>

                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ram Kumar"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="ram@fixbuddy.com"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Phone
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="9876501235"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Password
                    </label>

                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      minLength={6}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-lg font-bold text-gray-950">
                  Professional Information
                </h2>

                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="experience"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Experience (Years)
                    </label>

                    <input
                      id="experience"
                      name="experience"
                      type="number"
                      min="0"
                      value={form.experience}
                      onChange={handleChange}
                      placeholder="5"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="text-sm font-semibold text-gray-700"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Vellore"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="area"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Area
                    </label>

                    <input
                      id="area"
                      name="area"
                      type="text"
                      value={form.area}
                      onChange={handleChange}
                      placeholder="Katpadi"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bio"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Bio
                    </label>

                    <input
                      id="bio"
                      name="bio"
                      type="text"
                      value={form.bio}
                      onChange={handleChange}
                      placeholder="Experienced home service technician"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-lg font-bold text-gray-950">
                  Services
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Select the services this technician can handle.
                </p>

                {loadingServices ? (
                  <p className="mt-4 text-sm text-gray-500">
                    Loading services...
                  </p>
                ) : (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {services.map((service) => {
                      const selected = form.services.includes(service._id);

                      return (
                        <button
                          key={service._id}
                          type="button"
                          onClick={() => handleServiceToggle(service._id)}
                          className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                            selected
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <span className="text-2xl">
                            {service.icon || "🔧"}
                          </span>

                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {service.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {service.category}
                            </p>
                          </div>

                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded border text-xs ${
                              selected
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-gray-300"
                            }`}
                          >
                            {selected ? "✓" : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-950">
                      Technician Status
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Available technicians can be assigned to bookings.
                    </p>
                  </div>

                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={form.isAvailable}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      Available for jobs
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-6">
                <Link
                  to="/admin/dashboard"
                  className="rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={submitting || loadingServices}
                  className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Creating..." : "Create Technician"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

export default AddTechnician;