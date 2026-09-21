import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  addAdditionalCharge,
  getMyTechnicianBookings,
  rejectBooking,
  updateBookingStatus,
} from "../services/bookingService";

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

function TechnicianBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const [showChargeForm, setShowChargeForm] = useState(false);
  const [chargeDescription, setChargeDescription] = useState("");
  const [chargeAmount, setChargeAmount] = useState("");
  const [addingCharge, setAddingCharge] = useState(false);

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [actionError, setActionError] = useState("");

  const loadBooking = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyTechnicianBookings();

      if (!data.success) {
        throw new Error(data.message || "Failed to load booking");
      }

      const foundBooking = (data.bookings || []).find(
        (item) => item._id === id,
      );

      if (!foundBooking) {
        throw new Error("Booking not found or no longer assigned to you");
      }

      setBooking(foundBooking);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load booking",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [id]);

  const handleStartWork = async () => {
    try {
      setUpdatingStatus(true);
      setActionError("");

      const data = await updateBookingStatus(id, "in-progress");

      if (!data.success) {
        throw new Error(data.message || "Failed to start work");
      }

      setBooking(data.booking);
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Failed to start work",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleComplete = async () => {
    try {
      setUpdatingStatus(true);
      setActionError("");

      const data = await updateBookingStatus(id, "completed");

      if (!data.success) {
        throw new Error(data.message || "Failed to complete booking");
      }

      setBooking(data.booking);
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Failed to complete booking",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setActionError("Please provide a rejection reason.");
      return;
    }

    try {
      setRejecting(true);
      setActionError("");

      const data = await rejectBooking(id, rejectReason.trim());

      if (!data.success) {
        throw new Error(data.message || "Failed to reject booking");
      }

      navigate("/technician/dashboard");
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Failed to reject booking",
      );
    } finally {
      setRejecting(false);
    }
  };

  const handleAddCharge = async () => {
    if (!chargeDescription.trim()) {
      setActionError("Please enter a charge description.");
      return;
    }

    const amount = Number(chargeAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setActionError("Please enter a valid charge amount.");
      return;
    }

    try {
      setAddingCharge(true);
      setActionError("");

      const data = await addAdditionalCharge(
        id,
        chargeDescription.trim(),
        amount,
      );

      if (!data.success) {
        throw new Error(data.message || "Failed to add charge");
      }

      setBooking(data.booking);
      setChargeDescription("");
      setChargeAmount("");
      setShowChargeForm(false);
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Failed to add additional charge",
      );
    } finally {
      setAddingCharge(false);
    }
  };

  const additionalTotal =
    booking?.additionalCharges?.reduce(
      (sum, charge) => sum + Number(charge.amount || 0),
      0,
    ) || 0;

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-gray-500">Loading booking...</p>
            </div>
          </section>
        </main>
      </>
    );
  }

  if (error || !booking) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <h2 className="font-semibold text-red-800">
                Unable to load booking
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error || "Booking not found"}
              </p>

              <Link
                to="/technician/dashboard"
                className="mt-4 inline-block rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Back to Dashboard
              </Link>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          <Link
            to="/technician/dashboard"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                    {booking.service?.icon || "🔧"}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-emerald-600">
                      {booking.service?.category || "Home Service"}
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-gray-950 sm:text-3xl">
                      {booking.service?.name || "Service"}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                      Booked on {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </div>

                <span
                  className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyles[booking.status] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {formatStatus(booking.status)}
                </span>
              </div>

              <div className="mt-8 grid gap-6 border-t border-gray-100 pt-6 sm:grid-cols-2">
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

                  <p className="mt-1 font-medium text-gray-800">
                    {formatDate(booking.scheduledDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Address
                  </p>

                  <p className="mt-1 leading-6 font-medium text-gray-800">
                    {booking.address}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Service Duration
                  </p>

                  <p className="mt-1 font-medium text-gray-800">
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
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-gray-950">Job Pricing</h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Base Service Price</span>
                  <span className="font-semibold text-gray-900">
                    ₹{booking.price}
                  </span>
                </div>

                {booking.additionalCharges?.length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <p className="mb-3 text-sm font-semibold text-gray-700">
                      Additional Charges
                    </p>

                    <div className="space-y-3">
                      {booking.additionalCharges.map((charge, index) => (
                        <div
                          key={`${charge._id || index}`}
                          className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                        >
                          <span className="text-sm text-gray-700">
                            {charge.description}
                          </span>

                          <span className="text-sm font-semibold text-gray-900">
                            ₹{charge.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="text-lg font-bold text-gray-950">
                    Final Total
                  </span>

                  <span className="text-2xl font-bold text-emerald-600">
                    ₹{booking.totalPrice ?? booking.price + additionalTotal}
                  </span>
                </div>
              </div>
            </div>

            {actionError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-700">
                  {actionError}
                </p>
              </div>
            )}

            {booking.status === "assigned" && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-gray-950">
                  Job Actions
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Start the job when you arrive at the customer's location.
                </p>

                {!showRejectForm ? (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleStartWork}
                      disabled={updatingStatus}
                      className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updatingStatus ? "Starting..." : "Start Work"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowRejectForm(true);
                        setActionError("");
                      }}
                      className="rounded-full border border-red-200 px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Reject Job
                    </button>
                  </div>
                ) : (
                  <div className="mt-6">
                    <label className="text-sm font-semibold text-gray-700">
                      Reason for rejecting this job
                    </label>

                    <textarea
                      value={rejectReason}
                      onChange={(event) => setRejectReason(event.target.value)}
                      rows={4}
                      maxLength={300}
                      placeholder="Explain why you cannot take this job..."
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={handleReject}
                        disabled={rejecting}
                        className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {rejecting ? "Rejecting..." : "Confirm Rejection"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowRejectForm(false);
                          setRejectReason("");
                          setActionError("");
                        }}
                        disabled={rejecting}
                        className="rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700"
                      >
                        Keep Job
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {booking.status === "in-progress" && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-gray-950">
                  Work In Progress
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Add any approved extra charges before completing the job.
                </p>

                {!showChargeForm ? (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowChargeForm(true);
                        setActionError("");
                      }}
                      className="rounded-full border border-emerald-200 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                    >
                      + Add Additional Charge
                    </button>

                    <button
                      type="button"
                      onClick={handleComplete}
                      disabled={updatingStatus}
                      className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updatingStatus
                        ? "Completing..."
                        : "Mark Job Completed"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 rounded-xl bg-gray-50 p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Description
                        </label>

                        <input
                          type="text"
                          value={chargeDescription}
                          onChange={(event) =>
                            setChargeDescription(event.target.value)
                          }
                          maxLength={200}
                          placeholder="Example: Gas refill"
                          className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700">
                          Amount
                        </label>

                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={chargeAmount}
                          onChange={(event) =>
                            setChargeAmount(event.target.value)
                          }
                          placeholder="500"
                          className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={handleAddCharge}
                        disabled={addingCharge}
                        className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {addingCharge ? "Adding..." : "Add Charge"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowChargeForm(false);
                          setChargeDescription("");
                          setChargeAmount("");
                          setActionError("");
                        }}
                        disabled={addingCharge}
                        className="rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {booking.status === "completed" && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                <h2 className="font-bold text-emerald-800">
                  Job Completed
                </h2>

                <p className="mt-1 text-sm text-emerald-700">
                  This service has been successfully completed.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default TechnicianBookingDetails;