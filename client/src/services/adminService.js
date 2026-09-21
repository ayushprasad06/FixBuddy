import api from "./api";

export const getAllBookings = async () => {
  const response = await api.get("/bookings/admin/all");
  return response.data;
};

export const getTechnicians = async () => {
  const response = await api.get("/technicians");
  return response.data;
};

export const assignTechnician = async (bookingId, technicianId) => {
  const response = await api.patch(`/bookings/${bookingId}/assign`, {
    technician: technicianId,
  });
  return response.data;
};

export const createTechnicianAccount = async (technicianData) => {
  const response = await api.post("/technicians/account", technicianData);
  return response.data;
};

export const updateTechnician = async (technicianId, technicianData) => {
  const response = await api.put(
    `/technicians/${technicianId}`,
    technicianData
  );
  return response.data;
};

export const toggleTechnicianActive = async (technicianId) => {
  const response = await api.patch(`/technicians/${technicianId}/status`);
  return response.data;
};

export const deleteTechnician = async (technicianId) => {
  const response = await api.delete(`/technicians/${technicianId}`);
  return response.data;
};

export const getAllServices = async () => {
  const response = await api.get("/services/admin/all");
  return response.data;
};

export const createService = async (serviceData) => {
  const response = await api.post("/services", serviceData);
  return response.data;
};

export const updateService = async (serviceId, serviceData) => {
  const response = await api.put(`/services/${serviceId}`, serviceData);
  return response.data;
};

export const toggleServiceStatus = async (serviceId) => {
  const response = await api.patch(`/services/${serviceId}/status`);
  return response.data;
};

export const deleteService = async (serviceId) => {
  const response = await api.delete(`/services/${serviceId}`);
  return response.data;
};

export const getAdmins = async () => {
  const response = await api.get("/users/admins");
  return response.data;
};

export const createAdmin = async (adminData) => {
  const response = await api.post("/users/admins", adminData);
  return response.data;
};

export const updateAdmin = async (adminId, adminData) => {
  const response = await api.put(
    `/users/admins/${adminId}`,
    adminData
  );
  return response.data;
};

export const toggleAdminStatus = async (adminId) => {
  const response = await api.patch(
    `/users/admins/${adminId}/status`
  );
  return response.data;
};

export const deleteAdmin = async (adminId) => {
  const response = await api.delete(
    `/users/admins/${adminId}`
  );
  return response.data;
};