import api from "./api";

export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get("/bookings/my");
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

export const cancelBooking = async (id, cancellationReason) => {
  const response = await api.patch(`/bookings/${id}/cancel`, {
    cancellationReason,
  });
  return response.data;
};

export const getServiceBySlug = async (slug) => {
  const response = await api.get(`/services/${slug}`);
  return response.data;
};

export const getMyTechnicianBookings = async () => {
  const response = await api.get("/bookings/technician/my");
  return response.data;
};

export const updateBookingStatus = async (id, status) => {
  const response = await api.patch(`/bookings/${id}/status`, {
    status,
  });
  return response.data;
};

export const addAdditionalCharge = async (id, description, amount) => {
  const response = await api.patch(`/bookings/${id}/additional-charges`, {
    description,
    amount,
  });
  return response.data;
};

export const rejectBooking = async (id, reason) => {
  const response = await api.patch(`/bookings/${id}/reject`, {
    reason,
  });
  return response.data;
};

export const createReview = async (bookingId, rating, comment) => {
  const response = await api.post("/reviews", {
    bookingId,
    rating,
    comment,
  });

  return response.data;
};

export const getReviewByBooking = async (bookingId) => {
  const response = await api.get(`/reviews/booking/${bookingId}`);
  return response.data;
};