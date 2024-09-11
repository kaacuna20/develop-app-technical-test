import { apiClient, setAuthToken } from "./Client";


export const getCheckOut = async () => {
  setAuthToken(); // Configurar el token en los encabezados
  try {
    const response = await apiClient.get("order/checkout/");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching checkout:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createOrder = async (orderForm) => {
  setAuthToken();

  try {

    const response = await apiClient.post("order/", orderForm, {
      withCredentials: true,

    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating order:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getOrderDetails = async (order_id) => {
  setAuthToken();
  try {
    const response = await apiClient.get(`/order/details/${order_id}/`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching order details:",
      error.response?.data || error.message
    );
    throw error;
  }
};
