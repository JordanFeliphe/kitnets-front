import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and properly propagate them
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the complete error for debugging
    console.error('API Error:', error);

    // Create a structured error object
    let structuredError = {
      message: 'Erro na comunicação com o servidor',
      status: null,
      data: null,
      originalError: error
    };

    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      structuredError = {
        message: error.response.data?.message || `Erro ${error.response.status}`,
        status: error.response.status,
        data: error.response.data,
        originalError: error
      };

      // Handle 401 specifically for token expiration (but not for login attempts)
      if (error.response.status === 401 && !error.config.url?.includes('/auth/login')) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        window.location.href = "/auth";
      }
    } else if (error.request) {
      // Network error - request was made but no response received
      structuredError.message = 'Erro de conexão com o servidor';
    } else {
      // Something else happened
      structuredError.message = error.message || 'Erro desconhecido';
    }

    return Promise.reject(structuredError);
  }
);

export default api;