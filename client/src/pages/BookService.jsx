import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import { getServiceBySlug, createBooking } from "../services/bookingService";

function BookService() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [service, setService] = useState(null);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [serviceError, setServiceError] = useState("");

  const [formData, setFormData] = useState({
    scheduledDate: "",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  useEffect(() => {
    let isMounted = true;

    getServiceBySlug(slug)
      .then((data) => {
        if (isMounted) {
          if (data.success && data.service) {
            setService(data.service);
          } else {
            setServiceError("Service not found");
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setServiceError(
            err.response?.data?.message || "Failed to load service details"
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setServiceLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingError("");

    if (!formData.scheduledDate || !formData.address.trim()) {
      setBookingError("Please provide a scheduled date and service address.");
      return;
    }

    const bookingDate = new Date(formData.scheduledDate);
    if (bookingDate <= new Date()) {
      setBookingError("Scheduled date must be in the future.");
      return;
    }

    setSubmitting(true);

    try {
      const data = await createBooking({
        service: service._id,
        scheduledDate: bookingDate.toISOString(),
        address: formData.address.trim(),
        notes: formData.notes.trim() || undefined,
      });

      if (data.success && data.booking) {
        setConfirmedBooking(data.booking);
      } else {
        setBookingError(data.message || "Failed to create booking.");
      }
    } catch (err) {
      setBookingError(
        err.response?.data?.message || "Failed to submit booking. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  if (authLoading || serviceLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex flex-1 items-center justify-center py-24">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-r-transparent" />
            <p className="mt-4 text-sm text-gray-500">Loading service details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (serviceError || !service) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-6 py-24">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-600">
              ✕
            </div>
            <h1 className="mt-6 text-3xl font-bold text-gray-950">
              Service Not Found
            </h1>
            <p className="mt-3 text-sm text-gray-600">
              The service you're trying to book does not exist or has been removed.
            </p>
            <div className="mt-8">
              <Link
                to="/services"
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Browse All Services
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (confirmedBooking) {
    const formattedDate = new Date(
      confirmedBooking.scheduledDate
    ).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-6 py-16 lg:px-8">
          <div className="w-full max-w-2xl rounded-3xl border border-gray-100 bg-white p-8 shadow-sm lg:p-12">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
                ✓
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Booking Request Placed
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Booking Confirmed!
              </h1>
              <p className="mt-3 text-sm text-gray-600">
                Thank you! Your service request has been received and is waiting for technician assignment.
              </p>
            </div>

            <div className="mt-10 divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 text-sm">
              <div className="flex justify-between py-3">
                <span className="font-medium text-gray-500">Service</span>
                <span className="font-semibold text-gray-950">
                  {confirmedBooking.service?.name || service.name}
                </span>
              </div>

              <div className="flex justify-between py-3">
                <span className="font-medium text-gray-500">Category</span>
                <span className="font-semibold text-gray-950">
                  {confirmedBooking.service?.category || service.category || "General"}
                </span>
              </div>

              <div className="flex justify-between py-3">
                <span className="font-medium text-gray-500">Scheduled Date & Time</span>
                <span className="font-semibold text-gray-950">{formattedDate}</span>
              </div>

              <div className="flex justify-between py-3">
                <span className="font-medium text-gray-500">Service Address</span>
                <span className="max-w-xs text-right font-semibold text-gray-950">
                  {confirmedBooking.address}
                </span>
              </div>

              <div className="flex justify-between py-3">
                <span className="font-medium text-gray-500">Total Price</span>
                <span className="text-base font-bold text-emerald-600">
                  ₹{confirmedBooking.price ?? service.price ?? service.basePrice}
                </span>
              </div>

              <div className="flex justify-between py-3">
                <span className="font-medium text-gray-500">Booking Status</span>
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold uppercase text-amber-700">
                  {confirmedBooking.status || "pending"}
                </span>
              </div>

              <div className="flex justify-between py-3">
                <span className="font-medium text-gray-500">Assigned Technician</span>
                <span className="font-semibold text-gray-600">
                  {confirmedBooking.technician ? "Assigned" : "Not Assigned Yet"}
                </span>
              </div>

              {confirmedBooking.notes && (
                <div className="flex justify-between py-3">
                  <span className="font-medium text-gray-500">Notes</span>
                  <span className="max-w-xs text-right text-gray-700">
                    {confirmedBooking.notes}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/services"
                className="rounded-full bg-emerald-600 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Book Another Service
              </Link>
              <Link
                to="/"
                className="rounded-full border border-gray-200 px-6 py-3.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const price = service.price ?? service.basePrice;
  const duration = service.duration ?? service.estimatedDuration;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1 bg-gray-50/50 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8">
            <Link
              to={`/services/${slug}`}
              className="text-sm font-medium text-gray-500 transition hover:text-emerald-600"
            >
              ← Back to service details
            </Link>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Book a Service
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Provide your address and preferred timing. Our admin team will assign a verified technician.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Service Summary Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                    {service.icon || "🔧"}
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                      {service.category || "Service"}
                    </span>
                    <h2 className="text-xl font-bold text-gray-950">
                      {service.name}
                    </h2>
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-600">
                  {service.description}
                </p>

                <div className="mt-6 space-y-3 border-t border-gray-100 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Service fee</span>
                    <span className="font-bold text-gray-950">₹{price}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Estimated duration</span>
                    <span className="font-semibold text-gray-700">{duration}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Technician</span>
                    <span className="font-semibold text-emerald-600">Assigned by Admin</span>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-emerald-50/70 p-4 text-xs text-emerald-800">
                  <p className="font-semibold">Professional Guarantee</p>
                  <p className="mt-1 text-emerald-700">
                    Technician will be assigned by FixBuddy after review. No advance payment required right now.
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Form Card */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-950">
                  Booking Details
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Fill in your details below to schedule your appointment.
                </p>

                {bookingError && (
                  <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                    {bookingError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div>
                    <label
                      htmlFor="scheduledDate"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Preferred Date & Time <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="scheduledDate"
                        name="scheduledDate"
                        type="datetime-local"
                        min={getMinDateTime()}
                        required
                        value={formData.scheduledDate}
                        onChange={handleChange}
                        className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Must be a future date and time.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Service Address <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        required
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House / Flat no, Building name, Street, Landmark, City, Pincode"
                        className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Problem Description / Special Notes
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        maxLength={500}
                        placeholder="Explain what needs repair or any instructions for the technician (optional)"
                        className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                    <p className="mt-1 text-right text-xs text-gray-400">
                      {formData.notes.length}/500
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-xs text-gray-600">
                    <p className="font-semibold text-gray-900">
                      Note on Technician Selection:
                    </p>
                    <p className="mt-1">
                      To guarantee high quality service, FixBuddy administrators assign the best available technician with relevant expertise for this category.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-emerald-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Creating Booking..." : "Confirm & Book Service"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BookService;
