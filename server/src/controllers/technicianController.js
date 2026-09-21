import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Technician from "../models/Technician.js";
import User from "../models/User.js";
import Service from "../models/Service.js";
import Booking from "../models/Booking.js";

export const getTechnicians = async (req, res) => {
  try {
    const technicians = await Technician.find()
      .populate("user", "name email phone role isActive")
      .populate("services", "name category price duration icon")
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: technicians.length,
      technicians,
    });
  } catch (error) {
    console.error("Get technicians error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch technicians",
    });
  }
};

export const getTechnicianById = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id)
      .populate("user", "name email phone role isActive")
      .populate("services", "name category price duration icon");

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: "Technician not found",
      });
    }

    res.status(200).json({
      success: true,
      technician,
    });
  } catch (error) {
    console.error("Get technician error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch technician",
    });
  }
};

export const createTechnician = async (req, res) => {
  try {
    const {
      user,
      bio,
      services,
      experience,
      location,
    } = req.body;

    const existingTechnician = await Technician.findOne({
      user,
    });

    if (existingTechnician) {
      return res.status(409).json({
        success: false,
        message: "Technician profile already exists",
      });
    }

    const technician = await Technician.create({
      user,
      bio,
      services,
      experience,
      location,
    });

    const populatedTechnician = await Technician.findById(technician._id)
      .populate("user", "name email phone role isActive")
      .populate("services", "name category price duration icon");

    res.status(201).json({
      success: true,
      message: "Technician created successfully",
      technician: populatedTechnician,
    });
  } catch (error) {
    console.error("Create technician error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create technician",
    });
  }
};

export const updateTechnician = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid technician ID",
      });
    }

    const technician = await Technician.findById(id);

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: "Technician not found",
      });
    }

    const {
      name,
      email,
      phone,
      bio,
      services,
      experience,
      city,
      area,
      isAvailable,
      isVerified,
    } = req.body;

    const user = await User.findById(technician.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Technician user account not found",
      });
    }

    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();

      if (!normalizedEmail) {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty",
        });
      }

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "A user with this email already exists",
        });
      }

      user.email = normalizedEmail;
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }

      user.name = name.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (services !== undefined) {
      if (!Array.isArray(services)) {
        return res.status(400).json({
          success: false,
          message: "Services must be an array",
        });
      }

      for (const serviceId of services) {
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
          return res.status(400).json({
            success: false,
            message: "Invalid service ID",
          });
        }
      }

      const validServices = await Service.find({
        _id: { $in: services },
        isActive: true,
      }).select("_id");

      if (validServices.length !== services.length) {
        return res.status(400).json({
          success: false,
          message: "One or more selected services are invalid or inactive",
        });
      }

      technician.services = services;
    }

    if (bio !== undefined) {
      technician.bio = bio.trim();
    }

    if (experience !== undefined) {
      technician.experience = Number(experience) || 0;
    }

    if (city !== undefined) {
      technician.location.city = city.trim();
    }

    if (area !== undefined) {
      technician.location.area = area.trim();
    }

    if (isAvailable !== undefined) {
      technician.isAvailable = Boolean(isAvailable);
    }

    if (isVerified !== undefined) {
      technician.isVerified = Boolean(isVerified);
    }

    await user.save();
    await technician.save();

    const updatedTechnician = await Technician.findById(technician._id)
      .populate("user", "name email phone role isActive")
      .populate("services", "name category price duration icon");

    res.status(200).json({
      success: true,
      message: "Technician updated successfully",
      technician: updatedTechnician,
    });
  } catch (error) {
    console.error("Update technician error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update technician",
    });
  }
};

export const deleteTechnician = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid technician ID",
      });
    }

    const technician = await Technician.findById(id);

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: "Technician not found",
      });
    }

    const bookingCount = await Booking.countDocuments({
      technician: technician._id,
    });

    if (bookingCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "This technician has booking history and cannot be permanently deleted. Deactivate the technician instead.",
      });
    }

    const userId = technician.user;

    await Technician.findByIdAndDelete(technician._id);
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Technician deleted successfully",
    });
  } catch (error) {
    console.error("Delete technician error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete technician",
    });
  }
};

export const toggleTechnicianActive = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid technician ID.",
      });
    }

    const technician = await Technician.findById(id);

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: "Technician not found.",
      });
    }

    const user = await User.findById(technician.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Technician user account not found.",
      });
    }

    user.isActive = !user.isActive;

    if (user.isActive) {
      technician.isAvailable = true;
    } else {
      technician.isAvailable = false;
    }

    await user.save();
    await technician.save();

    const updatedTechnician = await Technician.findById(technician._id)
      .populate("user", "name email phone role isActive")
      .populate("services", "name category price duration icon");

    return res.status(200).json({
      success: true,
      message: user.isActive
        ? "Technician activated successfully."
        : "Technician deactivated successfully.",
      technician: updatedTechnician,
    });
  } catch (error) {
    console.error("Toggle technician active error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update technician status.",
    });
  }
};

export const createTechnicianAccount = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      bio,
      services,
      experience,
      city,
      area,
      isAvailable,
      isVerified,
    } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    const serviceIds = Array.isArray(services) ? services : [];

    for (const serviceId of serviceIds) {
      if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid service ID",
        });
      }
    }

    const validServices = await Service.find({
      _id: { $in: serviceIds },
      isActive: true,
    }).select("_id");

    if (validServices.length !== serviceIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more selected services are invalid",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      role: "technician",
      isActive: true,
    });

    try {
      const technician = await Technician.create({
        user: user._id,
        bio: bio?.trim() || "",
        services: serviceIds,
        experience: Number(experience) || 0,
        location: {
          city: city?.trim() || "",
          area: area?.trim() || "",
        },
        rating: 0,
        totalReviews: 0,
        jobsCompleted: 0,
        isAvailable: isAvailable !== false,
        isVerified: isVerified !== false,
      });

      const populatedTechnician = await Technician.findById(
        technician._id
      )
        .populate("user", "name email phone role isActive")
        .populate("services", "name category price duration icon");

      return res.status(201).json({
        success: true,
        message: "Technician account created successfully",
        technician: populatedTechnician,
      });
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      throw error;
    }
  } catch (error) {
    console.error("Create technician account error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create technician account",
    });
  }
};