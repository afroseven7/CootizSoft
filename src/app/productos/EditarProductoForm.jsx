"use client";

import { useState, useEffect } from "react";

const EditarProductoForm = ({ producto, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    estado: true,
    imagenes: [],
  });

  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion || "",
        precio: producto.precio,
        stock: producto.stock,
        estado: producto.estado,
        imagenes: producto.imagen || [],
      });
    }
  }, [producto]);

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
    const nuevasImagenes = [...formData.imagenes];

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

        nuevasImagenes.push(data.secure_url);
      } catch (error) {
        console.error("Error subiendo imagen:", error);
        alert("Hubo un problema subiendo una imagen.");
      }
    }

    setFormData((prev) => ({ ...prev, imagenes: nuevasImagenes }));
    setSubiendo(false);
  };

  const handleRemoveImage = (index) => {
    const nuevasImagenes = formData.imagenes.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, imagenes: nuevasImagenes }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...producto, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="backdrop-blur-md bg-gray-900 bg-opacity-80 p-6 rounded-xl w-full max-w-lg shadow-xl text-white">
        <h2 className="text-2xl font-bold text-medium_slate_blue mb-4">Editar Producto</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del producto"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
          />

          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
          />

          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={formData.precio}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
          />

          <label className="flex items-center space-x-2 text-white">
            <input type="checkbox" name="estado" checked={formData.estado} onChange={handleChange} />
            <span>Producto activo</span>
          </label>

          {/* Subida de imágenes */}
          <div>
            <label className="block text-white">Imágenes del Producto</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              disabled={subiendo}
              className="w-full px-4 py-2 mt-2 bg-gray-800 text-white border border-gray-600 rounded-lg cursor-pointer"
            />
          </div>

          {/* Vista previa de imágenes */}
          {formData.imagenes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {formData.imagenes.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} alt="Producto" className="w-16 h-16 object-cover rounded-lg shadow-md" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={subiendo}
              className="px-4 py-2 bg-medium_slate_blue text-white rounded-lg hover:bg-majorelle_blue transition"
            >
              {subiendo ? "Subiendo imágenes..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarProductoForm;
