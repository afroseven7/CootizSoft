"use client";

import { useState } from "react";

export default function ProductoForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    estado: true,
    imagenes: [],
  });

  const [subiendo, setSubiendo] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSubiendo(true);
    const urls = [...formData.imagenes];

    for (const file of files) {
      const formDataImage = new FormData();
      formDataImage.append("file", file);
      formDataImage.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
      formDataImage.append("folder", "productos");

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: formDataImage }
        );

        const data = await res.json();
        if (!data.secure_url) throw new Error("Error al subir la imagen");

        urls.push(data.secure_url);
      } catch (error) {
        console.error("Error subiendo imagen:", error);
        alert("Hubo un problema subiendo una imagen.");
      }
    }

    setFormData((prev) => ({ ...prev, imagenes: urls }));
    setSubiendo(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto p-4"> {/* 🔥 Esto limita la altura y habilita scroll si es necesario */}
      <h1 className="text-2xl font-bold text-medium_slate_blue mb-6 text-center">Crear Producto</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white">Nombre *</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full px-4 py-2 mt-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none" />
        </div>

        <div>
          <label className="block text-white">Descripción</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="w-full px-4 py-2 mt-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none" />
        </div>

        <div>
          <label className="block text-white">Precio *</label>
          <input type="number" name="precio" value={formData.precio} onChange={handleChange} required className="w-full px-4 py-2 mt-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none" />
        </div>

        <div>
          <label className="block text-white">Stock *</label>
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="w-full px-4 py-2 mt-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none" />
        </div>

        <div>
          <label className="block text-white">Estado</label>
          <input type="checkbox" name="estado" checked={formData.estado} onChange={handleChange} className="mt-2" />
        </div>

        <div>
          <label className="block text-white">Imágenes del Producto</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} disabled={subiendo} className="w-full px-4 py-2 mt-2 bg-gray-800 text-white border border-gray-600 rounded-lg cursor-pointer" />
        </div>

        {formData.imagenes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {formData.imagenes.map((img, index) => (
              <img key={index} src={img} alt="Producto" className="w-16 h-16 object-cover rounded-lg shadow-md" />
            ))}
          </div>
        )}

        <div className="text-center">
          <button type="submit" disabled={subiendo} className="px-6 py-3 bg-medium_slate_blue text-white rounded-lg hover:bg-majorelle_blue transition">
            {subiendo ? "Subiendo imágenes..." : "Guardar Producto"}
          </button>
        </div>
      </form>
    </div>
  );
}
