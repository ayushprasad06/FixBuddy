import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMyTechnicianBookings } from "../services/bookingService";
import { useAuth } from "../hooks/useAuth";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  assigned: "bg-blue-50 text-blue-700",
  "in-progress": "bg-indigo-50 text-indigo-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

const formatStatus = (status) => {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

function TechnicianDashboard() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyTechnicianBookings();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch bookings");
        }

        setBookings(data.bookings || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load assigned bookings",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter((booking) => {
        if (statusFilter === "all") {
          return true;
        }

        return booking.status === statusFilter;
      });
  }, [bookings, statusFilter]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              Technician Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Welcome back, {user?.name?.split(" ")[0] || "Technician"}
            </h1>

            <p className="mt-2 text-gray-600">
              View and manage your assigned service jobs.
            </p>
          </div>

          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold text-gray-950">
                Assigned Jobs
              </h2>

              {!loading && !error && bookings.length > 0 && (
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="status-filter"
                    className="text-sm font-medium text-gray-600"
                  >
                    Filter
                  </label>

                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="all">All Jobs</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}
            </div>

            {loading && (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center">
                <p className="text-gray-500">Loading your jobs...</p>
              </div>
            )}

            {!loading && error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
                <p className="font-medium text-red-700">{error}</p>
              </div>
            )}

            {!loading && !error && bookings.length === 0 && (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
                  🔧
                </div>

                <h3 className="mt-4 text-lg font-semibold text-gray-950">
                  No assigned jobs
                </h3>

                <p className="mt-2 text-gray-500">
                  New jobs assigned to you will appear here.
                </p>
              </div>
            )}

            {!loading &&
              !error &&
              bookings.length > 0 &&
              filteredBookings.length === 0 && (
                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                    📋
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-gray-950">
                    No {formatStatus(statusFilter).toLowerCase()} jobs
                  </h3>

                  <p className="mt-2 text-gray-500">
                    There are no jobs with this status.
                  </p>

                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className="mt-6 inline-flex rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-emerald-600 hover:text-emerald-600"
                  >
                    View All Jobs
                  </button>
                </div>
              )}

            {!loading &&
              !error &&
              filteredBookings.length > 0 && (
                <div className="mt-6 space-y-5">
                  {filteredBookings.map((booking) => (
                    <article
                      key={booking._id}
                      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                            {booking.service?.icon || "🔧"}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-xl font-bold text-gray-950">
                                {booking.service?.name || "Service"}
                              </h3>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  statusStyles[booking.status] ||
                                  "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {formatStatus(booking.status)}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-gray-500">
                              {booking.service?.category || "Home Service"}
                            </p>
                          </div>
                        </div>

                        <div className="text-left lg:text-right">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Base Price
                          </p>

                          <p className="mt-1 text-2xl font-bold text-gray-950">
                            ₹{booking.price}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Customer
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {booking.customer?.name || "Customer"}
                          </p>

                          {booking.customer?.phone && (
                            <a
                              href={`tel:${booking.customer.phone}`}
                              className="mt-1 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
                            >
                              📞 {booking.customer.phone}
                            </a>
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Scheduled
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {formatDate(booking.scheduledDate)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Address
                          </p>

                          <p className="mt-1 text-sm font-medium leading-6 text-gray-800">
                            {booking.address}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Duration
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {booking.service?.duration || "Not specified"}
                          </p>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-6 border-t border-gray-100 pt-6">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Customer Problem / Notes
                          </p>

                          <p className="mt-2 leading-6 text-gray-700">
                            {booking.notes}
                          </p>
                        </div>
                      )}

                      <div className="mt-6 flex justify-end border-t border-gray-100 pt-6">
                        <Link
                          to={`/technician/bookings/${booking._id}`}
                          className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-emerald-600 hover:text-emerald-600"
                        >
                          View Details
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
          </div>
        </section>
      </main>
    </>
  );
}

export default TechnicianDashboard;