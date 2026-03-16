import axios from "axios";

// URL base de tu backend en Django
const API_URL = "http://127.0.0.1:8000/api";

// Creamos la instancia principal de Axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// INTERCEPTOR DE PETICIONES (Requests)
// ==========================================
// Se ejecuta antes de que cualquier petición salga hacia el backend
apiClient.interceptors.request.use(
  (config) => {
    // 1. Buscamos el token de acceso en el LocalStorage
    const token = localStorage.getItem("access_token");

    // 2. Si existe y la ruta no es de autenticación, lo inyectamos en los Headers
    if (token && config.headers && !config.url?.includes("/auth/")) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ==========================================
// INTERCEPTOR DE RESPUESTAS (Responses)
// ==========================================
// Se ejecuta cuando el backend responde, antes de entregarlo al componente
apiClient.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa (200, 201), simplemente la devolvemos
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // IMPORTANTE: Previene el autorefresco en la página de Login
    // Si el error (ej: 401 Credenciales Inválidas) viene del endpoint de Login o Registro,
    // lo devolvemos inmediatamente sin intentar refrescar el token.
    if (
      originalRequest.url?.includes("/auth/login/") ||
      originalRequest.url?.includes("/auth/registro/")
    ) {
      return Promise.reject(error);
    }

    // Si el error es 401 (No autorizado) y es una ruta del CRUD (Envios, Clientes, etc.)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marcamos para no entrar en un bucle infinito

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        // Si no hay refresh token guardado, forzamos el cierre de sesión
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // 1. Pedimos un nuevo Access Token a Django usando Axios puro (no apiClient para evitar bucles)
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        // 2. Guardamos el nuevo token en LocalStorage
        const newAccessToken = response.data.access;
        localStorage.setItem("access_token", newAccessToken);

        // 3. Actualizamos el Header de la petición original que falló y la volvemos a enviar automáticamente
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Si el refresh token expiró o falló, borramos todo y mandamos al Login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // window.location.href recarga la página, pero como solo ocurre si se vence
        // la sesión estando *adentro* del sistema, es el comportamiento correcto.
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Si es otro tipo de error (500, 404, 400 Validation Error), lo pasamos al componente
    return Promise.reject(error);
  },
);

export default apiClient;
