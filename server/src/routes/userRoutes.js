import express from "express";

import {
  getMe,
  getAdmins,
  createAdmin,
  updateAdmin,
  toggleAdminStatus,
  deleteAdmin,
} from "../controllers/userController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMe);

// Admin management
router.get(
  "/admins",
  protect,
  authorize("admin"),
  getAdmins
);

router.post(
  "/admins",
  protect,
  authorize("admin"),
  createAdmin
);

router.put(
  "/admins/:id",
  protect,
  authorize("admin"),
  updateAdmin
);

router.patch(
  "/admins/:id/status",
  protect,
  authorize("admin"),
  toggleAdminStatus
);

router.delete(
  "/admins/:id",
  protect,
  authorize("admin"),
  deleteAdmin
);

export default router;