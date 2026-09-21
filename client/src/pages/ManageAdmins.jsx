import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  toggleAdminStatus,
  deleteAdmin,
} from "../services/adminService";

function ManageAdmins() {
  const [admins, setAdmins] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdmins();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch admins");
      }

      setAdmins(data.admins || []);
    } catch (error) {
      console.error("Fetch admins error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch admins"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
    });

    setEditingAdmin(null);
    setShowForm(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setSuccess("");

      if (editingAdmin) {
        const updateData = {
          name: form.name,
          email: form.email,
          phone: form.phone,
        };

        if (form.password.trim()) {
          updateData.password = form.password;
        }

        const data = await updateAdmin(
          editingAdmin._id,
          updateData
        );

        if (!data.success) {
          throw new Error(
            data.message || "Failed to update admin"
          );
        }

        setSuccess("Admin updated successfully.");
      } else {
        const data = await createAdmin(form);

        if (!data.success) {
          throw new Error(
            data.message || "Failed to create admin"
          );
        }

        setSuccess("Admin created successfully.");
      }

      resetForm();
      await fetchAdmins();
    } catch (error) {
      console.error("Admin save error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save admin"
      );
    }
  };

  const handleEdit = (admin) => {
    setError("");
    setSuccess("");

    setEditingAdmin(admin);

    setForm({
      name: admin.name || "",
      email: admin.email || "",
      phone: admin.phone || "",
      password: "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleToggleStatus = async (admin) => {
    try {
      setError("");
      setSuccess("");

      const data = await toggleAdminStatus(admin._id);

      if (!data.success) {
        throw new Error(
          data.message || "Failed to update admin status"
        );
      }

      setSuccess(data.message || "Admin status updated.");
      await fetchAdmins();
    } catch (error) {
      console.error("Toggle admin error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update admin status"
      );
    }
  };

  const handleDelete = async (admin) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${admin.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const data = await deleteAdmin(admin._id);

      if (!data.success) {
        throw new Error(
          data.message || "Failed to delete admin"
        );
      }

      setSuccess("Admin deleted successfully.");
      await fetchAdmins();
    } catch (error) {
      console.error("Delete admin error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete admin"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Manage Admins
            </h1>

            <p className="mt-3 max-w-2xl text-gray-500">
              Create and manage administrator accounts for the FixBuddy platform.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setEditingAdmin(null);
                setForm({
                  name: "",
                  email: "",
                  phone: "",
                  password: "",
                });
                setShowForm(true);
              }
            }}
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            {showForm ? "Cancel" : "+ Add Admin"}
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {showForm && (
          <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <h2 className="text-xl font-bold text-gray-950">
                {editingAdmin ? "Edit Admin" : "Add New Admin"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {editingAdmin
                  ? "Update administrator account details."
                  : "Create a new administrator account."}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid gap-5 md:grid-cols-2"
            >
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-500"
                  placeholder="Admin name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-500"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-500"
                  placeholder="9876543210"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  {editingAdmin
                    ? "New Password (optional)"
                    : "Password"}
                </label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required={!editingAdmin}
                  minLength={6}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-500"
                  placeholder={
                    editingAdmin
                      ? "Leave blank to keep current password"
                      : "Minimum 6 characters"
                  }
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row md:col-span-2">
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  {editingAdmin
                    ? "Update Admin"
                    : "Create Admin"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="mt-8">
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
              Loading admins...
            </div>
          ) : admins.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <h2 className="text-xl font-bold text-gray-950">
                No admins found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Create an administrator account to manage FixBuddy.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {admins.map((admin) => (
                <div
                  key={admin._id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-lg font-bold text-emerald-700">
                        {admin.name?.charAt(0)?.toUpperCase() || "A"}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-bold text-gray-950">
                          {admin.name}
                        </h2>

                        <p className="truncate text-sm text-gray-500">
                          {admin.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        admin.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {admin.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-gray-400">
                        Phone
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {admin.phone || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Role
                      </p>

                      <p className="mt-1 text-sm font-medium capitalize text-gray-800">
                        {admin.role}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(admin)}
                      className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(admin)}
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        admin.isActive
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {admin.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(admin)}
                      className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ManageAdmins;