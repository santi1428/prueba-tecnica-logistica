import React, { useState, useEffect } from "react";
import { Anchor, Plus, Edit, Trash2, X, AlertCircle } from "lucide-react";
import { api } from "../api/endpoint";
import type { Puerto } from "../interfaces/model";

const Puertos: React.FC = () => {
  const [puertos, setPuertos] = useState<Puerto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Estado inicial actualizado con "pais"
  const [formData, setFormData] = useState<Partial<Puerto>>({
    nombre: "",
    pais: "", // <--- CAMBIADO
  });

  useEffect(() => {
    fetchPuertos();
  }, []);

  const fetchPuertos = async () => {
    setIsLoading(true);
    try {
      const response = await api.puertos.getAll();
      setPuertos(response.data);
    } catch (error) {
      console.error(error);
      setErrorMsg("Error al cargar los puertos desde el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      nombre: "",
      pais: "", // <--- CAMBIADO
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (puerto: Puerto) => {
    setFormData(puerto);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    // Payload actualizado con "pais"
    const payload = {
      nombre: formData.nombre,
      pais: formData.pais, // <--- CAMBIADO
    };

    try {
      if (isEditing && formData.id) {
        const res = await api.puertos.update(formData.id, payload);
        setPuertos(puertos.map((p) => (p.id === formData.id ? res.data : p)));
      } else {
        const res = await api.puertos.create(payload);
        setPuertos([...puertos, res.data]);
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.detail ||
          "Error al guardar el puerto. Verifica los datos.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "¿Estás seguro de eliminar este puerto? Podría afectar a los envíos marítimos asociados.",
      )
    )
      return;

    try {
      await api.puertos.delete(id);
      setPuertos(puertos.filter((p) => p.id !== id));
    } catch (error: any) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.detail ||
          "Error al eliminar el puerto. Puede que tenga envíos asociados.",
      );
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Anchor className="text-blue-600" /> Gestión de Puertos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra los puntos de embarque y desembarque marítimo
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus size={20} /> Nuevo Puerto
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-center shadow-sm">
          <AlertCircle className="text-red-500 mr-2" size={20} />
          <span className="text-red-700">{errorMsg}</span>
        </div>
      )}

      {/* Tabla de Datos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                <th className="p-4 font-semibold w-1/3">Nombre del Puerto</th>
                {/* Cambiado el encabezado de la tabla */}
                <th className="p-4 font-semibold w-1/2">País</th>
                <th className="p-4 font-semibold text-center w-1/6">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && puertos.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    Cargando puertos...
                  </td>
                </tr>
              ) : puertos.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No hay puertos registrados.
                  </td>
                </tr>
              ) : (
                puertos.map((puerto) => (
                  <tr
                    key={puerto.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {puerto.nombre}
                    </td>
                    {/* Renderiza el campo pais */}
                    <td className="p-4 text-gray-600">{puerto.pais}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(puerto)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => puerto.id && handleDelete(puerto.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-gray-800">
                {isEditing ? "Editar Puerto" : "Registrar Nuevo Puerto"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:bg-gray-100 p-1 rounded-md"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Puerto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ej. Puerto de Buenaventura"
                  />
                </div>

                {/* País */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pais || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, pais: e.target.value })
                    } // <--- CAMBIADO
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ej. Colombia"
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-blue-400"
                >
                  {isLoading ? "Guardando..." : "Guardar Puerto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Puertos;
