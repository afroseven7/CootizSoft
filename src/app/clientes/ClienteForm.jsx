"use client";

import { useState, useEffect } from "react";

const ClienteForm = ({ onSubmit, cliente }) => {
  // 🔥 Estado del formulario inicializado con el cliente si existe
  const [formData, setFormData] = useState({
    identificacion: "",
    nombre: "",
    telefono: "",
    direccion: "",
    email: "",
  });

  // 🔥 Efecto para actualizar los datos cuando se edita un cliente
  useEffect(() => {
    if (cliente) {
      setFormData({
        identificacion: cliente.identificacion || "",
        nombre: cliente.nombre || "",
        telefono: cliente.telefono || "",
        direccion: cliente.direccion || "",
        email: cliente.email || "",
      });
    }
  }, [cliente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(cliente ? { ...cliente, ...formData } : formData); // ✅ Si es edición, enviamos el ID también
  };

  return (
    <div className="p-6 bg-jet rounded-lg shadow-lg w-full max-w-lg">
      <h2 className="text-2xl font-bold text-medium_slate_blue mb-4">
        {cliente ? "Editar Cliente" : "Registrar Cliente"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="identificacion"
          placeholder="Número de Identificación"
          value={formData.identificacion}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
        />

        <input
          type="text"
          name="nombre"
          placeholder="Nombre o Razón Social"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
        />

        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
        />

        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
        />

        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-medium_slate_blue text-white rounded-lg hover:bg-majorelle_blue transition"
        >
          {cliente ? "Actualizar Cliente" : "Guardar Cliente"}
        </button>
      </form>
    </div>
  );
};

export default ClienteForm;
