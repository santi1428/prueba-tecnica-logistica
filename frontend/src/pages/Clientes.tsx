import React, { useState, useEffect } from "react";
import { Users, Plus, Edit, Trash2, X, AlertCircle } from "lucide-react";
import { api } from "../api/endpoint";
import type { Cliente, TipoDocumento } from "../interfaces/model";

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Estado inicial actualizado con tipo_documento
  const [formData, setFormData] = useState<Partial<Cliente>>({
    nombre: "",
    documento: "",
    tipo_documento: 0,
    correo_electronico: "",
    telefono: "",
    direccion: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Promise.all para cargar todo paralelo
      const [resClientes, resTiposDoc] = await Promise.all([
        api.clientes.getAll(),
        api.tiposDocumento.getAll(),
      ]);
      setClientes(resClientes.data);
      setTiposDocumento(resTiposDoc.data);
    } catch (error) {
      console.error(error);
      setErrorMsg("Error al cargar la información desde el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      nombre: "",
      documento: "",
      tipo_documento: 0, // Reseteo
      correo_electronico: "",
      telefono: "",
      direccion: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cliente: Cliente) => {
    setFormData(cliente);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación: Obligar a seleccionar un tipo de documento
    if (!formData.tipo_documento || formData.tipo_documento === 0) {
      setErrorMsg("Debes seleccionar un Tipo de Documento.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    // Preparamos el payload
    const payload = {
      nombre: formData.nombre,
      tipo_documento: Number(formData.tipo_documento), // <--- Añadido al payload
      documento: formData.documento,
      correo_electronico: formData.correo_electronico,
      telefono: formData.telefono,
      direccion: formData.direccion,
    };

    try {
      if (isEditing && formData.id) {
        const res = await api.clientes.update(formData.id, payload);
        setClientes(clientes.map((c) => (c.id === formData.id ? res.data : c)));
      } else {
        const res = await api.clientes.create(payload);
        setClientes([...clientes, res.data]);
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.detail ||
          "Error al guardar el cliente. Verifica los datos.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este cliente?")) return;
    try {
      await api.clientes.delete(id);
      setClientes(clientes.filter((c) => c.id !== id));
    } catch (error: any) {
      console.error(error);
      setErrorMsg(
        "Error al eliminar el cliente. Puede que tenga envíos asociados.",
      );
    }
  };

  // Función para obtener la abreviatura del documento en la tabla
  const getTipoDocumentoAbreviatura = (id_tipo: number | undefined) => {
    if (!id_tipo) return "N/A";
    const tipo = tiposDocumento.find((t) => t.id === id_tipo);
    return tipo?.abreviatura || tipo?.nombre || "N/A";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-blue-600" /> Gestión de Clientes
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra tu cartera de clientes
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
        >
          <Plus size={20} /> Nuevo Cliente
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
                <th className="p-4 font-semibold">Nombre / Razón Social</th>
                {/* CAMBIO EN LA TABLA: Tipo + Documento */}
                <th className="p-4 font-semibold">Documento</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Teléfono</th>
                <th className="p-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && clientes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Cargando clientes...
                  </td>
                </tr>
              ) : clientes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No hay clientes registrados.
                  </td>
                </tr>
              ) : (
                clientes.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {cliente.nombre}
                    </td>

                    {/* Renderizamos Tipo Documento (CC, NIT) + El Número */}
                    <td className="p-4 text-gray-600">
                      <span className="font-semibold mr-1">
                        {getTipoDocumentoAbreviatura(cliente.tipo_documento)}:
                      </span>
                      {cliente.documento}
                    </td>

                    <td className="p-4 text-gray-600">
                      {cliente.correo_electronico || "N/A"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {cliente.telefono || "N/A"}
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(cliente)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => cliente.id && handleDelete(cliente.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
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
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-gray-800">
                {isEditing ? "Editar Cliente" : "Registrar Nuevo Cliente"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:bg-gray-100 p-1 rounded-md"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo o Razón Social *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ej. Logística Global S.A."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Documento *
                  </label>
                  <select
                    required
                    value={formData.tipo_documento || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipo_documento: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="" disabled>
                      Seleccione tipo...
                    </option>
                    {tiposDocumento.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}{" "}
                        {tipo.abreviatura ? `(${tipo.abreviatura})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Documento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.documento || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, documento: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ej. 123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ej. +57 300 000 0000"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={formData.correo_electronico || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        correo_electronico: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.direccion || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, direccion: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ej. Calle 123 #45-67, Ciudad"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                >
                  {isLoading ? "Guardando..." : "Guardar Cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
