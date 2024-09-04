import React from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

const AdminRoute = ({ children }) => {
  const { admin, loading, error } = useAdmin();

  if (loading) {
    return <div>Loading...</div>; // Mostrar un indicador de carga mientras se verifica la autenticación
  }

  if (!admin) {
    // Redirigir al login de admin si no hay un usuario autenticado como admin
    return <Navigate to="/login" replace />;
  }

  // Renderizar el contenido si el usuario está autenticado como admin
  return children;
};

export default AdminRoute;
