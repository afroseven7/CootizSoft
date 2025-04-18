"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import VerDetalleCotizacion from "@/components/VerDetalleCotizacion";

export default function MisCotizacionesPage() {
  const { user } = useUser();
  const [cotizaciones, setCotizaciones] = useState([]);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);

  const formatearFecha = (fecha) => {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(fecha));
  };

  const calcularEstado = (fechaVencimiento, facturada) => {
    if (facturada) return { label: "Facturada", color: "bg-purple-600" };

    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);

    if (vencimiento >= hoy) return { label: "Vigente", color: "bg-green-600" };
    else return { label: "Vencida", color: "bg-red-600" };
  };

  const fetchCotizaciones = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      const email = user.primaryEmailAddress.emailAddress;
      const res = await fetch(`/api/cotizaciones?email=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (Array.isArray(data.cotizaciones)) {
        const ordenadas = data.cotizaciones.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setCotizaciones(ordenadas);
      } else {
        console.warn("Respuesta inesperada:", data);
        setCotizaciones([]);
      }
    } catch (error) {
      console.error("❌ Error cargando cotizaciones:", error);
      setCotizaciones([]);
    }
  };

  useEffect(() => {
    fetchCotizaciones();
  }, [user]);

  const handleToggleFacturada = async (cotizacion) => {
    try {
      const res = await fetch("/api/facturada", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.primaryEmailAddress?.emailAddress,
          idCotizacion: cotizacion.id, // ✅ Aquí debe ir el ID correctamente
          facturada: !cotizacion.facturada,
        }),
      });
  
      if (res.ok) {
        fetchCotizaciones(); // ✅ Refrescar
      } else {
        console.error("❌ Error al cambiar el estado de facturada");
      }
    } catch (err) {
      console.error("❌ Error de red al actualizar:", err);
    }
  };
  
  
  
  
  const handleDownloadPDF = async (contenidoHTML) => {
    const container = document.createElement("div");
    container.innerHTML = contenidoHTML;
    document.body.appendChild(container);

    const element = container;

    const img = element.querySelector("img");
    if (img && img.src && !img.src.startsWith("data:image")) {
      const toBase64 = (url) =>
        fetch(url)
          .then((res) => res.blob())
          .then(
            (blob) =>
              new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              })
          );
      try {
        const base64Logo = await toBase64(img.src);
        img.src = base64Logo;
      } catch (err) {
        console.warn("No se pudo convertir la imagen a base64:", err);
      }
    }

    const html2pdf = (await import("html2pdf.js")).default;

    const images = element.querySelectorAll("img");
    const promises = Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) resolve(true);
          else {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
          }
        })
    );
    await Promise.all(promises);

    html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: "cotizacion.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();

    document.body.removeChild(container);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mis Cotizaciones</h1>

      <table className="w-full border-collapse border border-gray-600">
        <thead className="bg-zinc-800 text-white">
          <tr>
            <th className="border border-gray-600 px-4 py-2 text-left">N°</th>
            <th className="border border-gray-600 px-4 py-2 text-left">Cliente</th>
            <th className="border border-gray-600 px-4 py-2 text-left">Valor Total</th>
            <th className="border border-gray-600 px-4 py-2 text-left">Creación</th>
            <th className="border border-gray-600 px-4 py-2 text-left">Vencimiento</th>
            <th className="border border-gray-600 px-4 py-2 text-left">Estado</th>
            <th className="border border-gray-600 px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-zinc-900 text-white">
          {cotizaciones.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-6 text-gray-500">
                No hay cotizaciones aún.
              </td>
            </tr>
          ) : (
            cotizaciones.map((coti, index) => {
              const estado = calcularEstado(coti.fechaVencimiento, coti.facturada);

              return (
                <tr key={coti.id}>
                  <td className="border border-gray-600 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-600 px-4 py-2">
                    <strong>{coti.cliente?.nombre}</strong>
                    <br />
                    <span className="text-xs text-gray-400">{coti.cliente?.identificacion}</span>
                  </td>
                  <td className="border border-gray-600 px-4 py-2 text-right">
                    ${coti.total.toLocaleString("es-CO")}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">{formatearFecha(coti.createdAt)}</td>
                  <td className="border border-gray-600 px-4 py-2">
                    {formatearFecha(coti.fechaVencimiento)}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    <span className={`text-white text-xs px-2 py-1 rounded font-medium ${estado.color}`}>
                      {estado.label}
                    </span>
                  </td>
                  <td className="border border-gray-600 px-4 py-2 space-y-1 space-x-1">
                    <button
                      onClick={() => {
                        setCotizacionSeleccionada(coti);
                        setMostrarDetalle(true);
                      }}
                      className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Ver Detalles
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(coti.contenidoHTML)}
                      className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Descargar
                    </button>
                          <button
                              onClick={() => handleToggleFacturada(coti)}
                              className={`px-2 py-1 text-white text-sm rounded ${coti.facturada ? "bg-purple-700 hover:bg-purple-800" : "bg-gray-700 hover:bg-gray-800"
                                  }`}
                          >
                              {coti.facturada ? "Desmarcar" : "Facturada"}
                          </button>

                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <VerDetalleCotizacion
        visible={mostrarDetalle}
        onClose={() => setMostrarDetalle(false)}
        htmlContenido={cotizacionSeleccionada?.contenidoHTML}
      />
    </div>
  );
}
