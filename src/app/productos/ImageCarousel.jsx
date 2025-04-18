"use client";

import { useState, useEffect } from "react";

const ImageCarousel = ({ imagenes, onClose, initialIndex = 0 }) => {
  const [index, setIndex] = useState(initialIndex);

  // Cerrar con tecla "Esc"
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const prevImage = () => setIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  const nextImage = () => setIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      {/* Botón para cerrar */}
      <button className="absolute top-4 right-4 text-white text-3xl" onClick={onClose}>
        ✖
      </button>

      {/* Botón Anterior (Ahora está FUERA de la imagen) */}
      <button
        className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white text-4xl bg-black bg-opacity-50 p-3 rounded-full"
        onClick={prevImage}
      >
        ❮
      </button>

      {/* Imagen actual */}
      <img src={imagenes[index]} alt="Producto" className="w-3/4 max-h-[80vh] object-contain rounded-lg" />

      {/* Botón Siguiente (Ahora está FUERA de la imagen) */}
      <button
        className="absolute right-8 top-1/2 transform -translate-y-1/2 text-white text-4xl bg-black bg-opacity-50 p-3 rounded-full"
        onClick={nextImage}
      >
        ❯
      </button>
    </div>
  );
};

export default ImageCarousel;
