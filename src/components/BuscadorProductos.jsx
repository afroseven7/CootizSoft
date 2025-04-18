"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function BuscadorProductos({ onProductosSeleccionados }) {
  const { user } = useUser();
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [seleccionados, setSeleccionados] = useState([]);

  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const fetchProductos = async () => {
      try {
        const email = user.primaryEmailAddress.emailAddress;
        const res = await fetch(`/api/productos?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (res.ok) {
          const productosConCodigo = data
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((prod, idx) => ({
              ...prod,
              codigo: String(idx + 1).padStart(3, "0"),
            }));
          setProductos(productosConCodigo);
        } else {
          console.error("Error al obtener productos:", data.message);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchProductos();
  }, [user]);

  const productosFiltrados = productos.filter((p) =>
    [p.nombre.toLowerCase(), p.codigo].some((campo) =>
      campo.includes(filtro.toLowerCase())
    )
  );

  const toggleProducto = (producto) => {
    const yaExiste = seleccionados.find((item) => item.id === producto.id);
    if (yaExiste) {
      setSeleccionados(seleccionados.filter((p) => p.id !== producto.id));
    } else {
      setSeleccionados([...seleccionados, { ...producto, cantidad: 1 }]);
    }
  };

  const handleCantidadChange = (id, nuevaCantidad) => {
    setSeleccionados((prev) =>
      prev.map((prod) =>
        prod.id === id ? { ...prod, cantidad: parseInt(nuevaCantidad) || 1 } : prod
      )
    );
  };

  useEffect(() => {
    onProductosSeleccionados(seleccionados);
  }, [seleccionados]);

  return (
    <div className="mb-6">
      <label className="block font-semibold mb-2">🧾 Buscar y Seleccionar Productos:</label>
      <input
        type="text"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full px-4 py-2 mb-3 bg-white text-black border border-gray-400 rounded-lg focus:outline-none"
        placeholder="Buscar por nombre o código (ej. 001, 002...)"
      />

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {productosFiltrados.map((producto) => {
          const estaSeleccionado = seleccionados.some((p) => p.id === producto.id);
          return (
            <div
              key={producto.id}
              className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 shadow-md p-3 rounded"
            >
              <div className="text-gray-900">
                <p className="text-sm font-semibold text-gray-800">
                  #{producto.codigo} - {producto.nombre}
                </p>
                <p className="text-xs text-gray-700">{producto.descripcion}</p>
                <p className="text-sm font-bold">${producto.precio}</p>
              </div>

              <div className="flex items-center gap-2">
                {estaSeleccionado && (
                  <input
                    type="number"
                    min={1}
                    value={seleccionados.find((p) => p.id === producto.id)?.cantidad || 1}
                    onChange={(e) => handleCantidadChange(producto.id, e.target.value)}
                    className="w-16 px-2 py-1 border rounded text-black"
                  />
                )}
                <button
                  onClick={() => toggleProducto(producto)}
                  className={`px-3 py-1 rounded text-white ${
                    estaSeleccionado ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {estaSeleccionado ? "Quitar" : "Agregar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
