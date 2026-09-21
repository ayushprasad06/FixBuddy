import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import {
  getTechnicians,
  updateTechnician,
  toggleTechnicianActive,
  deleteTechnician,
} from "../services/adminService";

function ManageTechnicians() {
  const [technicians, setTechnicians] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingTechnician, setEditingTechnician] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    experience: 0,
    city: "",
    area: "",
    services: [],
    isAvailable: true,
    isVerified: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [technicianData, serviceResponse] = await Promise.all([
        getTechnicians(),
        api.get("/services"),
      ]);

      if (!technicianData.success) {
        throw new Error(
          technicianData.message || "Failed to load technicians"
        );
      }

      setTechnicians(technicianData.technicians);
      setServices(serviceResponse.data.services || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load technicians"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openEdit = (technician) => {
    setEditingTechnician(technician);

    setForm({
      name: technician.user?.name || "",
      email: technician.user?.email || "",
      phone: technician.user?.phone || "",
      bio: technician.bio || "",
      experience: technician.experience || 0,
      city: technician.location?.city || "",
      area: technician.location?.area || "",
      services: technician.services?.map((service) => service._id) || [],
      isAvailable: technician.isAvailable,
      isVerified: technician.isVerified,
    });
  };

  const closeEdit = () => {
    setEditingTechnician(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleServiceChange = (serviceId) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateTechnician(editingTechnician._id, {
        ...form,
        experience: Number(form.experience),
      });

      closeEdit();
      await fetchData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to update technician"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (technician) => {
    const currentlyActive = technician.user?.isActive;

    const confirmed = window.confirm(
      currentlyActive
        ? `Deactivate ${technician.user?.name}?`
        : `Activate ${technician.user?.name}?`
    );

    if (!confirmed) return;

    try {
      await toggleTechnicianActive(technician._id);
      await fetchData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to update technician"
      );
    }
  };

  const handleDelete = async (technician) => {
    const confirmed = window.confirm(
      `Delete ${technician.user?.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteTechnician(technician._id);
      await fetchData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete technician"
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-600">
                Administration
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950">
                Manage Technicians
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage technician accounts, services, availability and
                profiles.
              </p>
            </div>

            <Link
              to="/admin/technicians/new"
              className="rounded-xl bg-emerald-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              + Add Technician
            </Link>
          </div>

          {loading && (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-sm text-gray-500">
                Loading technicians...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && technicians.length === 0 && (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <p className="font-semibold text-gray-900">
                No technicians found
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add your first technician to get started.
              </p>
            </div>
          )}

          {!loading && !error && technicians.length > 0 && (
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {technicians.map((technician) => {
                const active = technician.user?.isActive;
                const available = technician.isAvailable;

                return (
                  <div
                    key={technician._id}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-lg font-bold text-emerald-700">
                          {technician.user?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "T"}
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate text-lg font-bold text-gray-950">
                            {technician.user?.name}
                          </h2>

                          <p className="truncate text-sm text-gray-500">
                            {technician.user?.email}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                          active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 border-y border-gray-100 py-5 sm:grid-cols-4">
                      <div>
                        <p className="text-xs text-gray-400">Rating</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          ⭐ {technician.rating?.toFixed(1) || "0.0"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Reviews</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {technician.totalReviews || 0}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Experience</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {technician.experience || 0} yrs
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Jobs</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {technician.jobsCompleted || 0}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Contact
                      </p>

                      <p className="mt-2 text-sm text-gray-700">
                        {technician.user?.phone || "No phone number"}
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        {technician.location?.area
                          ? `${technician.location.area}, `
                          : ""}
                        {technician.location?.city || "Location not specified"}
                      </p>
                    </div>

                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Services
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {technician.services?.length > 0 ? (
                          technician.services.map((service) => (
                            <span
                              key={service._id}
                              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                            >
                              {service.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">
                            No services assigned
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                      <span className="text-sm font-medium text-gray-700">
                        Availability
                      </span>

                      <span
                        className={`text-sm font-semibold ${
                          available
                            ? "text-emerald-600"
                            : "text-gray-500"
                        }`}
                      >
                        {available ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(technician)}
                        className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleActive(technician)}
                        className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                          active
                            ? "border border-amber-200 text-amber-700 hover:bg-amber-50"
                            : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {active ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(technician)}
                        className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {editingTechnician && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/40 px-4 py-8">
          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-950">
                  Edit Technician
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update technician profile and account details.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Name
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Phone
                  </label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Experience (years)
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    City
                  </label>

                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Area
                  </label>

                  <input
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Bio
                </label>

                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={3}
                  maxLength={500}
                  className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Services
                </p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {services.map((service) => (
                    <label
                      key={service._id}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={form.services.includes(service._id)}
                        onChange={() =>
                          handleServiceChange(service._id)
                        }
                        className="h-4 w-4 accent-emerald-600"
                      />

                      <span className="text-sm text-gray-700">
                        {service.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={form.isAvailable}
                    onChange={handleChange}
                    className="h-4 w-4 accent-emerald-600"
                  />
                  Available for jobs
                </label>

                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={form.isVerified}
                    onChange={handleChange}
                    className="h-4 w-4 accent-emerald-600"
                  />
                  Verified
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageTechnicians;