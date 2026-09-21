import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import Technician from "../models/Technician.js";

// CREATE BOOKING — CUSTOMER
export const createBooking = async (req, res) => {
  try {
    const { service, scheduledDate, address, notes } = req.body;

    // Validate required fields
    if (!service || !scheduledDate || !address) {
      return res.status(400).json({
        success: false,
        message: "Service, date and address are required",
      });
    }

    // Check service exists
    const serviceExists = await Service.findOne({
      _id: service,
      isActive: true,
    });

    if (!serviceExists) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Make sure booking date is in the future
    const bookingDate = new Date(scheduledDate);

    if (Number.isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking date",
      });
    }

    if (bookingDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Booking date must be in the future",
      });
    }

    // Create booking
    const booking = await Booking.create({
      customer: req.user._id,
      service: serviceExists._id,
      scheduledDate: bookingDate,
      address,
      notes,
      price: serviceExists.price,
      additionalCharges: [],
      totalPrice: serviceExists.price,
      technician: null,
      status: "pending",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("service", "name category price duration")
      .populate({
        path: "technician",
        populate: {
          path: "user",
          select: "name phone email",
        },
      });

    res.status(201).json({
      success: true,
      message: "Service booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};

// GET CUSTOMER BOOKINGS
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer: req.user._id,
    })
      .populate("service", "name category price duration icon")
      .populate({
        path: "technician",
        populate: {
          path: "user",
          select: "name phone email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get customer bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id)
      .populate("customer", "name email phone")
      .populate("service", "name category price duration icon")
      .populate({
        path: "technician",
        populate: {
          path: "user",
          select: "name phone email",
        },
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this booking",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this booking",
      });
    }

    if (
      booking.status === "in-progress" ||
      booking.status === "completed" ||
      booking.status === "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${booking.status} booking`,
      });
    }

    booking.status = "cancelled";

    if (cancellationReason) {
      booking.cancellationReason = cancellationReason.trim();
    }

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("service", "name category price duration icon")
      .populate({
        path: "technician",
        populate: {
          path: "user",
          select: "name phone email",
        },
      });

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name email phone")
      .populate("service", "name category price duration icon")
      .populate({
        path: "technician",
        populate: {
          path: "user",
          select: "name phone email",
        },
      })
      .populate({
        path: "rejectionHistory.technician",
        populate: {
          path: "user",
          select: "name phone email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get all bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

export const assignTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const { technician } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    if (!technician || !mongoose.Types.ObjectId.isValid(technician)) {
      return res.status(400).json({
        success: false,
        message: "Valid technician ID is required",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled" || booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: `Cannot assign technician to a ${booking.status} booking`,
      });
    }

    const technicianDoc = await Technician.findById(technician);

    if (!technicianDoc) {
      return res.status(404).json({
        success: false,
        message: "Technician not found",
      });
    }

    if (!technicianDoc.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Technician is not available",
      });
    }

    const supportsService = technicianDoc.services.some(
      (s) => s.toString() === booking.service.toString(),
    );

    if (!supportsService) {
      return res.status(400).json({
        success: false,
        message: "Technician does not support this service",
      });
    }

    booking.technician = technicianDoc._id;
    booking.status = "assigned";
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("service", "name category price duration")
      .populate({
        path: "technician",
        populate: {
          path: "user",
          select: "name phone email",
        },
      });

    res.status(200).json({
      success: true,
      message: "Technician assigned successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Assign technician error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to assign technician",
    });
  }
};

export const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const technicianProfile = await Technician.findOne({
      user: req.user._id,
    });

    if (!technicianProfile) {
      return res.status(404).json({
        success: false,
        message: "Technician profile not found",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (!booking.technician) {
      return res.status(400).json({
        success: false,
        message: "This booking has no assigned technician",
      });
    }

    if (booking.technician.toString() !== technicianProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this booking",
      });
    }

    if (booking.status !== "assigned") {
      return res.status(400).json({
        success: false,
        message: "Only assigned bookings can be rejected",
      });
    }

    booking.rejectionHistory.push({
      technician: technicianProfile._id,
      reason: reason.trim(),
      rejectedAt: new Date(),
    });

    booking.technician = null;
    booking.status = "pending";

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("service", "name category price duration icon");

    res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Reject booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reject booking",
    });
  }
};

export const addAdditionalCharge = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Charge description is required",
      });
    }

    const chargeAmount = Number(amount);

    if (!Number.isFinite(chargeAmount) || chargeAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Charge amount must be greater than 0",
      });
    }

    const technicianProfile = await Technician.findOne({
      user: req.user._id,
    });

    if (!technicianProfile) {
      return res.status(404).json({
        success: false,
        message: "Technician profile not found",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      !booking.technician ||
      booking.technician.toString() !== technicianProfile._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this booking",
      });
    }

    if (booking.status !== "in-progress") {
      return res.status(400).json({
        success: false,
        message:
          "Additional charges can only be added while work is in progress",
      });
    }

    booking.additionalCharges.push({
      description: description.trim(),
      amount: chargeAmount,
      addedAt: new Date(),
    });

    const additionalTotal = booking.additionalCharges.reduce(
      (sum, charge) => sum + charge.amount,
      0,
    );

    booking.totalPrice = booking.price + additionalTotal;

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("service", "name category price duration")
      .populate({
        path: "technician",
        populate: {
          path: "user",
          select: "name phone email",
        },
      });

    res.status(200).json({
      success: true,
      message: "Additional charge added successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Add additional charge error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add additional charge",
    });
  }
};

export const getMyTechnicianBookings = async (req, res) => {
  try {
    const technicianProfile = await Technician.findOne({
      user: req.user._id,
    });

    if (!technicianProfile) {
      return res.status(404).json({
        success: false,
        message: "Technician profile not found",
      });
    }

    const bookings = await Booking.find({
      technician: technicianProfile._id,
    })
      .populate("customer", "name email phone")
      .populate("service", "name category price duration icon")
      .populate({
        path: "technician",
        populate: {
          path: "user",
          select: "name phone email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get technician bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const technicianProfile = await Technician.findOne({
      user: req.user._id,
    });

    if (!technicianProfile) {
      return res.status(404).json({
        success: false,
        message: "Technician profile not found",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      !booking.technician ||
      booking.technician.toString() !== technicianProfile._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this booking",
      });
    }

    const validTransitions = {
      assigned: "in-progress",
      "in-progress": "completed",
    };

    if (validTransitions[booking.status] !== status) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from "${booking.status}" to "${status}"`,
      });
    }

    booking.status = status;
    await booking.save();

    if (status === "completed") {
      await Technician.findByIdAndUpdate(technicianProfile._id, {
        $inc: { jobsCompleted: 1 },
      });
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("service", "name category price duration")
      .populate({
        path: "technician",
        populate: {
          path: "user",
          select: "name phone email",
        },
      });

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
    });
  }
};
