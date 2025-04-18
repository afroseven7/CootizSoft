"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function BuscadorClientes({ onClienteSeleccionado }) {
  const { user } = useUser();
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const fetchClientes = async () => {
      try {
        const email = user.primaryEmailAddress.emailAddress;
        const res = await fetch(`/api/clientes?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (res.ok) setClientes(data);
        else console.error("Error al obtener clientes:", data.message);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    };

    fetchClientes();
  }, [user]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setBusqueda(value);

    if (value.trim() === "") {
      setResultados([]);
      return;
    }

    const lower = value.toLowerCase();

    const filtrados = clientes.filter((c) =>
      [c.nombre, c.identificacion, c.telefono, c.email].some((campo) =>
        campo?.toLowerCase().includes(lower)
      )
    );

    setResultados(filtrados);
    setMostrarResultados(true);
  };

  const handleSeleccion = (cliente) => {
    setBusqueda(`${cliente.nombre} - ${cliente.identificacion}`);
    setMostrarResultados(false);
    onClienteSeleccionado(cliente);
  };

  return (
    <div className="relative mb-6">
      <label className="block text-white font-semibold mb-2">🔍 Buscar Cliente:</label>
      <input
        type="text"
        value={busqueda}
        onChange={handleInputChange}
        onFocus={() => busqueda && setMostrarResultados(true)}
        onBlur={() => setTimeout(() => setMostrarResultados(false), 150)}
        className="w-full px-4 py-2 bg-white text-black border border-gray-400 rounded-lg focus:outline-none"
        placeholder="Buscar por nombre, identificación, teléfono o email..."
      />

      {mostrarResultados && resultados.length > 0 && (
        <ul className="absolute z-10 bg-white text-black border border-gray-300 w-full max-h-64 overflow-auto rounded shadow-md">
          {resultados.map((cliente) => (
            <li
              key={cliente.id}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100"
              onClick={() => handleSeleccion(cliente)}
            >
              <strong>{cliente.nombre}</strong> — {cliente.identificacion}<br />
              <small>{cliente.telefono} | {cliente.email}</small>
            </li>
          ))}
        </ul>
      )}

      {mostrarResultados && resultados.length === 0 && (
        <div className="absolute z-10 bg-white text-black border border-gray-300 w-full px-4 py-2 rounded shadow-md">
          No se encontraron resultados.
        </div>
      )}
    </div>
  );
}
