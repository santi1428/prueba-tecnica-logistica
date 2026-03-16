import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Truck, Lock, User, AlertCircle, Mail } from "lucide-react";
import { api } from "../api/endpoint";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const Register: React.FC = () => {
  useDocumentTitle("Registro");
  const navigate = useNavigate();

  // Estados del formulario
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados de interfaz
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // Llamamos al endpoint de registro que configuraste en Django
      await api.auth.registro({ username, email, password });

      // Si el registro es exitoso, redirigimos al usuario al login
      // (Opcional: Podrías hacer auto-login aquí llamando a api.auth.login)
      navigate("/login");
    } catch (error: any) {
      if (error.response && error.response.data) {
        // Muestra el error específico de Django (ej. "Este usuario ya existe")
        const djangoError = Object.values(error.response.data)[0] as string[];
        setErrorMsg(djangoError[0] || "Error al registrar usuario.");
      } else {
        setErrorMsg("Ocurrió un error de conexión.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        {/* Encabezado */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Regístrate para gestionar tu logística
          </p>
        </div>

        {/* Mensaje de Error */}
        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
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
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ej: mi_usuario"
                />
              </div>
            </div>

            {/* Input Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="correo@ejemplo.com"
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
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Botones */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleRegister}
            disabled={isLoading}
            className={`w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition-colors`}
          >
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
