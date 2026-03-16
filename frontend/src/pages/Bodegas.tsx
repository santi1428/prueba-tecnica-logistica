import React, { useState, useEffect } from "react";
import { Warehouse, Plus, Edit, Trash2, X, AlertCircle } from "lucide-react";
import { api } from "../api/endpoint";
import type { Bodega } from "../interfaces/model";

const Bodegas: React.FC = () => {
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Estados del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Estado inicial del formulario vacío
  const [formData, setFormData] = useState<Partial<Bodega>>({
    nombre: "",
    ubicacion: "",
  });

  // Cargar datos al montar
  useEffect(() => {
    fetchBodegas();
  }, []);

  const fetchBodegas = async () => {
    setIsLoading(true);
    try {
      const response = await api.bodegas.getAll();
      setBodegas(response.data);
    } catch (error) {
      console.error(error);
      setErrorMsg("Error al cargar las bodegas desde el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      nombre: "",
      ubicacion: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bodega: Bodega) => {
    setFormData(bodega);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const payload = {
      nombre: formData.nombre,
      ubicacion: formData.ubicacion,
    };

    try {
      if (isEditing && formData.id) {
        // Petición PATCH/PUT para actualizar
        const res = await api.bodegas.update(formData.id, payload);
        setBodegas(bodegas.map((b) => (b.id === formData.id ? res.data : b)));
      } else {
        // Petición POST para crear
        const res = await api.bodegas.create(payload);
        setBodegas([...bodegas, res.data]);
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.detail ||
          "Error al guardar la bodega. Verifica los datos.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "¿Estás seguro de eliminar esta bodega? Podría afectar a los envíos terrestres asociados.",
      )
    )
      return;

    try {
      await api.bodegas.delete(id);
      setBodegas(bodegas.filter((b) => b.id !== id));
    } catch (error: any) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.detail ||
          "Error al eliminar la bodega. Puede que tenga envíos asociados.",
      );
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Warehouse className="text-blue-600" /> Gestión de Bodegas
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra los centros de distribución para envíos terrestres
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus size={20} /> Nueva Bodega
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
                <th className="p-4 font-semibold w-1/3">Nombre de la Bodega</th>
                <th className="p-4 font-semibold w-1/2">Ubicación</th>
                <th className="p-4 font-semibold text-center w-1/6">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && bodegas.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    Cargando bodegas...
                  </td>
                </tr>
              ) : bodegas.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No hay bodegas registradas.
                  </td>
                </tr>
              ) : (
                bodegas.map((bodega) => (
                  <tr
                    key={bodega.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {bodega.nombre}
                    </td>
                    <td className="p-4 text-gray-600">{bodega.ubicacion}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(bodega)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => bodega.id && handleDelete(bodega.id)}
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

      {/* Modal CRUD (Fondo opaco sin blur) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-gray-800">
                {isEditing ? "Editar Bodega" : "Registrar Nueva Bodega"}
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
                    Nombre de la Bodega *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ej. Centro de Distribución Sur"
                  />
                </div>

                {/* Ubicación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ubicación (Ciudad, País) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ubicacion || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, ubicacion: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ej. Medellín, Colombia"
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
                  {isLoading ? "Guardando..." : "Guardar Bodega"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bodegas;
