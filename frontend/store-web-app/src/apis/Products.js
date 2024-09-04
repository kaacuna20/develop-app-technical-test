import axios from "axios";

// Base URL of your FastAPI backend
const API_URL = "http://localhost:8000/store";

export const offertProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/home`);
        console.log("OffertProducts:", response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            // Error response from server
            console.error("Error getting data:", error.response.data);
            throw new Error(error.response.data.detail || "An error occurred while fetching data.");
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

export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories/`);
        console.log("getCategories:", response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            // Error response from server
            console.error("Error getting data:", error.response.data);
            throw new Error(error.response.data.detail || "An error occurred while fetching data.");
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

export const getproducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products/`);
        console.log("getproducts:", response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            // Error response from server
            console.error("Error getting data:", error.response.data);
            throw new Error(error.response.data.detail || "An error occurred while fetching data.");
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


export const filterByCategory = async (category_id, page = 1, size = 10) => {
    try {
        const response = await axios.get(`${API_URL}/filter-category/${category_id}/`, {
            params: {
                page: page,
                size: size
            }
        });
        console.log("filterByCategory:", response.data);
        return response.data; // Retorna la lista de productos
    } catch (error) {
        if (error.response) {
            // Error de respuesta del servidor
            console.error("Error getting data:", error.response.data);
            throw new Error(error.response.data.detail || "An error occurred while fetching data.");
        } else if (error.request) {
            // No se recibió respuesta del servidor
            console.error("No response received:", error.request);
            throw new Error("No response received from the server.");
        } else {
            // Error al configurar la solicitud
            console.error("Error setting up request:", error.message);
            throw new Error("An error occurred while setting up the request.");
        }
    }
};


export const getProduct = async (slug) => {
    try {
        const response = await axios.get(`${API_URL}/get-product/${slug}/`);
        console.log("getProduct:", response.data);
        return response.data; 
    } catch (error) {
        if (error.response) {
            // Error de respuesta del servidor
            console.error("Error getting data:", error.response.data);
            throw new Error(error.response.data.detail || "Sorry, there is not a product identified with that slug.");
        } else if (error.request) {
            // No se recibió respuesta del servidor
            console.error("No response received:", error.request);
            throw new Error("No response received from the server.");
        } else {
            // Error al configurar la solicitud
            console.error("Error setting up request:", error.message);
            throw new Error("An error occurred while setting up the request.");
        }
    }
};

export const searchProducts = async (query) => {
    try {
        const response = await axios.get(`${API_URL}/search/`, {
            params: { search_query: query } // Enviar query como parámetro de búsqueda
        });
        console.log("searchProducts:", response.data);
        return response.data; // Retorna la lista de productos o el mensaje
    } catch (error) {
        if (error.response) {
            // Error de respuesta del servidor
            console.error("Error getting data:", error.response.data);
            throw new Error(error.response.data.detail || "An error occurred while fetching data.");
        } else if (error.request) {
            // No se recibió respuesta del servidor
            console.error("No response received:", error.request);
            throw new Error("No response received from the server.");
        } else {
            // Error al configurar la solicitud
            console.error("Error setting up request:", error.message);
            throw new Error("An error occurred while setting up the request.");
        }
    }
};