import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📌 Crear un nuevo producto (POST)
export async function POST(req) {
  try {
    const body = await req.json();

    // 🔍 Validar que los campos requeridos estén presentes
    if (!body.nombre || !body.precio || !body.stock || !body.imagenes.length || !body.idUsuario) {
      return NextResponse.json({ message: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // 🔥 Guardar el producto en la base de datos con Prisma
    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion || null,
        precio: parseFloat(body.precio),
        stock: parseInt(body.stock),
        estado: body.estado !== undefined ? body.estado : true, // Manejar valores `true` por defecto
        imagen: body.imagenes,
        idUsuario: body.idUsuario, // ✅ Guardamos el ID encriptado del usuario
      },
    });

    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error) {
    console.error("Error guardando el producto:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

// 📌 Obtener todos los productos (GET)
export async function GET(req) {
  try {
    // 📌 Obtener el email del usuario desde la query string
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Se requiere un email para obtener productos" }, { status: 400 });
    }

    // 🔒 Encriptar el email para obtener el idUsuario
    const crypto = await import("crypto"); // Importar dinámicamente para evitar errores en Next.js
    const idUsuario = crypto.createHash("sha256").update(email).digest("hex");

    // 🔍 Filtrar productos por idUsuario en la base de datos
    const productos = await prisma.producto.findMany({
      where: { idUsuario },
      orderBy: { createdAt: "desc" }, // Ordenar por fecha de creación (opcional)
    });

    return NextResponse.json(productos, { status: 200 });
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();

    // 📌 Validar que el producto tenga un ID y un usuario asociado
    if (!body.id || !body.idUsuario) {
      return NextResponse.json({ message: "ID del producto e idUsuario son requeridos" }, { status: 400 });
    }

    // 🔍 Verificar si el producto existe y pertenece al usuario correcto
    const productoExistente = await prisma.producto.findUnique({
      where: { id: body.id },
    });

    if (!productoExistente) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
    }

    if (productoExistente.idUsuario !== body.idUsuario) {
      return NextResponse.json({ message: "No tienes permisos para actualizar este producto" }, { status: 403 });
    }

    // 🔥 Actualizar el producto en la base de datos
    const productoActualizado = await prisma.producto.update({
      where: { id: body.id },
      data: {
        nombre: body.nombre || productoExistente.nombre,
        descripcion: body.descripcion || productoExistente.descripcion,
        precio: body.precio !== undefined ? parseFloat(body.precio) : productoExistente.precio,
        stock: body.stock !== undefined ? parseInt(body.stock) : productoExistente.stock,
        estado: body.estado !== undefined ? body.estado : productoExistente.estado,
        imagen: body.imagenes || productoExistente.imagen,
      },
    });

    return NextResponse.json(productoActualizado, { status: 200 });
  } catch (error) {
    console.error("Error actualizando producto:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();

    // 📌 Validar que el producto tenga un ID y un usuario asociado
    if (!body.id || !body.idUsuario) {
      return NextResponse.json({ message: "ID del producto e idUsuario son requeridos" }, { status: 400 });
    }

    // 🔍 Verificar si el producto existe y pertenece al usuario correcto
    const productoExistente = await prisma.producto.findUnique({
      where: { id: body.id },
    });

    if (!productoExistente) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
    }

    if (productoExistente.idUsuario !== body.idUsuario) {
      return NextResponse.json({ message: "No tienes permisos para eliminar este producto" }, { status: 403 });
    }

    // 🔥 Eliminar el producto de la base de datos
    await prisma.producto.delete({
      where: { id: body.id },
    });

    return NextResponse.json({ message: "Producto eliminado correctamente" }, { status: 200 });
  } catch (error) {
    console.error("Error eliminando producto:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

