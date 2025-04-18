"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Loading from "@/components/Loading"; // Importamos el componente de carga

export default function MiNegocioPage() {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    nombre: "",
    identificacion: "",
    direccion: "",
    ciudad: "",
    telefono: "",
    email: "",
    logo: null,
  });

  const [negocioExiste, setNegocioExiste] = useState(false);
  const [loading, setLoading] = useState(true); // 🔥 Inicializamos en `true` para mostrar la pantalla de carga

  // 🔍 Establecer email del usuario cuando esté disponible
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setFormData((prev) => ({ ...prev, email: user.primaryEmailAddress.emailAddress }));
    }
  }, [user]);

  // 🔍 Buscar el negocio en la base de datos cuando el email esté listo
  useEffect(() => {
    if (!formData.email) return;

    const fetchNegocio = async () => {
      try {
        const res = await fetch(`/api/negocios?email=${formData.email}`);
        if (res.status === 404) {
          setLoading(false); // ❌ No hay negocio, ocultamos la pantalla de carga
          return;
        }

        if (res.status === 200) {
          const data = await res.json();
          setFormData(data);
          setNegocioExiste(true);
        } else {
          setNegocioExiste(false); // 🔥 Asegura que el estado es correcto si el negocio no existe
        }
        

      } catch (error) {
        console.error("Error obteniendo datos del negocio:", error);
      } finally {
        setLoading(false); // ✅ Terminó la carga
      }
    };

    fetchNegocio();
  }, [formData.email]);

  // 🔥 Manejador para cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔥 Manejador para subida de archivos
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImage = new FormData();
    formDataImage.append("file", file);
    formDataImage.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    formDataImage.append("folder", "negocios");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formDataImage }
      );

      const data = await res.json();
      if (!data.secure_url) throw new Error("Error al subir la imagen");

      setFormData({ ...formData, logo: data.secure_url });
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      alert("Hubo un problema subiendo la imagen.");
    }
  };

  // 🔥 Manejador para enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const method = negocioExiste ? "PUT" : "POST"; // 🛠️ Decide si crear o actualizar

    try {
      const response = await fetch("/api/negocios", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Error en la solicitud: ${method}`);

      alert(negocioExiste ? "Negocio actualizado correctamente" : "Negocio registrado correctamente");
      setNegocioExiste(true); // 🔥 Se asegura de cambiar al modo "Actualizar"
    } catch (error) {
      console.error("Error guardando negocio:", error);
      alert("Hubo un error al guardar el negocio.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Si está cargando, mostrar la pantalla de carga en lugar del formulario
  if (loading) return <Loading />;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-raisin_black text-white">
      <div className="p-8 bg-jet shadow-md rounded-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-medium_slate_blue mb-6 text-center">
          {negocioExiste ? "Actualizar Negocio" : "Registrar Negocio"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white">Nombre del negocio *</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full px-4 py-2 mt-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none" />
          </div>

          <div>
            <label className="block text-white">Número de Identificación (NIT o CC) *</label>
            <input type="text" name="identificacion" value={formData.identificacion} onChange={handleChange} required className="w-full px-4 py-2 mt-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none" />
          </div>

          <div>
            <label className="block text-white">Dirección</label>
            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="w-full px-4 py-2 mt-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none" />
          </div>

          <div>
            <label className="block text-white">Ciudad *</label>
            <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} required className="w-full px-4 py-2 mt-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none" />
          </div>

          <div>
            <label className="block text-white">Teléfono *</label>
            <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required className="w-full px-4 py-2 mt-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none" />
          </div>

          <div>
            <label className="block text-white">Logo del Negocio (Opcional)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-4 py-2 mt-2 bg-gray-800 text-white border border-gray-600 rounded-lg cursor-pointer" />
          </div>

          {formData.logo && (
            <div className="flex justify-center mt-4">
              <img src={formData.logo} alt="Logo del negocio" className="w-32 h-32 object-cover rounded-lg shadow-md" />
            </div>
          )}

          <div className="text-center">
            <button type="submit" className="px-6 py-3 bg-medium_slate_blue text-white rounded-lg hover:bg-majorelle_blue transition">
              {negocioExiste ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
