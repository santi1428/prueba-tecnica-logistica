import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // 1. Evita que Vite colapse y recargue si hay un problema en la petición HTTP
    hmr: {
      overlay: true,
    },
    // 2. Si tienes el backend dentro de la misma carpeta padre, ignora sus cambios
    watch: {
      ignored: ["**/backend/**", "**/venv/**"],
    },
  },
});
