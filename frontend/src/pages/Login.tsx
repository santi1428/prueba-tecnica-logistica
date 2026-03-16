import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Lock, User, AlertCircle } from "lucide-react";
import { api } from "../api/endpoint.ts";

import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Estados para manejar la UI durante la petición
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    if (!username || !password) {
      setErrorMsg("Por favor, ingresa tu usuario y contraseña.");
      setIsLoading(false);
      return;
    }
    try {
      // 1. Llamamos a la API que configuramos en endpoints.ts
      const response = await api.auth.login({ username, password });

      // 2. Si es exitoso, extraemos los tokens de la respuesta de SimpleJWT
      const { access, refresh } = response.data;

      // 3. Guardamos los tokens en el almacenamiento del navegador
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      navigate("/envios");
    } catch (error: any) {
      // Manejo de errores (ej. credenciales incorrectas)
      if (error.response && error.response.status === 401) {
        setErrorMsg("Usuario o contraseña incorrectos.");
      } else {
        setErrorMsg("Ocurrió un error al conectar con el servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        {/* Encabezado del Formulario */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Truck className="h-8 w-8 text-blue-600" />
          </div>

          <p className="mt-2 text-sm text-gray-600">
            Ingresa al panel de gestión logística
          </p>
        </div>

        {/* Mensaje de Error */}
        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{errorMsg}</p>
          </div>
        )}

        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Input Usuario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="ej: admin"
                  id="username"
                  name="username"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Input Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
          >
            {isLoading ? "Autenticando..." : "Iniciar Sesión"}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/registro"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
