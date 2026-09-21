import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import {
  assignTechnician,
  getAllBookings,
  getTechnicians,
} from "../services/adminService";

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

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [assigningId, setAssigningId] = useState(null);
  const [selectedTechnicians, setSelectedTechnicians] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [bookingData, technicianData] = await Promise.all([
        getAllBookings(),
        getTechnicians(),
      ]);

      if (!bookingData.success) {
        throw new Error(
          bookingData.message || "Failed to load bookings",
        );
      }

      if (!technicianData.success) {
        throw new Error(
          technicianData.message || "Failed to load technicians",
        );
      }

      setBookings(bookingData.bookings || []);
      setTechnicians(technicianData.technicians || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load admin dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  const handleTechnicianChange = (bookingId, technicianId) => {
    setSelectedTechnicians((previous) => ({
      ...previous,
      [bookingId]: technicianId,
    }));
  };

  const handleAssign = async (bookingId) => {
    const technicianId = selectedTechnicians[bookingId];

    if (!technicianId) {
      return;
    }

    try {
      setAssigningId(bookingId);
      setError("");

      const data = await assignTechnician(bookingId, technicianId);

      if (!data.success) {
        throw new Error(data.message || "Failed to assign technician");
      }

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId ? data.booking : booking,
        ),
      );

      setSelectedTechnicians((previous) => ({
        ...previous,
        [bookingId]: "",
      }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to assign technician",
      );
    } finally {
      setAssigningId(null);
    }
  };

  const getCompatibleTechnicians = (booking) => {
    return technicians.filter((technician) => {
      const supportsService = technician.services?.some(
        (service) =>
          service._id === booking.service?._id ||
          service === booking.service?._id,
      );

      return technician.isAvailable && supportsService;
    });
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              Admin Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Booking Management
            </h1>

            <p className="mt-2 text-gray-600">
              Review bookings and assign available technicians.
            </p>
          </div>

          {loading && (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-gray-500">Loading bookings...</p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="font-medium text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && bookings.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
                📋
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-950">
                No bookings yet
              </h2>

              <p className="mt-2 text-gray-500">
                Customer bookings will appear here.
              </p>
            </div>
          )}

          {!loading && !error && bookings.length > 0 && (
            <>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold text-gray-950">
                  All Bookings
                </h2>

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
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="all">All Bookings</option>
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {filteredBookings.length === 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                    📋
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-gray-950">
                    No {formatStatus(statusFilter).toLowerCase()} bookings
                  </h3>

                  <p className="mt-2 text-gray-500">
                    There are no bookings with this status.
                  </p>

                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className="mt-6 inline-flex rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-emerald-600 hover:text-emerald-600"
                  >
                    View All Bookings
                  </button>
                </div>
              )}

              {filteredBookings.length > 0 && (
                <div className="space-y-5">
                  {filteredBookings.map((booking) => {
                    const compatibleTechnicians =
                      getCompatibleTechnicians(booking);

                    return (
                      <article
                        key={booking._id}
                        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                              {booking.service?.icon || "🔧"}
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-xl font-bold text-gray-950">
                                  {booking.service?.name || "Service"}
                                </h2>

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
                                {booking.service?.category ||
                                  "Home Service"}
                              </p>
                            </div>
                          </div>

                          <div className="lg:text-right">
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

                            <p className="mt-1 font-semibold text-gray-900">
                              {booking.customer?.name || "Customer"}
                            </p>

                            {booking.customer?.phone && (
                              <a
                                href={`tel:${booking.customer.phone}`}
                                className="mt-1 inline-block text-sm text-emerald-600"
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

                            <p className="mt-1 text-sm leading-6 text-gray-800">
                              {booking.address}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Technician
                            </p>

                            <p className="mt-1 text-sm font-semibold text-gray-800">
                              {booking.technician?.user?.name ||
                                "Not Assigned"}
                            </p>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="mt-6 border-t border-gray-100 pt-6">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Customer Problem
                            </p>

                            <p className="mt-2 text-sm leading-6 text-gray-700">
                              {booking.notes}
                            </p>
                          </div>
                        )}

                        {(booking.status === "pending" ||
                          booking.status === "assigned") && (
                          <div className="mt-6 border-t border-gray-100 pt-6">
                            <p className="text-sm font-semibold text-gray-900">
                              {booking.status === "assigned"
                                ? "Reassign Technician"
                                : "Assign Technician"}
                            </p>

                            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                              <select
                                value={
                                  selectedTechnicians[booking._id] || ""
                                }
                                onChange={(event) =>
                                  handleTechnicianChange(
                                    booking._id,
                                    event.target.value,
                                  )
                                }
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:max-w-md"
                              >
                                <option value="">
                                  Select technician
                                </option>

                                {compatibleTechnicians.map(
                                  (technician) => (
                                    <option
                                      key={technician._id}
                                      value={technician._id}
                                    >
                                      {technician.user?.name ||
                                        "Technician"}{" "}
                                      — {technician.experience || 0} yrs
                                    </option>
                                  ),
                                )}
                              </select>

                              <button
                                type="button"
                                onClick={() =>
                                  handleAssign(booking._id)
                                }
                                disabled={
                                  !selectedTechnicians[booking._id] ||
                                  assigningId === booking._id
                                }
                                className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {assigningId === booking._id
                                  ? "Assigning..."
                                  : "Assign"}
                              </button>
                            </div>

                            {compatibleTechnicians.length === 0 && (
                              <p className="mt-3 text-sm text-amber-600">
                                No available technician supports this
                                service.
                              </p>
                            )}
                          </div>
                        )}

                        {booking.rejectionHistory?.length > 0 && (
                          <div className="mt-6 rounded-xl bg-amber-50 p-4">
                            <p className="text-sm font-semibold text-amber-800">
                              Previous Rejections
                            </p>

                            <div className="mt-3 space-y-3">
                              {booking.rejectionHistory.map(
                                (rejection, index) => (
                                  <div
                                    key={rejection._id || index}
                                    className="text-sm"
                                  >
                                    <p className="font-medium text-gray-800">
                                      {rejection.technician?.user?.name ||
                                        "Technician"}
                                    </p>

                                    <p className="mt-1 text-amber-700">
                                      {rejection.reason}
                                    </p>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}

export default AdminDashboard;