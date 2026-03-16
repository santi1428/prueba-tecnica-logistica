import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const token = localStorage.getItem("access_token");

  // Si no hay token guardado, bloqueamos la entrada y lo mandamos al login.
  // state={{ from: location }} guarda la ruta que intentó visitar para redirigirlo
  // ahí después de iniciar sesión (si lo deseas implementar luego).
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
