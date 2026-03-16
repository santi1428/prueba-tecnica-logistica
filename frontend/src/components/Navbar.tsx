import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, Search, User } from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface MyTokenPayload {
  user_id: number;
  username?: string;
  exp: number;
}

// Función auxiliar fuera del componente para no re-crearla en cada render
const obtenerNombreDesdeToken = (): string => {
  const token = localStorage.getItem("access_token");
  if (!token) return "Usuario"; // Valor por defecto si no hay token

  try {
    const decoded = jwtDecode<MyTokenPayload>(token);
    // Retorna el username si existe, sino el ID
    return decoded.username ? decoded.username : `Usuario #${decoded.user_id}`;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return "Usuario";
  }
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  // 💡 EL CAMBIO CLAVE ESTÁ AQUÍ:
  // Inicializamos el estado pasándole la función de evaluación.
  // Esto hace que React lea el token y asigne el nombre en el PRIMER render,
  // evitando el uso de useEffect y los renders en cascada (cascading renders).
  const [userName] = useState<string>(obtenerNombreDesdeToken);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6 z-10 ml-0 md:ml-64 transition-all duration-300 sticky top-0">
      {/* Buscador */}
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64 md:w-96 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
        <Search className="text-gray-500 mr-2" size={18} />
        <input
          type="text"
          placeholder="Buscar guías, clientes..."
          className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Acciones de Usuario */}
      <div className="flex items-center gap-4">
        {/* Perfil Dinámico */}
        <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
          <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
            <User size={18} />
          </div>
          <span className="text-sm font-semibold text-gray-700 hidden sm:block capitalize">
            {userName}
          </span>
        </div>

        {/* Botón de Logout */}
        <button
          onClick={handleLogout}
          className="ml-2 flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
