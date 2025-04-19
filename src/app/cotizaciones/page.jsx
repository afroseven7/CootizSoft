"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import VistaPreviaCotizacion from "@/components/VistaPreviaCotizacion";
import BuscadorClientes from "@/components/BuscadorClientes";
import BuscadorProductos from "@/components/BuscadorProductos";
import ComponenteDuracionCotizacion from "@/components/ComponenteDuracionCotizacion";
// ❌ QUITADO: import html2pdf from "html2pdf.js";

export default function CotizacionesPage() {
  const { user } = useUser();
  const [plantilla, setPlantilla] = useState(null);
  const [negocio, setNegocio] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [duracion, setDuracion] = useState({ dias: 15, fechaVencimiento: "" });
  const vistaRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      try {
        const email = user.primaryEmailAddress.emailAddress;
        const res = await fetch(`/api/cotizaciones?email=${encodeURIComponent(email)}`);
        const data = await res.json();

        setPlantilla(data.plantilla);
        setNegocio(data.negocio);
      } catch (error) {
        console.error("❌ Error obteniendo datos:", error);
      }
    };

    fetchData();
  }, [user]);

  const handleDownloadPDF = async () => {
    const element = vistaRef.current;
    if (!element) return;

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

    // ✅ Import dinámico solo en cliente
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
  };

  const handleGuardarCotizacion = async () => {
    if (!user || !clienteSeleccionado || !negocio || !plantilla) {
      alert("❗ Datos incompletos para guardar la cotización.");
      return;
    }

    const subtotal = productosSeleccionados.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    const htmlCotizacion = vistaRef.current?.innerHTML || "";

    const res = await fetch("/api/cotizaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.primaryEmailAddress.emailAddress,
        clienteId: clienteSeleccionado.id,
        plantillaId: plantilla.id,
        negocioId: negocio.id,
        productos: productosSeleccionados,
        subtotal,
        iva,
        total,
        contenidoHTML: htmlCotizacion,
        fechaVencimiento: duracion.fechaVencimiento,
      }),
    });

    if (res.ok) {
      alert("✅ Cotización guardada en la base de datos.");
    } else {
      const data = await res.json();
      alert("❌ Error al guardar cotización: " + data.message);
    }
  };

  if (!plantilla?.contenido) return <p className="text-gray-500">No hay plantilla cargada.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cotización</h1>

      <BuscadorClientes onClienteSeleccionado={setClienteSeleccionado} />

      {clienteSeleccionado && (
        <p className="text-sm text-gray-600 mb-4">
          Cliente seleccionado: <strong>{clienteSeleccionado.nombre}</strong>
        </p>
      )}

      <BuscadorProductos onProductosSeleccionados={setProductosSeleccionados} />
      <ComponenteDuracionCotizacion onChange={setDuracion} />

      <div className="flex justify-end mt-6 gap-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          Guardar como PDF
        </button>

        <button
          onClick={handleGuardarCotizacion}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          Guardar
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Vista previa de la Cotización</h2>
        <div className="editor-wrapper">
          <div className="dummy-header">CootizSoft - Vista Previa</div>
          <div className="my-custom-editor-container" ref={vistaRef}>
            <VistaPreviaCotizacion
              plantillaHTML={plantilla.contenido}
              negocio={negocio}
              cliente={clienteSeleccionado}
              productos={productosSeleccionados}
              duracion={duracion}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
