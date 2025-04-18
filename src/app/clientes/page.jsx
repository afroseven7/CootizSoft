"use client";

import { useState, useEffect } from "react";
import crypto from "crypto"; // ✅ Importamos `crypto` directamente en el archivo
import { useUser } from "@clerk/nextjs";
import ClienteForm from "./ClienteForm";

// 🔥 Función para encriptar el correo electrónico
const encriptarCorreo = (email) => {
    return crypto.createHash("sha256").update(email).digest("hex");
};

const ClientesPage = () => {
    const { user } = useUser();
    const [clientes, setClientes] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [clienteEditando, setClienteEditando] = useState(null);

    useEffect(() => {
        const fetchClientes = async () => {
            if (!user?.primaryEmailAddress?.emailAddress) return;

            try {
                const email = user.primaryEmailAddress.emailAddress;
                const res = await fetch(`/api/clientes?email=${encodeURIComponent(email)}`);
                const data = await res.json();
                setClientes(data);
            } catch (error) {
                console.error("Error obteniendo clientes:", error);
            }
        };

        fetchClientes();
    }, [user]);

    const handleOpenForm = () => {
        setClienteEditando(null);
        setMostrarFormulario(true);
    };
    
    const handleOpenEditForm = (cliente) => {
        setClienteEditando(cliente);
        setMostrarFormulario(true);
    };

    const handleCloseForm = () => setMostrarFormulario(false);

    const handleSubmit = async (formData) => {
        try {
          if (!user?.primaryEmailAddress?.emailAddress) {
            alert("No se pudo obtener el correo del usuario.");
            return;
          }
      
          const ownerEmail = user.primaryEmailAddress.emailAddress; // 👈 Email del usuario, no del cliente
      
          const res = await fetch("/api/clientes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, ownerEmail }), // 👈 Manda ownerEmail
          });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al registrar el cliente");
            }

            const nuevoCliente = await res.json();
            setClientes((prevClientes) => [nuevoCliente, ...prevClientes]);

            setMostrarFormulario(false);
        } catch (error) {
            console.error("Error registrando el cliente:", error);
            alert("Hubo un error al registrar el cliente.");
        }
    };

    const handleUpdate = async (clienteActualizado) => {
        try {
            if (!user?.primaryEmailAddress?.emailAddress) {
                alert("No se pudo obtener el correo del usuario.");
                return;
            }

            const idUsuario = encriptarCorreo(user.primaryEmailAddress.emailAddress);

            const res = await fetch("/api/clientes", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...clienteActualizado, idUsuario }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al actualizar el cliente");
            }

            const clienteModificado = await res.json();
            setClientes((prevClientes) =>
                prevClientes.map((cliente) =>
                    cliente.id === clienteModificado.id ? clienteModificado : cliente
                )
            );

            setMostrarFormulario(false);
        } catch (error) {
            console.error("Error actualizando el cliente:", error);
            alert("Hubo un error al actualizar el cliente.");
        }
    };

    const handleDelete = async (idCliente) => {
        try {
            if (!user?.primaryEmailAddress?.emailAddress) {
                alert("No se pudo obtener el correo del usuario.");
                return;
            }

            const idUsuario = encriptarCorreo(user.primaryEmailAddress.emailAddress);

            const confirmacion = confirm("¿Estás seguro de que quieres eliminar este cliente?");
            if (!confirmacion) return;

            const res = await fetch("/api/clientes", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: idCliente, idUsuario }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al eliminar el cliente");
            }

            setClientes((prevClientes) => prevClientes.filter((cliente) => cliente.id !== idCliente));

            alert("Cliente eliminado correctamente");
        } catch (error) {
            console.error("Error eliminando el cliente:", error);
            alert("Hubo un error al eliminar el cliente.");
        }
    };

    return (
        <main className="flex flex-col items-center min-h-screen p-8 bg-raisin_black text-white">
            <div className="w-full max-w-4xl bg-jet p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-medium_slate_blue">Lista de Clientes</h1>
                    <button
                        onClick={handleOpenForm}
                        className="px-4 py-2 bg-medium_slate_blue text-white rounded-lg hover:bg-majorelle_blue transition"
                    >
                        Añadir Cliente
                    </button>
                </div>

                {/* 🛠️ Tabla de clientes */}
                <div className="overflow-x-auto">
                    <table className="w-full text-white border border-gray-700">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="p-3 border border-gray-700">Identificación</th>
                                <th className="p-3 border border-gray-700">Nombre</th>
                                <th className="p-3 border border-gray-700">Teléfono</th>
                                <th className="p-3 border border-gray-700">Correo</th>
                                <th className="p-3 border border-gray-700">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.length > 0 ? (
                                clientes.map((cliente) => (
                                    <tr key={cliente.id} className="text-center border border-gray-700">
                                        <td className="p-3 border border-gray-700">{cliente.identificacion}</td>
                                        <td className="p-3 border border-gray-700">{cliente.nombre}</td>
                                        <td className="p-3 border border-gray-700">{cliente.telefono}</td>
                                        <td className="p-3 border border-gray-700">{cliente.email}</td>
                                        <td className="p-3 border border-gray-700">
                                            <button
                                                onClick={() => handleOpenEditForm(cliente)}
                                                className="px-2 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600 transition"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cliente.id)}
                                                className="ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-3 text-center text-gray-400">
                                        No hay clientes registrados
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
                        <ClienteForm onSubmit={clienteEditando ? handleUpdate : handleSubmit} cliente={clienteEditando} />
                    </div>
                </div>
            )}
        </main>
    );
};

export default ClientesPage;
