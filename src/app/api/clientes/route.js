import { NextResponse } from "next/server";
import { PrismaClient } from "@/prisma/generated/client";
import crypto from "crypto"; // ✅ Importamos `crypto` SOLO en el backend

const prisma = new PrismaClient();

// 🔥 Método POST - Registrar un nuevo cliente
export async function POST(req) {
  try {
    const body = await req.json();

    // 📌 Validar que todos los campos requeridos estén presentes
    const { identificacion, nombre, telefono, email, direccion, ownerEmail } = body;

    if (!identificacion || !nombre || !telefono || !email || !ownerEmail) {
      return NextResponse.json({ message: "Todos los campos obligatorios deben estar completos" }, { status: 400 });
    }
    
    // 👇 Aquí usamos el email del USUARIO autenticado, no del cliente
    const idUsuario = crypto.createHash("sha256").update(ownerEmail).digest("hex");
    

    // 🔍 Verificar si el cliente ya existe en la base de datos
    const clienteExistente = await prisma.cliente.findUnique({
      where: { identificacion },
    });

    if (clienteExistente) {
      return NextResponse.json({ message: "El cliente ya está registrado" }, { status: 400 });
    }

    // 🔥 Crear el nuevo cliente en la base de datos
    const nuevoCliente = await prisma.cliente.create({
      data: {
        identificacion,
        nombre,
        telefono,
        direccion: direccion || null,
        email,
        idUsuario,
      },
    });

    return NextResponse.json(nuevoCliente, { status: 201 });
  } catch (error) {
    console.error("Error guardando cliente:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

// 🔥 Método GET - Obtener clientes del usuario autenticado
export async function GET(req) {
  try {
    // 📌 Obtener el email del usuario desde la query string
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Se requiere un email para obtener clientes" }, { status: 400 });
    }

    // 🔒 Encriptar el email para obtener el `idUsuario`
    const idUsuario = crypto.createHash("sha256").update(email).digest("hex");

    // 🔍 Obtener los clientes asociados al usuario autenticado
    const clientes = await prisma.cliente.findMany({
      where: { idUsuario },
      orderBy: { createdAt: "desc" }, // Ordenar por fecha de creación
    });

    return NextResponse.json(clientes, { status: 200 });
  } catch (error) {
    console.error("Error obteniendo clientes:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
export async function PUT(req) {
    try {
      const body = await req.json();
      const { id, identificacion, nombre, telefono, direccion, email, idUsuario } = body;
  
      // 📌 Validar que los datos sean correctos
      if (!id || !idUsuario) {
        return NextResponse.json({ message: "ID del cliente e idUsuario son requeridos" }, { status: 400 });
      }
  
      // 🔍 Verificar si el cliente existe y pertenece al usuario correcto
      const clienteExistente = await prisma.cliente.findUnique({
        where: { id },
      });
  
      if (!clienteExistente) {
        return NextResponse.json({ message: "Cliente no encontrado" }, { status: 404 });
      }
  
      if (clienteExistente.idUsuario !== idUsuario) {
        return NextResponse.json({ message: "No tienes permisos para actualizar este cliente" }, { status: 403 });
      }
  
      // 🔥 Actualizar el cliente en la base de datos
      const clienteActualizado = await prisma.cliente.update({
        where: { id },
        data: {
          identificacion: identificacion || clienteExistente.identificacion,
          nombre: nombre || clienteExistente.nombre,
          telefono: telefono || clienteExistente.telefono,
          direccion: direccion || clienteExistente.direccion,
          email: email || clienteExistente.email,
        },
      });
  
      return NextResponse.json(clienteActualizado, { status: 200 });
    } catch (error) {
      console.error("Error actualizando cliente:", error);
      return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
  }
  export async function DELETE(req) {
    try {
      const body = await req.json();
      const { id, idUsuario } = body;
  
      // 📌 Validar que los datos sean correctos
      if (!id || !idUsuario) {
        return NextResponse.json({ message: "ID del cliente e idUsuario son requeridos" }, { status: 400 });
      }
  
      // 🔍 Verificar si el cliente existe y pertenece al usuario correcto
      const clienteExistente = await prisma.cliente.findUnique({
        where: { id },
      });
  
      if (!clienteExistente) {
        return NextResponse.json({ message: "Cliente no encontrado" }, { status: 404 });
      }
  
      if (clienteExistente.idUsuario !== idUsuario) {
        return NextResponse.json({ message: "No tienes permisos para eliminar este cliente" }, { status: 403 });
      }
  
      // 🔥 Eliminar el cliente de la base de datos
      await prisma.cliente.delete({
        where: { id },
      });
  
      return NextResponse.json({ message: "Cliente eliminado correctamente" }, { status: 200 });
    } catch (error) {
      console.error("Error eliminando cliente:", error);
      return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
  }
  
    