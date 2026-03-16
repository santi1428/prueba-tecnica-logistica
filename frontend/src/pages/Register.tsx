import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Truck, Lock, User, AlertCircle, Mail } from "lucide-react";
import { api } from "../api/endpoint";

const Register: React.FC = () => {
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

    // Validaciones básicas de frontend en español
    if (!username || !email || !password) {
      setErrorMsg("Por favor, completa todos los campos.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      // Llamamos al endpoint de registro
      await api.auth.registro({ username, email, password });

      // Si el registro es exitoso, redirigimos al usuario al login
      navigate("/login");
    } catch (error: any) {
      if (error.response && error.response.data) {
        // Muestra el error específico de Django traducido o adaptado
        const djangoError = Object.values(error.response.data)[0] as string[];
        let mensaje = djangoError[0];

        // Traducciones comunes de Django (Opcional, por si tu backend está en inglés)
        if (mensaje.includes("already exists"))
          mensaje = "Este nombre de usuario ya está en uso.";
        if (mensaje.includes("valid email"))
          mensaje = "Introduce una dirección de correo válida.";

        setErrorMsg(
          mensaje || "Error al registrar el usuario. Revisa los datos.",
        );
      } else {
        setErrorMsg("Ocurrió un error de conexión con el servidor.");
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
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 flex items-center shadow-sm">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-700">{errorMsg}</p>
          </div>
        )}

        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Input Usuario */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Usuario
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ej: mi_usuario"
                />
              </div>
            </div>

            {/* Input Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Correo Electrónico
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            {/* Input Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
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
            {isLoading ? "Registrando usuario..." : "Registrarse"}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
