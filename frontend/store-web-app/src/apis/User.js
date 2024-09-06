import { apiClient, setAuthToken } from "./Client";

// Función para obtener el perfil del usuario
export const getUserProfile = async () => {
  setAuthToken(); // Configurar el token en los encabezados
  try {
    const response = await apiClient.get("user/profile/");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user profile:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Función para obtener el perfil del usuario
export const getHistoryOrder = async () => {
  setAuthToken(); // Configurar el token en los encabezados
  try {
    const response = await apiClient.get("user/history-orders/");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching order history:",
      error.response?.data || error.message
    );
    throw error;
  }
};
