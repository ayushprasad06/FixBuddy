import express from "express";

import {
  getTechnicians,
  getTechnicianById,
  createTechnician,
  updateTechnician,
  deleteTechnician,
  toggleTechnicianActive,
  createTechnicianAccount,
} from "../controllers/technicianController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getTechnicians);
router.get("/:id", getTechnicianById);

router.post(
  "/",
  protect,
  authorize("admin"),
  createTechnician
);

router.post(
  "/account",
  protect,
  authorize("admin"),
  createTechnicianAccount
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateTechnician
);

router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  toggleTechnicianActive
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteTechnician
);

export default router;