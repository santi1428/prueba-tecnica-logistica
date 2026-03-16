import React from "react";
import { NavLink } from "react-router-dom";
import { Truck, Users, Package, Warehouse, Anchor } from "lucide-react";

const Sidebar: React.FC = () => {
  // Lista de rutas para iterar y generar los botones del menú
  const menuItems = [
    { name: "Envíos", path: "/envios", icon: <Truck size={20} /> },
    { name: "Clientes", path: "/clientes", icon: <Users size={20} /> },
    { name: "Productos", path: "/productos", icon: <Package size={20} /> },
    { name: "Bodegas", path: "/bodegas", icon: <Warehouse size={20} /> },
    { name: "Puertos", path: "/puertos", icon: <Anchor size={20} /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col hidden md:flex fixed top-0 left-0 bottom-0 z-10 shadow-xl transition-all duration-300">
      {/* Título y Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-800 px-4">
        <Truck className="text-blue-500 mr-2" size={28} />
      </div>

      {/* Enlaces de Navegación */}
      <nav className="flex-1 py-4 flex flex-col gap-2 px-3 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span className="ml-3 font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-gray-800 text-center text-xs text-gray-500">
        <p>Prueba Técnica © 2026</p>
      </div>
    </aside>
  );
};

export default Sidebar;
