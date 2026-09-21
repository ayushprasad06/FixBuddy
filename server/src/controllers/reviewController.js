import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Technician from "../models/Technician.js";

export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and rating are required.",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only review your own bookings.",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can only review completed bookings.",
      });
    }

    if (!booking.technician) {
      return res.status(400).json({
        success: false,
        message: "This booking has no technician.",
      });
    }

    const existingReview = await Review.findOne({
      booking: booking._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this booking.",
      });
    }

    const review = await Review.create({
      booking: booking._id,
      customer: req.user._id,
      technician: booking.technician,
      rating,
      comment,
    });

    const technician = await Technician.findById(booking.technician);

    if (technician) {
      const oldTotal = technician.totalReviews;
      const oldRating = technician.rating;

      technician.rating =
        (oldRating * oldTotal + Number(rating)) / (oldTotal + 1);

      technician.totalReviews = oldTotal + 1;

      await technician.save();
    }

    const populatedReview = await Review.findById(review._id)
      .populate("customer", "name")
      .populate({
        path: "technician",
        populate: {
          path: "user",
          select: "name",
        },
      });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review: populatedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit review.",
      error: error.message,
    });
  }
};

export const getReviewByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own review.",
      });
    }

    const review = await Review.findOne({
      booking: bookingId,
    }).populate("customer", "name");

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch review.",
      error: error.message,
    });
  }
};