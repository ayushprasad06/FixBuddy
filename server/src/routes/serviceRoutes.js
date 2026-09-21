import express from "express";

import {
  getServices,
  getAllServices,
  getServiceById,
  createService,
  updateService,
  toggleServiceStatus,
  deleteService,
} from "../controllers/serviceController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getServices);

router.get(
  "/admin/all",
  protect,
  authorize("admin"),
  getAllServices
);

router.get("/:id", getServiceById);

router.post(
  "/",
  protect,
  authorize("admin"),
  createService
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateService
);

router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  toggleServiceStatus
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteService
);

export default router;