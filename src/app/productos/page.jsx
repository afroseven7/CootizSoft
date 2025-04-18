"use client";

import { useState, useEffect } from "react";
import crypto from "crypto";
import { useUser } from "@clerk/nextjs";
import ProductoForm from "./ProductoForm";
import ImageCarousel from "./ImageCarousel";
import EditarProductoForm from "./EditarProductoForm";
import Loading from "@/components/Loading"; // 👈 Asegúrate de que esta ruta sea correcta
 // ✅ Importamos el formulario de edición

const encriptarCorreo = (correo) => {
    return crypto.createHash("sha256").update(correo).digest("hex");
};

const ProductosPage = () => {
    const { user } = useUser();
    const [productos, setProductos] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);
    const [imagenesActuales, setImagenesActuales] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // 👈 Nueva bandera de carga


    useEffect(() => {
        const fetchProductos = async () => {
          if (!user?.primaryEmailAddress?.emailAddress) return;
      
          try {
            const email = user.primaryEmailAddress.emailAddress;
            const res = await fetch(`/api/productos?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            setProductos(data);
          } catch (error) {
            console.error("Error obteniendo productos:", error);
          } finally {
            setIsLoading(false); // 👈 Finaliza el loading aquí
          }
        };
      
        fetchProductos();
      }, [user]);
      

    const handleOpenForm = () => setMostrarFormulario(true);
    const handleCloseForm = () => setMostrarFormulario(false);
    const handleOpenCarousel = (imagenes) => setImagenesActuales(imagenes);
    const handleCloseCarousel = () => setImagenesActuales(null);
    const handleOpenEditForm = (producto) => setProductoEditando(producto);
    const handleCloseEditForm = () => setProductoEditando(null);

    const handleSubmit = async (formData) => {
        try {
            if (!user?.primaryEmailAddress?.emailAddress) {
                alert("No se pudo obtener el correo del usuario.");
                return;
            }

            const idUsuario = encriptarCorreo(user.primaryEmailAddress.emailAddress);

            const res = await fetch("/api/productos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, idUsuario }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al guardar el producto");
            }

            const nuevoProducto = await res.json();
            setProductos((prevProductos) => [nuevoProducto, ...prevProductos]);
            setMostrarFormulario(false);
        } catch (error) {
            console.error("Error al guardar el producto:", error);
            alert("Hubo un error al guardar el producto.");
        }
    };

    const handleUpdate = async (productoActualizado) => {
        try {
            if (!user?.primaryEmailAddress?.emailAddress) {
                alert("No se pudo obtener el correo del usuario.");
                return;
            }

            const idUsuario = encriptarCorreo(user.primaryEmailAddress.emailAddress);

            const res = await fetch("/api/productos", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...productoActualizado, idUsuario }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al actualizar el producto");
            }

            const productoModificado = await res.json();
            setProductos((prevProductos) =>
                prevProductos.map((producto) =>
                    producto.id === productoModificado.id ? productoModificado : producto
                )
            );

            setProductoEditando(null);
        } catch (error) {
            console.error("Error actualizando el producto:", error);
            alert("Hubo un error al actualizar el producto.");
        }
    };

    const handleDelete = async (idProducto) => {
        try {
          if (!user?.primaryEmailAddress?.emailAddress) {
            alert("No se pudo obtener el correo del usuario.");
            return;
          }
      
          const idUsuario = encriptarCorreo(user.primaryEmailAddress.emailAddress);
      
          const confirmacion = confirm("¿Estás seguro de que quieres eliminar este producto?");
          if (!confirmacion) return;
      
          const res = await fetch("/api/productos", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: idProducto, idUsuario }),
          });
      
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al eliminar el producto");
          }
      
          // 🔥 Eliminar el producto del estado sin recargar la página
          setProductos((prevProductos) =>
            prevProductos.filter((producto) => producto.id !== idProducto)
          );
      
          alert("Producto eliminado correctamente");
        } catch (error) {
          console.error("Error eliminando el producto:", error);
          alert("Hubo un error al eliminar el producto.");
        }
      };
      



    
      return (
        <main className="flex flex-col items-center min-h-screen p-8 bg-raisin_black text-white">
            <div className="w-full max-w-4xl bg-jet p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-medium_slate_blue">Lista de Productos</h1>
                    <button
                        onClick={handleOpenForm}
                        className="px-4 py-2 bg-medium_slate_blue text-white rounded-lg hover:bg-majorelle_blue transition"
                    >
                        Añadir Producto
                    </button>
                </div>

                {/* 🛠️ Tabla de productos */}
                <div className="overflow-x-auto">
                    <table className="w-full text-white border border-gray-700">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="p-3 border border-gray-700">Nombre</th>
                                <th className="p-3 border border-gray-700">Precio</th>
                                <th className="p-3 border border-gray-700">Stock</th>
                                <th className="p-3 border border-gray-700">Estado</th>
                                <th className="p-3 border border-gray-700">Imagen</th>
                                <th className="p-3 border border-gray-700">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.length > 0 ? (
                                productos.map((producto) => (
                                    <tr key={producto.id} className="text-center border border-gray-700">
                                        <td className="p-3 border border-gray-700">{producto.nombre}</td>
                                        <td className="p-3 border border-gray-700">${producto.precio.toFixed(2)}</td>
                                        <td className="p-3 border border-gray-700">{producto.stock}</td>
                                        <td className="p-3 border border-gray-700">{producto.estado ? "Activo" : "Inactivo"}</td>
                                        <td className="p-3 border border-gray-700">
                                            {producto.imagen.length > 0 ? (
                                                <img
                                                    src={producto.imagen[0]}
                                                    alt="Producto"
                                                    className="w-16 h-16 object-cover mx-auto rounded cursor-pointer"
                                                    onClick={() => handleOpenCarousel(producto.imagen)}
                                                />
                                            ) : (
                                                "Sin imagen"
                                            )}
                                        </td>
                                        <td className="p-3 border border-gray-700">
                                            {/* Botón Editar */}
                                            <button
                                                onClick={() => handleOpenEditForm(producto)}
                                                className="px-2 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600 transition"
                                            >
                                                Editar
                                            </button>

                                            {/* Botón Eliminar */}
                                            <button
                                                onClick={() => handleDelete(producto.id)}
                                                className="ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-3 text-center text-gray-400">
                                        No hay productos disponibles
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 🛠️ Modal con el formulario */}
            {mostrarFormulario && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 px-4" onClick={handleCloseForm}>
                    <div className="bg-jet p-6 rounded-lg w-full max-w-md shadow-lg relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={handleCloseForm} className="absolute top-3 right-3 text-white text-lg">✖</button>
                        <ProductoForm onSubmit={handleSubmit} />
                    </div>
                </div>
            )}

            {/* 🛠️ Modal con el formulario de edición */}
            {productoEditando && (
                <EditarProductoForm producto={productoEditando} onUpdate={handleUpdate} onClose={handleCloseEditForm} />
            )}

            {/* 🛠️ Modal con el carrusel de imágenes */}
            {imagenesActuales && <ImageCarousel imagenes={imagenesActuales} onClose={handleCloseCarousel} />}
        </main>
    );
};

export default ProductosPage;
