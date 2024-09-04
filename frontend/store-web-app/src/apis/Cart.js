import axios from "axios";

// Base URL of your FastAPI backend
const API_URL = "http://localhost:8000/cart";

export const cartProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}`, {
      withCredentials: true,
    });
    console.log("cartProducts:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Error response from server
      console.error("Error getting data:", error.response.data);
      throw new Error(
        error.response.data.detail || "An error occurred while fetching data."
      );
    } else if (error.request) {
      // No response received from server
      console.error("No response received:", error.request);
      throw new Error("No response received from the server.");
    } else {
      // Error setting up request
      console.error("Error setting up request:", error.message);
      throw new Error("An error occurred while setting up the request.");
    }
  }
};

export const addProductCart = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/add-device/`, productData, {
      withCredentials: true, // Incluir cookies en solicitudes cross-origin
    });
    console.log("Product added to cart:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Error de respuesta del servidor
      console.error("Error response from server:", error.response.data);
      // Puedes manejar los errores específicos aquí si hay códigos de error conocidos
      switch (error.response.status) {
        case 400:
          throw new Error("Bad request. not stock enough.");
        case 404:
          throw new Error("Product not found.");
        case 500:
          throw new Error("Server error. Please try again later.");
        default:
          throw new Error(
            "An error occurred while adding the product to the cart."
          );
      }
    } else if (error.request) {
      // No se recibió respuesta del servidor
      console.error("No response received from server:", error.request);
      throw new Error(
        "No response received from the server. Please check your network connection."
      );
    } else {
      // Error al configurar la solicitud
      console.error("Error setting up request:", error.message);
      throw new Error("An error occurred while setting up the request.");
    }
  }
};

export const changeQuantityProductCart = async (product_id, action) => {
  try {
    const response = await axios.put(
      `${API_URL}/update-cart-quantity/?product_id=${product_id}&action=${action}`,
      {},
      {
        withCredentials: true, // Incluir cookies en solicitudes cross-origin
      }
    );
    console.log("Quantity product changed:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Error de respuesta del servidor
      console.error("Error response from server:", error.response.data);
      // Puedes manejar los errores específicos aquí si hay códigos de error conocidos
      switch (error.response.status) {
        case 400:
          throw new Error("Invalid action");
        case 404:
          throw new Error("Product not found in cart");
        case 500:
          throw new Error("Server error. Please try again later.");
        default:
          throw new Error(
            "An error occurred while updating the cart quantity."
          );
      }
    } else if (error.request) {
      // No se recibió respuesta del servidor
      console.error("No response received from server:", error.request);
      throw new Error(
        "No response received from the server. Please check your network connection."
      );
    } else {
      // Error al configurar la solicitud
      console.error("Error setting up request:", error.message);
      throw new Error("An error occurred while setting up the request.");
    }
  }
};

export const deleteProductCart = async (product_id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-device/?product_id=${product_id}`, {
      withCredentials: true, // Incluir cookies en solicitudes cross-origin
    });
    console.log("Product deleted:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Error response from server
      console.error("Error response from server:", error.response.data);
      throw new Error(
        error.response.data.detail ||
          "An error occurred while deleting the product."
      );
    } else if (error.request) {
      // No response received from server
      console.error("No response received from server:", error.request);
      throw new Error("No response received from the server.");
    } else {
      // Error setting up request
      console.error("Error setting up request:", error.message);
      throw new Error("An error occurred while setting up the request.");
    }
  }
};
