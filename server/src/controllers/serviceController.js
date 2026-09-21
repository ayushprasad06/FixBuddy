import mongoose from "mongoose";
import Service from "../models/Service.js";

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Get services error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Get all services error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);

    const query = isObjectId
      ? {
          $or: [
            { _id: req.params.id },
            { slug: req.params.id },
          ],
          isActive: true,
        }
      : {
          slug: req.params.id,
          isActive: true,
        };

    const service = await Service.findOne(query);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Get service error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch service",
    });
  }
};

export const createService = async (req, res) => {
  try {
    const {
      name,
      slug,
      category,
      description,
      price,
      duration,
      icon,
    } = req.body;

    if (
      !name ||
      !slug ||
      !category ||
      !description ||
      price === undefined ||
      !duration
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const normalizedSlug = slug.trim().toLowerCase();

    const existingService = await Service.findOne({
      slug: normalizedSlug,
    });

    if (existingService) {
      return res.status(409).json({
        success: false,
        message: "A service with this slug already exists",
      });
    }

    const service = await Service.create({
      name: name.trim(),
      slug: normalizedSlug,
      category: category.trim(),
      description: description.trim(),
      price,
      duration: duration.trim(),
      icon: icon?.trim() || "🔧",
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create service error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create service",
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const {
      name,
      slug,
      category,
      description,
      price,
      duration,
      icon,
      isActive,
    } = req.body;

    if (!name || !slug || !category || !description || price === undefined || !duration) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const normalizedSlug = slug.trim().toLowerCase();

    const existingService = await Service.findOne({
      slug: normalizedSlug,
      _id: { $ne: id },
    });

    if (existingService) {
      return res.status(409).json({
        success: false,
        message: "A service with this slug already exists",
      });
    }

    service.name = name.trim();
    service.slug = normalizedSlug;
    service.category = category.trim();
    service.description = description.trim();
    service.price = price;
    service.duration = duration.trim();
    service.icon = icon?.trim() || "🔧";

    if (typeof isActive === "boolean") {
      service.isActive = isActive;
    }

    await service.save();

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Update service error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update service",
    });
  }
};

export const toggleServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    service.isActive = !service.isActive;

    await service.save();

    res.status(200).json({
      success: true,
      message: service.isActive
        ? "Service activated successfully"
        : "Service deactivated successfully",
      service,
    });
  } catch (error) {
    console.error("Toggle service status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update service status",
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const Booking = mongoose.model("Booking");

    const bookingExists = await Booking.exists({
      service: id,
    });

    if (bookingExists) {
      return res.status(409).json({
        success: false,
        message:
          "This service cannot be permanently deleted because it has existing bookings. Please deactivate it instead.",
      });
    }

    await Service.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Service permanently deleted successfully",
    });
  } catch (error) {
    console.error("Delete service error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete service",
    });
  }
};