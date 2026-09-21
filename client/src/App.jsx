import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookService from "./pages/BookService";
import CustomerDashboard from "./pages/CustomerDashboard";
import BookingDetails from "./pages/BookingDetails";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import TechnicianBookingDetails from "./pages/TechnicianBookingDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AddTechnician from "./pages/AddTechnician";
import ScrollToTop from "./components/ScrollToTop";
import ManageTechnicians from "./pages/ManageTechnicians";
import ManageServices from "./pages/ManageServices";
import ManageAdmins from "./pages/ManageAdmins";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetails />} />
          <Route
            path="/book/:slug"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <BookService />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/bookings/:id"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <BookingDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/technician/dashboard"
            element={
              <ProtectedRoute allowedRoles={["technician"]}>
                <TechnicianDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/technician/bookings/:id"
            element={
              <ProtectedRoute allowedRoles={["technician"]}>
                <TechnicianBookingDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/technicians"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageTechnicians />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/admins"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageAdmins />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/technicians/new"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AddTechnician />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
