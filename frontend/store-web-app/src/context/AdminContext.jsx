import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentAdmin } from "../apis/Admin";

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const adminData = await getCurrentAdmin();
        setAdmin(adminData);
      } catch (err) {
        setError(err.message || "Failed to fetch admin");
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  const login = (userAdminData) => {
    setAdmin(userAdminData); // Cambiado de setUser a setAdmin
    localStorage.setItem("token", userAdminData.token); // Guarda el token en localStorage
  };

  const logout = () => {
    setAdmin(null); // Cambiado de setUser a setAdmin
    localStorage.removeItem("token");
  };

  return (
    <AdminContext.Provider value={{ admin, loading, error, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
