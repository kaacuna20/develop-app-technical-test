import axios from "axios";
import qs from "qs";

// Base URL of your FastAPI backend
const API_URL = "http://localhost:8000/auth";

// Function to register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/`, userData);
    console.log("User registered:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error.response.data);
    throw new Error(error.response.data.detail); // Propagar el mensaje de error desde el backend
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/auth/token",
      qs.stringify({
        grant_type: "password",
        username,
        password,
        scope: "",
        client_id: "string", // Cambia esto si es necesario
        client_secret: "string", // Cambia esto si es necesario
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );
    // Guarda el token en localStorage
    localStorage.setItem("token", response.data.access_token);
    console.log("Login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);
    throw error;
  }
};

// Function to get the current user
export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await axios.get("http://localhost:8000/auth/protected-route", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Current user:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error.response.data);
    throw error;
  }
};
