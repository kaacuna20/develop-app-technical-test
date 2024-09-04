import { apiClient, setAuthToken } from './Client';

export const getCheckOut = async () => {
    setAuthToken(); // Configurar el token en los encabezados
    try {
      const response = await apiClient.get('order/checkout/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error.response?.data || error.message);
      throw error;
    }
  };


  export const createOrder = async (orderForm) => {
    setAuthToken(); // Configurar el token en los encabezados
    try {
      const response = await apiClient.post('order/', orderForm);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error.response?.data || error.message);
      throw error;
    }
  };

  export const getOrderDetails = async (order_id) => {
    setAuthToken(); // Configurar el token en los encabezados
    try {
      const response = await apiClient.get(`/order/details/${order_id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error.response?.data || error.message);
      throw error;
    }
  };
