"use client";

import { useEffect, useState } from "react";

export default function ComponenteDuracionCotizacion({ onChange, diasIniciales = 15 }) {
  const [dias, setDias] = useState(diasIniciales);
  const [fechaVencimiento, setFechaVencimiento] = useState("");

  const calcularFechaDesdeDias = (dias) => {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + dias - 1); // ✅ Incluir el día de hoy como el primer día
    return hoy.toISOString().split("T")[0];
  };

  const calcularDiasDesdeFecha = (fecha) => {
    const hoy = new Date();
    const destino = new Date(fecha);
    const diff = destino.getTime() - hoy.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1; // ✅ Sumar uno para incluir el día actual
  };

  const maxDias = 45;
  const hoy = new Date();
  const fechaMaxima = calcularFechaDesdeDias(maxDias);

  useEffect(() => {
    const fecha = calcularFechaDesdeDias(dias);
    setFechaVencimiento(fecha);
    onChange({ dias, fechaVencimiento: fecha });
  }, []);

  const handleDiasChange = (e) => {
    const value = Math.min(Math.max(parseInt(e.target.value), 1), maxDias);
    const nuevaFecha = calcularFechaDesdeDias(value);
    setDias(value);
    setFechaVencimiento(nuevaFecha);
    onChange({ dias: value, fechaVencimiento: nuevaFecha });
  };

  const handleFechaChange = (e) => {
    let nuevaFecha = e.target.value;
    let nuevosDias = calcularDiasDesdeFecha(nuevaFecha);

    if (nuevosDias > maxDias) {
      nuevaFecha = calcularFechaDesdeDias(maxDias);
      nuevosDias = maxDias;
    }

    if (nuevosDias < 1) {
      nuevaFecha = calcularFechaDesdeDias(1);
      nuevosDias = 1;
    }

    setDias(nuevosDias);
    setFechaVencimiento(nuevaFecha);
    onChange({ dias: nuevosDias, fechaVencimiento: nuevaFecha });
  };

  return (
    <div className="bg-jet p-4 rounded-lg border border-gray-600 text-white space-y-4">
      <h3 className="text-lg font-semibold text-medium_slate_blue">Duración de la Cotización</h3>

      <div className="flex flex-wrap gap-4 items-center">
        <label className="block">
          Días de Validez (máx 45):
          <input
            type="number"
            min={1}
            max={maxDias}
            value={dias}
            onChange={handleDiasChange}
            className="ml-2 px-2 py-1 rounded bg-white text-black w-20"
          />
        </label>

        <label className="block">
          Fecha de Vencimiento:
          <input
            type="date"
            value={fechaVencimiento}
            max={fechaMaxima}
            min={calcularFechaDesdeDias(1)}
            onChange={handleFechaChange}
            className="ml-2 px-2 py-1 rounded bg-white text-black"
          />
        </label>
      </div>
    </div>
  );
}
