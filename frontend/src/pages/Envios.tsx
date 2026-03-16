import React, { useState, useEffect } from "react";
import { Package, Plus, Edit, Trash2, X, AlertCircle } from "lucide-react";
import { api } from "../api/endpoint";
import type { EnvioPayload } from "../api/endpoint";
import type {
  Envio,
  Cliente,
  Producto,
  Bodega,
  Puerto,
  TipoDocumento, // <-- Asegúrate de tener esto en tu model.ts
} from "../interfaces/model";

import { useSearchParams } from "react-router-dom";

const Envios: React.FC = () => {
  const [envios, setEnvios] = useState<Envio[]>([]);

  // 1. Lee el parámetro de la URL
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  // ESTADOS PARA LOS CATÁLOGOS (Diccionarios de datos)
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [puertos, setPuertos] = useState<Puerto[]>([]);
  const [tiposDoc, setTiposDoc] = useState<TipoDocumento[]>([]); // <-- NUEVO ESTADO

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<Partial<Envio>>({
    cantidad_producto: 0,
    fecha_entrega: "",
    precio_envio: "",
    numero_guia: "",
    placa_vehiculo: "",
    numero_flota: "",
    precio_final: "",
    cliente: 0,
    tipo_producto: 0,
    tipo_logistica: 1,
    bodega_entrega: 0,
    puerto_entrega: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Agregamos tiposDocumento a las peticiones concurrentes
      const [
        resEnvios,
        resClientes,
        resProductos,
        resBodegas,
        resPuertos,
        resTiposDoc,
      ] = await Promise.all([
        api.envios.getAll(),
        api.clientes.getAll(),
        api.productos.getAll(),
        api.bodegas.getAll(),
        api.puertos.getAll(),
        api.tiposDocumento.getAll(),
      ]);
      setEnvios(resEnvios.data);
      setClientes(resClientes.data);
      setProductos(resProductos.data);
      setBodegas(resBodegas.data);
      setPuertos(resPuertos.data);
      setTiposDoc(resTiposDoc.data);
    } catch (error) {
      console.error(error);
      setErrorMsg("Error al cargar la información desde el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const enviosFiltrados = envios.filter((envio) => {
    if (!query) return true; // Si no hay búsqueda, muestra todos

    const matchGuia = envio.numero_guia.toLowerCase().includes(query);

    const clienteObj = clientes.find((c) => c.id === envio.cliente);

    const matchNombreCliente =
      clienteObj?.nombre.toLowerCase().includes(query) || false;

    const matchDocCliente =
      clienteObj?.documento.toLowerCase().includes(query) || false;

    return matchGuia || matchNombreCliente || matchDocCliente;
  });

  const getNombreCliente = (clienteId: number) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente ? cliente.nombre : "Desconocido";
  };

  const getTipoDocumentoCliente = (clienteId: number) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    if (!cliente) return "N/A";
    const tipo = tiposDoc.find((t) => t.id === cliente.tipo_documento);
    return tipo?.abreviatura || tipo?.nombre || "Doc";
  };

  const getDocumentoCliente = (clienteId: number) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente ? cliente.documento : "";
  };

  const getDestino = (envio: Envio) => {
    if (envio.tipo_logistica === 1 && envio.bodega_entrega) {
      const bodega = bodegas.find((b) => b.id === envio.bodega_entrega);
      return bodega ? `🏢 ${bodega.nombre}` : "Bodega desconocida";
    } else if (envio.tipo_logistica === 2 && envio.puerto_entrega) {
      const puerto = puertos.find((p) => p.id === envio.puerto_entrega);
      return puerto ? `⚓ ${puerto.nombre}` : "Puerto desconocido";
    }
    return "No asignado";
  };

  const getNombreProducto = (productoId: number) => {
    const producto = productos.find((p) => p.id === productoId);
    return producto ? producto.nombre : "Producto desconocido";
  };

  const handleOpenCreate = () => {
    setFormData({
      cantidad_producto: 0,
      fecha_entrega: "",
      precio_envio: "",
      numero_guia: "",
      placa_vehiculo: "",
      numero_flota: "",
      precio_final: "",
      cliente: 0,
      tipo_producto: 0,
      tipo_logistica: 1,
      bodega_entrega: 0,
      puerto_entrega: 0,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (envio: Envio) => {
    setFormData(envio);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cliente || !formData.tipo_producto) {
      setErrorMsg("Debes seleccionar un cliente y un producto.");
      return;
    }

    if (
      formData.tipo_logistica === 1 &&
      (!formData.bodega_entrega || formData.bodega_entrega === 0)
    ) {
      setErrorMsg(
        "Debes seleccionar una bodega de entrega para envíos terrestres.",
      );
      return;
    }

    if (
      formData.tipo_logistica === 2 &&
      (!formData.puerto_entrega || formData.puerto_entrega === 0)
    ) {
      setErrorMsg(
        "Debes seleccionar un puerto de entrega para envíos marítimos.",
      );
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    const payload: EnvioPayload = {
      cliente: Number(formData.cliente),
      tipo_producto: Number(formData.tipo_producto),
      tipo_logistica: Number(formData.tipo_logistica),
      cantidad_producto: Number(formData.cantidad_producto),
      fecha_entrega: formData.fecha_entrega || "",
      precio_envio: String(formData.precio_envio),

      bodega_entrega:
        formData.tipo_logistica === 1 && formData.bodega_entrega
          ? Number(formData.bodega_entrega)
          : undefined,
      puerto_entrega:
        formData.tipo_logistica === 2 && formData.puerto_entrega
          ? Number(formData.puerto_entrega)
          : undefined,
      placa_vehiculo:
        formData.tipo_logistica === 1
          ? formData.placa_vehiculo || undefined
          : undefined,
      numero_flota:
        formData.tipo_logistica === 2
          ? formData.numero_flota || undefined
          : undefined,
    };

    try {
      if (isEditing && formData.id) {
        const res = await api.envios.update(formData.id, payload);
        setEnvios(
          envios.map((env) => (env.id === formData.id ? res.data : env)),
        );
      } else {
        const res = await api.envios.create(payload);
        setEnvios([...envios, res.data]);
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.detail ||
          "Error al guardar el envío. Verifica los datos.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este envío?")) return;
    try {
      await api.envios.delete(id);
      setEnvios(envios.filter((env) => env.id !== id));
    } catch (error) {
      console.error(error);
      setErrorMsg("Error al eliminar el envío.");
    }
  };

  const formatearMoneda = (valor: string | undefined) =>
    valor ? `$${Number(valor).toLocaleString("es-CO")}` : "$0";
  const formatearFecha = (fechaStr: string | undefined) =>
    fechaStr ? new Date(fechaStr).toLocaleDateString("es-CO") : "N/A";

  return (
    <div className="p-6 max-w-[90rem] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-blue-600" /> Gestión de Envíos
          </h1>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
        >
          <Plus size={20} /> Nuevo Envío
        </button>
      </div>
      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-center">
          <AlertCircle className="text-red-500 mr-2" size={20} />
          <span className="text-red-700">{errorMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <th className="p-4 font-semibold">Guía</th>
                {/* NUEVA COLUMNA: Fecha Registro */}
                <th className="p-4 font-semibold">Fecha Reg.</th>
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold">Producto</th>
                <th className="p-4 font-semibold">Logística / Destino</th>
                <th className="p-4 font-semibold">Vehículo / Flota</th>
                <th className="p-4 font-semibold">Cant.</th>
                <th className="p-4 font-semibold">Entrega</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && envios.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-gray-500">
                    Cargando datos...
                  </td>
                </tr>
              ) : envios.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-gray-500">
                    No hay envíos registrados.
                  </td>
                </tr>
              ) : (
                enviosFiltrados.map((envio) => (
                  <tr
                    key={envio.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {envio.numero_guia}
                    </td>

                    {/* NUEVO DATO: Fecha de registro formateada */}
                    <td className="p-4 text-gray-600">
                      {formatearFecha(envio.fecha_registro)}
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-gray-800">
                        {getNombreCliente(envio.cliente)}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {getTipoDocumentoCliente(envio.cliente)}{" "}
                        {getDocumentoCliente(envio.cliente)}
                      </div>
                    </td>

                    <td className="p-4 text-gray-600">
                      {getNombreProducto(envio.tipo_producto)}
                    </td>

                    <td className="p-4">
                      <div className="mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${envio.tipo_logistica === 1 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                        >
                          {envio.tipo_logistica === 1
                            ? "Terrestre"
                            : "Marítima"}
                        </span>
                      </div>
                      <div
                        className="text-gray-600 text-xs truncate max-w-[150px]"
                        title={getDestino(envio)}
                      >
                        {getDestino(envio)}
                      </div>
                    </td>

                    <td className="p-4 text-gray-600">
                      {envio.tipo_logistica === 1
                        ? `🚗 ${envio.placa_vehiculo}`
                        : `🚢 ${envio.numero_flota || "N/A"}`}
                    </td>
                    <td className="p-4 text-gray-600">
                      {envio.cantidad_producto}
                    </td>
                    <td className="p-4 text-gray-600">
                      {formatearFecha(envio.fecha_entrega)}
                    </td>
                    <td className="p-4 font-semibold text-gray-800">
                      {formatearMoneda(envio.precio_final)}
                    </td>

                    <td className="p-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(envio)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => envio.id && handleDelete(envio.id)}
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
      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-gray-800">
                {isEditing ? "Editar Envío" : "Registrar Nuevo Envío"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:bg-gray-100 p-1 rounded-md"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente
                  </label>
                  <select
                    required
                    value={formData.cliente || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cliente: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="" disabled>
                      Seleccione un cliente...
                    </option>
                    {clientes.map((c) => {
                      const tipoDoc = tiposDoc.find(
                        (t) => t.id === c.tipo_documento,
                      );
                      const prefijo =
                        tipoDoc?.abreviatura || tipoDoc?.nombre || "Doc";
                      return (
                        <option key={c.id} value={c.id}>
                          {c.nombre} - {prefijo} {c.documento}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Producto
                  </label>
                  <select
                    required
                    value={formData.tipo_producto || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipo_producto: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="" disabled>
                      Seleccione un producto...
                    </option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* LOGÍSTICA Y DESTINO */}
              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Logística
                  </label>
                  <select
                    value={formData.tipo_logistica}
                    onChange={(e) => {
                      const nuevoTipo = Number(e.target.value);
                      setFormData({
                        ...formData,
                        tipo_logistica: nuevoTipo,
                        bodega_entrega:
                          nuevoTipo === 1 ? formData.bodega_entrega : 0,
                        puerto_entrega:
                          nuevoTipo === 2 ? formData.puerto_entrega : 0,
                        placa_vehiculo:
                          nuevoTipo === 1 ? formData.placa_vehiculo : "",
                        numero_flota:
                          nuevoTipo === 2 ? formData.numero_flota : "",
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value={1}>Terrestre</option>
                    <option value={2}>Marítima</option>
                  </select>
                </div>

                {formData.tipo_logistica === 1 ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bodega de Entrega
                    </label>
                    <select
                      value={formData.bodega_entrega || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bodega_entrega: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    >
                      <option value="" disabled>
                        Seleccione una bodega...
                      </option>
                      {bodegas.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Puerto de Entrega
                    </label>
                    <select
                      value={formData.puerto_entrega || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          puerto_entrega: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    >
                      <option value="" disabled>
                        Seleccione un puerto...
                      </option>
                      {puertos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {formData.tipo_logistica === 1 ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Placa Vehículo
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.placa_vehiculo || ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          placa_vehiculo: e.target.value.toUpperCase(),
                        });
                        e.target.setCustomValidity("");
                      }}
                      onInvalid={(e) => {
                        const target = e.target as HTMLInputElement;
                        if (target.validity.valueMissing)
                          target.setCustomValidity("La placa es obligatoria.");
                        else if (target.validity.patternMismatch)
                          target.setCustomValidity(
                            "Formato: 3 letras y 3 números (Ej. AAA123).",
                          );
                      }}
                      pattern="^[A-Za-z]{3}[0-9]{3}$"
                      maxLength={6}
                      placeholder="Ej. AAA123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número Flota
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.numero_flota || ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          numero_flota: e.target.value.toUpperCase(),
                        });
                        e.target.setCustomValidity("");
                      }}
                      onInvalid={(e) => {
                        const target = e.target as HTMLInputElement;
                        if (target.validity.valueMissing)
                          target.setCustomValidity("La flota es obligatoria.");
                        else if (target.validity.patternMismatch)
                          target.setCustomValidity(
                            "Formato: 3 letras, 4 números, 1 letra (Ej. AAA1234A).",
                          );
                      }}
                      pattern="^[A-Za-z]{3}[0-9]{4}[A-Za-z]{1}$"
                      maxLength={8}
                      placeholder="Ej. AAA1234A"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Entrega
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={
                      formData.fecha_entrega
                        ? formData.fecha_entrega.slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fecha_entrega: new Date(e.target.value).toISOString(),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad de Producto
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.cantidad_producto}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cantidad_producto: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio de Envío
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.precio_envio}
                    onChange={(e) =>
                      setFormData({ ...formData, precio_envio: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                  {isLoading ? "Guardando..." : "Guardar Envío"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Envios;
