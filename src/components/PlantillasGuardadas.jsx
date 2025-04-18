"use client";

import { useEffect, useState } from "react";
import "../styles/editor.css";

export default function PlantillasGuardadas({ emailUsuario, updateTrigger, onSelectPlantilla }) {
  const [plantillas, setPlantillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [plantillaPreview, setPlantillaPreview] = useState(null);

  useEffect(() => {
    fetchPlantillas();
  }, [emailUsuario, updateTrigger]);

  const fetchPlantillas = async () => {
    try {
      const res = await fetch(`/api/plantillas?email=${encodeURIComponent(emailUsuario)}`);
      const data = await res.json();

      if (res.ok) setPlantillas(data);
      else console.error("Error al cargar plantillas:", data.message);
    } catch (error) {
      console.error("Error en la solicitud:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Mostrar la vista previa en un modal
  const handlePreview = (plantilla) => {
    setPlantillaPreview(plantilla);
    setModalOpen(true);
  };

  // 🗑️ Eliminar plantilla
  const handleDelete = async (idPlantilla) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta plantilla?")) return;

    try {
      const res = await fetch(`/api/plantillas?id=${idPlantilla}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        alert("✅ Plantilla eliminada.");
        setPlantillas(plantillas.filter((p) => p.id !== idPlantilla));
      } else {
        alert("❌ Error al eliminar: " + data.message);
      }
    } catch (error) {
      console.error("Error eliminando plantilla:", error);
      alert("❌ Ocurrió un error al eliminar.");
    }
  };

  // 📝 Seleccionar plantilla para editar
  const handleSelect = (plantilla) => {
    console.log("Plantilla seleccionada:", plantilla);
    onSelectPlantilla(plantilla);
  };

  // ✅ Marcar como predeterminada
  const handleSetPredeterminada = async (plantillaId) => {
    try {
      const res = await fetch("/api/plantillas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: plantillaId,
          marcarPredeterminada: true, // Le pasamos la intención de marcar
          email: emailUsuario, }),
      });

      if (res.ok) {
        alert("✅ Plantilla marcada como predeterminada");
        fetchPlantillas(); // 🔄 Refrescar
      } else {
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        alert("❌ Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error al marcar como predeterminada");
    }
  };

  return (
    <div className="plantillas-container">
      <h3 className="titulo-seccion">📄 Plantillas Guardadas</h3>
      {loading ? (
        <p className="cargando">Cargando plantillas...</p>
      ) : plantillas.length > 0 ? (
        <div className="plantillas-grid">
          {plantillas.map((plantilla) => (
            <div key={plantilla.id} className="plantilla-card">
              {/* Vista previa */}
              <div className="plantilla-preview-container">
                <iframe
                  className="plantilla-preview"
                  srcDoc={`<!DOCTYPE html>
                  <html lang="es">
                  <head><style>
                    body { transform: scale(0.35); transform-origin: top left; width: 210mm; height: 297mm; overflow: hidden; background: white; margin: 0; padding: 0; }
                  </style></head>
                  <body>${plantilla.contenido}</body>
                  </html>`}
                  title="Vista Previa de Plantilla"
                />
              </div>

              {/* Nombre */}
              <h4 className="plantilla-titulo">{plantilla.nombre}</h4>

              {/* Botones */}
              <div className="botones-container">
                <button className="boton-ver" onClick={() => handlePreview(plantilla)}>Vista previa</button>
                <button className="boton-editar" onClick={() => handleSelect(plantilla)}>✏ Editar</button>
                <button className="boton-eliminar" onClick={() => handleDelete(plantilla.id)}>Eliminar</button>

                {/* 🔥 Botón predeterminada */}
                <button
                  className={`${
                    plantilla.predeterminada ? "boton-predeterminada-activa" : "boton-predeterminada"
                  }`}
                  onClick={() => handleSetPredeterminada(plantilla.id)}
                  disabled={plantilla.predeterminada}
                >
                  {plantilla.predeterminada ? "✅ Predeterminada" : "Marcar como Predeterminada"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="cargando">No hay plantillas guardadas.</p>
      )}

      {/* Modal de vista previa */}
      {modalOpen && plantillaPreview && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>✖</button>
            <iframe
              className="modal-preview"
              srcDoc={`<!DOCTYPE html><html lang="es"><head><style>
              body { width: 210mm; height: 297mm; background: white; margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              </style></head><body>${plantillaPreview.contenido}</body></html>`}
              title="Vista Previa Completa"
            />
          </div>
        </div>
      )}
    </div>
  );
}
