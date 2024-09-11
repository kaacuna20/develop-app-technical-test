import axios from 'axios';
import { getCsrftoken } from './CsrfToken';


const csrfToken = await getCsrftoken();
console.log(csrfToken)

export const apiClient = axios.create({
    baseURL: 'http://localhost:8000', // La URL base de tu API
    headers: {
      'Content-Type': 'application/json',

    },
    withCredentials: true, // Permite el envío de cookies junto con las solicitudes
  });
  
  // Función para configurar el token en los encabezados
  export const setAuthToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log(apiClient.defaults.headers);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      apiClient.defaults.headers.common['csrf-token'] = csrfToken;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  };


