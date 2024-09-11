import axios from "axios";

// Obtener el token CSRF al cargar la aplicación

export const getCsrftoken = async () => {
  try {
    const response = await axios.get("http://localhost:8000/csrf-token", {
      withCredentials: true,
    });
    const csrfToken = response.data.csrf_token;
    console.log("crsf-token", csrfToken)
    return csrfToken;
  } catch (error) {
    // Error response from server
    console.error("Error getting data:", error.response.data);
    throw new Error(
      error.response.data.detail || "An error occurred while fetching data."
    );
  }
};
