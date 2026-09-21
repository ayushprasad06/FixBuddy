import express from "express";
import {
  createReview,
  getReviewByBooking,
} from "../controllers/reviewController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/booking/:bookingId",
  protect,
  authorize("customer"),
  getReviewByBooking
);

router.post("/", protect, authorize("customer"), createReview);

export default router;