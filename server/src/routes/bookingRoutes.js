import express from "express";

import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  assignTechnician,
  rejectBooking,
  addAdditionalCharge,
  getMyTechnicianBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("customer"), createBooking);

router.get("/my", protect, authorize("customer"), getMyBookings);

router.get("/admin/all", protect, authorize("admin"), getAllBookings);

router.get(
  "/technician/my",
  protect,
  authorize("technician"),
  getMyTechnicianBookings,
);

router.get("/:id", protect, authorize("customer"), getBookingById);

router.patch("/:id/cancel", protect, authorize("customer"), cancelBooking);

router.patch("/:id/assign", protect, authorize("admin"), assignTechnician);

router.patch("/:id/reject", protect, authorize("technician"), rejectBooking);

router.patch(
  "/:id/additional-charges",
  protect,
  authorize("technician"),
  addAdditionalCharge,
);

router.patch(
  "/:id/status",
  protect,
  authorize("technician"),
  updateBookingStatus,
);

export default router;
