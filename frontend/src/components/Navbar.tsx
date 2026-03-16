import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // <-- Agregado useLocation
import { LogOut, Search, User, X } from "lucide-react"; // <-- Agregado X
import { jwtDecode } from "jwt-decode";

interface MyTokenPayload {
  user_id: number;
  username?: string;
  exp: number;
}

const obtenerNombreDesdeToken = (): string => {
  const token = localStorage.getItem("access_token");
  if (!token) return "Usuario";

  try {
    const decoded = jwtDecode<MyTokenPayload>(token);
    return decoded.username ? decoded.username : `Usuario #${decoded.user_id}`;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return "Usuario";
  }
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // <-- Para obtener la ruta actual
  const [userName] = useState<string>(obtenerNombreDesdeToken);

  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login", { replace: true });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/envios?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // --- NUEVA FUNCIÓN PARA LIMPIAR LA BÚSQUEDA ---
  const handleClearSearch = () => {
    setSearchTerm("");
    // Redirige a la página actual pero sin los parámetros de búsqueda (?q=...)
    // Esto resetea la tabla automáticamente si estabas en /envios
    navigate(location.pathname);
  };

  return (
    <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6 z-10 ml-0 md:ml-64 transition-all duration-300 sticky top-0">
      {/* Buscador */}
      <form
        onSubmit={handleSearch}
        className="relative flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64 md:w-96 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
      >
        <button
          type="submit"
          className="text-gray-500 hover:text-blue-600 transition-colors"
        >
          <Search className="mr-2" size={18} />
        </button>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar guías..."
          className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400 pr-8"
        />

        {/* BOTÓN DE RESETEO (Solo aparece si hay texto) */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 text-gray-400 hover:text-red-500 transition-colors"
            title="Limpiar búsqueda"
          >
            <X size={16} />
          </button>
        )}
      </form>

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
