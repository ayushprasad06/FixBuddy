import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

import {
  cancelBooking,
  getBookingById,
  createReview,
  getReviewByBooking,
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

const timelineSteps = [
  { key: "pending", label: "Service Booked" },
  { key: "assigned", label: "Technician Assigned" },
  { key: "in-progress", label: "Work Started" },
  { key: "completed", label: "Completed" },
];

const getStepState = (status, stepKey) => {
  const order = {
    pending: 0,
    assigned: 1,
    "in-progress": 2,
    completed: 3,
  };

  if (status === "cancelled") {
    return stepKey === "pending" ? "completed" : "inactive";
  }

  if (order[status] > order[stepKey]) {
    return "completed";
  }

  if (order[status] === order[stepKey]) {
    return "current";
  }

  return "inactive";
};

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cancelling, setCancelling] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelError, setCancelError] = useState("");

  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBookingById(id);

        if (!data.success) {
          throw new Error(data.message || "Failed to load booking");
        }

        setBooking(data.booking);

        if (data.booking.status === "completed") {
          try {
            const reviewData = await getReviewByBooking(id);

            if (reviewData.success && reviewData.review) {
              setRating(reviewData.review.rating);
              setReviewComment(reviewData.review.comment || "");
              setReviewSubmitted(true);
            }
          } catch (reviewError) {
            console.error("Failed to load existing review:", reviewError);
          }
        }
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

    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    try {
      setCancelling(true);
      setCancelError("");

      const data = await cancelBooking(id, cancellationReason.trim());

      if (!data.success) {
        throw new Error(data.message || "Failed to cancel booking");
      }

      setBooking(data.booking);
      setShowCancelForm(false);
      setCancellationReason("");
    } catch (err) {
      setCancelError(
        err.response?.data?.message ||
          err.message ||
          "Failed to cancel booking",
      );
    } finally {
      setCancelling(false);
    }
  };

  const canCancel =
    booking && (booking.status === "pending" || booking.status === "assigned");

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      setReviewError("Please select a rating.");
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewError("");

      const data = await createReview(
        booking._id,
        rating,
        reviewComment.trim(),
      );

      if (!data.success) {
        throw new Error(data.message || "Failed to submit review.");
      }

      setReviewSubmitted(true);
    } catch (error) {
      setReviewError(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit review.",
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          <Link
            to="/dashboard"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            ← Back to Dashboard
          </Link>

          {loading && (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-gray-500">Loading booking...</p>
            </div>
          )}

          {!loading && error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
              <h2 className="font-semibold text-red-800">
                Unable to load booking
              </h2>

              <p className="mt-1 text-sm text-red-700">{error}</p>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="mt-4 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Return to Dashboard
              </button>
            </div>
          )}

          {!loading && !error && booking && (
            <div className="mt-8 space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                      {booking.service?.icon || "🔧"}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-emerald-600">
                        {booking.service?.category}
                      </p>

                      <h1 className="mt-1 text-2xl font-bold text-gray-950 sm:text-3xl">
                        {booking.service?.name}
                      </h1>

                      <p className="mt-1 text-sm text-gray-500">
                        Booked on {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[booking.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {formatStatus(booking.status)}
                    </span>

                    <div className="mt-3 text-right">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Final Total
                      </p>

                      <p className="mt-1 text-2xl font-bold text-gray-950">
                        ₹{booking.totalPrice ?? booking.price}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 border-t border-gray-100 pt-6 sm:grid-cols-2">
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

                    <p className="mt-1 font-medium text-gray-800">
                      {booking.address}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Duration
                    </p>

                    <p className="mt-1 font-medium text-gray-800">
                      {booking.service?.duration || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Technician
                    </p>

                    <p className="mt-1 font-medium text-gray-800">
                      {booking.technician?.user?.name || "Not Assigned Yet"}
                    </p>

                    {booking.technician?.user?.phone && (
                      <a
                        href={`tel:${booking.technician.user.phone}`}
                        className="mt-1 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
                      >
                        {booking.technician.user.phone}
                      </a>
                    )}
                  </div>
                </div>

                {booking.notes && (
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Problem / Notes
                    </p>

                    <p className="mt-2 leading-6 text-gray-700">
                      {booking.notes}
                    </p>
                  </div>
                )}

                <div className="mt-6 border-t border-gray-100 pt-6">
                  <h2 className="text-lg font-bold text-gray-950">
                    Price Breakdown
                  </h2>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Base Service Price
                      </span>

                      <span className="text-sm font-semibold text-gray-900">
                        ₹{booking.price}
                      </span>
                    </div>

                    {booking.additionalCharges?.length > 0 && (
                      <div className="border-t border-gray-100 pt-3">
                        <p className="mb-3 text-sm font-semibold text-gray-700">
                          Additional Charges
                        </p>

                        <div className="space-y-2">
                          {booking.additionalCharges.map((charge, index) => (
                            <div
                              key={charge._id || index}
                              className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
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

                      <span className="text-xl font-bold text-emerald-600">
                        ₹{booking.totalPrice ?? booking.price}
                      </span>
                    </div>
                  </div>
                </div>

                {booking.cancellationReason && (
                  <div className="mt-6 rounded-xl bg-red-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                      Cancellation Reason
                    </p>

                    <p className="mt-1 text-sm text-red-800">
                      {booking.cancellationReason}
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-gray-950">
                  Booking Progress
                </h2>

                <div className="mt-8">
                  {booking.status === "cancelled" ? (
                    <div className="rounded-xl bg-red-50 p-5">
                      <p className="font-semibold text-red-800">
                        This booking has been cancelled.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {timelineSteps.map((step, index) => {
                        const state = getStepState(booking.status, step.key);

                        return (
                          <div
                            key={step.key}
                            className="flex items-start gap-4"
                          >
                            <div className="flex flex-col items-center">
                              <div
                                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                                  state === "completed"
                                    ? "bg-emerald-600 text-white"
                                    : state === "current"
                                      ? "border-2 border-emerald-600 bg-emerald-50 text-emerald-700"
                                      : "border border-gray-300 bg-white text-gray-400"
                                }`}
                              >
                                {state === "completed" ? "✓" : index + 1}
                              </div>

                              {index < timelineSteps.length - 1 && (
                                <div
                                  className={`mt-2 h-8 w-px ${
                                    state === "completed"
                                      ? "bg-emerald-500"
                                      : "bg-gray-200"
                                  }`}
                                />
                              )}
                            </div>

                            <div className="pt-1">
                              <p
                                className={`font-semibold ${
                                  state === "inactive"
                                    ? "text-gray-400"
                                    : "text-gray-900"
                                }`}
                              >
                                {step.label}
                              </p>

                              {state === "current" && (
                                <p className="mt-1 text-sm text-gray-500">
                                  Current booking status
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {booking.status === "completed" && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-gray-950">
                    {reviewSubmitted ? "Your Review" : "Rate Your Experience"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {reviewSubmitted
                      ? `Your feedback for ${
                          booking.technician?.user?.name || "your technician"
                        }`
                      : `How was your service with ${
                          booking.technician?.user?.name || "your technician"
                        }?`}
                  </p>

                  {reviewSubmitted ? (
                    <div className="mt-5">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-3xl ${
                              star <= rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      <p className="mt-2 text-sm font-medium text-gray-600">
                        {rating} out of 5 stars
                      </p>

                      {reviewComment && (
                        <div className="mt-5 rounded-xl bg-gray-50 p-4">
                          <p className="text-sm leading-6 text-gray-700">
                            "{reviewComment}"
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-700">
                        <span>✓</span>
                        <span>You have already reviewed this booking.</span>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="mt-5">
                      <div>
                        <p className="mb-2 text-sm font-semibold text-gray-700">
                          Your Rating
                        </p>

                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => {
                                setRating(star);
                                setReviewError("");
                              }}
                              aria-label={`Rate ${star} out of 5`}
                              className={`text-4xl leading-none transition ${
                                star <= rating
                                  ? "text-yellow-400"
                                  : "text-gray-300 hover:text-yellow-300"
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                          {rating > 0
                            ? `${rating} out of 5 stars`
                            : "Select your rating"}
                        </p>
                      </div>

                      <div className="mt-5">
                        <label
                          htmlFor="reviewComment"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Your Review
                        </label>

                        <textarea
                          id="reviewComment"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Tell us about your experience..."
                          maxLength={500}
                          rows={4}
                          className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />

                        <p className="mt-1 text-right text-xs text-gray-400">
                          {reviewComment.length}/500
                        </p>
                      </div>

                      {reviewError && (
                        <div className="mt-3 rounded-lg bg-red-50 px-4 py-3">
                          <p className="text-sm font-medium text-red-600">
                            {reviewError}
                          </p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={reviewSubmitting || rating === 0}
                        className="mt-5 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {reviewSubmitting ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {canCancel && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  {!showCancelForm ? (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="font-semibold text-gray-950">
                          Need to cancel?
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          You can cancel this booking before work starts.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowCancelForm(true)}
                        className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h2 className="font-semibold text-gray-950">
                        Cancel Booking
                      </h2>

                      <textarea
                        value={cancellationReason}
                        onChange={(event) =>
                          setCancellationReason(event.target.value)
                        }
                        rows={4}
                        maxLength={300}
                        placeholder="Tell us why you are cancelling..."
                        className="mt-4 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      />

                      {cancelError && (
                        <p className="mt-2 text-sm text-red-600">
                          {cancelError}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={cancelling}
                          className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {cancelling
                            ? "Cancelling..."
                            : "Confirm Cancellation"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowCancelForm(false);
                            setCancelError("");
                          }}
                          disabled={cancelling}
                          className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700"
                        >
                          Keep Booking
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default BookingDetails;
