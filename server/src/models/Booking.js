import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Technician",
      default: null,
    },

    scheduledDate: {
      type: Date,
      required: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    additionalCharges: [
      {
        description: {
          type: String,
          required: true,
          trim: true,
          maxlength: 200,
        },
        amount: {
          type: Number,
          required: true,
          min: 0.01,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    totalPrice: {
      type: Number,
      min: 0,
    },

    rejectionHistory: [
      {
        technician: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Technician",
          required: true,
        },
        reason: {
          type: String,
          required: true,
          trim: true,
          maxlength: 300,
        },
        rejectedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    status: {
      type: String,
      enum: ["pending", "assigned", "in-progress", "completed", "cancelled"],
      default: "pending",
    },

    cancellationReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
