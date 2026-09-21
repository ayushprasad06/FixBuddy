import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getAllServices,
  createService,
  updateService,
  toggleServiceStatus,
  deleteService,
} from "../services/adminService";

const emptyForm = {
  name: "",
  slug: "",
  category: "",
  description: "",
  price: "",
  duration: "",
  icon: "🔧",
};

function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllServices();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch services");
      }

      setServices(data.services || []);
    } catch (error) {
      console.error("Fetch services error:", error);
      setError(error.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);

    setForm({
      name: service.name || "",
      slug: service.slug || "",
      category: service.category || "",
      description: service.description || "",
      price: service.price ?? "",
      duration: service.duration || "",
      icon: service.icon || "🔧",
    });

    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingService(null);
    setForm(emptyForm);
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
      setSaving(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
        category: form.category.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        duration: form.duration.trim(),
        icon: form.icon.trim() || "🔧",
      };

      if (!payload.name || !payload.slug || !payload.category) {
        setError("Please fill in all required fields.");
        return;
      }

      if (!payload.description || !payload.duration) {
        setError("Please fill in all required fields.");
        return;
      }

      if (Number.isNaN(payload.price) || payload.price < 0) {
        setError("Please enter a valid price.");
        return;
      }

      let data;

      if (editingService) {
        data = await updateService(editingService._id, payload);
      } else {
        data = await createService(payload);
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to save service");
      }

      closeModal();
      await fetchServices();
    } catch (error) {
      console.error("Save service error:", error);
      setError(error.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (service) => {
    const action = service.isActive ? "deactivate" : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${service.name}"?`,
    );

    if (!confirmed) return;

    try {
      setError("");

      const data = await toggleServiceStatus(service._id);

      if (!data.success) {
        throw new Error(data.message || "Failed to update service status");
      }

      await fetchServices();
    } catch (error) {
      console.error("Toggle service status error:", error);
      setError(error.message || "Failed to update service status");
    }
  };

  const handleDelete = async (service) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${service.name}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setError("");

      const data = await deleteService(service._id);

      if (!data.success) {
        throw new Error(data.message || "Failed to delete service");
      }

      await fetchServices();
    } catch (error) {
      console.error("Delete service error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete service";

      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold text-emerald-600">
              Administration
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-gray-950">
              Manage Services
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage service details, pricing and availability.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            + Add Service
          </button>
        </div>

        {error && !modalOpen && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-gray-900">
              No services found
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Add your first service to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div
                key={service._id}
                className={`rounded-2xl border bg-white p-6 shadow-sm transition ${
                  service.isActive
                    ? "border-gray-200"
                    : "border-gray-200 opacity-75"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                      {service.icon || "🔧"}
                    </div>

                    <div>
                      <h2 className="font-semibold text-gray-950">
                        {service.name}
                      </h2>

                      <p className="text-xs text-gray-500">
                        {service.category}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      service.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                  {service.description}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 border-y border-gray-100 py-4">
                  <div>
                    <p className="text-xs text-gray-400">Price</p>

                    <p className="mt-1 text-lg font-bold text-gray-950">
                      ₹{service.price}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Duration</p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {service.duration}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(service)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(service)}
                    className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                      service.isActive
                        ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                        : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    {service.isActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(service)}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-950">
                    {editingService ? "Edit Service" : "Add Service"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {editingService
                      ? "Update the service information."
                      : "Create a new service for customers."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Service Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="AC Repair"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Slug
                  </label>

                  <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="ac-repair"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="AC & Cooling"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="499"
                    min="0"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Duration
                  </label>

                  <input
                    type="text"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="1-3 hours"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Icon
                  </label>

                  <input
                    type="text"
                    name="icon"
                    value={form.icon}
                    onChange={handleChange}
                    placeholder="🔧"
                    maxLength="4"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe what this service includes..."
                  rows="4"
                  required
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingService
                      ? "Save Changes"
                      : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageServices;
