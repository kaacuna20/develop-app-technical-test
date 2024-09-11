import axios from "axios";
import { apiClient, setAuthToken } from "./Client";


// Function to get the current user
export const getCurrentAdmin = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await axios.get(
      "http://localhost:8000/admin/protected-route",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Current user:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error.response.data);
    throw error;
  }
};

export const getUsers = async () => {
  setAuthToken(); // Configurar el token en los encabezados
  try {
    const response = await apiClient.get("admin/all-users/");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user profile:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getOrders = async () => {
  setAuthToken(); // Configurar el token en los encabezados
  try {
    const response = await apiClient.get("admin/all-orders/");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching orders:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getOrderProducts = async (orderId = null, productId = null) => {
  setAuthToken(); // Configura el token si es necesario

  // Construir parámetros de consulta dinámicamente
  const queryParams = new URLSearchParams();
  if (orderId !== null && orderId !== "") {
    queryParams.append("order_id", orderId);
  }
  if (productId !== null && productId !== "0") {
    queryParams.append("product_id", productId);
  }

  try {
    // Construir la URL completa
    const url = `admin/order-products/?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching order products:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createCategory = async (category) => {
  setAuthToken();

  try {
    const response = await apiClient.post(
      `admin/create-category/?category=${category}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error creating category:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createProductItem = async (product) => {
  setAuthToken();
  try {
    const response = await apiClient.post("admin/create-product/", product, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating product:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const uploadImages = async (productId, images) => {
  setAuthToken();

  try {
    const formData = new FormData();

    formData.append("main_image_url", images.mainImage);
    formData.append("second_image_url", images.secondImage);
    formData.append("third_image_url", images.thirdImage);
    formData.append("fourth_image_url", images.fourthImage);

    const response = await apiClient.post(
      `admin/upload-images/?product_id=${productId}`,
      formData,

      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error uploading images:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateCategory = async (categoryId, newCategory) => {
  setAuthToken();
  try {
    const response = await apiClient.put(
      `admin/update-category/${categoryId}?new_name=${newCategory}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating category:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateProduct = async (productId, updateProduct) => {
  setAuthToken();
  try {
    const response = await apiClient.put(
      `admin/update-products-items/${productId}/`,
      updateProduct,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating category:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  setAuthToken();
  try {
    const response = await apiClient.delete(
      `admin/delete-category/${categoryId}/`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting category:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateUserState = async (userId, newState) => {
  setAuthToken();
  try {
    const response = await apiClient.put(
      `admin/update-state-user/${userId}/?new_state=${newState}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user state:",
      error.response?.data || error.message
    );
    throw error;
  }
};
