import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// Get all admin accounts
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (error) {
    console.error("Get admins error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch admins",
    });
  }
};

// Create a new admin
export const createAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || "",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    const safeAdmin = await User.findById(admin._id).select("-password");

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: safeAdmin,
    });
  } catch (error) {
    console.error("Create admin error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create admin",
    });
  }
};

// Update admin details
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password } = req.body;

    const admin = await User.findOne({
      _id: id,
      role: "admin",
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "A user with this email already exists",
        });
      }

      admin.email = normalizedEmail;
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }

      admin.name = name.trim();
    }

    if (phone !== undefined) {
      admin.phone = phone.trim();
    }

    if (password !== undefined && password !== "") {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      admin.password = await bcrypt.hash(password, 12);
    }

    await admin.save();

    const safeAdmin = await User.findById(admin._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      admin: safeAdmin,
    });
  } catch (error) {
    console.error("Update admin error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update admin",
    });
  }
};

// Activate / deactivate admin
export const toggleAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await User.findOne({
      _id: id,
      role: "admin",
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Prevent deactivating the final active admin
    if (admin.isActive) {
      const activeAdminCount = await User.countDocuments({
        role: "admin",
        isActive: true,
      });

      if (activeAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "The last active admin cannot be deactivated.",
        });
      }
    }

    admin.isActive = !admin.isActive;

    await admin.save();

    const safeAdmin = await User.findById(admin._id).select("-password");

    res.status(200).json({
      success: true,
      message: admin.isActive
        ? "Admin activated successfully"
        : "Admin deactivated successfully",
      admin: safeAdmin,
    });
  } catch (error) {
    console.error("Toggle admin status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update admin status",
    });
  }
};

// Permanently delete admin
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await User.findOne({
      _id: id,
      role: "admin",
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Prevent deleting the final active admin
    if (admin.isActive) {
      const activeAdminCount = await User.countDocuments({
        role: "admin",
        isActive: true,
      });

      if (activeAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "The last active admin cannot be deleted.",
        });
      }
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Admin permanently deleted successfully",
    });
  } catch (error) {
    console.error("Delete admin error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete admin",
    });
  }
};